import { ImageIcon } from "lucide-react";

export function ImagePlaceholder({
  name,
  className = ""
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      className={`lumina-image-placeholder flex min-h-56 items-center justify-center overflow-hidden rounded-[1.35rem] border border-dashed border-border bg-background/70 text-center ${className}`}
    >
      <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-muted-foreground">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card">
          <ImageIcon className="h-5 w-5" />
        </span>
        <span className="text-sm font-medium">{name}</span>
      </div>
    </div>
  );
}
