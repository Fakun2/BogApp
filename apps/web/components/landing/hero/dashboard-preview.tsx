import { ImagePlaceholder } from "../ui/image-placeholder";

export function DashboardPreview() {
  return (
    <div className="lumina-hero-preview relative mx-auto rounded-[2rem] border border-border bg-card/55 p-2 shadow-[var(--landing-dashboard-shadow)] backdrop-blur-xl">
      <div className="overflow-hidden rounded-[1.55rem] border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <div className="h-7 w-64 max-w-[48vw] rounded-full border border-border bg-background" />
          <div className="h-7 w-7 rounded-full border border-border bg-background" />
        </div>
        <ImagePlaceholder
          name="dashboard-preview.png"
          className="min-h-[360px] rounded-none border-0 sm:min-h-[520px]"
        />
      </div>
    </div>
  );
}
