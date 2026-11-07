import { execFile } from "child_process";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import { connect as connectTls } from "tls";
import { join } from "path";
import { promisify } from "util";

const execFileAsync = promisify(execFile);
const PREVIEW = join(process.cwd(), "data", "confirm-preview.json");

const DEFAULT_FROM = "The GOAT Initiative <cory@thegoatinitiative.org>";

const MAIL_SCRIPT = `
on run argv
  set bodyText to item 1 of argv
  set recipientAddr to item 2 of argv
  set subjectText to item 3 of argv
  set senderAddr to item 4 of argv
  tell application "Mail"
    set foundAddr to ""
    repeat with mailAccount in accounts
      set addrs to email addresses of mailAccount
      repeat with addr in addrs
        if (addr as string) is senderAddr then
          set foundAddr to addr as string
        end if
      end repeat
    end repeat
    if foundAddr is "" then error "Mail has no account for " & senderAddr
    set newMessage to make new outgoing message with properties {subject:subjectText, content:bodyText, visible:false}
    tell newMessage
      set sender to foundAddr
      make new to recipient at end of to recipients with properties {address:recipientAddr}
      send
    end tell
  end tell
end run
`;

function fromHeader(): string {
  return (process.env.TGI_MAIL_FROM || DEFAULT_FROM).trim();
}

function fromAddress(): string {
  const header = fromHeader();
  const wrapped = header.match(/<([^>]+)>/);
  return (wrapped ? wrapped[1] : header).trim();
}

function message(name: string, url: string): string {
  return [
    `Hello ${name},`,
    "",
    "Confirm your account to read field reports from The GOAT Initiative.",
    "After you confirm, each report opens when it is released.",
    "",
    url,
    "",
    "This link expires in 24 hours. If you did not sign up, you can ignore this message.",
    "",
    "The GOAT Initiative",
  ].join("\n");
}

function smtpConfigured(): boolean {
  return Boolean(process.env.TGI_SMTP_HOST && process.env.TGI_SMTP_USER && process.env.TGI_SMTP_PASS);
}

function assertHeader(value: string): string {
  const clean = value.replace(/[\r\n]/g, "").trim();
  if (!clean || clean.length > 320) throw new Error("Confirmation email address is invalid");
  return clean;
}

async function sendWithSmtp(to: string, name: string, url: string): Promise<void> {
  const host = process.env.TGI_SMTP_HOST || "";
  const port = Number(process.env.TGI_SMTP_PORT || 465);
  const user = process.env.TGI_SMTP_USER || "";
  const pass = process.env.TGI_SMTP_PASS || "";
  const from = assertHeader(fromHeader());
  const recipient = assertHeader(to);
  const subject = "Confirm your GOAT Initiative account";
  const body = message(name.replace(/[\r\n]/g, " ").slice(0, 200), url).replace(/\n/g, "\r\n");
  const payload = [
    `From: ${from}`,
    `To: ${recipient}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "",
    body,
  ].join("\r\n");

  await new Promise<void>((resolve, reject) => {
    const socket = connectTls({ host, port, servername: host });
    let buffer = "";
    const lines: string[] = [];
    const pending: Array<(line: string) => void> = [];
    let settled = false;
    const fail = (error: Error) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      reject(error);
    };
    socket.setTimeout(20000, () => fail(new Error("Confirmation email timed out")));
    socket.on("error", fail);
    const pushLine = (line: string) => {
      const next = pending.shift();
      if (next) next(line);
      else lines.push(line);
    };
    socket.on("data", (chunk) => {
      buffer += chunk.toString("utf8");
      let end = buffer.indexOf("\r\n");
      while (end !== -1) {
        pushLine(buffer.slice(0, end));
        buffer = buffer.slice(end + 2);
        end = buffer.indexOf("\r\n");
      }
    });
    const wait = () =>
      new Promise<string>((resolveLine) => {
        const queued = lines.shift();
        if (queued !== undefined) resolveLine(queued);
        else pending.push(resolveLine);
      });
    const expect = async (codes: number[]) => {
      let line = await wait();
      while (line[3] === "-") line = await wait();
      const code = Number(line.slice(0, 3));
      if (!codes.includes(code)) throw new Error(`Mail server refused the message (${code})`);
    };
    const send = (line: string) => {
      socket.write(`${line}\r\n`);
    };
    socket.once("secureConnect", () => {
      void (async () => {
        try {
          await expect([220]);
          send("EHLO thegoatinitiative.org");
          await expect([250]);
          send("AUTH LOGIN");
          await expect([334]);
          send(Buffer.from(user).toString("base64"));
          await expect([334]);
          send(Buffer.from(pass).toString("base64"));
          await expect([235]);
          send(`MAIL FROM:<${fromAddress()}>`);
          await expect([250]);
          send(`RCPT TO:<${recipient}>`);
          await expect([250, 251]);
          send("DATA");
          await expect([354]);
          socket.write(`${payload.replace(/^\./gm, "..")}\r\n.\r\n`);
          await expect([250]);
          send("QUIT");
          socket.end();
          settled = true;
          resolve();
        } catch (error) {
          fail(error instanceof Error ? error : new Error("Confirmation email was refused"));
        }
      })();
    });
  });
}

async function sendWithResend(to: string, name: string, url: string): Promise<void> {
  const from = fromHeader();
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Confirm your GOAT Initiative account",
      text: message(name, url),
    }),
  });
  if (!response.ok) {
    throw new Error(`Confirmation email was refused (${response.status})`);
  }
}

async function sendWithMailApp(to: string, name: string, url: string): Promise<void> {
  await execFileAsync(
    "osascript",
    ["-e", MAIL_SCRIPT, message(name, url), to, "Confirm your GOAT Initiative account", fromAddress()],
    { timeout: 20000 }
  );
}

async function writePreview(memberId: string, url: string): Promise<void> {
  await mkdir(join(process.cwd(), "data"), { recursive: true });
  await writeFile(PREVIEW, JSON.stringify({ memberId, url }), { mode: 0o600 });
}

export async function localConfirmLink(memberId: string): Promise<string | null> {
  try {
    const parsed = JSON.parse(await readFile(PREVIEW, "utf8")) as { memberId?: string; url?: string };
    if (parsed.memberId !== memberId || !parsed.url) return null;
    return parsed.url;
  } catch {
    return null;
  }
}

/** Sends the confirmation message. On this Mac, Mail.app is the fallback. */
export async function sendConfirmation(input: {
  memberId: string;
  to: string;
  name: string;
  url: string;
}): Promise<"sent" | "local"> {
  if (process.env.TGI_MAIL_DISABLE === "1") {
    await writePreview(input.memberId, input.url);
    return "local";
  }
  if (smtpConfigured()) {
    await sendWithSmtp(input.to, input.name, input.url);
    await unlink(PREVIEW).catch(() => undefined);
    return "sent";
  }
  if (process.env.RESEND_API_KEY) {
    await sendWithResend(input.to, input.name, input.url);
    await unlink(PREVIEW).catch(() => undefined);
    return "sent";
  }
  if (process.env.VERCEL) {
    throw new Error("Confirmation email is not configured");
  }
  try {
    await sendWithMailApp(input.to, input.name, input.url);
    await unlink(PREVIEW).catch(() => undefined);
    return "sent";
  } catch (error) {
    console.error(
      "Confirmation email was not sent.",
      error instanceof Error ? error.message.replace(input.url, "[link]") : "mail"
    );
    await writePreview(input.memberId, input.url);
    return "local";
  }
}
