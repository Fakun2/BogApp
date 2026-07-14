UPDATE "roles"
SET "description" = CASE "code"
  WHEN 'owner' THEN 'Tiene control completo del estudio, permisos, facturacion y administracion.'
  WHEN 'admin' THEN 'Administra el estudio, equipo, roles y configuracion operativa.'
  WHEN 'lawyer' THEN 'Gestiona clientes, expedientes, documentos, tareas y seguimiento legal.'
  WHEN 'paralegal' THEN 'Colabora en expedientes, documentos y tareas sin administrar permisos.'
  WHEN 'accounting' THEN 'Accede a clientes, expedientes y gestion financiera del estudio.'
  WHEN 'viewer' THEN 'Consulta informacion del estudio sin modificar datos operativos.'
  ELSE "description"
END,
"updated_at" = now()
WHERE "is_system" = true
  AND "code" IN ('owner', 'admin', 'lawyer', 'paralegal', 'accounting', 'viewer');
