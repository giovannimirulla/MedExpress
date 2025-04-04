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
import DynamicDrugIcon from '@/components/DynamicDrugIcon';


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
          <Modal
            title={
              <div className="flex items-center gap-2">
                {selectedOrder?.drugPackage && (
                  <DynamicDrugIcon drug={selectedOrder.drugPackage} />
                )}
                <span className="text-xl font-bold text-gray-800">
                  {selectedOrder ? selectedOrder.name : 'Dettagli Ordine'}
                </span>
              </div>
            }
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            className="custom-modal"
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <div className="flex flex-col gap-6 p-6 bg-gray-50 rounded-lg shadow-lg">
              <>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 items-start text-gray-700">
                  <p className="font-semibold">Somministrazione:</p>
                  <p className="text-right">{selectedOrder?.drugPackage.vieSomministrazione}</p>

                  <p className="font-semibold">Dosaggio:</p>
                  <p className="text-right">{selectedOrder?.drugPackage.descrizioneFormaDosaggio}</p>
                </div>

                <div className="text-gray-700">
                  <p className="font-semibold col-span-2">Principi attivi:</p>
                  <ul className="list-disc pl-6 col-span-2 text-sm">
                    {selectedOrder?.drugPackage.principiAttiviIt.map((principio: string, index: number) => (
                      <li key={index}>{principio}</li>
                    ))}
                  </ul>
                </div>

                {/* Linea divisoria */}
                <hr className="my-4 border-t border-gray-300 w-3/4 mx-auto" />

                {/* Campi secondari */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 items-start text-gray-700">
                  <p className="font-semibold">Stato Farmacia:</p>
                  <p className="text-right">{selectedOrder?.statusPharmacy}</p>

                  <p className="font-semibold">Stato Driver:</p>
                  <p className="text-right">{selectedOrder?.statusDriver}</p>

                  <p className="font-semibold">Stato Medico:</p>
                  <p className="text-right">{selectedOrder?.statusDoctor}</p>

                  <p className="font-semibold">Priorità:</p>
                  <p className="text-right">{selectedOrder?.priority}</p>
                </div>
              </>
            </div>
          </Modal>

          {dashboardContent}
        </Content>
      </Layout>
    </ConfigProvider>
  );
}