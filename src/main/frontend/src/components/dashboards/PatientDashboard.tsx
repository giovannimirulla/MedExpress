import React, { useState, useEffect } from 'react';
import { Card, Table, Badge } from 'antd';
import { usePatientOrders } from '@/hooks/usePatientOrders';
import { OrderDataType } from '@/interfaces/OrderDataType';
import { Order } from '@/interfaces/Order';
import { getTimeDifference } from '@/utils/dateUtils';
import { Tag } from 'antd';
import DynamicDrugIcon from '@/components/DynamicDrugIcon';
import { Priority } from '@/enums/Priority';



interface PatientDashboardProps {
    orders: Order[];
    showModal: (selectedOrder: OrderDataType) => void;
}


const PatientDashboard: React.FC<PatientDashboardProps> = ({ orders, showModal }) => {

    const [, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setTick(tick => tick + 1);
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const { ordersForDoctorApproval, ordersForPharmacyProcessing, ordersForDriverPickup, ordersCompleted } = usePatientOrders(orders);

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
    ];

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card title={`In attesa autorizzazione medico (${ordersForDoctorApproval.length})`}>
                    <Table<OrderDataType>
                        columns={columns}
                        dataSource={ordersForDoctorApproval}
                        pagination={false}
                        onRow={(record: OrderDataType) => ({
                            onClick: () => showModal(record)
                        })}
                    />
                </Card>
                <Card title={`Da evadere dalla farmacia (${ordersForPharmacyProcessing.length})`} >
                    <Table<OrderDataType>
                        columns={columns}
                        dataSource={ordersForPharmacyProcessing}
                        pagination={false}
                        onRow={(record: OrderDataType) => ({
                            onClick: () => showModal(record)
                        })}
                    />
                </Card>
                <Card title={`Da consegnare dal driver (${ordersForDriverPickup.length})`} >
                    <Table<OrderDataType>
                        columns={columns}
                        dataSource={ordersForDriverPickup}
                        pagination={false}
                        style={{ height: ordersForDriverPickup.length === 0 ? '100%' : 'auto' }}
                        onRow={(record: OrderDataType) => ({
                            onClick: () => showModal(record)
                        })}
                    />
                </Card>
            </div>
            <div className="grid grid-cols-1">
                <Card title={`Ordini Completati (${ordersCompleted.length})`} >
                    <Table<OrderDataType>
                        columns={columns}
                        dataSource={ordersCompleted}
                        pagination={false}
                        onRow={(record: OrderDataType) => ({
                            onClick: () => showModal(record)
                        })}
                    />
                </Card>
            </div>
        </>
    );
};

export default PatientDashboard;