import React from 'react';
import { ImSpinner, ImSpinner2 } from 'react-icons/im';

const loading = () => {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full'>
      <ImSpinner2 className='animate-spin h-12 w-12'/>
    </div>
  );
};

export default loading;