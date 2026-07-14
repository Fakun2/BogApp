import { createAccountMediaTiles } from "../../_constants/create-account.constants";
import { getMediaMaskPath } from "../../_utils/create-account-media-mask";

type CreateAccountMediaMaskProps = {
  height: number;
  width: number;
};

export function CreateAccountMediaMask({ height, width }: CreateAccountMediaMaskProps) {
  if (!height || !width) {
    return null;
  }

  const path = getMediaMaskPath(createAccountMediaTiles, { height, width });

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full text-background"
      preserveAspectRatio="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <path d={path} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
