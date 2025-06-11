
import React from 'react';

const AwardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" {...props}>
    <path d="M0 0h24v24H0V0z" fill="none"/>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2zm0 5.84L9.93 10.5 5.51 11.1l3.59 3.48L8.2 19.5 12 17.27l3.8 2.23-.9-4.92 3.59-3.48-4.42-.6L12 7.84z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
export default AwardIcon;
