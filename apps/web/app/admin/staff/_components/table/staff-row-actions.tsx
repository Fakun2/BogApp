"use client";

import { useState } from "react";
import { MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { getActiveTenantAccess, hasAnyPermission, hasPermission } from "@/lib/auth/permissions";
import { useSession } from "@/lib/auth/use-session";
import { useDeleteStaffMutation } from "../../_hooks/use-delete-staff-mutation";
import type { StaffListResponse, StaffWorker } from "../../_types/staff.types";
import { canManageWorkerByHierarchy } from "../../_utils/staff-access";
import { CreateStaffSheet } from "../create-staff/create-staff-sheet";
import { DeleteStaffDialog } from "./delete-staff-dialog";

export function StaffRowActions({
  onUpdated,
  staffData,
  worker
}: {
  onUpdated: () => void;
  staffData: StaffListResponse | undefined;
  worker: StaffWorker;
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteStaffMutation = useDeleteStaffMutation(worker.id);
  const session = useSession();
  const canUseActions =
    hasAnyPermission(session, ["staff:update", "staff:delete"]) &&
    canManageWorkerByHierarchy({
      actorRoleCode: getActiveTenantAccess(session)?.role,
      currentUserId: session?.user.id,
      roleOptions: staffData?.filterOptions.roles ?? [],
      worker
    });
  const canUpdate = hasPermission(session, "staff:update");
  const canDelete = hasPermission(session, "staff:delete");

  async function handleDelete() {
    try {
      await deleteStaffMutation.mutateAsync();
      setDeleteDialogOpen(false);
      onUpdated();
    } catch {
      // The mutation exposes the error in the confirmation panel.
    }
  }

  if (!canUseActions) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-8 w-8 rounded-lg border-border/50 p-0"
            aria-label={`Acciones para ${worker.fullName}`}
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {canUpdate ? (
            <CreateStaffSheet
              mode="update"
              staffData={staffData}
              trigger={
                <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                  <PencilLine className="h-4 w-4" aria-hidden="true" />
                  Editar
                </DropdownMenuItem>
              }
              worker={worker}
              onCreated={onUpdated}
            />
          ) : null}
          {canDelete ? (
            <DropdownMenuItem
              variant="destructive"
              onSelect={(event) => {
                event.preventDefault();
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Eliminar
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteStaffDialog
        error={deleteStaffMutation.error?.message}
        loading={deleteStaffMutation.isPending}
        open={deleteDialogOpen}
        workerName={worker.fullName}
        onConfirm={handleDelete}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}
