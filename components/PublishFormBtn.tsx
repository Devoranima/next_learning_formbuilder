import React, { startTransition, useTransition } from 'react';
import { Button } from './ui/button';
import { MdOutlinePublish } from 'react-icons/md';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from './ui/alert-dialog'
import { FaIcons } from 'react-icons/fa';
import { toast } from './ui/use-toast';
import { publishForm } from '@/actions/form';
import { useRouter } from 'next/navigation';

const PublishFormBtn = ({id} : {id: number}) => {

  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const publish = async () => {
    try {
      await publishForm(id);
      toast({ 
        title:"Success",
        description:"Your form is now public"
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant:"destructive"
      })
    }
  } 
    
  return (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant={'outline'} className='gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400'>
        <MdOutlinePublish className="w-4 h-4"/>
        Publish
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you ready to publish your form?</AlertDialogTitle>
        <AlertDialogDescription>
          Action cannot be reverted. After pubslishing you will not be able to edit this form. 
          <br/><br/>
          <span className='font-medium'>
            After publishing your form it will be available for others and you will be able to collect submissions.
          </span>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction disabled={loading} onClick={(e)=>{
          e.preventDefault();
          startTransition(publish)
        }}>Publish my form! {loading && <FaIcons className="animate-spin"/>}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  );
};

export default PublishFormBtn;