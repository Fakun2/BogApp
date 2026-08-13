import { createAccountCopy } from "../../_constants/create-account.constants";

export function FormDivider() {
  return (
    <div className="my-2 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs text-muted-foreground 2xl:my-5">
      <span className="h-px bg-border" />
      {createAccountCopy.divider}
      <span className="h-px bg-border" />
    </div>
  );
}
