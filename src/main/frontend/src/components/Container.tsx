import React from 'react';

interface ContainerProps {
    children: React.ReactNode;
    fullScreen?: boolean;
    paddingTop?: boolean;
}

const Container: React.FC<ContainerProps> = ({ children , fullScreen = false , paddingTop = false}) => {
    return (
        <div className={`max-w-7xl mx-auto px-6 md:px-12 w-full ${fullScreen ? 'min-h-screen' : ''} ${paddingTop ? 'pt-24' : ''}  ` }>
        {children}
    </div>
    );
};

export default Container;