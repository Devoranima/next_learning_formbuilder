import React, { ElementType } from 'react';
import { TextFieldElement } from './fields/TextField';
import { TitleFieldElement } from './fields/TitleField';
import { ParagraphFieldElement } from './fields/ParagraphField';
import { SeparatorFieldElement } from './fields/SeparatorField';
import { NumberFieldFormElement } from './fields/NumberField';
import { TextareaFieldElement } from './fields/TextareaField';
import { DateFieldElement } from './fields/DateField';

export type ElementsType = 
"TextField" | 
"TitleField" | 
"ParagraphField" | 
"SeparatorField" | 
"NumberField" | 
"TextareaField" | 
"DateField";

export type SubmitValueFunctionType = (key: string, value: string)=>void;

export type FormElementType = {
  type: ElementsType;

  construct: (id: string)=> FormElementInstance

  designerBtnElement: {
    icon: React.ElementType,
    label: string
  }
  designerComponent: React.FC<{
    elementInstance: FormElementInstance
  }>;
  formComponent: React.FC<{
    elementInstance: FormElementInstance,
    submitValue?: (key: string, value: string)=>void,
    isInvalid?: boolean,
    defaultValue?: string
  }>;
  properiesComponent: React.FC<{
    elementInstance: FormElementInstance
  }>;

  validate: (formElement: FormElementInstance, currentValue: string) => boolean
}

export type FormElementInstance = {
  id: string;
  type: ElementsType;
  extraAttributes?: Record<string, any>
}

type FormElementsType = {
  [key in ElementsType] : FormElementType;
}

export const FormElements: FormElementsType = {
  TextField: TextFieldElement,
  TitleField: TitleFieldElement,
  ParagraphField: ParagraphFieldElement,
  SeparatorField: SeparatorFieldElement,
  NumberField: NumberFieldFormElement,
  TextareaField: TextareaFieldElement,
  DateField: DateFieldElement
}; 