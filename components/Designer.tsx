"user client"

import React, { useState } from 'react';
import DesignerSidebar from './DesignerSidebar';
import {useDndMonitor, useDraggable, useDroppable} from '@dnd-kit/core'
import { cn } from '@/lib/utils';
import { ElementsType, FormElementInstance, FormElements } from './FormElements';
import useDesigner from './hooks/useDesigner';
import { idGenerator } from '@/lib/idGenerator';
import { Button } from './ui/button';
import { BiSolidTrash } from 'react-icons/bi';

const Designer = () => {

  const {elements, addElement, selectedElement, setSelectedElement, removeElement} = useDesigner();

  const droppable = useDroppable({
    id: "designer-drop-area",
    data:{
      isDesignerDropArea: true
    }
  })

  useDndMonitor({
    onDragEnd:(event)=>{
      const {active, over} = event;
      if (!active || !over) return;
      const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;
      const droppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea

      //Dropping btn Drop Area
      const droppingSidebarBtnOverDesignerDropArea = isDesignerBtnElement && droppingOverDesignerDropArea
      if (droppingSidebarBtnOverDesignerDropArea){
        const type = active.data?.current?.type;

        const newElement = FormElements[type as ElementsType].construct(idGenerator())

        addElement(elements.length, newElement);
        return;
      }

      const droppingOverDesignerElementTopHalf = over.data?.current?.isTopHalfDesignerElement

      const droppingOverDesignerElementBottomHalf = over.data?.current?.isBottomHalfDesignerElement
  
      const droppingOverDesignerElement = droppingOverDesignerElementTopHalf || droppingOverDesignerElementBottomHalf

      const droppingSidebarBtnOverDesignerElement = isDesignerBtnElement && droppingOverDesignerElement

      if (droppingSidebarBtnOverDesignerElement){
        const type = active.data?.current?.type;

        const newElement = FormElements[type as ElementsType].construct(idGenerator())
        const overElementId = over?.data?.current?.elementId
        const overElementIndex = elements.findIndex(e => e.id === overElementId);

        if (overElementIndex === -1) throw new Error('element not found')

        let newIndex = overElementIndex;
        if (droppingOverDesignerElementBottomHalf){
          newIndex++;
        }
        addElement(newIndex, newElement);
        return;
      }
      const droppingDesignerElement = active.data?.current?.isDesignerElement;
      const droppingDesignerElementOverAnotherDesignerElement = droppingOverDesignerElement && droppingDesignerElement

      if (droppingDesignerElementOverAnotherDesignerElement ){
        const overElementId = over?.data?.current?.elementId
        const overElementIndex = elements.findIndex(e => e.id === overElementId);

        const activeElementId = active.data?.current?.elementId;
        const activeElementIndex = elements.findIndex(e => e.id === activeElementId);

        if(overElementIndex === -1 || activeElementIndex === -1) throw new Error('element not found')

        const activeElement = {...elements[activeElementIndex]};

        removeElement(activeElementId);

        let newIndex = overElementIndex;
        if (droppingOverDesignerElementBottomHalf){
          newIndex++;
        }
        addElement(newIndex, activeElement);
        return;
      }

      const droppingDesignerElementOverDesignerDropArea = droppingDesignerElement && droppingOverDesignerDropArea
      if (droppingDesignerElementOverDesignerDropArea){
        const activeElementId = active.data?.current?.elementId;
        const activeElementIndex = elements.findIndex(e => e.id === activeElementId);

        if(activeElementIndex === -1) throw new Error('element not found')

        const activeElement = {...elements[activeElementIndex]};

        removeElement(activeElementId);

        addElement(elements.length, activeElement);
        return;
      }
    }
  })

  return (
    <div className='flex w-full h-full'>
      <div className="p4 w-full"
        onClick={()=>{
          if(selectedElement) setSelectedElement(null)
        }}
      >
        <div 
        ref = {droppable.setNodeRef}
        className={cn("bg-background max-w-[920px] h-full m-auto rounded-xl  flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto", droppable.isOver && "ring-2 ring-primary/20")}>
          {elements.length > 0 &&
            <div className="flex flex-col w-full gap-2 p-4">
              {elements.map(element=>(
                <DesignerElementWrapper key={element.id} element={element}/>
              ))}
            </div>
          }
          {!droppable.isOver && elements.length == 0 &&
            <p className='text-3xl text-muted-foreground flex flex-grow items-center font-bold'>
              Drop here
            </p>
          }
          {droppable.isOver &&
            <div className="w-full p-4">
              <div className="h-[120px] rounded-md bg-primary/20"></div>
            </div>
          }
        </div>
      </div>
      <DesignerSidebar/>
    </div>
  );
};


const DesignerElementWrapper = ({element} : {element: FormElementInstance})=>{
  const {removeElement, selectedElement, setSelectedElement} = useDesigner();
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true
    }
  })
  
  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true
    }
  })

  const DesignerElement = FormElements[element.type].designerComponent;

  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data:{
      type: element.type,
      elementId: element.id,
      isDesignerElement: true
    }
  })

  if (draggable.isDragging) return null;

  return (
    <div 
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className='relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset'

      onMouseEnter={()=>{setMouseIsOver(true)}}
      onMouseLeave={()=>{setMouseIsOver(false)}}
      onClick={(e)=>{
        e.stopPropagation();
        setSelectedElement(element)}
      }
    >
      <div ref={topHalf.setNodeRef} className={cn("absolute w-full h-1/2 rounded-t-md")}></div>
      <div ref={bottomHalf.setNodeRef} className={cn("absolute w-full h-1/2 bottom-0 rounded-b-md")}></div>
      {
        mouseIsOver &&
        <>
          <div className="absolute right-0 h-full">
            <Button 
              className='flex justify-center h-full border rounded-md rounded-l-none bg-red-500' 
              variant={'outline'}
              onClick={(e)=>{
                e.stopPropagation();
                removeElement(element.id);
              }}
            >
              <BiSolidTrash className="h-6 w-6"/>
            </Button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <p className='text-muted-foreground text-sm'>Click for properties or drag to move</p>
          </div>
        </>
      }
      {topHalf.isOver && 
        <div className="absolute top-0 w-full rounded-md rounded-b-none h-[7px] bg-primary"></div>
      }
      {bottomHalf.isOver && 
        <div className="absolute bottom-0 w-full rounded-md rounded-t-none h-[7px] bg-primary"></div>
      }
      <div className={cn("flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100", mouseIsOver && "opacity-20")}>
        <DesignerElement elementInstance={element}/>
      </div>
    </div>
  )
}

export default Designer;