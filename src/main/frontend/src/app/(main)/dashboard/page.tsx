"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Card, Table, ConfigProvider, Tag, Button, Typography, Spin, Alert } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined, SendOutlined } from '@ant-design/icons';
import DynamicDrugIcon from '@/components/DynamicDrugIcon';
import { socket } from "@/services/socketService";
import api from '@/utils/api';
import { useAuth } from '@/context/authContext';
import { Role } from '@/enums/Role';
import { AuthEntityType } from '@/enums/AuthEntityType';

const { Content } = Layout;
const { Title } = Typography;

export default function Dashboard() {
  const { getRole, getEntityType, getId, getName } = useAuth();
  const role = getRole();
  const id = getId();
  const entityType = getEntityType();
  const name = getName();

  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Salviamo l'intero array degli ordini
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
    drugPackage: {
      formaFarmaceutica: string;
      medicinale: {
        denominazioneMedicinale: string;
      };
    };
    statusEntity: string;
    statusMessage: string;
    updateAt: string;
  }

  const columns = [
    {
      title: 'Nome',
      key: 'name',
      dataIndex: 'name',
      render: (_: string, record: DataType) => {
        const diff = getTimeDifference(record.updatedAt);
        return (

          <div className="flex items-center space-x-2">
            <DynamicDrugIcon drug={record.drugPackage} />
            <div className='flex flex-col '>
              <a className='font-bold'>{record.name}</a>
              <span >{diff}</span>
            </div>
          </div>

        )
      },
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
      title: 'Azione',
      key: 'action',
      render: (_: string, record: DataType) => {
        if (record.status === "PENDING" && role === Role.Driver) {
          return <Button onClick={() => updateStatus(record.key, "TAKEN_OVER")} loading={isUpdating}>Prendi Ordine</Button>;
        } else if (record.status === "TAKEN_OVER") {
          return <Button onClick={() => updateStatus(record.key, "IN_DELIVERY")} loading={isUpdating}>In consegna</Button>;
        } else if (record.status === "IN_DELIVERY") {
          return <Button onClick={() => updateStatus(record.key, "DELIVERED_TO_USER")} loading={isUpdating}>Consegnato</Button>;
        } else if (record.status === "PENDING" && role === Role.Doctor) {
          return (
            <div className="flex space-x-2">
              <Button onClick={() => updateStatus(record.key, "APPROVED")} icon={<CheckCircleOutlined />} variant="solid" color="green" loading={isUpdating}>Approva</Button>
              <Button onClick={() => updateStatus(record.key, "REJECTED")} icon={<CloseCircleOutlined />} variant="solid" color="red" loading={isUpdating}>Rifiuta</Button>
            </div>
          );
        } else if (record.status === "PENDING" && entityType === AuthEntityType.Pharmacy) {
          return <Button onClick={() => updateStatus(record.key, "UNDER_PREPARATION")} icon={<SendOutlined />} variant="solid" color="green" loading={isUpdating}>Accetta</Button>;
        } else if (record.status === "UNDER_PREPARATION" && entityType === AuthEntityType.Pharmacy) {
          return <Button onClick={() => updateStatus(record.key, "READY_FOR_PICKUP")} variant="solid" color="orange" loading={isUpdating}>Pronto per il ritiro</Button>;
        } else if (record.status === "READY_FOR_PICKUP" && entityType === AuthEntityType.Pharmacy) {
          return <Button onClick={() => updateStatus(record.key, "DELIVERED_TO_DRIVER")} variant="solid" color="green" loading={isUpdating}>Consegnato al driver</Button>;
        }
        return null;
      },
    }
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

  function updateStatus(orderId: string, status: string) {
    //if role is driver url is /api/v1/driver/updateStatus else if role is doctor url is /api/v1/doctor/updateStatus
console.log("orderId", orderId);
console.log("status", status);
    let url = '';
    if (entityType === AuthEntityType.Pharmacy) {
      url = '/pharmacy/updateStatus';
    }
    else if (role === Role.Driver) {
      url = '/driver/updateStatus';
    } else if (role === Role.Doctor) {
      url = '/doctor/updateStatus';
    }
    setIsUpdating(true);

    api.post(url, {
      orderId: orderId,
      status: status
    })
      .then(() => {
        setOrders((prevOrders: Order[]) => prevOrders.map((order: Order) => {
          if (order.id === orderId) {
            if (entityType === AuthEntityType.Pharmacy) {
              order.statusPharmacy = status;
            } else if (role === Role.Driver) {
              order.statusDriver = status;
            } else if (role === Role.Doctor) {
              order.statusDoctor = status;
            }
          }
          return order;
        }))
        setIsUpdating(false);
      })
      .catch(err => {
        setError(err.message);
        setIsUpdating(false);
      });
  }




    useEffect(() => {
      api.get("/order/all")
        .then(response => {
          console.log(response.data);
          setOrders(response.data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }, [getId]);

    // UseMemo per il ruolo Doctor (già esistente)
    const doctorPendingOrders: DataType[] = useMemo(() =>
      orders
        .filter((order: Order) => order.statusDoctor === "PENDING")
        .map((order: Order): DataType => ({
          key: order.id,
          name: order.drugPackage.medicinale.denominazioneMedicinale,
          status: order.statusDoctor!,
          drugPackage: order.drugPackage,
          updatedAt: order.updatedAt!
        })),
      [orders]);

    const doctorApprovedOrders: DataType[] = useMemo(() =>
      orders
        .filter((order: Order) => order.statusDoctor === "APPROVED")
        .map((order: Order): DataType => ({
          key: order.id,
          name: order.drugPackage.medicinale.denominazioneMedicinale,
          status: order.statusDoctor!,
          drugPackage: order.drugPackage,
          updatedAt: order.updatedAt!
        })),
      [orders]);

    const doctorRejectedOrders: DataType[] = useMemo(() =>
      orders
        .filter((order: Order) => order.statusDoctor === "REJECTED")
        .map((order: Order): DataType => ({
          key: order.id,
          name: order.drugPackage.medicinale.denominazioneMedicinale,
          status: order.statusDoctor!,
          drugPackage: order.drugPackage,
          updatedAt: order.updatedAt!
        })),
      [orders]);

    // UseMemo per il ruolo Driver
    const driverPendingOrders: DataType[] = useMemo(() =>
      orders
        .filter((order: Order) => order.statusDriver === "PENDING" && order.statusPharmacy === "READY_FOR_PICKUP")
        .map((order: Order): DataType => ({
          key: order.id,
          name: order.drugPackage.medicinale.denominazioneMedicinale,
          status: order.statusDriver!,
          drugPackage: order.drugPackage,
          updatedAt: order.updatedAt!
        })),
      [orders]);

    const driverTakenOverOrders: DataType[] = useMemo(() =>
      orders
        .filter((order: Order) => order.statusDriver === "TAKEN_OVER")
        .map((order: Order): DataType => ({
          key: order.id,
          name: order.drugPackage.medicinale.denominazioneMedicinale,
          status: order.statusDriver!,
          drugPackage: order.drugPackage,
          updatedAt: order.updatedAt!
        })),
      [orders]);

    const driverInDeliveryOrders: DataType[] = useMemo(() =>
      orders
        .filter((order: Order) => order.statusDriver === "IN_DELIVERY")
        .map((order: Order): DataType => ({
          key: order.id,
          name: order.drugPackage.medicinale.denominazioneMedicinale,
          status: order.statusDriver!,
          drugPackage: order.drugPackage,
          updatedAt: order.updatedAt!
        })),
      [orders]);

    const driverCompletedOrders: DataType[] = useMemo(() =>
      orders
        .filter((order: Order) => order.statusDriver === "DELIVERED_TO_USER")
        .map((order: Order): DataType => ({
          key: order.id,
          name: order.drugPackage.medicinale.denominazioneMedicinale,
          status: order.statusDriver!,
          drugPackage: order.drugPackage,
          updatedAt: order.updatedAt!
        })),
      [orders]);

    const pharmacyPendingOrders: DataType[] = useMemo(() =>
      orders
        .filter((order: Order) =>
          (order.statusDoctor === "APPROVED" || order.statusDoctor === "NO_APPROVAL_NEEDED") &&
          order.statusPharmacy === "PENDING"
        )
        .map((order: Order): DataType => ({
          key: order.id,
          name: order.drugPackage.medicinale.denominazioneMedicinale,
          status: order.statusPharmacy!,
          drugPackage: order.drugPackage,
          updatedAt: order.updatedAt!
        })),
      [orders]
    );

    const pharmacyUnderPreparationOrders: DataType[] = useMemo(() =>
      orders
        .filter((order: Order) => order.statusPharmacy === "UNDER_PREPARATION")
        .map((order: Order): DataType => ({
          key: order.id,
          name: order.drugPackage.medicinale.denominazioneMedicinale,
          status: order.statusPharmacy!,
          drugPackage: order.drugPackage,
          updatedAt: order.updatedAt!
        })),
      [orders]
    );

    const pharmacyReadyOrders: DataType[] = useMemo(() =>
      orders
        .filter((order: Order) =>
          order.statusPharmacy === "READY_FOR_PICKUP"
        )
        .map((order: Order): DataType => ({
          key: order.id,
          name: order.drugPackage.medicinale.denominazioneMedicinale,
          status: order.statusPharmacy!,
          drugPackage: order.drugPackage,
          updatedAt: order.updatedAt!
        })),
      [orders]
    );

    const pharmacyDeliveredOrders: DataType[] = useMemo(() =>
      orders
        .filter((order: Order) =>
          order.statusPharmacy === "DELIVERED_TO_DRIVER"
        )
        .map((order: Order): DataType => ({
          key: order.id,
          name: order.drugPackage.medicinale.denominazioneMedicinale,
          status: order.statusPharmacy!,
          drugPackage: order.drugPackage,
          updatedAt: order.updatedAt!
        })),
      [orders]
    );


    // UseMemo per altri ruoli (pharmacy, etc.) se necessario...
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

      function onConnect() {
        console.log("Connected to socket server");
       }
      function onDisconnect() { 
        console.log("Disconnected from socket server");
      }
      function onOrderUpdate(orderUpdate: OrderSocket) {
        console.log("Order update received", orderUpdate);
        setOrders((prevOrders) => {
          const orderIndex = prevOrders.findIndex(order => order.id === orderUpdate.orderId);
          if (orderIndex !== -1) {
            // Update existing order
            return prevOrders.map((order) => {
              if (order.id === orderUpdate.orderId) {
          if (orderUpdate.statusEntity === "statusDoctor") {
            order.statusDoctor = orderUpdate.statusMessage;
          } else if (orderUpdate.statusEntity === "statusPharmacy") {
            order.statusPharmacy = orderUpdate.statusMessage;
          } else if (orderUpdate.statusEntity === "statusDriver") {
            order.statusDriver = orderUpdate.statusMessage;
          }
          order.updatedAt = orderUpdate.updateAt;
              }
              return order;
            });
          } else {
            
            // Create new order with minimal default values
            const newOrder: Order = {
              id: orderUpdate.orderId,
              drugPackage: orderUpdate.drugPackage,
              updatedAt: orderUpdate.updateAt,
              statusDoctor: undefined,
              statusPharmacy: undefined,
              statusDriver: undefined,
              statusUser: undefined
            };
            if (orderUpdate.statusEntity === "statusDoctor") {
              newOrder.statusDoctor = orderUpdate.statusMessage;
            } else if (orderUpdate.statusEntity === "statusPharmacy") {
              newOrder.statusPharmacy = orderUpdate.statusMessage;
            } else if (orderUpdate.statusEntity === "statusDriver") {
              newOrder.statusDriver = orderUpdate.statusMessage;
            }
            return [...prevOrders, newOrder];
          }
        });
        console.log("Updated orders", orders);
      }

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      console.log("id", id);
      if (id) {
        socket.on(id, onOrderUpdate);
      }

      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        if (id) {
          socket.off(id, onOrderUpdate);
        }
      };
    }, [id, orders]);

    if (loading) return <div className='min-h-screen flex items-center flex-col justify-center gap-4'> <Spin tip="Loading.." size="large"/> <div className="text-primary font-semibold mt-2">Loading...</div></div>;
    if (error) return <div className='min-h-screen flex items-center flex-col justify-center'><Alert
    message="Errore"
    description={error}
    type="error"
    showIcon
  /></div>;

    if (entityType === AuthEntityType.Pharmacy) {
      return (
        <ConfigProvider theme={{ components: { Card: { bodyPadding: 0 } } }}>
          <Layout className="min-h-screen">
            <Content className="px-16 pt-8">
              <div className='mb-8'>
                <Title>Benvenuto {name}</Title>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card title={`In attesa (${pharmacyPendingOrders.length})`} variant="borderless">
                  <Table<DataType>
                    columns={columns}
                    dataSource={pharmacyPendingOrders}
                    pagination={false}
                  />
                </Card>
                <Card title={`In preparazione (${pharmacyUnderPreparationOrders.length})`} variant="borderless">
                  <Table<DataType>
                    columns={columns}
                    dataSource={pharmacyUnderPreparationOrders}
                    pagination={false}
                  />
                </Card>
                <Card title={`Pronto per la consegna (${pharmacyReadyOrders.length})`} variant="borderless">
                  <Table<DataType>
                    columns={columns}
                    dataSource={pharmacyReadyOrders}
                    pagination={false}
                  />
                </Card>
              </div>
              <div className="grid grid-cols-1">
                <Card title={`Consegna completata (${pharmacyDeliveredOrders.length})`} variant="borderless">
                  <Table<DataType>
                    columns={columns}
                    dataSource={pharmacyDeliveredOrders}
                    pagination={false}
                  />
                </Card>
              </div>
            </Content>
          </Layout>
        </ConfigProvider>
      );
    }

    // Render per il ruolo Doctor
    if (role === Role.Doctor) {
      return (
        <ConfigProvider theme={{ components: { Card: { bodyPadding: 0 } } }}>
          <Layout className="min-h-screen">
            <Content className="px-16 pt-8">
              <div className='mb-8'>
                <Title>Benvenuto {name}</Title>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card title={`In attesa (${doctorPendingOrders.length})`} variant="borderless">
                  <Table<DataType>
                    columns={columns.filter(col => col.key !== 'status')}
                    dataSource={doctorPendingOrders}
                    pagination={false}
                  />
                </Card>
                <Card title={`Approvati (${doctorApprovedOrders.length})`} variant="borderless">
                  <Table<DataType>
                    columns={columns.filter(col => col.key !== 'action')}
                    dataSource={doctorApprovedOrders}
                    pagination={false}
                  />
                </Card>
                <Card title={`Rifiutati (${doctorRejectedOrders.length})`} variant="borderless">
                  <Table<DataType>
                    columns={columns.filter(col => col.key !== 'action')}
                    dataSource={doctorRejectedOrders}
                    pagination={false}
                  />
                </Card>
              </div>
            </Content>
          </Layout>
        </ConfigProvider>
      );
    }

    // Render per il ruolo Driver
    if (role === Role.Driver) {
      return (
        <ConfigProvider theme={{ components: { Card: { bodyPadding: 0 } } }}>
          <Layout className="min-h-screen">
            <Content className="px-16 pt-8">
              <div className='mb-8'>
                <Title>Benvenuto {name}</Title>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card title={`In attesa (${driverPendingOrders.length})`} variant="borderless">
                  <Table<DataType>
                    columns={columns}
                    dataSource={driverPendingOrders}
                    pagination={false}
                  />
                </Card>
                <Card title={`Preso in carico (${driverTakenOverOrders.length})`} variant="borderless">
                  <Table<DataType>
                    columns={columns}
                    dataSource={driverTakenOverOrders}
                    pagination={false}
                  />
                </Card>
                <Card title={`In consegna (${driverInDeliveryOrders.length})`} variant="borderless">
                  <Table<DataType>
                    columns={columns}
                    dataSource={driverInDeliveryOrders}
                    pagination={false}
                  />
                </Card>
              </div>
              {/* Sezione inferiore: completati */}
              <div className="grid grid-cols-1">
                <Card title={`Consegna completata (${driverCompletedOrders.length})`} variant="borderless">
                  <Table<DataType>
                    columns={columns}
                    dataSource={driverCompletedOrders}
                    pagination={false}
                  />
                </Card>
              </div>
            </Content>
          </Layout>
        </ConfigProvider>
      );
    }

    // Layout predefinito per il paziente
    const doctorApprovalCount = orders.filter((order: Order) =>
      order.statusDoctor === "PENDING" || order.statusDoctor === "REJECTED"
    ).length;

    const pharmacyProcessingCount = ordersForPharmacyProcessing.length;
    const driverPickupCount = ordersForDriverPickup.length;
    const completedCount = ordersCompleted.length;

    return (
      <ConfigProvider theme={{ components: { Card: { bodyPadding: 0 } } }}>
        <Layout className="min-h-screen">
          <Content className="px-16 pt-8">
            <div className='mb-8'>
              <Title>Benvenuto {name}</Title>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card title={`In attesa autorizzazione medico (${doctorApprovalCount})`} variant="borderless">
                <Table<DataType>
                  columns={columns.filter(col => col.key !== 'action')}
                  dataSource={orders
                    .filter((order) => order.statusDoctor === "PENDING" || order.statusDoctor === "REJECTED")
                    .map((order): DataType => ({
                      key: order.id,
                      name: order.drugPackage.medicinale.denominazioneMedicinale,
                      status: order.statusDoctor!,
                      drugPackage: order.drugPackage,
                      updatedAt: order.updatedAt!
                    }))}
                  pagination={false}
                />
              </Card>
              <Card title={`Da evadere dalla farmacia (${pharmacyProcessingCount})`} variant="borderless">
                <Table<DataType>
                  columns={columns.filter(col => col.key !== 'action')}
                  dataSource={ordersForPharmacyProcessing}
                  pagination={false}
                />
              </Card>
              <Card title={`Da consegnare dal driver (${driverPickupCount})`} variant="borderless">
                <Table<DataType>
                  columns={columns.filter(col => col.key !== 'action')}
                  dataSource={ordersForDriverPickup}
                  pagination={false}
                />
              </Card>
            </div>
            <div className="grid grid-cols-1">
              <Card title={`Ordini Completati (${completedCount})`} variant="borderless">
                <Table<DataType>
                  columns={columns.filter(col => col.key !== 'action')}
                  dataSource={ordersCompleted}
                  pagination={false}
                />
              </Card>
            </div>
          </Content>
        </Layout>
      </ConfigProvider>
    );
  }
  