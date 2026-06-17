# Backlog BogApp BOG-001 a BOG-080

Backlog profesional para construir MVP funcional, SaaS multi-tenant, plataforma LegalTech y release vendible.

| Código | Título | Priority | Phase | Area | Type | Size | Sprint | Inicio | Cierre | Depends on | Blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BOG-001 | Auditar estado técnico del repositorio BogApp | P0 | M0 | Product | Chore | M | M0 | 2026-06-15 | 2026-06-21 | — | — |
| BOG-002 | Definir fuente de verdad de base de datos | P0 | M0 | Product | Chore | M | M0 | 2026-06-15 | 2026-06-21 | — | BOG-006, BOG-010, BOG-021 |
| BOG-003 | Configurar Project board estilo Código Cuatro | P0 | M0 | Product | Chore | M | M0 | 2026-06-15 | 2026-06-21 | — | — |
| BOG-004 | Crear labels, milestones y vistas del Project | P0 | M0 | Product | Chore | M | M0 | 2026-06-15 | 2026-06-21 | — | — |
| BOG-005 | Documentar decisiones funcionales cerradas de BogApp | P0 | M0 | Product | Chore | M | M0 | 2026-06-15 | 2026-06-21 | — | BOG-006 |
| BOG-006 | Frontend: implementar store del onboarding | P0 | M1 | Frontend | Feature | M | M1 | 2026-06-22 | 2026-07-05 | BOG-002, BOG-005 | BOG-007, BOG-008, BOG-009 |
| BOG-007 | Frontend: implementar paso 1 — Cuenta owner | P0 | M1 | Frontend | Feature | M | M1 | 2026-06-22 | 2026-07-05 | BOG-006 | BOG-012 |
| BOG-008 | Frontend: implementar paso 2 — Estudio jurídico | P0 | M1 | Frontend | Feature | M | M1 | 2026-06-22 | 2026-07-05 | BOG-006 | BOG-012 |
| BOG-009 | Frontend: implementar paso 3 — Workspace | P0 | M1 | Frontend | Feature | M | M1 | 2026-06-22 | 2026-07-05 | BOG-006 | BOG-012 |
| BOG-010 | Database: preparar modelos para tenant onboarding | P0 | M1 | Database | Feature | M | M1 | 2026-06-22 | 2026-07-05 | BOG-002 | BOG-011 |
| BOG-011 | Backend: crear endpoint bootstrap tenant | P0 | M1 | Backend | Feature | L | M1 | 2026-06-22 | 2026-07-05 | BOG-010 | BOG-012, BOG-015 |
| BOG-012 | Integración: conectar onboarding con API real | P0 | M1 | Integration | Feature | M | M1 | 2026-06-22 | 2026-07-05 | BOG-007, BOG-008, BOG-009, BOG-011 | BOG-014 |
| BOG-013 | Frontend: crear dashboard inicial post-alta | P0 | M1 | Frontend | Feature | M | M1 | 2026-06-22 | 2026-07-05 | — | BOG-014 |
| BOG-014 | QA: validar flujo completo de alta del estudio | P0 | M1 | QA | QA | M | M1 | 2026-06-22 | 2026-07-05 | BOG-012, BOG-013 | BOG-050 |
| BOG-015 | Backend: implementar tenant context por request | P0 | M2 | Backend | Feature | M | M2 | 2026-07-06 | 2026-07-19 | BOG-011 | BOG-016, BOG-021 |
| BOG-016 | Backend: validar membership contra DB | P0 | M2 | Backend | Feature | M | M2 | 2026-07-06 | 2026-07-19 | BOG-015 | BOG-017 |
| BOG-017 | Backend: implementar RBAC base por tenant | P0 | M2 | Backend | Feature | L | M2 | 2026-07-06 | 2026-07-19 | BOG-016 | BOG-019, BOG-022, BOG-035, BOG-044 |
| BOG-018 | Backend: aplicar guards a rutas protegidas | P0 | M2 | Backend | Feature | M | M2 | 2026-07-06 | 2026-07-19 | — | BOG-019 |
| BOG-019 | QA: probar bloqueo de acceso cross-tenant | P0 | M2 | QA | QA | M | M2 | 2026-07-06 | 2026-07-19 | BOG-017, BOG-018 | BOG-050 |
| BOG-020 | Backend: registrar auditoría de acciones sensibles | P0 | M2 | Backend | Feature | M | M2 | 2026-07-06 | 2026-07-19 | — | — |
| BOG-021 | Database: validar modelos MVP tenant-aware | P1 | M3 | Database | Feature | M | M3 | 2026-07-20 | 2026-08-09 | BOG-002, BOG-015 | BOG-022 |
| BOG-022 | Backend: CRUD de clientes jurídicos | P1 | M3 | Backend | Feature | L | M3 | 2026-07-20 | 2026-08-09 | BOG-017, BOG-021 | BOG-025 |
| BOG-023 | Frontend: pantalla de clientes | P1 | M3 | Frontend | Feature | M | M3 | 2026-07-20 | 2026-08-09 | — | — |
| BOG-024 | Backend: CRUD de partes contrarias y áreas de práctica | P1 | M3 | Backend | Feature | L | M3 | 2026-07-20 | 2026-08-09 | — | BOG-025 |
| BOG-025 | Backend: CRUD de expedientes / causas | P1 | M3 | Backend | Feature | L | M3 | 2026-07-20 | 2026-08-09 | BOG-022, BOG-024 | BOG-031, BOG-035 |
| BOG-026 | Backend: gestionar participantes de causa | P1 | M3 | Backend | Feature | M | M3 | 2026-07-20 | 2026-08-09 | — | — |
| BOG-027 | Frontend: pantalla de expedientes | P1 | M3 | Frontend | Feature | M | M3 | 2026-07-20 | 2026-08-09 | — | — |
| BOG-028 | Frontend: timeline básico del expediente | P1 | M3 | Frontend | Feature | M | M3 | 2026-07-20 | 2026-08-09 | — | — |
| BOG-029 | QA: validar clientes y expedientes | P1 | M3 | QA | QA | M | M3 | 2026-07-20 | 2026-08-09 | — | BOG-050 |
| BOG-030 | Backend: implementar abstracción StorageProvider | P1 | M4 | Backend | Feature | M | M4 | 2026-08-10 | 2026-08-23 | — | BOG-031 |
| BOG-031 | Backend: documentos básicos asociados a causas y clientes | P1 | M4 | Backend | Feature | M | M4 | 2026-08-10 | 2026-08-23 | BOG-025, BOG-030 | — |
| BOG-032 | Frontend: carga y listado de documentos | P1 | M4 | Frontend | Feature | M | M4 | 2026-08-10 | 2026-08-23 | — | — |
| BOG-033 | Backend: categorías y metadatos de documentos | P1 | M4 | Backend | Feature | M | M4 | 2026-08-10 | 2026-08-23 | — | — |
| BOG-034 | QA: validar módulo de documentos | P1 | M4 | QA | QA | M | M4 | 2026-08-10 | 2026-08-23 | — | BOG-050 |
| BOG-035 | Backend: modelos y API de tareas básicas | P1 | M5 | Backend | Feature | M | M5 | 2026-08-24 | 2026-09-06 | BOG-017, BOG-025 | BOG-044 |
| BOG-036 | Frontend: vista de tareas y vencimientos | P1 | M5 | Frontend | Feature | M | M5 | 2026-08-24 | 2026-09-06 | — | — |
| BOG-037 | Backend: notificaciones básicas | P1 | M5 | Backend | Feature | M | M5 | 2026-08-24 | 2026-09-06 | — | — |
| BOG-038 | Backend: recordatorios de tareas vencidas y próximas | P1 | M5 | Backend | Feature | M | M5 | 2026-08-24 | 2026-09-06 | — | — |
| BOG-039 | QA: validar tareas, vencimientos y notificaciones | P1 | M5 | QA | QA | M | M5 | 2026-08-24 | 2026-09-06 | — | BOG-050 |
| BOG-040 | Backend: gastos simples por causa y cliente | P1 | M6 | Backend | Feature | M | M6 | 2026-09-07 | 2026-09-20 | — | — |
| BOG-041 | Backend: cuenta corriente básica del cliente | P1 | M6 | Backend | Feature | M | M6 | 2026-09-07 | 2026-09-20 | — | — |
| BOG-042 | Backend: caja básica del estudio | P1 | M6 | Backend | Feature | M | M6 | 2026-09-07 | 2026-09-20 | — | — |
| BOG-043 | Frontend: dashboard financiero básico | P1 | M6 | Frontend | Feature | M | M6 | 2026-09-07 | 2026-09-20 | — | BOG-050 |
| BOG-044 | Arquitectura: documentar RabbitMQ, eventos y Outbox Pattern | P2 | M7 | Architecture | Chore | M | M7 | 2026-09-21 | 2026-10-04 | BOG-017, BOG-035 | — |
| BOG-045 | Integración futura: Google Calendar | P2 | M7 | Integration | Feature | M | M7 | 2026-09-21 | 2026-10-04 | — | — |
| BOG-046 | Integración futura: Google Drive | P2 | M7 | Integration | Feature | M | M7 | 2026-09-21 | 2026-10-04 | — | — |
| BOG-047 | Integración futura: IA legal sobre documentos y expedientes | P2 | M7 | Integration | Feature | M | M7 | 2026-09-21 | 2026-10-04 | — | — |
| BOG-048 | Infra: hardening de CI/CD y comandos de validación | P2 | M8 | Infra | Chore | M | M8 | 2026-10-05 | 2026-10-18 | — | BOG-050 |
| BOG-049 | Infra: documentación de variables de entorno y secretos | P2 | M8 | Infra | Chore | M | M8 | 2026-10-05 | 2026-10-18 | — | BOG-052 |
| BOG-050 | QA: smoke test completo del MVP | P0 | M8 | QA | QA | M | M8 | 2026-10-05 | 2026-10-18 | BOG-014, BOG-019, BOG-029, BOG-034, BOG-039, BOG-043, BOG-048 | BOG-052 |
| BOG-051 | Observabilidad: logs, auditoría y errores por tenant | P2 | M8 | Observability | Chore | M | M8 | 2026-10-05 | 2026-10-18 | — | BOG-052 |
| BOG-052 | Release checklist: preparar entrega MVP de BogApp | P0 | M8 | Product | Chore | M | M8 | 2026-10-05 | 2026-10-18 | BOG-049, BOG-050, BOG-051 | BOG-053, BOG-061, BOG-065, BOG-068 |
| BOG-053 | Producto: definir planes comerciales Free/Premium/Enterprise | P2 | M9 | Product | Chore | M | M9 | 2026-10-19 | 2026-11-01 | BOG-052 | BOG-054, BOG-056, BOG-057 |
| BOG-054 | Backend: preparar límites por plan y tenant | P2 | M9 | Backend | Feature | M | M9 | 2026-10-19 | 2026-11-01 | BOG-053 | BOG-055 |
| BOG-055 | Frontend: pantalla de plan y uso del tenant | P2 | M9 | Frontend | Feature | M | M9 | 2026-10-19 | 2026-11-01 | BOG-054 | — |
| BOG-056 | Billing: documentar estrategia Stripe/MercadoPago | P2 | M9 | Billing | Chore | M | M9 | 2026-10-19 | 2026-11-01 | BOG-053 | — |
| BOG-057 | Legal: documentar términos de uso y política de privacidad | P2 | M9 | Legal | Chore | S | M9 | 2026-10-19 | 2026-11-01 | BOG-053 | — |
| BOG-058 | Comercial: preparar demo seed para estudios jurídicos | P2 | M9 | Sales | Chore | M | M9 | 2026-10-19 | 2026-11-01 | — | — |
| BOG-059 | Comercial: preparar landing o sección comercial básica | P2 | M9 | Sales | Chore | M | M9 | 2026-10-19 | 2026-11-01 | — | — |
| BOG-060 | Soporte: documentar proceso de alta de nuevo cliente | P2 | M9 | Support | Chore | S | M9 | 2026-10-19 | 2026-11-01 | — | — |
| BOG-061 | Infra: configurar entorno staging | P1 | M10 | Infra | Chore | M | M10 | 2026-11-02 | 2026-11-15 | BOG-052 | BOG-062 |
| BOG-062 | Infra: configurar entorno producción | P1 | M10 | Infra | Chore | M | M10 | 2026-11-02 | 2026-11-15 | BOG-061 | BOG-063 |
| BOG-063 | Infra: estrategia de backups de base de datos | P1 | M10 | Infra | Chore | M | M10 | 2026-11-02 | 2026-11-15 | BOG-062 | BOG-077 |
| BOG-064 | Infra: estrategia de recuperación ante fallos | P1 | M10 | Infra | Chore | M | M10 | 2026-11-02 | 2026-11-15 | — | BOG-077 |
| BOG-065 | Seguridad: checklist OWASP básico | P1 | M10 | Security | Chore | M | M10 | 2026-11-02 | 2026-11-15 | BOG-052 | BOG-077 |
| BOG-066 | Seguridad: rate limiting y protección de endpoints críticos | P1 | M10 | Security | Chore | M | M10 | 2026-11-02 | 2026-11-15 | — | — |
| BOG-067 | Seguridad: revisión de exposición de secretos | P1 | M10 | Security | Chore | M | M10 | 2026-11-02 | 2026-11-15 | — | — |
| BOG-068 | QA: pruebas E2E principales | P1 | M10 | QA | QA | M | M10 | 2026-11-02 | 2026-11-15 | BOG-052 | BOG-077 |
| BOG-069 | QA: prueba de carga inicial | P1 | M10 | QA | QA | M | M10 | 2026-11-02 | 2026-11-15 | — | BOG-077 |
| BOG-070 | QA: prueba de permisos por rol | P1 | M10 | QA | QA | M | M10 | 2026-11-02 | 2026-11-15 | — | BOG-077 |
| BOG-071 | UX: revisión final de navegación y consistencia visual | P1 | M10 | UX | Chore | M | M10 | 2026-11-02 | 2026-11-15 | — | BOG-077 |
| BOG-072 | Docs: manual técnico de instalación | P1 | M10 | Docs | Chore | S | M10 | 2026-11-02 | 2026-11-15 | — | BOG-077 |
| BOG-073 | Docs: manual de usuario owner/admin | P1 | M10 | Docs | Chore | S | M10 | 2026-11-02 | 2026-11-15 | — | BOG-077 |
| BOG-074 | Docs: manual de usuario abogado/asistente | P1 | M10 | Docs | Chore | S | M10 | 2026-11-02 | 2026-11-15 | — | BOG-077 |
| BOG-075 | Soporte: flujo de reporte de bugs | P1 | M10 | Support | Chore | S | M10 | 2026-11-02 | 2026-11-15 | — | — |
| BOG-076 | Soporte: SLA inicial para clientes | P1 | M10 | Support | Chore | S | M10 | 2026-11-02 | 2026-11-15 | — | — |
| BOG-077 | Release: checklist de go-live | P0 | M10 | Release | Chore | M | M10 | 2026-11-02 | 2026-11-15 | BOG-063, BOG-064, BOG-065, BOG-068, BOG-069, BOG-070, BOG-071, BOG-072, BOG-073, BOG-074 | BOG-078 |
| BOG-078 | Release: crear versión v1.0.0 | P0 | M10 | Release | Chore | M | M10 | 2026-11-02 | 2026-11-15 | BOG-077 | BOG-079, BOG-080 |
| BOG-079 | Comercial: preparar demo comercial | P1 | M10 | Sales | Chore | M | M10 | 2026-11-02 | 2026-11-15 | BOG-078 | — |
| BOG-080 | Producto: retrospectiva y roadmap post venta | P1 | M10 | Product | Chore | M | M10 | 2026-11-02 | 2026-11-15 | BOG-078 | — |
