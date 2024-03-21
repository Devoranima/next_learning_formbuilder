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
import {RiSeparator} from "react-icons/ri"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { LuHeading1 } from "react-icons/lu"
import { Separator } from "../ui/separator"

const type: ElementsType = "SeparatorField"

export const SeparatorFieldElement: FormElementType = {
  type,
  construct: (id: string) => ({
    id,
    type,
  }),
  designerBtnElement:{
    icon: RiSeparator,
    label: "Separator Field"
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  properiesComponent: PropertiesComponent,

  validate: () => true
}

function DesignerComponent({elementInstance} : {elementInstance: FormElementInstance}){
  const element = elementInstance as FormElementInstance;
  return <div className="flex flex-col gap-2 w-full">
    <Label>
      Separator field
    </Label>
    <Separator/>
  </div>
}

function PropertiesComponent({elementInstance} : {elementInstance: FormElementInstance}){

  return (
    <p className="text-muted-foreground">No Properties</p>
  )
}

function FormComponent ({
  elementInstance, 
} : {
  elementInstance: FormElementInstance
}){
  return (
    <Separator/>
  )
}