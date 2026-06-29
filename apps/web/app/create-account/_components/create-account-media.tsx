import { BriefcaseBusiness, Scale, ShieldCheck, Users } from "lucide-react";
import { createAccountMedia } from "../_constants/create-account.constants";

const legalFeatures = [
  {
    title: "Clientes centralizados",
    description: "Alta, busqueda e historial preparados para el trabajo diario del estudio.",
    icon: Users
  },
  {
    title: "Expedientes conectados",
    description: "Una base ordenada para vincular clientes, causas, documentos y tareas.",
    icon: BriefcaseBusiness
  },
  {
    title: "Acceso seguro",
    description: "Roles, permisos y separacion por tenant para cada estudio juridico.",
    icon: ShieldCheck
  }
];

export function CreateAccountMedia() {
  return (
    <section
      className="hidden min-h-screen overflow-hidden rounded-3xl border border-[#d6c4a3]/40 bg-[#14110f] text-[#f8f1e4] lg:block lg:h-full lg:min-h-0"
      aria-label={createAccountMedia.label}
    >
      <div className="relative flex h-full flex-col justify-between p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(200,166,70,0.28),_transparent_34%),linear-gradient(135deg,_rgba(255,253,248,0.08),_transparent_42%)]" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full border border-[#c8a646]/40 bg-[#c8a646]/15">
              <Scale className="h-5 w-5 text-[#c8a646]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#c8a646]">BogApp</p>
              <p className="text-sm text-[#cbbfa9]">Workspace juridico privado</p>
            </div>
          </div>
          <span className="rounded-full border border-[#c8a646]/40 px-4 py-2 text-xs text-[#e9ddc7]">
            LegalTech SaaS
          </span>
        </div>

        <div className="relative z-10 max-w-2xl">
          <p className="mb-4 text-sm uppercase tracking-[0.28em] text-[#c8a646]">
            Gestion integral para estudios
          </p>
          <h2 className="text-5xl font-semibold leading-tight tracking-tight">
            Clientes, expedientes y tareas en un solo sistema.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#cbbfa9]">
            BogApp ordena la operacion del estudio desde el primer acceso: usuarios, roles,
            clientes e informacion sensible bajo una experiencia sobria y profesional.
          </p>
        </div>

        <div className="relative z-10 grid gap-4 xl:grid-cols-3">
          {legalFeatures.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-[#d6c4a3]/25 bg-[#fffdf8]/[0.07] p-5 backdrop-blur"
            >
              <feature.icon className="h-5 w-5 text-[#c8a646]" />
              <h3 className="mt-4 text-base font-semibold text-[#fffdf8]">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#cbbfa9]">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
