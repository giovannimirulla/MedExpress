import { Priority } from '@/enums/Priority';
import { Entity } from './Entity';
import { CommonDrug } from './CommonDrug';

export interface OrderResponse {
  id: string;
  drugPackage: CommonDrug;
  priority: Priority;
  statusDoctor: string;
  statusPharmacy: string;
  statusDriver: string;
  updatedAt: string;
  updatedBy?: Entity;
  user: {
    name: string;
    surname: string;
    address: string;
    doctor: {
      name: string;
      surname: string;
    };
  };
  pharmacy?: {
    companyName: string;
  };
}