import { SheetFooter } from "@/components/ui/sheet";
import { CreateStaffCloseButton } from "./create-staff-close-button";
import { CreateStaffSubmitButton } from "./create-staff-submit-button";

export function CreateStaffFooter({
  mode,
  submitting = false
}: {
  mode: "create" | "update";
  submitting?: boolean;
}) {
  return (
    <SheetFooter className="px-4 pb-5 pt-2">
      <div className="grid w-full gap-3 sm:grid-cols-2">
        <CreateStaffSubmitButton disabled={submitting} mode={mode} />
        <CreateStaffCloseButton />
      </div>
    </SheetFooter>
  );
}
