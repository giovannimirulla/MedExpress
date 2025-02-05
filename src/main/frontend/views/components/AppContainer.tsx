import Container from './Container';
import { useTranslation } from "react-i18next";
import { useState } from 'react';
import { AutoComplete, Input, Card, Pagination, PaginationProps, Spin } from 'antd';
import { TruckFilled } from '@ant-design/icons';
import type { AutoCompleteProps } from 'antd';

import { motion } from 'framer-motion';

const AppContainer = () => {

  const { t } = useTranslation("app");
  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
  const [selected, setSelected] = useState(false);
  const [drugs, setDrugs] = useState<any[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(16);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchedValue, setSearchedValue] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange: PaginationProps['onChange'] = (current) => {
    setCurrentPage(current-1);
    fetchDrugs(searchedValue, current-1, pageSize);
  };



const fetchDrugs = async (query: string, page: number, size: number) => {
  try {
    setLoading(true);
    const response = await fetch(`http://localhost:8080/api/v1/aifa/drugs?query=${query}&spellingCorrection=true&page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'accept': '*/*'
      }
    });

    const responseData = await response.json();
    console.log('fetchDrugs responseData', responseData);
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
    try {
      const response = await fetch(`http://localhost:8080/api/v1/aifa/autocomplete?query=${query}`, {
        method: 'GET',
        headers: {
          'accept': '*/*'
        }
      });
      const responseData = await response.json();
      console.log('responseData', responseData);
      
      if (response.status === 200 && responseData.data) {
          const options: AutoCompleteProps['options'] = responseData.data.map((item: any) => ({ value: item.toString() }));
          setOptions(options);
      } else {
          console.error('Invalid response or data is null');
          setOptions([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setOptions([]);
    }
  };

  const onSelect = (value: string) => {
    console.log('onSelect', value);
    setSelected(true);
    //save selected value
    setCurrentPage(0);
    setSearchedValue(value);
    fetchDrugs(value, currentPage, pageSize);
  };

  return (
    <div className="relative min-h-screen w-screen" id="home">
      <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
        <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
      </div>
      <Container fullScreen>
      <motion.div
        className="ml-auto h flex flex-col items-center justify-center"
        initial={{ height: '80vh' }}
        animate={{ height: selected ? '6rem' : '80vh' }}
        transition={{ duration: 0.5 }}
      >
          <div className="lg:w-2/3 text-center mx-auto">
          <motion.div
            className="lg:w-2/3 text-center mx-auto"
            initial={{ opacity: 1 }}
            animate={{ opacity: selected ? 0 : 1,
              transitionEnd: {
                display: selected ? 'none' : 'block',
              },
             }}
            transition={{ duration: 0.5 }}
            
          >
            <h1 className="text-body font-bold text-5xl md:text-6xl xl:text-7xl">Cerca qui il tuo <span className="text-primary">farmaco</span></h1>
          </motion.div><AutoComplete
              className={`z-20`}
              style={{ width: '60%' }}
              options={options}
              onSelect={onSelect}
              onSearch={handleSearch}
              size="large"
              autoFocus
            >
              <Input.Search size="large" placeholder="es. Tachipirina" enterButton/>
            </AutoComplete>
          </div>
          </motion.div>
          <div className="flex items-start justify-center min-h-[80vh]">
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
                <motion.div className={` grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4  ${selected ? 'block' : 'hidden'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: loading ? 0.5 : (selected ? 1 : 0) }}
                transition={{ duration: 0.5 }}
                >
              {drugs.map((drug, index) => (
                <Card key={index} title={drug.formaFarmaceutica} bordered={false}
                actions={[
                <TruckFilled key={"order"}/>
                ]}>
                <p><strong>Somministrazione: </strong>{drug.vieSomministrazione}</p>
                </Card>
              ))}
              </motion.div>
              </div>
          <motion.div className={`relative flex justify-center my-8 ${selected ? 'block' : 'hidden'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: selected ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
            >
                <Pagination align="center" pageSize={pageSize} total={totalElements} onChange={onChange} showSizeChanger={false} />
          </motion.div>
      </Container>
      <motion.div 
        className={`absolute bottom-0 w-full h-[30%] bg-pattern -z-10`}
        initial={{ opacity: 1 }}
        animate={{ opacity: selected ? 0.4 : 1 }}
        transition={{ duration: 0.5 }}
      ></motion.div>
    </div>
  )
}

export default AppContainer

