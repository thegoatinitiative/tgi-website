import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { get, put, BlobNotFoundError } from "@vercel/blob";

const root = join(process.cwd(), "content", "intel");
const reports = ["iphone-11", "tecno-ch6i"];

if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
  console.error("BLOB_READ_WRITE_TOKEN or BLOB_STORE_ID is required");
  process.exit(1);
}

let uploaded = 0;
for (const report of reports) {
  const dir = join(root, report);
  const names = (await readdir(dir)).filter((name) => name.endsWith(".jpg")).sort();
  for (const name of names) {
    const bytes = await readFile(join(dir, name));
    await put(`intel/${report}/${name}`, bytes, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "image/jpeg",
      cacheControlMaxAge: 60 * 60 * 24 * 30,
    });
    uploaded += 1;
  }
}

let existing = null;
try {
  existing = await get("members/store.json", { access: "private", useCache: false });
} catch (error) {
  if (!(error instanceof BlobNotFoundError)) throw error;
}
if (existing?.statusCode === 200 && existing.stream) {
  console.log(`uploaded ${uploaded} pages; member store already exists`);
} else {
  await put("members/store.json", JSON.stringify({ members: [], unlocked: [] }), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
  console.log(`uploaded ${uploaded} pages; created an empty member store`);
}
