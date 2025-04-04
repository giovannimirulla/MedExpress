import { useMemo } from 'react';
import { OrderDataType } from '@/interfaces/OrderDataType';
import { Order } from '@/interfaces/Order';
import { Priority } from '@/enums/Priority';
import { StatusDoctor, StatusDoctorLabel, StatusDoctorColor, StatusDoctorIcon } from '@/enums/StatusDoctor';
import { AuthEntityType } from '@/enums/AuthEntityType';

function processDoctorOrders(orders: Order[], status: StatusDoctor): OrderDataType[] {
    const priorityOrder: Record<string, number> = { [Priority.HIGH]: 2, [Priority.NORMAL]: 1 };

    return orders
        .filter((order: Order) => order.statusDoctor === status)
        .sort((a, b) => {
            // Sort by priority first
            const priorityComparison = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
            if (priorityComparison !== 0) return priorityComparison;
    
            // Then sort by date (most recent first)
            const dateA = new Date(a.updatedAt!).getTime();
            const dateB = new Date(b.updatedAt!).getTime();
            return dateB - dateA;
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
            statusDriver: order.statusDriver,
            pharmacy: {
                name: order.pharmacy?.companyName || "Non assegnata",
                email: order.pharmacy?.email || "Non assegnata",
                entityType: AuthEntityType.Pharmacy,
                id: order.pharmacy?.id || "Non assegnata",
            },
            driver: {
                name: order.driver?.name && order.driver?.surname ? order.driver?.name + " " +  order.driver?.surname : "Non assegnato",
                email: order.driver?.email || "Non assegnato",
                entityType: AuthEntityType.User,
                id: order.driver?.id || "Non assegnato",
            },
            user: {
                name: order.user.name && order.user.surname ? order.user.name + " " + order.user.surname : "Non specificato",
                email: order.user.email,
                entityType: AuthEntityType.User,
                id: order.user.id,
                doctor: {
                    name: order.user.doctor.name + " " + order.user.doctor.surname,
                    email: order.user.doctor.email,
                    entityType: AuthEntityType.User,
                    id: order.user.doctor.id,   
                },
            },
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