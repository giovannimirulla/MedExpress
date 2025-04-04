import { Priority } from "@/enums/Priority";
import { CommonDrug } from "./CommonDrug";
import { Entity } from "./Entity";
import { StatusDoctor } from "@/enums/StatusDoctor";
import { StatusPharmacy } from "@/enums/StatusPharmacy";
import { StatusDriver } from "@/enums/StatusDriver";

export interface OrderDataType {
  key: string;
  id: string;
  name: string;
  statusLabel: string;
  statusColor: string;
  statusIcon:  React.ReactElement;
  statusUser: string;
  drugPackage: CommonDrug;
  updatedAt: string;
  updatedBy?: Entity;
  priority: Priority;
  statusDoctor: StatusDoctor;
  statusPharmacy: StatusPharmacy;
  statusDriver: StatusDriver;
  pharmacy: Entity;
  driver: Entity;
  user: Entity & {
    doctor: Entity;
  };
} 