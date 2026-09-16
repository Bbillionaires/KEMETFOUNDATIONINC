export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : "text-left"}`}>
      {eyebrow && (
        <p
          className={`mb-3 text-xs font-semibold uppercase tracking-[0.3em] ${
            light ? "text-kemet-gold" : "text-kemet-gold-deep"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-display text-3xl font-bold sm:text-4xl ${
          light ? "text-kemet-white" : "text-kemet-black"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-kemet-ivory/85" : "text-kemet-charcoal/80"}`}>
          {description}
        </p>
      )}
      <div
        className={`mx-auto mt-6 h-px w-24 bg-gold-gradient ${align === "left" ? "ml-0" : ""}`}
        aria-hidden="true"
      />
    </div>
  );
}
