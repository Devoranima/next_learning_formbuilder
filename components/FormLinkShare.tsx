"use client"

import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from './ui/use-toast';
import { ImShare } from 'react-icons/im';

const FormLinkShare = ({shareUrl} : {shareUrl: string}) => {
  const [mounted, setMounted] = useState(false)
  const shareLink = `${window.location.origin}/submit/${shareUrl}`
  useEffect(()=>{
    setMounted(true);
  }, [])

  if (!mounted) return null
  
  return (
    <div className='flex flex-grow gap-4 items-center'>
      <Input readOnly className='w-full' value={shareLink}/>
      <Button  
        className='max-w-[250px]' 
        onClick={()=>{
          navigator.clipboard.writeText(shareLink)
          toast({
            title:"Copied",
            description:"Link copied to clipboard"
          })
        }}
      >
        <ImShare className='mr-2 h-4 w-4'/>
        Share Link
      </Button>
    </div>
  );
};

export default FormLinkShare;