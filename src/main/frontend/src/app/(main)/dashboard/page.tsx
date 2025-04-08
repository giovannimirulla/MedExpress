"use client";
import React, { useState, useEffect } from 'react';
import { Layout, ConfigProvider, Spin, Alert, Modal, Divider, Badge, Tag, Segmented } from 'antd';
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

import { castToStatusPharmacy, castFromStatusPharmacy, StatusPharmacy, StatusPharmacyColor, StatusPharmacyIcon, StatusPharmacyLabel } from '@/enums/StatusPharmacy';
import { castToStatusDriver, castFromStatusDriver, StatusDriver, StatusDriverColor, StatusDriverIcon, StatusDriverLabel } from '@/enums/StatusDriver';
import { castToStatusDoctor, castFromStatusDoctor, StatusDoctor, StatusDoctorColor, StatusDoctorIcon, StatusDoctorLabel } from '@/enums/StatusDoctor';
import { castToPriority, Priority } from '@/enums/Priority';
import { OrderResponse } from '@/interfaces/OrderResponse';


import { OrderDataType } from '@/interfaces/OrderDataType';
import DynamicDrugIcon from '@/components/DynamicDrugIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStaffSnake, faTruckFast, faUser, faUserDoctor } from '@fortawesome/free-solid-svg-icons';


const { Content } = Layout;

enum DashboardType {
  MAIN = 'main',
  PATIENT = 'patient',
}

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
  const [activeDashboard, setActiveDashboard] = useState<DashboardType>(DashboardType.MAIN);

  const dashboardOptions = [
    {
      label: (
        <span>
          <FontAwesomeIcon
            icon={role === Role.Driver ? faTruckFast : faUserDoctor}
            className="mr-2"
          />
          {role === Role.Driver ? "Driver" : "Dottore"}
        </span>
      ),
      value: DashboardType.MAIN,
    },
    {
      label: (
        <span>
          <FontAwesomeIcon icon={faUser} className="mr-2" />
          Paziente
        </span>
      ),
      value: DashboardType.PATIENT,
    },
  ];



  const showModal = (selectedOrder: OrderDataType) => {
    console.log("selectedOrder", selectedOrder);
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
  if (activeDashboard === DashboardType.MAIN) {
    if (entityType === AuthEntityType.Pharmacy) {
      dashboardContent = <PharmacyDashboard orders={orders} updateStatus={updateStatus} isUpdating={isUpdating} showModal={showModal} />;
    } else if (role === Role.Doctor) {
      dashboardContent = <DoctorDashboard orders={orders} updateStatus={updateStatus} isUpdating={isUpdating} showModal={showModal} />;
    } else if (role === Role.Driver) {
      dashboardContent = <DriverDashboard orders={orders} updateStatus={updateStatus} isUpdating={isUpdating} showModal={showModal} />;
    } else {
      dashboardContent = <PatientDashboard orders={orders} showModal={showModal} />;
    }
  } else {
    dashboardContent = <PatientDashboard orders={orders} showModal={showModal} />;
  }

  return (
    <ConfigProvider theme={{ components: { Card: { bodyPadding: 0 } } }}>
      <Layout className="min-h-screen dark:bg-black bg-gray-50">
        <Content className="px-16 pb-16 pt-8">
          <div className='flex flex-col-reverse lg:flex-row lg:justify-between items-center lg:items-start  mb-8 '>
            <h1 className='dark:text-white text-gray-800 font-bold text-4xl'>Benvenuto {name}</h1>
            {(role === Role.Doctor || role === Role.Driver) && (
              <div className="w-80 mb-6 lg:mb-0">
                <Segmented
                  size="large"
                  className="w-full"
                  shape="round"
                  block
                  value={activeDashboard}
                  options={dashboardOptions}
                  onChange={(val: DashboardType) => setActiveDashboard(val)}
                />
              </div>
            )}
          </div>

          <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            className="custom-modal"
            style={{
              top: '20%',

            }}
            width={"60%"}
          >
            <>
              {/* 2 div in orizzonatale, la prima contente l'icona del farmaco e la seconda il nome del farmaco e altri dati */}
              <div className="flex">
                <div className="flex items-center gap-4 m-4">


                  {
                    selectedOrder ? (
                      selectedOrder.priority === Priority.HIGH ? (
                        <Badge
                          count={null} // Usa null per un pallino
                          dot
                          offset={[-20, 15]} // Regola la posizione del badge
                          style={{ width: '30px', height: '30px' }} // Aumenta la dimensione del badge
                          status="processing"
                          color="red"
                        >
                          <DynamicDrugIcon drug={selectedOrder.drugPackage} size='large' />
                        </Badge>
                      ) : (
                        <DynamicDrugIcon drug={selectedOrder.drugPackage} size='large' />
                      )
                    ) : null
                  }

                </div>

                <div className="flex flex-col text-left m-4">
                  <span className="text-2xl font-bold text-gray-800">
                    {selectedOrder?.drugPackage.medicinale.denominazioneMedicinale}
                  </span>
                  {(selectedOrder?.drugPackage?.vieSomministrazione?.length ?? 0) > 0 && <div className="  items-start text-gray-700 ">
                    <p className="text-sm text-gray-500 italic mb-4">{selectedOrder?.drugPackage.descrizioneFormaDosaggio}</p>
                    <p className="font-semibold">Somministrazione:</p>
                    <ul className="list-disc pl-6 col-span-2 text-sm">
                      {selectedOrder?.drugPackage.vieSomministrazione.map((viaSomministrazione: string, index: number) => (
                        <li key={index}>{viaSomministrazione}</li>
                      ))}
                    </ul>
                  </div>}

                  {(selectedOrder?.drugPackage?.principiAttiviIt?.length ?? 0) > 0 &&
                    <div className="text-gray-700">
                      <p className="font-semibold col-span-2">Principi attivi:</p>
                      <ul className="list-disc pl-6 col-span-2 text-sm">
                        {selectedOrder?.drugPackage.principiAttiviIt.map((principio: string, index: number) => (
                          <li key={index}>{principio}</li>
                        ))}
                      </ul>
                    </div>
                  }

                </div>
              </div>

              <Divider plain>               <span className="text-sm text-gray-500">
                {selectedOrder?.updatedAt && `Ultimo aggiornamento: ${new Date(selectedOrder.updatedAt).toLocaleString('it-IT', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}`}
              </span></Divider>


              {/* 3 div in orizzontale, la prima contente icon medico e dati del medico, la seconda della farmacia e la terza del driver */}
              <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-start text-gray-700">
                <div className="flex items-center gap-2">
                  <div className={`h-12 w-12 flex items-center justify-center rounded-full text-lightBlue bg-lightBlue/20`}>
                    <FontAwesomeIcon icon={faUserDoctor} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-500">
                      {selectedOrder?.user.doctor && <span><strong>Dottore:</strong> {selectedOrder.user.doctor.name}</span>}
                    </span>
                    <div>
                      {selectedOrder && <Tag color={StatusDoctorColor[selectedOrder.statusDoctor! as StatusDoctor]} icon={StatusDoctorIcon[selectedOrder.statusDoctor! as StatusDoctor]}>
                        {StatusDoctorLabel[selectedOrder.statusDoctor! as StatusDoctor]}
                      </Tag>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`h-12 w-12 flex items-center justify-center rounded-full text-green bg-green/20`}>
                    <FontAwesomeIcon icon={faStaffSnake} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-500">
                      {selectedOrder?.pharmacy && <span><strong>Farmacia:</strong> {selectedOrder.pharmacy.name}</span>}
                    </span>
                    <div>
                      {selectedOrder && <Tag color={StatusPharmacyColor[selectedOrder.statusPharmacy! as StatusPharmacy]} icon={StatusPharmacyIcon[selectedOrder.statusPharmacy! as StatusPharmacy]}>
                        {StatusPharmacyLabel[selectedOrder.statusPharmacy! as StatusPharmacy]}
                      </Tag>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`h-12 w-12 flex items-center justify-center rounded-full text-amber bg-amber/20`}>
                    <FontAwesomeIcon icon={faTruckFast} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-500">
                      {selectedOrder?.driver && <span><strong>Driver:</strong> {selectedOrder.driver.name}</span>}
                    </span>
                    <div>
                      {selectedOrder && <Tag color={StatusDriverColor[selectedOrder.statusDriver! as StatusDriver]} icon={StatusDriverIcon[selectedOrder.statusDriver! as StatusDriver]}>
                        {StatusDriverLabel[selectedOrder.statusDriver! as StatusDriver]}
                      </Tag>}
                    </div>
                  </div>
                </div>

              </div>

              {((entityType=== AuthEntityType.User && (role === Role.Doctor || role === Role.Driver)) || entityType === AuthEntityType.Pharmacy) && (
                <>
              <Divider plain>
                <span className="text-sm text-gray-500">
                  Ordine eseguito da:
                </span></Divider>

                <div className="flex">
                <div className="flex items-center gap-4 m-4">


                <div className={`w-40 h-40 flex items-center justify-center rounded-full text-gray-200 bg-gray-200/20`}>
                    <FontAwesomeIcon icon={faUser} className={"text-6xl"} />
                  </div>
              
                </div>

                <div className="flex flex-col justify-center text-left m-4">
                  <span className="text-2xl font-bold text-gray-800">
                    {selectedOrder?.user.name}
                  </span>
                  <p className="text-sm text-gray-500">
                  <span className="font-semibold">Email:</span>  {selectedOrder?.user.email}
                  </p>
                  <p className="text-sm text-gray-500">
                  <span className="font-semibold">Indirizzo:</span>  {selectedOrder?.user.address}
                  </p>
            
                </div>
              </div>
              </>
  )}

            </>
          </Modal>

          {dashboardContent}
        </Content>
      </Layout>
    </ConfigProvider >
  );
}