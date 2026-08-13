export function mapRecordToOptions<TValue extends string>(labels: Record<TValue, string>) {
  return Object.entries(labels).map(([value, label]) => ({
    label: label as string,
    value: value as TValue
  }));
}

export function getForumPlaceholder({
  hasJudicialCenter,
  hasProvince,
  needsJudicialCenter
}: {
  hasJudicialCenter: boolean;
  hasProvince: boolean;
  needsJudicialCenter: boolean;
}) {
  if (!hasProvince) {
    return "Selecciona una provincia primero";
  }

  if (needsJudicialCenter && !hasJudicialCenter) {
    return "Selecciona un centro judicial primero";
  }

  return "Seleccionar fuero";
}

export function getJudicialCenterPlaceholder(hasProvince: boolean) {
  return hasProvince ? "Seleccionar centro judicial" : "Selecciona una provincia primero";
}
