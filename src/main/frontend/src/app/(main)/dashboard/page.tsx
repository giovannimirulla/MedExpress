"use client";
import React, { useState, useEffect } from 'react';
import { Layout, ConfigProvider, Spin, Alert, Typography, Modal } from 'antd';
import api from '@/utils/api';
import { socket } from '@/services/socketService';
import { useAuth } from '@/context/authContext';
import DoctorDashboard from '@/components/dashboards/DoctorDashboard';
import PharmacyDashboard from '@/components/dashboards/PharmacyDashboard';
import DriverDashboard from '@/components/dashboards/DriverDashboard';
import PatientDashboard from '@/components/dashboards/PatientDashboard';
import { Order } from '@/interfaces/Order';
import { OrderSocket } from '@/interfaces/OrderSocket';
import { AuthEntityType } from '@/enums/AuthEntityType';
import { Role } from '@/enums/Role';

import { castToStatusPharmacy, castFromStatusPharmacy, StatusPharmacy } from '@/enums/StatusPharmacy';
import { castToStatusDriver, castFromStatusDriver, StatusDriver } from '@/enums/StatusDriver';
import { castToStatusDoctor, castFromStatusDoctor, StatusDoctor } from '@/enums/StatusDoctor';
import { castToPriority, Priority } from '@/enums/Priority';
import { OrderResponse } from '@/interfaces/OrderResponse';


import { OrderDataType } from '@/interfaces/OrderDataType';



const { Content } = Layout;
const { Title } = Typography;


export default function Dashboard() {
  const { getRole, getEntityType, getId, getName } = useAuth();
  const role = getRole();
  const entityType = getEntityType();
  const id = getId();
  const name = getName();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDataType | null>(null);


  const showModal = (selectedOrder: OrderDataType) => {
    setIsModalOpen(true);
    setSelectedOrder(selectedOrder);

  };


  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Recupero iniziale degli ordini
  useEffect(() => {
    api.get("/order/all")
      .then(response => {
        setOrders(response.data.map((order: OrderResponse) => ({
          ...order,
          statusDoctor: castToStatusDoctor(order.statusDoctor),
          statusPharmacy: castToStatusPharmacy(order.statusPharmacy),
          statusDriver: castToStatusDriver(order.statusDriver),
          priority: castToPriority(order.priority)
        })));
        console.log("response.data", response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [getId]);

  // Gestione delle connessioni socket
  useEffect(() => {
    function onConnect() {
      console.log("Connected to socket server");
    }
    function onDisconnect() {
      console.log("Disconnected from socket server");
    }
    function onOrderUpdate(orderUpdate: OrderSocket) {
      console.log("Order update received", orderUpdate);
      setOrders(prevOrders => {
        const idx = prevOrders.findIndex(order => order.id === orderUpdate.id);
        if (idx !== -1) {
          return prevOrders.map(order =>
            order.id === orderUpdate.id ? {
              ...order,
              updatedAt: orderUpdate.updatedAtString,
              statusDoctor: castToStatusDoctor(orderUpdate.statusDoctor),
              statusPharmacy: castToStatusPharmacy(orderUpdate.statusPharmacy),
              statusDriver: castToStatusDriver(orderUpdate.statusDriver),
              priority: castToPriority(orderUpdate.priority),
            } : order
          );
        }
        return [...prevOrders, { ...orderUpdate, updatedAt: orderUpdate.updatedAtString, statusDoctor: castToStatusDoctor(orderUpdate.statusDoctor), statusPharmacy: castToStatusPharmacy(orderUpdate.statusPharmacy), statusDriver: castToStatusDriver(orderUpdate.statusDriver), priority: castToPriority(orderUpdate.priority) }];
      });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    if (id) {
      socket.on(id, onOrderUpdate);
    }
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      if (id) socket.off(id, onOrderUpdate);
    };
  }, [id]);

  function updateStatus<T extends StatusPharmacy | StatusDriver | StatusDoctor>(orderId: string, status: T) {
    // if role is driver url is /api/v1/driver/updateStatus 
    // else if role is doctor url is /api/v1/doctor/updateStatus
    console.log("orderId", orderId);
    console.log("status", status);
    let url = '';
    let statusString = '';
    if (entityType === AuthEntityType.Pharmacy) {
      statusString = castFromStatusPharmacy(status as StatusPharmacy);
      url = '/pharmacy/updateStatus';
    } else if (role === Role.Driver) {
      statusString = castFromStatusDriver(status as StatusDriver);
      url = '/driver/updateStatus';
    } else if (role === Role.Doctor) {
      statusString = castFromStatusDoctor(status as StatusDoctor);
      url = '/doctor/updateStatus';
    }
    setIsUpdating(true);
    console.log("statusString", statusString);
    api.post(url, { orderId, status: statusString })
      .then(() => {
        setOrders((prevOrders: Order[]) =>
          prevOrders.map((order: Order) => {
            if (order.id === orderId) {
              if (entityType === AuthEntityType.Pharmacy) {
                order.statusPharmacy = status as StatusPharmacy;
              } else if (role === Role.Driver) {
                order.statusDriver = status as StatusDriver;
              } else if (role === Role.Doctor) {
                order.statusDoctor = status as StatusDoctor;
              }
              order.updatedAt = new Date().toISOString();
            }
            return order;
          })
        );
        setIsUpdating(false);
      })
      .catch(err => {
        setError(err.message);
        setIsUpdating(false);
      });
  }

  if (loading) return (
    <div className='min-h-[80vh] flex items-center justify-center gap-4'>
      <Spin tip="Loading.." size="large" />
      <div className="text-primary font-semibold">Loading...</div>
    </div>
  );
  if (error) return (
    <div className='min-h-[80vh] flex items-center justify-center'>
      <Alert message="Errore" description={error} type="error" showIcon />
    </div>
  );

  // Selezione del dashboard in base al ruolo
  let dashboardContent;
  if (entityType === AuthEntityType.Pharmacy) {
    dashboardContent = <PharmacyDashboard orders={orders} updateStatus={updateStatus} isUpdating={isUpdating} showModal={showModal} />;
  } else if (role === Role.Doctor) {
    dashboardContent = <DoctorDashboard orders={orders} updateStatus={updateStatus} isUpdating={isUpdating} showModal={showModal} />;
  } else if (role === Role.Driver) {
    dashboardContent = <DriverDashboard orders={orders} updateStatus={updateStatus} isUpdating={isUpdating} showModal={showModal} />;
  } else {
    dashboardContent = <PatientDashboard orders={orders} showModal={showModal} />;
  }

  return (
    <ConfigProvider theme={{ components: { Card: { bodyPadding: 0 } } }}>
      <Layout className="min-h-screen">
        <Content className="px-16 py-8">
          <div className='mb-8'>
            <Title>Benvenuto {name}</Title>
          </div>
          <Modal title={
            <span className='flex items-center'>
              {selectedOrder ? selectedOrder.name : ''}</span>}
            open={isModalOpen} onCancel={handleCancel} footer={null}>
            <div className='flex flex-col gap-4'>
              <div className='flex items-center justify-between'>
                <span className='font-bold'>Nome</span>
                <span>{selectedOrder ? selectedOrder.name : ''}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='font-bold'>Stato</span>
                <span>{selectedOrder ? selectedOrder.statusUser : ''}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='font-bold'>Data</span>
                <span>{selectedOrder ? selectedOrder.updatedAt : ''}</span>
              </div>
            </div>
          </Modal>
            

            {dashboardContent}
        </Content>
      </Layout>
    </ConfigProvider>
  );
}