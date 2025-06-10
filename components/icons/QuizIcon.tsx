
import React from 'react';

const QuizIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" {...props}>
    <path d="M0 0h24v24H0V0z" fill="none"/>
    <path d="M20.56 3.44C20.17 3.05 19.66 3 19.14 3H4.86c-.52 0-1.03.05-1.42.44-.39.39-.44.9-.44 1.42V18.1c0 .52.05 1.03.44 1.42.39.39.9.44 1.42.44H19.1c.52 0 1.03-.05 1.42-.44.39-.39.44-.9.44-1.42V4.86c.04-.52-.01-1.03-.4-1.42zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm5.5 12h-11c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h11c.28 0 .5.22.5.5s-.22.5-.5.5zm0-3h-11c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h11c.28 0 .5.22.5.5s-.22.5-.5.5z"/>
  </svg>
);
export default QuizIcon;
