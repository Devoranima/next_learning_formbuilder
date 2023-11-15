import React, { useTransition } from 'react';
import { Button } from './ui/button';
import { HiSaveAs } from 'react-icons/hi';
import useDesigner from './hooks/useDesigner';
import { updateFormContent } from '@/actions/form';
import { toast } from './ui/use-toast';
import { FaSpinner } from 'react-icons/fa';

const SaveFormBtn = ({id} : {id: number}) => {
  const {elements} = useDesigner();
  const [loading, startTransition] = useTransition(); 


  const updateForm = async () =>{
    try{
      const JsonElements = JSON.stringify(elements);
      await updateFormContent(id, JsonElements);
      toast({
        title: "Success",
        description: "Your form has been updated"
      })
    }
    catch(error){
      toast({
        title: "Error",
        description: "Your changes were not saved",
        variant:"destructive"
      })
    }
  }

  return (
    <Button variant={'outline'} className='gap-2' disabled={loading} onClick={()=>{startTransition(updateForm)}}>
      <HiSaveAs className="h-4 w-4"/>
      Save
      {loading && <FaSpinner className="animate-spin"/>}
    </Button>
  );
};

export default SaveFormBtn;