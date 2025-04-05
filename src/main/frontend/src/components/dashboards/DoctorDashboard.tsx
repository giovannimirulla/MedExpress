import React, { useState, useEffect } from 'react';
import { Card, Table, Badge } from 'antd';
import { useDoctorOrders } from '@/hooks/useDoctorOrders';
import { OrderDataType } from '@/interfaces/OrderDataType';
import { Order } from '@/interfaces/Order';
import { getTimeDifference } from '@/utils/dateUtils';
import { Tag, Button } from 'antd';
import DynamicDrugIcon from '@/components/DynamicDrugIcon';

import { StatusPharmacy } from '@/enums/StatusPharmacy';
import { StatusDriver } from '@/enums/StatusDriver';
import { StatusDoctor } from '@/enums/StatusDoctor';
import { Priority } from '@/enums/Priority';

import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';


interface DoctorDashboardProps {
    orders: Order[];
    updateStatus: <T extends StatusPharmacy | StatusDriver | StatusDoctor>(orderId: string, status: T) => void;
    isUpdating: boolean;
    showModal: (selectedOrder: OrderDataType) => void;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ orders, updateStatus, isUpdating, showModal }) => {

    const [, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setTick(tick => tick + 1);
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const { doctorPendingOrders, doctorApprovedOrders, doctorRejectedOrders } = useDoctorOrders(orders);

    const columns = [
        {
            title: 'Nome',
            key: 'name',
            dataIndex: 'name',
            render: (_: string, record: OrderDataType) => {
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
                            <span className='text-xs'>{getTimeDifference(record.updatedAt)}</span>
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
                if (record.statusDoctor === StatusDoctor.PENDING) {
                    return (
                        <div className="flex space-x-2">
                            <Button onClick={() => updateStatus(record.key, StatusDoctor.APPROVED)} icon={<CheckCircleOutlined />} variant="solid" color="green" loading={isUpdating}>Approva</Button>
                            <Button onClick={() => updateStatus(record.key, StatusDoctor.REJECTED)} icon={<CloseCircleOutlined />} variant="solid" color="red" loading={isUpdating}>Rifiuta</Button>
                        </div>
                    );
                }
            },
        },
        // Add action column if needed
    ];

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card title={`In attesa (${doctorPendingOrders.length})`} >
                    <Table<OrderDataType>
                        columns={columns}
                        dataSource={doctorPendingOrders}
                        pagination={false}
                        onRow={(record: OrderDataType) => ({
                            onClick: () => showModal(record)
                        })}
                    />
                </Card>
                <Card title={`Approvati (${doctorApprovedOrders.length})`} >
                    <Table<OrderDataType>
                        columns={columns.filter((column) => column.key !== 'action')}
                        dataSource={doctorApprovedOrders}
                        pagination={false}
                        onRow={(record: OrderDataType) => ({
                            onClick: () => showModal(record)
                        })}
                    />
                </Card>
                <Card title={`Rifiutati (${doctorRejectedOrders.length})`} >
                    <Table<OrderDataType>
                        columns={columns.filter((column) => column.key !== 'action')}
                        dataSource={doctorRejectedOrders}
                        pagination={false}
                        style={{ height: doctorRejectedOrders.length === 0 ? '100%' : 'auto' }}
                        onRow={(record: OrderDataType) => ({
                            onClick: () => showModal(record)
                        })}
                    />
                </Card>
            </div>
        </>
    );
};

export default DoctorDashboard;