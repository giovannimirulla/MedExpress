import Container from './Container';
import { useTranslation } from "react-i18next";
import { useState } from 'react';
import { AutoComplete, Input } from 'antd';
import type { AutoCompleteProps } from 'antd';

const AppContainer = () => {

  const { t } = useTranslation("app");
  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);

  const handleSearch = async (query: string) => {
    if (query.length < 2 || query.length > 100) {
        console.error('La lunghezza della query deve essere compresa tra 2 e 100');
        //set options to empty array
        setOptions([]);
        return;
    }
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
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onSelect = (value: string) => {
    console.log('onSelect', value);
  };

  return (
    <div className="relative h-screen w-screen" id="home">
      <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
        <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
      </div>
      <Container fullScreen>
        <div className="relative ml-auto h-[80%] flex flex-col items-center justify-center">
          <div className="lg:w-2/3 text-center mx-auto">
            <h1 className="text-body text-balance font-bold text-5xl md:text-6xl xl:text-7xl">Cerca qui il tuo <span className="text-primary">farmaco</span></h1>
            <AutoComplete
              popupMatchSelectWidth={252}
              className='mt-4'
              style={{ width: '60%' }}
              options={options}
              onSelect={onSelect}
              onSearch={handleSearch}
              size="large"
            >
              <Input.Search size="large" placeholder="es. Tachipirina" enterButton />
            </AutoComplete>
          </div>
        </div>
      </Container>
      <div className="absolute bottom-0 w-full h-[30%] bg-pattern"></div>
    </div>
  )
}

export default AppContainer

