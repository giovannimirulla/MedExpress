
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';


export enum StatusPharmacy {
    PENDING,
    UNDER_PREPARATION,
    READY_FOR_PICKUP,
    DELIVERED_TO_DRIVER
}

export const StatusPharmacyLabel: Record<StatusPharmacy, string> = {
    [StatusPharmacy.PENDING]: "In attesa",
    [StatusPharmacy.UNDER_PREPARATION]: "In preparazione",
    [StatusPharmacy.READY_FOR_PICKUP]: "Pronto per il ritiro",
    [StatusPharmacy.DELIVERED_TO_DRIVER]: "Consegnato al corriere",
};

export const StatusPharmacyColor: Record<StatusPharmacy, string> = {
    [StatusPharmacy.PENDING]: "warning",
    [StatusPharmacy.UNDER_PREPARATION]: "warning",
    [StatusPharmacy.READY_FOR_PICKUP]: "warning",
    [StatusPharmacy.DELIVERED_TO_DRIVER]: "success",
};

export const StatusPharmacyIcon: Record<StatusPharmacy, React.ReactElement> = {
    [StatusPharmacy.PENDING]: <QuestionCircleOutlined />,
    [StatusPharmacy.UNDER_PREPARATION]: <QuestionCircleOutlined />,
    [StatusPharmacy.READY_FOR_PICKUP]:  <QuestionCircleOutlined />,
    [StatusPharmacy.DELIVERED_TO_DRIVER]: <CheckCircleOutlined />,
};

//cast to StatusPharmacy
export function castToStatusPharmacy(value: string | undefined): StatusPharmacy {
    const status = StatusPharmacy[value as keyof typeof StatusPharmacy];
    return status === undefined ? StatusPharmacy.PENDING : status;
}

//reverse cast to StatusPharmacy
export function castFromStatusPharmacy(value: StatusPharmacy): string {
    return StatusPharmacy[value];
}