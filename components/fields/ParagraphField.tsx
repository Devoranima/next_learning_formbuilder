"use client"

import { ElementsType, FormElementInstance, FormElementType } from "../FormElements"
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
import { BsTextParagraph } from "react-icons/bs"
import { AutosizeTextarea } from "../ui/autosizetextarea"

const type: ElementsType = "ParagraphField"

const extraAttributes = {
  text: 'Paragraph Text',
}

type propertiesSchemaType = zod.infer<typeof propertiesSchema>

const propertiesSchema = zod.object({
  text: zod.string().min(2).max(500),
})

export const ParagraphFieldElement: FormElementType = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes
  }),
  designerBtnElement: {
    icon: BsTextParagraph,
    label: "Paragraph Field"
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  properiesComponent: PropertiesComponent,

  validate: () => true
}

type customInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as customInstance;
  const { text } = element.extraAttributes
  return (
    <p>{text}</p>
  )
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as customInstance;
  const form = useForm<propertiesSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      text: element.extraAttributes.text
    }
  })

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form])
  const { updateElement } = useDesigner();

  const applyChanges = (values: propertiesSchemaType) => {
    updateElement(element.id, {
      ...element, extraAttributes: {
        ...values
      }
    })
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <AutosizeTextarea
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as customInstance;
  const { text } = element.extraAttributes

  return (
    <p className="text-xl">{text}</p>
  )
}