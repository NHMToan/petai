export function StatePanel({
  title,
  message,
  tone = "neutral",
}: {
  title: string;
  message: string;
  tone?: "neutral" | "error";
}) {
  return (
    <div
      className={[
        "rounded-[1.5rem] border px-6 py-5",
        tone === "error"
          ? "border-error/30 bg-error/10 text-error"
          : "border-outline-variant/30 bg-white/[0.03] text-on-surface",
      ].join(" ")}
    >
      <p className="font-semibold">{title}</p>
      <p className={`mt-2 text-sm ${tone === "error" ? "text-error/90" : "text-on-surface-variant"}`}>{message}</p>
    </div>
  );
}
