import { Entity } from './Entity';
import { CommonDrug } from './CommonDrug';

export interface OrderResponse {
  id: string;
  packageId: string;
  drugPackage: CommonDrug;
  priority: string;
  statusDoctor: string;
  statusPharmacy: string;
  statusDriver: string;
  updatedAt: string;
  updatedBy?: Entity;
  user: {
    id: string;
    name: string;
    surname: string;
    email: string;
    address: string;
    doctor: {
      name: string;
      surname: string;
      email: string;
      id: string;
    };
  };
  pharmacy?: {
    companyName: string;
    email: string;
    id: string;
  };
}