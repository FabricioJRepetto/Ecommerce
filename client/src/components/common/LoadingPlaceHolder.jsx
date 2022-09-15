import React from 'react';

export const containerStyles = {
    width: '100%',
    height: '100%',
    position: 'relative'
};

function LoadingPlaceHolder(props) {

    const loaderStyles = {
        background: '#e2e2e2',
        width: '100%',
        overflow: 'hidden',
        position: props.container ? 'absolute' : 'relative',
        ...props.extraStyles
    };

    const loaderSwipeStyles = {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        animation: 'loaderSwipeAnim 1s cubic-bezier(0.4, 0.0, 0.2, 1) infinite',
        background: 'linear-gradient(to right, #e2e2e2 10%, #ababab 50%, #e2e2e2 90%)',
        height: '100%'
    }

    return (
        <div style={loaderStyles}>
            <div style={loaderSwipeStyles}></div>
        </div>
    );
}

export default LoadingPlaceHolder;