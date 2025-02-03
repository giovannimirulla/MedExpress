import React from 'react';

interface ContainerProps {
    children: React.ReactNode;
    fullScreen?: boolean;
}

const Container: React.FC<ContainerProps> = ({ children , fullScreen = false }) => {
    return (
        <div className={`max-w-7xl mx-auto px-6 md:px-12 ${fullScreen ? 'h-screen' : ''}`}>
        {children}
    </div>
    );
};

export default Container;