"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Card, Table, ConfigProvider, Tag } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import DynamicDrugIcon from '@/components/DynamicDrugIcon';
import { socket } from "@/services/socketService";

const { Content } = Layout;

interface DataType {
  key: string;
  name: string;
  status: string;
  drugPackage: Order["drugPackage"];
  updatedAt: string;
}

interface Order {
  id: string;
  drugPackage: {
    formaFarmaceutica: string;
    medicinale: {
      denominazioneMedicinale: string;
    };
  };
  statusDoctor?: string;
  statusPharmacy?: string;
  statusDriver?: string;
  statusUser?: string;
  updatedAt?: string;
}

interface OrderSocket {
  orderId: string;
  statusEntity: string;
  statusMessage: string;
}

const columns = [
  {
    title: 'Nome',
    key: 'name',
    dataIndex: 'name',
    render: (_: string, record: DataType) => (
      <div className="flex items-center space-x-2">
        <DynamicDrugIcon drug={record.drugPackage} />
        <a>{record.name}</a>
      </div>
    ),
  },
  {
    title: 'Stato',
    key: 'status',
    dataIndex: 'status',
    render: (status: string) => {
      let icon;
      let color;
      const text = status.toUpperCase();
      if (status === "APPROVED") {
        icon = <CheckCircleOutlined />;
        color = 'green';
      } else if (status === "PENDING") {
        icon = <ExclamationCircleOutlined />;
        color = 'orange';
      } else if (status === "REJECTED") {
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
  {
    title: 'Ultimo Aggiornamento',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    render: (updatedAt: string) => {
      const diff = getTimeDifference(updatedAt);
      return <span>{diff}</span>;
    },
  },
];

function getTimeDifference(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    const diffHrs = Math.floor(diffMins / 60);
    return `${diffHrs} hr${diffHrs > 1 ? "s" : ""} ago`;
  } else {
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));
    if (diffDays < 30) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    }
  }
}

export default function Dashboard() {
  // Salviamo l'intero array degli ordini
  const [orders, setOrders] = useState<Order[]>([]);
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
        // Assumiamo che "data" sia un array di ordini
        console.log(data);
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filtriamo e mappiamo solo al momento della visualizzazione utilizzando useMemo
  const ordersForDoctorApproval: DataType[] = useMemo(() => 
    orders
      .filter((order: Order) =>
        order.statusDoctor === "PENDING" || order.statusDoctor === "REJECTED"
      )
      .map((order: Order): DataType => ({
        key: order.id,
        name: order.drugPackage.medicinale.denominazioneMedicinale,
        status: order.statusDoctor!,
        drugPackage: order.drugPackage,
        updatedAt: order.updatedAt!
      })),
  [orders]);

  const ordersForPharmacyProcessing: DataType[] = useMemo(() => 
    orders
      .filter((order: Order) =>
        (order.statusDoctor === "APPROVED" || order.statusDoctor === "NO_APPROVAL_NEEDED") &&
        (order.statusPharmacy === "PENDING" ||
         order.statusPharmacy === "UNDER_PREPARATION" ||
         order.statusPharmacy === "READY_FOR_PICKUP")
      )
      .map((order: Order): DataType => ({
        key: order.id,
        name: order.drugPackage.medicinale.denominazioneMedicinale,
        status: order.statusPharmacy!,
        drugPackage: order.drugPackage,
        updatedAt: order.updatedAt!
      })),
  [orders]);

  const ordersForDriverPickup: DataType[] = useMemo(() => 
    orders
      .filter((order: Order) =>
        (order.statusDoctor === "APPROVED" || order.statusDoctor === "NO_APPROVAL_NEEDED") &&
        order.statusPharmacy === "DELIVERED_TO_DRIVER"
      )
      .map((order: Order): DataType => ({
        key: order.id,
        name: order.drugPackage.medicinale.denominazioneMedicinale,
        status: order.statusPharmacy!,
        drugPackage: order.drugPackage,
        updatedAt: order.updatedAt!
      })),
  [orders]);

  const ordersCompleted: DataType[] = useMemo(() => 
    orders
      .filter((order: Order) =>
        (order.statusDoctor === "APPROVED" || order.statusDoctor === "NO_APPROVAL_NEEDED") &&
        order.statusPharmacy === "DELIVERED_TO_DRIVER" &&
        order.statusDriver === "DELIVERED_TO_USER"
      )
      .map((order: Order): DataType => ({
        key: order.id,
        name: order.drugPackage.medicinale.denominazioneMedicinale,
        status: order.statusDriver!,
        drugPackage: order.drugPackage,
        updatedAt: order.updatedAt!
      })),
  [orders]);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {}
    function onDisconnect() {}
    function onOrderUpdate(orderUpdate: OrderSocket) {
      console.log("Order update received", orderUpdate);
      // Qui andrà implementata l'eventuale logica per aggiornare un ordine specifico
      // Se esiste l'ordine aggiornato, applica le modifiche
      // in order statusEntity is statusDoctor, statusPharmacy or statusDriver
      // in order statusMessage is the new status

      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((order) => {    
          if (order.id === orderUpdate.orderId) {
            if (orderUpdate.statusEntity === "statusDoctor") {
              order.statusDoctor = orderUpdate.statusMessage;
            } else if (orderUpdate.statusEntity === "statusPharmacy") {
              order.statusPharmacy = orderUpdate.statusMessage;
            } else if (orderUpdate.statusEntity === "statusDriver") {
              order.statusDriver = orderUpdate.statusMessage;
            }
          }
          return order;
        });
        return updatedOrders;
      }); 
      

    }
  
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("67be417c419c6774d37aa75d", onOrderUpdate);
  
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("67be417c419c6774d37aa75d", onOrderUpdate);
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const doctorApprovalCount = ordersForDoctorApproval.length;
  const pharmacyProcessingCount = ordersForPharmacyProcessing.length;
  const driverPickupCount = ordersForDriverPickup.length;
  const completedCount = ordersCompleted.length;

  return (
    <ConfigProvider theme={{ components: { Card: { bodyPadding: 0 } } }}> 
      <Layout className="min-h-screen">
        <Content className="p-4">
          {/* Sezione in alto: Ordini in attesa/da evadere/da consegnare */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card title={`In attesa autorizzazione medico (${doctorApprovalCount})`} variant="borderless">
              <Table<DataType> columns={columns} dataSource={ordersForDoctorApproval} pagination={false} />
            </Card>
            <Card title={`Da evadere dalla farmacia (${pharmacyProcessingCount})`} variant="borderless">
              <Table<DataType> columns={columns} dataSource={ordersForPharmacyProcessing} pagination={false} />
            </Card>
            <Card title={`Da consegnare dal driver (${driverPickupCount})`} variant="borderless">
              <Table<DataType> columns={columns} dataSource={ordersForDriverPickup} pagination={false} />
            </Card>
          </div>
          {/* Sezione in basso: Ordini Completati */}
          <div className="grid grid-cols-1">
            <Card title={`Ordini Completati (${completedCount})`} variant="borderless">
              <Table<DataType> columns={columns} dataSource={ordersCompleted} pagination={false} />
            </Card>
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}