"use client";
import Container from '@/components/Container';
import { useState } from 'react';
import { App, AutoComplete, Input, Pagination, PaginationProps, Spin, Modal, List, Button, Alert, message, Tag } from 'antd';
import { Drug } from '@/types/Drug';
import type { AutoCompleteProps } from 'antd';

import { motion } from 'framer-motion';
import CardDrug from '@/components/CardDrug';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserDoctor, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import DynamicDrugIcon from '@/components/DynamicDrugIcon';
import api from '@/utils/api';
import { useAuth } from '@/context/authContext';
import { InfoCircleOutlined } from '@ant-design/icons';
import Heading from '@/components/Heading';
import { AuthEntityType } from '@/enums/AuthEntityType';

interface DataType {
  key: number;
  id: string;
  title: string;
  description: string;
  tag: string;
  prescription: boolean;
}

const Home = () => {
  const { isLoggedIn, getEntityType } = useAuth();
    const entityType = getEntityType();

  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
  const [selected, setSelected] = useState(false);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchedValue, setSearchedValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<DataType[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);


  const showModal = (selectedDrug: Drug) => {
    setIsModalOpen(true);
    setSelectedDrug(selectedDrug);
    setList([]);

    //insert in list  selectedDrug.confezioni
    selectedDrug.confezioni.map((confezione, index) => {
      setList((list) => [
        ...list,
        {
          key: index,
          id: confezione.idPackage,
          title: confezione.denominazionePackage.split('"')[1],
          description: confezione.denominazionePackage.split('"')[2],
          tag: confezione.descrizioneRf.join(', '),
          prescription: confezione.classeFornitura === 'RR' || confezione.classeFornitura === 'RNR'
        }
      ]);
    });


  };


  const handleCancel = () => {
    setIsModalOpen(false);
  };



  const onChange: PaginationProps['onChange'] = (current) => {
    setCurrentPage(current - 1);
    fetchDrugs(searchedValue, current - 1, pageSize);
  };



  const fetchDrugs = async (query: string, page: number, size: number) => {
    try {
      setLoading(true);
      const response = await api.get(`/aifa/drugs?query=${query}&spellingCorrection=true&page=${page}&size=${size}`);
      const responseData = response.data;
      setLoading(false);
      if (response.status === 200 && responseData.data) {
        setDrugs(responseData.data.content);
        setTotalElements(responseData.data.totalElements);
      } else {
        console.error('Invalid response or data is null');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching drugs data:', error);
    }
  };

  const handleSearch = async (query: string) => {
    //min 2 max 100
    if (query.length > 2 && query.length < 100) {
      try {
        const response = await api.get(`/aifa/autocomplete?query=${query}`);
        const responseData = response.data;

        if (response.status === 200 && responseData.data) {
          const options: AutoCompleteProps['options'] = responseData.data.map((item: string) => ({ value: item.toString() }));
          setOptions(options);
        } else {
          console.error('Invalid response or data is null');
          setOptions([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setOptions([]);
      }
    }
  };

  const onSelect = (value: string) => {
    setSelected(true);
    //save selected value
    setCurrentPage(0);
    setSearchedValue(value);
    fetchDrugs(value, currentPage, pageSize);
  }

  const handleOrder = (drugId: string, packageId: string): void => {
    if (!isLoggedIn()) {
      messageApi.error('Devi effettuare il login per ordinare un farmaco!');
      return;
    }

    api.post('/order', { drugId, packageId })
      .then((response) => {
        console.log('Order response', response);
        if (response.status === 201) {
          console.log('Order success');
          setIsModalOpen(false);
          messageApi.success('Ordine effettuato con successo!');
        } else {
          console.error('Order failed');
          messageApi.error('Errore durante l\'ordine');
        }
      })
      .catch((error) => {
        console.error('Order error', error);
      });
  }
  return (
    <>
     <Heading />
    <App>
      {contextHolder}
      <main className="relative min-h-screen w-screen" id="home">
        <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
          <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
          <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
        </div>
        <Container fullScreen>
          <Modal title={<span className='flex items-center'>{selectedDrug && <div className='mr-4'><DynamicDrugIcon drug={selectedDrug} /></div>} {selectedDrug ? selectedDrug.medicinale.denominazioneMedicinale : ''}</span>} open={isModalOpen} onCancel={handleCancel} footer={null}>
            {list.some(item => item.prescription) && (
              <>
                <Alert
                  message="Avviso"
                  description={
                    <>
                      I farmaci con il pulsante &apos;Richiedi&apos; in arancione richiedono la prescrizione del medico.
                      {entityType !== AuthEntityType.Pharmacy && " Cliccando su &apos;Richiedi&apos; verrà inviata una richiesta al medico di base."}
                    </>
                  }
                  type="warning"
                  showIcon
                  closable
                />
                <br />
              </>
            )}
            <List
              itemLayout="horizontal"
              dataSource={list}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    entityType === AuthEntityType.User && ( <Button
                      key={item.key}
                      color={item.prescription ? "orange" : "primary"}
                      variant="solid"
                      onClick={() => selectedDrug?.id && handleOrder(selectedDrug.id, item.id)}
                    >
                      <FontAwesomeIcon icon={item.prescription ? faUserDoctor : faTruckFast} />
                      {item.prescription ? "Richiedi" : "Ordina"}
                    </Button> )
                  ]}
                >
                  <List.Item.Meta
                    title={<p><strong>{item.title}</strong></p>}
                    description={<div className='flex flex-col'><span>{item.description}</span>  
                    <div className='mt-2'>
                    <Tag color="blue" className="text-sm" icon={<InfoCircleOutlined />}>
                      {item.tag}
                    </Tag></div></div>}
                  />
                </List.Item>
              )}
            />


          </Modal>

          <motion.div
            className="ml-auto h flex flex-col items-center justify-center "
            initial={{ height: '80vh' }}
            animate={{ height: selected ? '6rem' : '80vh' }}
            transition={{ duration: 0.5 }}
          >
            <div className=" text-center mx-auto h-full flex flex-col items-center justify-center w-3/4">
              <motion.div
                className="mb-8"
                initial={{ opacity: 1 }}
                animate={{
                  opacity: selected ? 0 : 1,
                  transitionEnd: {
                    display: selected ? 'none' : 'block',
                  },
                }}
                transition={{ duration: 0.5 }}

              >
                <h1 className="text-body dark:text-white font-bold text-5xl md:text-6xl xl:text-7xl">Cerca qui il tuo <span className="text-primary">farmaco</span></h1>
              </motion.div>

              <AutoComplete
                className={`z-20 w-2/3 h-auto`}
                options={options}
                onSelect={onSelect}
                onSearch={handleSearch}

                autoFocus
              >
                <Input.Search size="large" placeholder="es. Tachipirina" enterButton />
              </AutoComplete>
            </div>
          </motion.div>
          <div className="flex items-start justify-center">
            {selected && drugs.length === 0 && (
              <motion.div
                className="flex items-center justify-center h-[80vh] z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Spin size="large" />
              </motion.div>
            )}
            <motion.div className={` grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  ${selected ? 'block' : 'hidden'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: loading ? 0.5 : (selected ? 1 : 0) }}
              transition={{ duration: 0.5 }}
            >
              {drugs.map((drug, index) => (
                <CardDrug key={index} drug={drug} showModel={showModal} entityType={entityType}/>
              ))}
            </motion.div>
          </div>
          <motion.div className={`relative flex justify-center my-8 ${selected ? 'block' : 'hidden'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: selected ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Pagination className="pagination" pageSize={pageSize} total={totalElements} onChange={onChange} showSizeChanger={false} />
          </motion.div>
        </Container>
        <motion.div
          className={`absolute bottom-0 w-full h-[30%] bg-pattern -z-10`}
          initial={{ opacity: 1 }}
          animate={{ opacity: selected ? 0.4 : 1 }}
          transition={{ duration: 0.5 }}
        ></motion.div>
      </main>
    </App>
    </>
  )
}

export default Home

