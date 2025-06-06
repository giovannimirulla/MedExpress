
import { CheckCircleOutlined, SendOutlined, ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';

export enum StatusDriver {
    PENDING,
    TAKEN_OVER,
    IN_DELIVERY,
    DELIVERED_TO_USER
}

export const StatusDriverLabel: Record<StatusDriver, string> = {
    [StatusDriver.PENDING]: "In attesa",
    [StatusDriver.TAKEN_OVER]: "Preso in carico",
    [StatusDriver.IN_DELIVERY]: "In consegna",
    [StatusDriver.DELIVERED_TO_USER]: "Consegnato",
};

export const StatusDriverColor: Record<StatusDriver, string> = {
    [StatusDriver.PENDING]: "warning",
    [StatusDriver.TAKEN_OVER]: "warning",
    [StatusDriver.IN_DELIVERY]: "warning",
    [StatusDriver.DELIVERED_TO_USER]: "green",
};

export const StatusDriverIcon: Record<StatusDriver,  React.ReactElement> = {
    [StatusDriver.PENDING]: <ClockCircleOutlined />,
    [StatusDriver.TAKEN_OVER]: <InboxOutlined />,
    [StatusDriver.IN_DELIVERY]: <SendOutlined />,
    [StatusDriver.DELIVERED_TO_USER]: <CheckCircleOutlined />,
};

//cast to StatusDriver
export function castToStatusDriver(value: string | undefined): StatusDriver {
    const status = StatusDriver[value as keyof typeof StatusDriver];
    return status === undefined ? StatusDriver.PENDING : status;
}

//reverse cast to StatusDriver
export function castFromStatusDriver(value: StatusDriver): string {
    return StatusDriver[value];
}