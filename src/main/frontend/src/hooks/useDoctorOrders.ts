import { useMemo } from 'react';
import { OrderDataType } from '@/interfaces/OrderDataType';
import { Order } from '@/interfaces/Order';
import { Priority } from '@/enums/Priority';
import { StatusDoctor, StatusDoctorLabel, StatusDoctorColor, StatusDoctorIcon } from '@/enums/StatusDoctor';

function processDoctorOrders(orders: Order[], status: StatusDoctor): OrderDataType[] {
    const priorityOrder: Record<string, number> = { [Priority.HIGH]: 2, [Priority.NORMAL]: 1 };

    return orders
        .filter((order: Order) => order.statusDoctor === status)
        .sort((a, b) => {
            const dateA = new Date(a.updatedAt!).getTime();
            const dateB = new Date(b.updatedAt!).getTime();
            if (dateB !== dateA) {
                return dateB - dateA;
            }
            return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        })
        .map((order: Order): OrderDataType => ({
            key: order.id,
            id: order.id,
            name: order.drugPackage.medicinale.denominazioneMedicinale,
            statusLabel: StatusDoctorLabel[order.statusDoctor! as StatusDoctor],
            statusColor: StatusDoctorColor[order.statusDoctor! as StatusDoctor],
            statusIcon: StatusDoctorIcon[order.statusDoctor! as StatusDoctor],
            statusUser: order.updatedBy?.name || "Non specificato",
            drugPackage: order.drugPackage,
            updatedAt: order.updatedAt!,
            updatedBy: order.updatedBy,
            priority: order.priority,
            statusDoctor: order.statusDoctor,
            statusPharmacy: order.statusPharmacy,
            statusDriver: order.statusDriver
        }));
}

export function useDoctorOrders(orders: Order[]) {
    const doctorPendingOrders = useMemo(
        () => processDoctorOrders(orders, StatusDoctor.PENDING),
        [orders]
    );
    const doctorApprovedOrders = useMemo(
        () => processDoctorOrders(orders, StatusDoctor.APPROVED),
        [orders]
    );
    const doctorRejectedOrders = useMemo(
        () => processDoctorOrders(orders, StatusDoctor.REJECTED),
        [orders]
    );

    return { doctorPendingOrders, doctorApprovedOrders, doctorRejectedOrders };
}