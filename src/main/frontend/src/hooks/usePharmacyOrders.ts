import { useMemo, useCallback } from 'react';
import { Order } from '@/interfaces/Order';
import { OrderDataType } from '@/interfaces/OrderDataType';
import { Priority } from '@/enums/Priority';
import { StatusPharmacy, StatusPharmacyLabel, StatusPharmacyColor, StatusPharmacyIcon } from '@/enums/StatusPharmacy';
import { StatusDoctor } from '@/enums/StatusDoctor';

export function usePharmacyOrders(orders: Order[]) {
  const processPharmacyOrders = useCallback((
    filterFn: (order: Order) => boolean,
    mapper?: (order: Order, defaultMapping: OrderDataType) => OrderDataType
  ): OrderDataType[] => {
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
      .map((order: Order): OrderDataType => {
        const defaultMapping: OrderDataType = {
          key: order.id,
          id: order.id,
          name: order.drugPackage.medicinale.denominazioneMedicinale,
          statusLabel: StatusPharmacyLabel[order.statusPharmacy! as StatusPharmacy],
          statusColor: StatusPharmacyColor[order.statusPharmacy! as StatusPharmacy],
          statusIcon: StatusPharmacyIcon[order.statusPharmacy! as StatusPharmacy],
          statusUser: order.updatedBy?.name || "Non specificato",
          drugPackage: order.drugPackage,
          updatedAt: order.updatedAt!,
          updatedBy: order.updatedBy,
          priority: order.priority,
          statusDoctor: order.statusDoctor,
          statusPharmacy: order.statusPharmacy,
          statusDriver: order.statusDriver
        };
        return mapper ? mapper(order, defaultMapping) : defaultMapping;
      });
  }, [orders]);

  const pharmacyPendingOrders = useMemo(() =>
    processPharmacyOrders(
      order =>
        (order.statusDoctor === StatusDoctor.APPROVED || order.statusDoctor === StatusDoctor.NO_APPROVAL_NEEDED) &&
        order.statusPharmacy === StatusPharmacy.PENDING,
      (order, defaultMapping) => ({
        ...defaultMapping,
        statusUser: `${order.user.name} ${order.user.surname}`
      })
    ),
    [processPharmacyOrders]
  );

  const pharmacyUnderPreparationOrders = useMemo(() =>
    processPharmacyOrders(
      order => order.statusPharmacy === StatusPharmacy.UNDER_PREPARATION,
      (order, defaultMapping) => ({
        ...defaultMapping,
        statusUser: `${order.user.name} ${order.user.surname}`
      })
    ),
    [processPharmacyOrders]
  );

  const pharmacyReadyOrders = useMemo(() =>
    processPharmacyOrders(
      order => order.statusPharmacy === StatusPharmacy.READY_FOR_PICKUP,
      (order, defaultMapping) => ({
        ...defaultMapping,
        statusUser: `${order.user.name} ${order.user.surname}`
      })
    ),
    [processPharmacyOrders]
  );

  const pharmacyDeliveredOrders = useMemo(() =>
    processPharmacyOrders(order => order.statusPharmacy === StatusPharmacy.DELIVERED_TO_DRIVER),
    [processPharmacyOrders]
  );

  return {
    pharmacyPendingOrders,
    pharmacyUnderPreparationOrders,
    pharmacyReadyOrders,
    pharmacyDeliveredOrders
  };
}