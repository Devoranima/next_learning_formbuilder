import React from 'react';
import { Button } from './ui/button';
import {MdPreview} from 'react-icons/md'
import useDesigner from './hooks/useDesigner';
import {Dialog, DialogTrigger} from './ui/dialog'
import { DialogContent } from './ui/dialog';
import { FormElements } from './FormElements';
import { FaPray } from 'react-icons/fa';

const PreviewDialogBtn = () => {
  const {elements} = useDesigner();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'outline'} className='gap-2'>
          <MdPreview className="h-6 w-6"/>
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className='w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0'>
        <div className="px-4 y-2 border-b">
          <p className='text-lg font-bold text-muted-foreground'>
            Form preview
          </p>
          <p className='text-sm text-muted-foreground'>
            This is how your form will look
          </p>
        </div>
        <div className="bg-accent flex flex-col flex-grow items-center justify-center p-4 bg-[url(/hideout.svg)] dark:bg-[url(/hideout-dark.svg)] overflow-y-auto">
          <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-2xl p-8 overflow-y-auto">
            {
              elements.map(element=>{
                const FormComponent = FormElements[element.type].formComponent;
                return <FormComponent key={element.id} elementInstance={element}/>
              })
            }
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialogBtn;