"use client";
import React, { useState, useEffect } from 'react';
import { Layout, Card, Table, ConfigProvider, Tag } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import DynamicDrugIcon from '@/components/DynamicDrugIcon';

const { Content } = Layout;

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
    status: string;
}

const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      render: (_: string, record: any) => (
        <div className="flex items-center space-x-2">
          <DynamicDrugIcon drug={record.drugPackage} />
          <a>{record.name}</a>
        </div>
      )
    },
    {
      title: 'Stato',
      key: 'status',
      dataIndex: 'status',
      render: (status: string) => {
        let icon;
        let color;
        const text = status.toUpperCase();
        if (status === 'approved') {
          icon = <CheckCircleOutlined />;
          color = 'green';
        } else if (status === 'pending') {
          icon = <ExclamationCircleOutlined />;
          color = 'orange';
        } else if (status === 'rejected') {
          icon = <CloseCircleOutlined />;
          color = 'red';
        } else {
          icon = <QuestionCircleOutlined />;
          color = 'default';
        }
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
    },
  ];



export default function Dashboard() {
    const [orderData, setOrderData] = useState<any>({ pending: [], approvedOrNoApprovalNeeded: [], deliveredToDriver: [], deliveredToUser: [] });
    
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/order/67be417c419c6774d37aa75d")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                //add datatype icon, name and status. in response name is in array pending in drugPackage -> medicinale -> denominazioneMedicinale, status is in array for pending is statusDoctor, for approvedOrNoApprovalNeeded is statusPharmacy, for deliveredToDriver is statusDriver, for deliveredToUser is statusDriver
                const pending = data.pending.map((order: any) => ({
                    key: order.id,
                    name: order.drugPackage.medicinale.denominazioneMedicinale,
                    status: order.statusDoctor,
                    drugPackage: order.drugPackage,
                }));
                const approvedOrNoApprovalNeeded = data.approvedOrNoApprovalNeeded.map((order: any) => ({
                    key: order.id,
                    name: order.drugPackage.medicinale.denominazioneMedicinale,
                    status: order.statusPharmacy,
                    drugPackage: order.drugPackage,
                }));
                const deliveredToDriver = data.deliveredToDriver.map((order: any) => ({
                    key: order.id,
                    name: order.drugPackage.medicinale.denominazioneMedicinale,
                    status: order.statusDriver,
                    drugPackage: order.drugPackage,
                }));
                const deliveredToUser = data.deliveredToUser.map((order: any) => ({
                    key: order.id,
                    name: order.drugPackage.medicinale.denominazioneMedicinale,
                    status: order.statusUser,
                    drugPackage: order.drugPackage,
                }));
                setOrderData({ pending, approvedOrNoApprovalNeeded, deliveredToDriver, deliveredToUser });
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Ipotizziamo che l'oggetto ottenuto abbia questa struttura:
    // {
    //    pending: Order[],
    //    approvedOrNoApprovalNeeded: Order[],
    //    deliveredToDriver: Order[],
    //    deliveredToUser: Order[]
    // }
    const pendingCount = orderData.pending.length;
    const approvedCount = orderData.approvedOrNoApprovalNeeded.length;
    const deliveredToDriverCount = orderData.deliveredToDriver.length;
    const deliveredToUserCount = orderData.deliveredToUser.length;

    return (
        <ConfigProvider theme={{ components: { Card: { bodyPadding: 0 } } }}> 
        <Layout className="min-h-screen">
            <Content className="p-4">
                {/* Sezione in alto: Ordini in attesa/da evadere/da consegnare */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card title={`In attesa dell'autorizzazione del medico (${pendingCount})`} variant="borderless">
                        <Table<DataType> columns={columns} dataSource={orderData.pending} pagination={false} />
                    </Card>
                    <Card title={`Da evadere dalla farmacia (${approvedCount})`} variant="borderless">
                        <Table<DataType> columns={columns} dataSource={orderData.approvedOrNoApprovalNeeded} pagination={false} />
                    </Card>
                    <Card title={`Da consegnare dal driver (${deliveredToDriverCount})`} variant="borderless">
                        <Table<DataType> columns={columns} dataSource={orderData.deliveredToDriver} pagination={false} />
                    </Card>
                </div>
                {/* Sezione in basso: Ordini Completati */}
                <div className="grid grid-cols-1">
                    <Card title={`Ordini Completati (${deliveredToUserCount})`} variant="borderless">
                        <Table<DataType> columns={columns} dataSource={orderData.deliveredToUser} pagination={false} />
                    </Card>
                </div>
            </Content>
        </Layout>
        </ConfigProvider>
    );
}