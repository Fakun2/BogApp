export function Stats() {
  return (
    <section className="bg-card py-12 text-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 text-center sm:grid-cols-4 sm:px-6">
        {[
          ["100k+", "Expedientes"],
          ["99.9%", "Disponibilidad de sistema"],
          ["3", "Capas de seguridad"],
          ["12x", "Mas rapido que herramientas tradicionales"]
        ].map(([number, label]) => (
          <div key={label}>
            <p className="text-4xl font-semibold">{number}</p>
            <p className="mt-2 text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
