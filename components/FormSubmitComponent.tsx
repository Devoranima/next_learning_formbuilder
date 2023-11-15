"use client"

import React, { useCallback, useRef, useState, useTransition } from 'react';
import { FormElementInstance, FormElementType, FormElements } from './FormElements';
import { Button } from './ui/button';
import { HiCursorClick } from 'react-icons/hi';
import { toast } from './ui/use-toast';
import { ImSpinner2 } from 'react-icons/im';
import { submitForm } from '@/actions/form';

const FormSubmitComponent = ({formUrl, content} : {formUrl: string, content: FormElementInstance[]}) => {
  const formValues = useRef<{[key: string] : string}>({});

  const formErrors = useRef<{[key: string] : boolean}>({});

  const [renderKey, setRenderKey] = useState(new Date().getTime());

  const [submitted, setSubmitted] = useState(false);

  const [pending, startTransition] = useTransition();

  const validateForm: () => boolean = useCallback (() => {
    for (const field of content){
      const actualValue = formValues.current[field.id] || ""
      const valid = FormElements[field.type].validate(field, actualValue);

      if(!valid){
        formErrors.current[field.id] = true;
      }
    }
    
    return Object.keys(formErrors.current).length === 0;
  }, [content])


  const submitValue = (key: string, value: string) => {
    formValues.current[key] = value
  }

  const submit = async () => {
    formErrors.current = {};
    const validForm = validateForm();
    if (!validForm){
      setRenderKey(new Date().getTime());
      toast({
        title:"Error",
        description: "Complete all fields",
        variant:"destructive"
      })
      return;
    }

    try {
      const JsonContent = JSON.stringify(formValues.current);
      await submitForm(formUrl, JsonContent);
      toast({
        title:"Success",
        description: "Form submitted",
      })
      setSubmitted(true)
    } catch (error) {
      toast({
        title:"Error",
        description: "Something went wrong",
        variant:"destructive"
      })
    }

  }

  if(submitted){
    return (
      <div className='flex justify-center w-full h-full items-center p-8'>
          <div key={renderKey} className="max-w[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-red-700 rounded">
            <h1 className='text-2xl font-bold'>Form submitted</h1>
            <p className='text-muted-foreground'>
              Thank you for your answer, you can close this page now.
            </p>
          </div>
      </div>
    )
  }


  return (
    <div className='flex justify-center w-full h-full items-center p-8'>
      <div key={renderKey} className="max-w[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-red-700 rounded">
        {content.map(element=>{
          const FormComponent=FormElements[element.type].formComponent;
          return <FormComponent 
            key={element.id} 
            elementInstance={element} 
            submitValue={submitValue}
            isInvalid={formErrors.current[element.id]}
            defaultValue={element.extraAttributes?.defaultValue}
          />
        })}
        <Button 
          className='mt-8' 
          onClick={()=>{startTransition(submit)}}>
          {!pending &&
            <>
              <HiCursorClick className="mr-2"/>
              Submit
            </>
          }  
          {pending && 
            <ImSpinner2 className="animate-spin"/>
          }
        </Button>
      </div>
    </div>
  );
};

export default FormSubmitComponent;