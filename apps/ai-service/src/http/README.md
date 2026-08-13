# HTTP

Controladores internos del AI Service.

Los endpoints de esta carpeta deben ser llamados por `apps/api` o por workers internos, nunca directamente desde el navegador. Cada request debe llegar firmada y con tenant/user/case ya validados por el monolito.

