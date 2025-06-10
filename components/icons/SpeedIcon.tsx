
import React from 'react';

const SpeedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" {...props}>
    <path d="M0 0h24v24H0V0z" fill="none"/>
    <path d="M10.59 4.59C10.21 4.21 9.7 4 9.17 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-5.17c-.53 0-1.04-.21-1.42-.59L10.59 4.59zM19 12H5V8h14v4z"/>
    <path d="M9.46 10.74L12 12.5l2.54-1.76.71.71L12 14l-3.25-2.55.71-.71zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15l-4-4h8l-4 4z"/>
  </svg>
);
export default SpeedIcon;
