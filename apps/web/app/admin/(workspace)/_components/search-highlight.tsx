import type { ReactNode } from "react";

type MatchRange = {
  end: number;
  start: number;
};

export function SearchHighlight({
  query,
  text
}: {
  query: string | string[] | null | undefined;
  text: string;
}) {
  const terms = normalizeQuery(query);

  if (terms.length === 0 || text.length === 0) {
    return <>{text}</>;
  }

  const ranges = getMatchRanges(text, terms);

  if (ranges.length === 0) {
    return <>{text}</>;
  }

  const parts: ReactNode[] = [];
  let currentIndex = 0;

  for (const range of ranges) {
    if (range.start > currentIndex) {
      parts.push(text.slice(currentIndex, range.start));
    }

    parts.push(
      <mark
        className="rounded-[2px] bg-yellow-200/80 px-0.5 text-foreground shadow-[inset_0_-0.18em_0_rgb(250_204_21_/_0.35)] dark:bg-yellow-300/35"
        key={`${range.start}-${range.end}`}
      >
        {text.slice(range.start, range.end)}
      </mark>
    );
    currentIndex = range.end;
  }

  if (currentIndex < text.length) {
    parts.push(text.slice(currentIndex));
  }

  return <>{parts}</>;
}

function normalizeQuery(query: string | string[] | null | undefined) {
  const values = Array.isArray(query) ? query : [query];

  return values
    .flatMap((value) => (value ?? "").trim().split(/\s+/))
    .filter((value, index, items) => value.length > 0 && items.indexOf(value) === index);
}

function getMatchRanges(text: string, terms: string[]) {
  const lowerText = text.toLocaleLowerCase();
  const ranges: MatchRange[] = [];

  for (const term of terms) {
    const lowerTerm = term.toLocaleLowerCase();
    let start = lowerText.indexOf(lowerTerm);

    while (start !== -1) {
      ranges.push({ start, end: start + lowerTerm.length });
      start = lowerText.indexOf(lowerTerm, start + lowerTerm.length);
    }
  }

  return mergeRanges(ranges.sort((first, second) => first.start - second.start));
}

function mergeRanges(ranges: MatchRange[]) {
  const merged: MatchRange[] = [];

  for (const range of ranges) {
    const previous = merged.at(-1);

    if (!previous || range.start > previous.end) {
      merged.push({ ...range });
      continue;
    }

    previous.end = Math.max(previous.end, range.end);
  }

  return merged;
}
