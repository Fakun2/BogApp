import { EventEmitter } from "node:events";
import { Injectable } from "@nestjs/common";

export const roleEvents = {
  deactivated: "role.deactivated",
  deleted: "role.deleted"
} as const;

export type RoleCleanupPayload = {
  roleId: string;
  tenantId: string;
};

@Injectable()
export class RoleEventsService {
  private readonly emitter = new EventEmitter();

  emitCleanup(eventName: (typeof roleEvents)[keyof typeof roleEvents], payload: RoleCleanupPayload) {
    setImmediate(() => this.emitter.emit(eventName, payload));
  }

  onCleanup(eventName: (typeof roleEvents)[keyof typeof roleEvents], listener: (payload: RoleCleanupPayload) => void) {
    this.emitter.on(eventName, listener);
  }
}
