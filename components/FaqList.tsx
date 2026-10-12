export type FaqItem = {
  question: string;
  answer: string;
};

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <section className="py-16" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto px-4">
        <h2
          id="faq-heading"
          className="font-heading text-2xl md:text-3xl text-gray-100 tracking-wider mb-8"
        >
          QUESTIONS
        </h2>
        <div className="space-y-3">
          {items.map((item) => (
            <details
              key={item.question}
              className="group bg-dark-100/80 border border-gray-800 rounded-sm open:border-primary/40"
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-heading text-sm text-gray-100 tracking-wide flex items-center justify-between gap-4">
                <span>{item.question}</span>
                <span className="text-primary text-lg leading-none group-open:rotate-45 transition-transform" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 text-gray-400 leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
