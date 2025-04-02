import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Badge } from 'antd';
import { usePharmacyOrders } from '@/hooks/usePharmacyOrders';
import { OrderDataType } from '@/interfaces/OrderDataType';
import { Order } from '@/interfaces/Order';
import DynamicDrugIcon from '@/components/DynamicDrugIcon';
import { getTimeDifference } from '@/utils/dateUtils';

import { StatusPharmacy } from '@/enums/StatusPharmacy';
import { StatusDriver } from '@/enums/StatusDriver';
import { StatusDoctor } from '@/enums/StatusDoctor';
import { Priority } from '@/enums/Priority';

import { SendOutlined } from '@ant-design/icons';




interface PharmacyDashboardProps {
    orders: Order[];
    updateStatus: <T extends StatusPharmacy | StatusDriver | StatusDoctor>(orderId: string, status: T) => void;
    isUpdating: boolean;
}

const PharmacyDashboard: React.FC<PharmacyDashboardProps> = ({ orders, updateStatus, isUpdating }) => {
    const [, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setTick(tick => tick + 1);
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const { pharmacyPendingOrders, pharmacyUnderPreparationOrders, pharmacyReadyOrders, pharmacyDeliveredOrders } = usePharmacyOrders(orders);

    const columns = [
        {
            title: 'Nome',
            key: 'name',
            dataIndex: 'name',
            render: (_: string, record: OrderDataType) => {
                const diff = getTimeDifference(record.updatedAt);
                return (
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
                            <span className='text-xs'>{diff}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            title: 'Stato',
            key: 'status',
            render: (_: string, record: OrderDataType) => {
                const text = record.statusLabel;
                const color = record.statusColor;
                const icon = record.statusIcon;
                return (
                    <Tag color={color} icon={icon}>
                        {text}
                    </Tag>
                );
            },
        },
        {
            title: 'Azione',
            key: 'action',
            render: (_: string, record: OrderDataType) => {
                if (record.statusPharmacy === StatusPharmacy.PENDING) {
                    return <Button onClick={() => updateStatus(record.key, StatusPharmacy.UNDER_PREPARATION)} icon={<SendOutlined />} variant="solid" color="green" loading={isUpdating}>Accetta</Button>;
                } else if (record.statusPharmacy === StatusPharmacy.UNDER_PREPARATION) {
                    return <Button onClick={() => updateStatus(record.key, StatusPharmacy.READY_FOR_PICKUP)} variant="solid" color="orange" loading={isUpdating}>Pronto per il ritiro</Button>;
                }
            }
        }
    ];

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card title={`In attesa (${pharmacyPendingOrders.length})`} variant="borderless">
                    <Table<OrderDataType>
                        columns={columns}
                        dataSource={pharmacyPendingOrders}
                        pagination={false}
                    />
                </Card>
                <Card title={`In preparazione (${pharmacyUnderPreparationOrders.length})`} variant="borderless">
                    <Table<OrderDataType>
                        columns={columns}
                        dataSource={pharmacyUnderPreparationOrders}
                        pagination={false}
                    />
                </Card>
                <Card title={`Pronto per la consegna (${pharmacyReadyOrders.length})`} variant="borderless">
                    <Table<OrderDataType>
                        columns={columns.filter(col => col.key !== 'action')}
                        dataSource={pharmacyReadyOrders}
                        pagination={false}
                    />
                </Card>
            </div>
            <div className="grid grid-cols-1">
                <Card title={`Consegna completata (${pharmacyDeliveredOrders.length})`} variant="borderless">
                    <Table<OrderDataType>
                        columns={columns.filter(col => col.key !== 'action')}
                        dataSource={pharmacyDeliveredOrders}
                        pagination={false}
                    />
                </Card>
            </div>
        </>
    );
};

export default PharmacyDashboard;