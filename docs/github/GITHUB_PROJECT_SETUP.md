# Setup del GitHub Project

1. Crear Project: `BogApp — Gestión profesional`.
2. Ejecutar `docs/github/scripts/setup-github-management.ps1 -DryRun` para validar.
3. Ejecutar sin `-DryRun` con GitHub CLI autenticado.
4. Crear campos: Status, Priority, Phase, Area, Type, Size, Sprint, Start date, Target date.
5. Cargar issues desde `docs/github/scripts/issues.seed.json`.

## Labels
Usar `priority:P0..P3`, `phase:M0..M10`, `area:*`, `type:*`, `size:S/M/L`.

## Milestones
Un milestone por fase M0-M10 con fechas del roadmap base.

## Scopes GitHub CLI
Si falta permiso de Projects, ejecutar: `gh auth refresh -s project`.
