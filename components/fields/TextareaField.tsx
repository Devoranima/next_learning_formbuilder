"use client"


import { ElementsType, FormElementInstance, FormElementType, SubmitValueFunctionType } from "../FormElements"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import * as zod from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import useDesigner from "../hooks/useDesigner"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { Switch } from "../ui/switch"
import { cn } from "@/lib/utils"
import { AutosizeTextarea } from "../ui/autosizetextarea"
import { BsTextareaResize } from "react-icons/bs"

const type: ElementsType = "TextareaField"


const extraAttributes = {
  label: 'Textarea Field',
  helperText: 'Helper Text',
  required: false,
  placeHolder: "Placeholder..."
}

type propertiesSchemaType = zod.infer<typeof propertiesSchema>

const propertiesSchema = zod.object({
  label: zod.string().min(2).max(40),
  helperText: zod.string().max(200),
  required: zod.boolean().default(false),
  placeHolder: zod.string().max(500),
})

export const TextareaFieldElement: FormElementType = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes
  }),
  designerBtnElement:{
    icon: BsTextareaResize,
    label: "Textarea Field"
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  properiesComponent: PropertiesComponent,

  validate: (formElement: FormElementInstance, currentValue: string):boolean => {
    const element = formElement as customInstance;
    if (element.extraAttributes.required){
      return currentValue.length > 0
    }
    return true;
  }
}

type customInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

function DesignerComponent({elementInstance} : {elementInstance: FormElementInstance}){
  const element = elementInstance as customInstance;
  const {label, required, placeHolder, helperText} = element.extraAttributes
  return <div className="flex flex-col gap-2 w-full">
    <Label>
      {label} 
      {required && '*'}
    </Label>
    <AutosizeTextarea 
      readOnly 
      disabled 
      placeholder={placeHolder}
    />
    {helperText &&
      <p className="text-muted-foreground text-[0.8rem]">
        {helperText}
      </p>
    }
  </div>
}

function PropertiesComponent({elementInstance} : {elementInstance: FormElementInstance}){
  const element = elementInstance as customInstance;
  const form = useForm<propertiesSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      ...element.extraAttributes
    }
  })

  useEffect(()=>{
    form.reset(element.extraAttributes);
  }, [element, form])
  const {updateElement} = useDesigner();

  const applyChanges = (values: propertiesSchemaType)=>{
    updateElement(element.id, {...element, extraAttributes:{
      ...values
    }})
  }

  return (
    <Form {...form}>
      <form 
        onBlur={form.handleSubmit(applyChanges)} 
        className="space-y-3"
        onSubmit={(e)=>{
          e.preventDefault();
        }}
      >
        <FormField
          control={form.control}
          name="label"
          render={({field}) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  onKeyDown={(e)=>{
                    if(e.key === 'Enter') e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The label of the field. <br/> It will be displayed above the field
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeHolder"
          render={({field}) => (
            <FormItem>
              <FormLabel>PlaceHolder</FormLabel>
              <FormControl>
                <AutosizeTextarea 
                  {...field}
                  onKeyDown={(e)=>{
                    if(e.key === 'Enter') e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The placeholder
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="helperText"
          render={({field}) => (
            <FormItem>
              <FormLabel>HelperText</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  
                  onKeyDown={(e)=>{
                    if(e.key === 'Enter') e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The helper text below the field
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({field}) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Required</FormLabel>

                <FormDescription>
                  Is field required?
                </FormDescription>
              </div>
              <FormControl>
                <Switch 
                  checked={field.value} 
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

function FormComponent ({
  elementInstance, 
  submitValue, 
  isInvalid, 
  defaultValue
} : {
  elementInstance: FormElementInstance, 
  submitValue?: SubmitValueFunctionType, 
  isInvalid?: boolean,
  defaultValue?: string
}){
  const element = elementInstance as customInstance;
  const {label, required, placeHolder, helperText} = element.extraAttributes


  const [value, setValue] = useState(defaultValue || '');
  const [error, setError] = useState(false);

  useEffect(()=>{
    setError(isInvalid === true);
  }, [isInvalid])

  return <div className="flex flex-col gap-2 w-full">
    <Label className={cn(error && "text-red-500")}>
      {label} 
      {required && '*'}
    </Label>
    <AutosizeTextarea value={value} placeholder={placeHolder} required={required} onChange={(e)=>{
      setValue(e.currentTarget.value)
    }}
    onBlur={(e)=>{
      if (!submitValue) return;
      const valid = TextareaFieldElement.validate(element, e.target.value);
      setError(!valid);
      if(!valid) return;
      submitValue(element.id, e.target.value);
    }}
    />
    {helperText &&
      <p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500")}>
        {helperText}
      </p>
    }
  </div>
}