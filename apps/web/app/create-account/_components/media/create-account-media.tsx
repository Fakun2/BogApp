"use client";

import {
  createAccountMedia,
  createAccountMediaTiles
} from "../../_constants/create-account.constants";
import { useElementSize } from "../../_hooks/use-element-size";
import { CreateAccountMediaMask } from "./create-account-media-mask";
import { CreateAccountMediaTile } from "./create-account-media-tile";

export function CreateAccountMedia() {
  const { ref, size } = useElementSize<HTMLElement>();

  return (
    <section
      ref={ref}
      className="relative hidden min-h-0 overflow-hidden rounded-3xl bg-card lg:block"
      aria-label={createAccountMedia.label}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={createAccountMedia.videoUrl}
        autoPlay
        loop
        muted
        playsInline
      />
      <CreateAccountMediaMask height={size.height} width={size.width} />
      <div className="relative z-20 grid h-full grid-cols-6 grid-rows-12 gap-2">
        {createAccountMediaTiles.map((tile) => (
          <CreateAccountMediaTile key={tile.id} tile={tile} />
        ))}
      </div>
    </section>
  );
}
