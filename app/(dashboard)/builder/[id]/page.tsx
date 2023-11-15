import { getFormById } from '@/actions/form';
import FormBuilder from '@/components/FormBuilder';
import React from 'react';

const BuilderPage = async ({params}:{params: {id:string}}) => {
  const form = await getFormById(Number(params.id));
  if (!form) throw new Error("form not found");
  return (
    <FormBuilder form={form}/>
  );
};

export default BuilderPage;