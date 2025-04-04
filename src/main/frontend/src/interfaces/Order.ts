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
        id: string;
        companyName: string;
        email: string;
    };
    driver?: {
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
}