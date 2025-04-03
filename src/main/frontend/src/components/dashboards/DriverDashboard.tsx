import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Badge } from 'antd';
import DynamicDrugIcon from '@/components/DynamicDrugIcon';
import { getTimeDifference } from '@/utils/dateUtils';
import { StatusDriver } from '@/enums/StatusDriver';

import { OrderDataType } from '@/interfaces/OrderDataType';
import { useDriverOrders } from '@/hooks/useDriverOrders';

import { Order } from '@/interfaces/Order';

import { StatusPharmacy } from '@/enums/StatusPharmacy';
import { StatusDoctor } from '@/enums/StatusDoctor';
import { Priority } from '@/enums/Priority';

interface DriverDashboardProps {
    orders: Order[];
    updateStatus: <T extends StatusPharmacy | StatusDriver | StatusDoctor>(orderId: string, status: T) => void;
    isUpdating: boolean;
    showModal: (selectedOrder: OrderDataType) => void;
}


const DriverDashboard: React.FC<DriverDashboardProps> = ({ orders, updateStatus, isUpdating, showModal }) => {

    const [, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setTick(tick => tick + 1);
        }, 60000);
        return () => clearInterval(interval);
    }, []);
    const { driverPendingOrders, driverTakenOverOrders, driverInDeliveryOrders, driverCompletedOrders } = useDriverOrders(orders);

    const columns = [
        {
            title: 'Nome',
            key: 'name',
            dataIndex: 'name',
            render: (_: string, record: OrderDataType) => (
                <div className="flex items-center space-x-2">
                    {
                        record.priority === Priority.HIGH ? (

                            <Badge
                                count={null} // Usa null per un pallino
                                dot
                                offset={[-5, 5]} // Regola la posizione del badge
                                style={{ width: '14px', height: '14px' }} // Aumenta la dimensione del badge
                                status="processing"
                                color="red"
                            >
                                <DynamicDrugIcon drug={record.drugPackage} />
                            </Badge>
                        ) : (
                            <DynamicDrugIcon drug={record.drugPackage} />
                        )
                    }
                    <div className='flex flex-col '>
                        <a className='font-bold'>{record.name}</a>
                        <span className='text-sm'>{record.statusUser}</span>
                        <span className='text-xs'>{getTimeDifference(record.updatedAt)}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Stato',
            key: 'status',
            render: (_: string, record: OrderDataType) => (
                <Tag color={record.statusColor} icon={record.statusIcon}>
                    {record.statusLabel}
                </Tag>
            ),
        },
        {
            title: 'Azione',
            key: 'action',
            render: (_: string, record: OrderDataType) => {
                if (record.statusDriver === StatusDriver.PENDING) {
                    return <Button onClick={() => updateStatus(record.key, StatusDriver.TAKEN_OVER)} loading={isUpdating}>Prendi Ordine</Button>;
                } else if (record.statusDriver === StatusDriver.TAKEN_OVER) {
                    return <Button onClick={() => updateStatus(record.key, StatusDriver.IN_DELIVERY)} loading={isUpdating}>In consegna</Button>;
                } else if (record.statusDriver === StatusDriver.IN_DELIVERY) {
                    return <Button onClick={() => updateStatus(record.key, StatusDriver.DELIVERED_TO_USER)} loading={isUpdating}>Consegnato</Button>;
                }
                return null;
            }
        },
    ];


    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card title={`In attesa (${driverPendingOrders.length})`} variant="borderless">
                    <Table<OrderDataType>
                        columns={columns}
                        dataSource={driverPendingOrders}
                        pagination={false}
                        onRow={(record: OrderDataType) => ({
                            onClick: () => showModal(record)
                        })}
                    />
                </Card>
                <Card title={`Preso in carico (${driverTakenOverOrders.length})`} variant="borderless">
                    <Table<OrderDataType>
                        columns={columns}
                        dataSource={driverTakenOverOrders}
                        pagination={false}
                        onRow={(record: OrderDataType) => ({
                            onClick: () => showModal(record)
                        })}
                    />
                </Card>
                <Card title={`In consegna (${driverInDeliveryOrders.length})`} variant="borderless">
                    <Table<OrderDataType>
                        columns={columns}
                        dataSource={driverInDeliveryOrders}
                        pagination={false}
                        onRow={(record: OrderDataType) => ({
                            onClick: () => showModal(record)
                        })}
                    />
                </Card>
            </div>
            <div className="grid grid-cols-1">
                <Card title={`Consegna completata (${driverCompletedOrders.length})`} variant="borderless">
                    <Table<OrderDataType>
                        columns={columns.filter((col) => col.key !== 'action')} // Remove action column for completed orders
                        dataSource={driverCompletedOrders}
                        pagination={false}
                        onRow={(record: OrderDataType) => ({
                            onClick: () => showModal(record)
                        })}
                    />
                </Card>
            </div>
        </>
    );
}
export default DriverDashboard;