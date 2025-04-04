import { useCallback, useMemo } from 'react';
import { Order } from '@/interfaces/Order';
import { OrderDataType } from '@/interfaces/OrderDataType';
import { Priority } from '@/enums/Priority';
import { StatusDriver, StatusDriverLabel, StatusDriverColor, StatusDriverIcon } from '@/enums/StatusDriver';
import { StatusPharmacy } from '@/enums/StatusPharmacy';
import { AuthEntityType } from '@/enums/AuthEntityType';

export function useDriverOrders(orders: Order[]) {
  const processDriverOrders = useCallback((filterFn: (order: Order) => boolean): OrderDataType[] => {
    const priorityOrder: Record<string, number> = { [Priority.HIGH]: 2, [Priority.NORMAL]: 1 };
    return orders
      .filter(filterFn)
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
        statusLabel: StatusDriverLabel[order.statusDriver! as StatusDriver],
        statusColor: StatusDriverColor[order.statusDriver! as StatusDriver],
        statusIcon: StatusDriverIcon[order.statusDriver! as StatusDriver],
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
  }, [orders]);

  const driverPendingOrders = useMemo(
    () => processDriverOrders(order =>
      order.statusDriver === StatusDriver.PENDING &&
      order.statusPharmacy === StatusPharmacy.READY_FOR_PICKUP
    ),
    [processDriverOrders]
  );

  const driverTakenOverOrders = useMemo(
    () => processDriverOrders(order => order.statusDriver === StatusDriver.TAKEN_OVER),
    [processDriverOrders]
  );

  const driverInDeliveryOrders = useMemo(
    () => processDriverOrders(order => order.statusDriver === StatusDriver.IN_DELIVERY),
    [processDriverOrders]
  );

  const driverCompletedOrders = useMemo(
    () => processDriverOrders(order => order.statusDriver === StatusDriver.DELIVERED_TO_USER),
    [processDriverOrders]
  );

  return { driverPendingOrders, driverTakenOverOrders, driverInDeliveryOrders, driverCompletedOrders };
}