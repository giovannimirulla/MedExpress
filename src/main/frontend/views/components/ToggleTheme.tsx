import React from 'react'
import "@theme-toggles/react/css/Around.css"
import { Around } from "@theme-toggles/react"
import useToggleStore from 'Frontend/store/toggleStore';
 

const ToggleTheme = () => {
  const {theme , onToggle} = useToggleStore.getState()
  const [isToggled, setToggle] = React.useState(theme === 'dark' ?true :false);

    const toggleStyle = {
        // backgroundColor: isToggled ? 'green' : 'red',
        fontSize: '24px'  
      };


    return (
      <Around duration={750}
        style={toggleStyle}
        onToggle={onToggle}
        reversed
        toggled={isToggled}
        toggle={setToggle}
        placeholder="Toggle Theme"
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        />
    );
};

export default ToggleTheme;
