import { Send, Sparkles, Upload } from "lucide-react";
import type { CreateAccountMediaTileConfig } from "../_types/create-account.types";
import { cn } from "@/lib/utils";

const defaultTileRadiusClassName = "rounded-[24px]";

const squareCornerClassNames = {
  bottomLeft: "rounded-bl-none",
  bottomRight: "rounded-br-none",
  topLeft: "rounded-tl-none",
  topRight: "rounded-tr-none"
} as const;

export function CreateAccountMediaTile({ tile }: { tile: CreateAccountMediaTileConfig }) {
  if (tile.kind === "feature") {
    return <FeatureTile tile={tile} />;
  }

  if (tile.kind === "brand") {
    return <BrandTile tile={tile} />;
  }

  return <MediaTile tile={tile} />;
}

function MediaTile({ tile }: { tile: Extract<CreateAccountMediaTileConfig, { kind: "media" }> }) {
  return (
    <div
      className={cn(
        "relative min-h-0 overflow-hidden",
        getTileRadiusClassName(tile),
        tile.className
      )}
      aria-label={tile.media.alt}
    />
  );
}

function FeatureTile({
  tile
}: {
  tile: Extract<CreateAccountMediaTileConfig, { kind: "feature" }>;
}) {
  const isAmber = tile.tone === "amber";

  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-col justify-between overflow-hidden p-4",
        getTileRadiusClassName(tile),
        isAmber ? "bg-[#ffbd3c] text-black" : "bg-[#6418ad] text-white",
        tile.className
      )}
    >
      {!isAmber ? (
        <div className="rounded-lg bg-white/10 p-2 text-[11px] leading-none text-white/45">
          Enter Prompt
          <div className="mt-3 flex items-center justify-between text-white/70">
            <Sparkles className="h-3.5 w-3.5" />
            <Send className="h-3.5 w-3.5" />
            <Upload className="h-3.5 w-3.5" />
          </div>
        </div>
      ) : null}

      <div>
        <h2 className="text-lg font-semibold leading-5 tracking-normal">{tile.title}</h2>
        <p className={cn("mt-2 text-xs leading-4", isAmber ? "text-black/80" : "text-white/70")}>
          {tile.description}
        </p>
      </div>

      {isAmber ? (
        <div className="self-end">
          <Sparkles className="h-8 w-8" />
        </div>
      ) : null}
    </div>
  );
}

function BrandTile({ tile }: { tile: Extract<CreateAccountMediaTileConfig, { kind: "brand" }> }) {
  return (
    <div
      className={cn(
        "relative flex min-h-0 items-center justify-center overflow-hidden bg-secondary text-foreground",
        getTileRadiusClassName(tile),
        tile.className
      )}
    >
      <h2>Logo</h2>
    </div>
  );
}

function getTileRadiusClassName(tile: CreateAccountMediaTileConfig) {
  const roundedCorners = tile.roundedCorners;

  return cn(
    tile.radiusClassName ?? defaultTileRadiusClassName,
    roundedCorners?.topLeft === false && squareCornerClassNames.topLeft,
    roundedCorners?.topRight === false && squareCornerClassNames.topRight,
    roundedCorners?.bottomRight === false && squareCornerClassNames.bottomRight,
    roundedCorners?.bottomLeft === false && squareCornerClassNames.bottomLeft
  );
}
