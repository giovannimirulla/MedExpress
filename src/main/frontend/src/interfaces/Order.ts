import { StatusDoctor } from '@/enums/StatusDoctor';
import { StatusPharmacy } from '@/enums/StatusPharmacy';
import { StatusDriver } from '@/enums/StatusDriver';
import { Priority } from '@/enums/Priority';
import { Entity } from './Entity';
import { CommonDrug } from './CommonDrug';

export interface Order {
    id: string;
    drugPackage: CommonDrug;
    priority: Priority;
    statusDoctor: StatusDoctor;
    statusPharmacy: StatusPharmacy;
    statusDriver: StatusDriver;
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