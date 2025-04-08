
import { AuthEntityType } from '@/enums/AuthEntityType';
export interface Entity {
    name: string;
    email: string;
    entityType: AuthEntityType;
    id: string;
    address: string;
}