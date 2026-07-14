import type {
  CreateAccountMediaTileConfig,
  CreateAccountMediaTileCorners
} from "../_types/create-account.types";

export const createAccountMedia = {
  videoUrl: "/media/lawyer.mp4",
  label: "video de abogado"
} as const;

const defaultMedia = {
  alt: "Composición visual abstracta del workspace",
  src: createAccountMedia.videoUrl,
  type: "video" as const
};

export const createAccountMediaTileRadius = {
  brand: "rounded-[24px]",
  default: "rounded-[24px]",
  feature: "rounded-[24px]",
  tight: "rounded-[24px]"
} as const;

export const createAccountMediaTileCorners = {
  all(overrides: CreateAccountMediaTileCorners = {}) {
    return {
      bottomLeft: true,
      bottomRight: true,
      topLeft: true,
      topRight: true,
      ...overrides
    };
  }
} as const;

export const createAccountMediaTiles: CreateAccountMediaTileConfig[] = [
  {
    id: "top-left",
    kind: "media",
    className: "col-start-1 col-span-1 row-start-1 row-span-2",
    media: defaultMedia,
    objectPosition: "0% 0%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: true,
      topRight: false,
      bottomLeft: false,
      bottomRight: true
    })
  },
  {
    id: "top-wide-left",
    kind: "media",
    className: "col-start-2 col-span-2 row-start-1 row-span-2",
    media: defaultMedia,
    objectPosition: "32% 0%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: false,
      topRight: false,
      bottomLeft: true,
      bottomRight: true
    })
  },
  {
    id: "top-wide-right",
    kind: "media",
    className: "col-start-4 col-span-2 row-start-1 row-span-2",
    media: defaultMedia,
    objectPosition: "66% 0%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: false,
      topRight: false,
      bottomLeft: true,
      bottomRight: true
    })
  },
  {
    id: "top-right",
    kind: "media",
    className: "col-start-6 col-span-1 row-start-1 row-span-2",
    media: defaultMedia,
    objectPosition: "100% 0%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: false,
      topRight: true,
      bottomLeft: true,
      bottomRight: false
    })
  },
  {
    id: "left-main",
    kind: "media",
    className: "col-start-1 col-span-1 row-start-3 row-span-4",
    media: defaultMedia,
    objectPosition: "0% 32%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: false,
      topRight: true,
      bottomLeft: false,
      bottomRight: true
    })
  },
  {
    id: "center-main-left",
    kind: "media",
    className: "col-start-2 col-span-2 row-start-3 row-span-4",
    media: defaultMedia,
    objectPosition: "32% 32%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all()
  },
  {
    id: "center-main-right",
    kind: "media",
    className: "col-start-4 col-span-2 row-start-3 row-span-4",
    media: defaultMedia,
    objectPosition: "66% 32%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all()
  },
  {
    id: "right-main",
    kind: "media",
    className: "col-start-6 col-span-1 row-start-3 row-span-4",
    media: defaultMedia,
    objectPosition: "100% 32%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topRight: false,
      bottomRight: false
    })
  },
  {
    id: "left-dark",
    kind: "media",
    className: "col-start-1 col-span-1 row-start-7 row-span-4",
    media: defaultMedia,
    objectPosition: "0% 66%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: false,
      topRight: true,
      bottomLeft: false,
      bottomRight: true
    })
  },
  {
    id: "feature-tenant",
    kind: "media",
    className: "col-start-2 col-span-2 row-start-7 row-span-4",
    media: defaultMedia,
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all()
  },
  {
    id: "feature-rbac",
    kind: "media",
    className: "col-start-4 col-span-2 row-start-7 row-span-4",
    media: defaultMedia,
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all()
  },
  {
    id: "brand-mark",
    kind: "media",
    className: "col-start-6 col-span-1 row-start-7 row-span-4",
    media: defaultMedia,
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topRight: false,
      bottomRight: false
    })
  },
  {
    id: "bottom-left",
    kind: "media",
    className: "col-start-1 col-span-1 row-start-11 row-span-2",
    media: defaultMedia,
    objectPosition: "0% 100%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: false,
      topRight: true,
      bottomLeft: false,
      bottomRight: false
    })
  },
  {
    id: "bottom-center-left",
    kind: "media",
    className: "col-start-2 col-span-2 row-start-11 row-span-2",
    media: defaultMedia,
    objectPosition: "32% 100%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      bottomLeft: false,
      bottomRight: false
    })
  },
  {
    id: "bottom-center-right",
    kind: "media",
    className: "col-start-4 col-span-2 row-start-11 row-span-2",
    media: defaultMedia,
    objectPosition: "66% 100%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      bottomLeft: false,
      bottomRight: false
    })
  },
  {
    id: "bottom-right",
    kind: "media",
    className: "col-start-6 col-span-1 row-start-11 row-span-2",
    media: defaultMedia,
    objectPosition: "100% 100%",
    radiusClassName: createAccountMediaTileRadius.default,
    roundedCorners: createAccountMediaTileCorners.all({
      topLeft: true,
      topRight: false,
      bottomLeft: false,
      bottomRight: true
    })
  }
];
