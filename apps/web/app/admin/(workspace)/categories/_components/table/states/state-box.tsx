export function StateBox({
  fill,
  message,
  tone = "muted"
}: {
  fill?: boolean;
  message: string;
  tone?: "error" | "muted";
}) {
  return (
    <div
      className={`flex items-center justify-center px-6 text-center text-sm ${
        fill ? "h-full min-h-0" : "min-h-44"
      } ${tone === "error" ? "bg-destructive/5 text-destructive" : "text-muted-foreground"}`}
    >
      {message}
    </div>
  );
}
