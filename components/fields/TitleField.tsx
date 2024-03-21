"use client"

import { ElementsType, FormElementInstance, FormElementType } from "../FormElements"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import * as zod from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import useDesigner from "../hooks/useDesigner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { LuHeading1 } from "react-icons/lu"

const type: ElementsType = "TitleField"

const extraAttributes = {
  title: 'Title field',
}

type propertiesSchemaType = zod.infer<typeof propertiesSchema>

const propertiesSchema = zod.object({
  title: zod.string().min(2).max(40),
})

export const TitleFieldElement: FormElementType = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes
  }),
  designerBtnElement:{
    icon: LuHeading1,
    label: "Title Field"
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  properiesComponent: PropertiesComponent,

  validate: () => true
}

type customInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

function DesignerComponent({elementInstance} : {elementInstance: FormElementInstance}){
  const element = elementInstance as customInstance;
  const {title} = element.extraAttributes
  return <div className="flex flex-col gap-2 w-full">
    <Label>
      Title field
    </Label>
    <p className="text-xl">{title}</p>
  </div>
}

function PropertiesComponent({elementInstance} : {elementInstance: FormElementInstance}){
  const element = elementInstance as customInstance;
  const form = useForm<propertiesSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      title: element.extraAttributes.title
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
          name="title"
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
} : {
  elementInstance: FormElementInstance
}){
  const element = elementInstance as customInstance;
  const {title} = element.extraAttributes

  return (
    <p className="text-xl">{title}</p>
  )
}