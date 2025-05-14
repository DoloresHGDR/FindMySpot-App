import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const EyeIconOpen = () => (
        <Svg 
            className="w-6 h-6 text-gray-800 dark:text-white" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <Path 
                fillRule="evenodd" 
                d="M4.998 7.78C6.729 6.345 9.198 5 12 5c2.802 0 5.27 1.345 7.002 2.78a12.713 12.713 0 0 1 2.096 2.183c.253.344.465.682.618.997.14.286.284.658.284 1.04s-.145.754-.284 1.04a6.6 6.6 0 0 1-.618.997 12.712 12.712 0 0 1-2.096 2.183C17.271 17.655 14.802 19 12 19c-2.802 0-5.27-1.345-7.002-2.78a12.712 12.712 0 0 1-2.096-2.183 6.6 6.6 0 0 1-.618-.997C2.144 12.754 2 12.382 2 12s.145-.754.284-1.04c.153-.315.365-.653.618-.997A12.714 12.714 0 0 1 4.998 7.78ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" 
                clipRule="evenodd"/>
        </Svg>
    );

export const EyeIconClosed = () => (
    <Svg className="w-6 h-6 text-gray-800 dark:text-white" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <Path 
            stroke="currentColor" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
    </Svg>
    );

export const DniIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-id-badge-2">
        <Path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <Path d="M7 12h3v4h-3z" />
        <Path d="M10 6h-6a1 1 0 0 0 -1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1 -1v-12a1 1 0 0 0 -1 -1h-6" />
        <Path d="M10 3m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
        <Path d="M14 16h2" />
        <Path d="M14 12h4" />
    </Svg>
);

export const LockIcon = () => (
    <Svg className="w-6 h-6 text-gray-800 dark:text-white" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <Path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"/>
    </Svg>

)