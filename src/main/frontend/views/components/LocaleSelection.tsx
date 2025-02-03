import { Select, ListBox, Item } from '@vaadin/react-components';
import i18n from 'Frontend/utils/translation/i18n';
import React from 'react'

const LocaleSelection = () => {
    const [locale, setLocale] = React.useState(localStorage.getItem("locale") ?? "en");
    const handleChange = (event: any) => {
        const selectedOption = event.target.value;
        setLocale(selectedOption);
        localStorage.setItem("locale", selectedOption);
        i18n.changeLanguage(selectedOption);
        
      };
    
      const options = [
        {
          label: 'IT',
          img:'https://flagsapi.com/IT/flat/64.png',
          value: 'it'
        },
        {
          label: 'EN',
          img:'https://flagsapi.com/US/flat/64.png',
          value: 'en'
        },
      ]
    return (
        <Select  
        className='w-[80px] sm:w-[100px] bg-red-50 rounded-[4px] '
        theme='small'
        value={locale}
        onChange={handleChange} >
          <ListBox className='bg- -400'
          selected={0}>
              {options.map((items , index) => (
                <Item key={index} className='text-black  ' value={items.value} >
                <div className='grid grid-cols-2 items-center '>
                <span className='text-[12px] pt-[3px]'>{items.label}</span>
                <img slot="prefix" className='w-[25px] h-[25px]' src={items.img }alt={items.label} />
                </div>
                </Item>
              ))}
          </ListBox>
    </Select>
  )
}

export default LocaleSelection
