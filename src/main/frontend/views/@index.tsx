import Heading, { Banner } from './components/Heading';
 
import AppContainer from './components/AppContainer';
 
import '@vaadin/icons';
import Footer from './components/Footer';
import { ConfigProvider } from 'antd';
import React from 'react';

// export const config: ViewConfig = {
//   menu: { order: 0, icon: 'line-awesome/svg/globe-solid.svg' },
//   title: 'Hello World',
// };



const  Application = () => {
const [toggle , setToggle] = React.useState('')

  // const name = useSignal('');
  document.documentElement.setAttribute(
    "theme","light"
  );

  return (
    <ConfigProvider
    theme={{
      token: {
        // Seed Token
        colorPrimary: '#00A9E4',

      },
    }}
  >
    <div>
    <Heading/>
      <div className='w-full flex justify-center  '> 
          <div className='md:grid-cols-2 md:grid'>
            {/* <div className='w-full col-span-2 '>  
            <Banner/>
            </div> */}
            <AppContainer/>
          </div>
      </div>
             <Footer/> 
    </div>
    </ConfigProvider>
  );
}

export default Application
