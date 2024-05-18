"use client"

import { MdTextFields } from "react-icons/md"
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Calendar } from "../ui/calendar"

const type: ElementsType = "DateField"


const extraAttributes = {
  label: 'Date Field',
  helperText: 'Helper Text',
  required: false,
  //placeHolder: "Pick a date"
}

type propertiesSchemaType = zod.infer<typeof propertiesSchema>

const propertiesSchema = zod.object({
  label: zod.string().min(2).max(40),
  helperText: zod.string().max(200),
  required: zod.boolean().default(false),
  //placeHolder: zod.string(),
})

export const DateFieldElement: FormElementType = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes
  }),
  designerBtnElement:{
    icon: MdTextFields,
    label: "Date Field"
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
  const {label, required, helperText} = element.extraAttributes
  return <div className="flex flex-col gap-2 w-full">
    <Label>
      {label} 
      {required && '*'}
    </Label>
    {/*<Input readOnly disabled placeholder={placeHolder}/>*/}
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
        {/*<FormField
          control={form.control}
          name="placeHolder"
          render={({field}) => (
            <FormItem>
              <FormLabel>PlaceHolder</FormLabel>
              <FormControl>
                <Input 
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
        />*/}
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
  const {label, required, helperText} = element.extraAttributes


  const [value, setValue] = useState<Date | null>(null);
  const [error, setError] = useState(false);

  useEffect(()=>{
    setError(isInvalid === true);
  }, [isInvalid])

  return <div className="flex flex-col gap-2 w-full">
    <Label className={cn(error && "text-red-500")}>
      {label} 
      {required && '*'}
    </Label>
    {/*<Input 
      value={value} required={required}
      onBlur={(e)=>{
        if (!submitValue) return;
        const valid = DateFieldElement.validate(element, e.target.value);
        setError(!valid);
        if(!valid) return;
        submitValue(element.id, e.target.value);
      }}
    />*/}
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4"/>
          {value ? format(value, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value ?? new Date()}
          onSelect={(e)=>{
            if (!e) return;
            setValue(e)
          }}
          initialFocus
          onDayBlur={(e)=>{
            if (!submitValue) return;
            if (!e) return;
            const valid = DateFieldElement.validate(element, format(e, "PPP"));
            setError(!valid);
            if(!valid) return;
            submitValue(element.id, format(e, "PPP"));
          }}
        />
      </PopoverContent>
    </Popover>
    {helperText &&
      <p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500")}>
        {helperText}
      </p>
    }
  </div>
}