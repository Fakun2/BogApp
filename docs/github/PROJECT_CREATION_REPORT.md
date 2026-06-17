# Reporte de creación de gestión GitHub

- Issues planificadas: 80.
- Rango correlativo: BOG-001 a BOG-080.
- Fases: M0 a M10.
- Script: `docs/github/scripts/setup-github-management.ps1`.
- Seed: `docs/github/scripts/issues.seed.json`.

## Riesgos
- La automatización de campos de GitHub Projects puede requerir ajustes manuales por permisos y diferencias de API.
- Las dependencias se escriben en los cuerpos de issues usando números reales cuando el script encuentra el mapeo.

## Próximo paso
Ejecutar DryRun, revisar salida y luego ejecutar sin `-DryRun` con `gh` autenticado.
