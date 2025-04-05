import { useCallback, useMemo } from 'react';
import { Order } from '@/interfaces/Order';
import { OrderDataType } from '@/interfaces/OrderDataType';
import { Priority } from '@/enums/Priority';
import { StatusDoctor, StatusDoctorLabel, StatusDoctorColor, StatusDoctorIcon } from '@/enums/StatusDoctor';
import { StatusDriver, StatusDriverLabel, StatusDriverColor, StatusDriverIcon } from '@/enums/StatusDriver';
import { StatusPharmacy, StatusPharmacyLabel, StatusPharmacyColor, StatusPharmacyIcon } from '@/enums/StatusPharmacy';
import { AuthEntityType } from '@/enums/AuthEntityType';

export function usePatientOrders(orders: Order[]) {

  const processOrders = useCallback((
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
        };
        return mapper ? mapper(order, defaultMapping) : defaultMapping;
      });
  }, [orders]);

  const ordersForDoctorApproval: OrderDataType[] = useMemo(
    () => processOrders(
      order =>
        order.statusDoctor === StatusDoctor.PENDING ||
        order.statusDoctor === StatusDoctor.REJECTED,
      (order, defaultMapping) => ({
        ...defaultMapping,
        statusUser: `Dott. ${order.user.doctor.name} ${order.user.doctor.surname}`
      })
    ),
    [processOrders]
  );

  const ordersForPharmacyProcessing: OrderDataType[] = useMemo(
    () =>
      processOrders(
        (order) => {
          const isApprovedDoctor =
            order.statusDoctor === StatusDoctor.APPROVED ||
            order.statusDoctor === StatusDoctor.NO_APPROVAL_NEEDED;
          const isValidPharmacyStatus =
            order.statusPharmacy === StatusPharmacy.PENDING ||
            order.statusPharmacy === StatusPharmacy.UNDER_PREPARATION ||
            order.statusPharmacy === StatusPharmacy.READY_FOR_PICKUP;
          // Escludiamo gli ordini che sono già presi in carico dal driver
          const isExcluded =
            order.statusPharmacy === StatusPharmacy.READY_FOR_PICKUP &&
            order.statusDriver === StatusDriver.TAKEN_OVER;
          return isApprovedDoctor && isValidPharmacyStatus && !isExcluded;
        },
        (order, defaultMapping) => ({
          ...defaultMapping,
          statusUser: order.pharmacy
            ? order.pharmacy.companyName
            : "Non assegnata",
          statusLabel: StatusPharmacyLabel[order.statusPharmacy! as StatusPharmacy],
          statusColor: StatusPharmacyColor[order.statusPharmacy! as StatusPharmacy],
          statusIcon: StatusPharmacyIcon[order.statusPharmacy! as StatusPharmacy]
        })
      ),
    [processOrders]
  );

  const ordersForDriverPickup: OrderDataType[] = useMemo(
    () =>
      processOrders(
        order =>
          (order.statusDoctor === StatusDoctor.APPROVED || order.statusDoctor === StatusDoctor.NO_APPROVAL_NEEDED) &&
          (order.statusPharmacy === StatusPharmacy.DELIVERED_TO_DRIVER && (
            order.statusDriver === StatusDriver.TAKEN_OVER ||
            order.statusDriver === StatusDriver.IN_DELIVERY)),
        (order, defaultMapping) => ({
          ...defaultMapping,
          statusLabel: StatusDriverLabel[order.statusDriver! as StatusDriver],
          statusColor: StatusDriverColor[order.statusDriver! as StatusDriver],
          statusIcon: StatusDriverIcon[order.statusDriver! as StatusDriver],
        })
      ),
    [processOrders]
  );

  const ordersCompleted: OrderDataType[] = useMemo(
    () =>
      processOrders(
        order =>
          (order.statusDoctor === StatusDoctor.APPROVED ||
            order.statusDoctor === StatusDoctor.NO_APPROVAL_NEEDED) &&
          order.statusPharmacy === StatusPharmacy.DELIVERED_TO_DRIVER &&
          order.statusDriver === StatusDriver.DELIVERED_TO_USER,
        (order, defaultMapping) => ({
          ...defaultMapping,
          statusLabel: StatusDriverLabel[order.statusDriver! as StatusDriver],
          statusColor: StatusDriverColor[order.statusDriver! as StatusDriver],
          statusIcon: StatusDriverIcon[order.statusDriver! as StatusDriver],
        })
      ),
    [processOrders]
  );

  // order senza filtro
  const allOrders: OrderDataType[] = useMemo(() => processOrders(() => true), [processOrders]);

  return { ordersForDoctorApproval, ordersForPharmacyProcessing, ordersForDriverPickup, ordersCompleted, allOrders };
}