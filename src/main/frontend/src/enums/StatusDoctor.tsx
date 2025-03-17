import React from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined, SendOutlined } from '@ant-design/icons';

export enum StatusDoctor {
    PENDING,
    APPROVED,
    REJECTED,
    NO_APPROVAL_NEEDED
}

export const StatusDoctorLabel: Record<StatusDoctor, string> = {
    [StatusDoctor.PENDING]: "In attesa",
    [StatusDoctor.APPROVED]: "Approvato",
    [StatusDoctor.REJECTED]: "Rifiutato",
    [StatusDoctor.NO_APPROVAL_NEEDED]: "Non necessita approvazione",
};
export const StatusDoctorColor: Record<StatusDoctor, string> = {
    [StatusDoctor.PENDING]: "warning",
    [StatusDoctor.APPROVED]: "green",
    [StatusDoctor.REJECTED]: "danger",
    [StatusDoctor.NO_APPROVAL_NEEDED]: "info",
};
export const StatusDoctorIcon: Record<StatusDoctor, React.ReactElement> = {
    [StatusDoctor.PENDING]: <QuestionCircleOutlined />,
    [StatusDoctor.APPROVED]: <CheckCircleOutlined />,
    [StatusDoctor.REJECTED]: <CloseCircleOutlined />,
    [StatusDoctor.NO_APPROVAL_NEEDED]: <SendOutlined />,

};

//cast to StatusDoctor
export function castToStatusDoctor(value: string | undefined): StatusDoctor {
    const status = StatusDoctor[value as keyof typeof StatusDoctor];
    return status === undefined ? StatusDoctor.PENDING : status;
}

//reverse cast to StatusDoctor
export function castFromStatusDoctor(value: StatusDoctor): string {
    return StatusDoctor[value];
}