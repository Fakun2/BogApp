import type { CreateAccountMediaTileConfig } from "../_types/create-account.types";

const mediaMaskGrid = {
  columns: 6,
  gap: 8,
  radius: 24,
  rows: 12
} as const;

type MaskSize = {
  height: number;
  width: number;
};

export function getMediaMaskPath(tiles: CreateAccountMediaTileConfig[], size: MaskSize) {
  const mediaTiles = tiles.filter((tile) => tile.kind === "media");

  return [
    `M0 0H${size.width}V${size.height}H0Z`,
    ...mediaTiles.map((tile) => getMaskRoundedRectPath(tile, size))
  ].join(" ");
}

function getMaskRoundedRectPath(
  tile: Extract<CreateAccountMediaTileConfig, { kind: "media" }>,
  size: MaskSize
) {
  const layout = getTileGridLayout(tile.className);
  const gap = mediaMaskGrid.gap;
  const columnWidth = (size.width - gap * (mediaMaskGrid.columns - 1)) / mediaMaskGrid.columns;
  const rowHeight = (size.height - gap * (mediaMaskGrid.rows - 1)) / mediaMaskGrid.rows;
  const x = (layout.columnStart - 1) * (columnWidth + gap);
  const y = (layout.rowStart - 1) * (rowHeight + gap);
  const width = columnWidth * layout.columnSpan + gap * (layout.columnSpan - 1);
  const height = rowHeight * layout.rowSpan + gap * (layout.rowSpan - 1);
  const radius = Math.min(width, height, mediaMaskGrid.radius);
  const corners = tile.roundedCorners ?? {};
  const topLeft = corners.topLeft === false ? 0 : radius;
  const topRight = corners.topRight === false ? 0 : radius;
  const bottomRight = corners.bottomRight === false ? 0 : radius;
  const bottomLeft = corners.bottomLeft === false ? 0 : radius;

  return [
    `M${x + topLeft} ${y}`,
    `H${x + width - topRight}`,
    topRight ? `Q${x + width} ${y} ${x + width} ${y + topRight}` : `L${x + width} ${y}`,
    `V${y + height - bottomRight}`,
    bottomRight
      ? `Q${x + width} ${y + height} ${x + width - bottomRight} ${y + height}`
      : `L${x + width} ${y + height}`,
    `H${x + bottomLeft}`,
    bottomLeft ? `Q${x} ${y + height} ${x} ${y + height - bottomLeft}` : `L${x} ${y + height}`,
    `V${y + topLeft}`,
    topLeft ? `Q${x} ${y} ${x + topLeft} ${y}` : `L${x} ${y}`,
    "Z"
  ].join(" ");
}

function getTileGridLayout(className: string) {
  return {
    columnSpan: getGridClassNumber(className, "col-span"),
    columnStart: getGridClassNumber(className, "col-start"),
    rowSpan: getGridClassNumber(className, "row-span"),
    rowStart: getGridClassNumber(className, "row-start")
  };
}

function getGridClassNumber(className: string, token: string) {
  const match = className.match(new RegExp(`${token}-(\\d+)`));

  return match ? Number(match[1]) : 1;
}
