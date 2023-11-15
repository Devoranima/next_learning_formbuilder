"use server";

import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schemas/form";
import { currentUser } from "@clerk/nextjs";

class UserNotFoundError extends Error {

}

export async function getFormStats() {
  const user = await currentUser();
  if (!user){
    throw new UserNotFoundError();
  } 

  const stats = await prisma.form.aggregate({
    where:{
      userId: user.id
    },
    _sum:{
      visits: true,
      submissions: true
    }
  })

  const visits = stats._sum.visits || 0;
  const submissions = stats._sum.submissions || 0;

  let submissionRate = 0;
  if (visits > 0) submissionRate = (submissions/visits)*100

  const bounceRate = 100 - submissionRate;

  return{visits, submissions, submissionRate, bounceRate}
}

export async function createForm(data: formSchemaType){
  const validation = formSchema.safeParse(data);
  if(!validation.success){
    throw new Error("Form is not valid")
  }

  const user = await currentUser();
  if(!user){
    throw new UserNotFoundError();
  }

  const {name, description} = validation.data
  
  const form = await prisma.form.create({
    data:{
      userId: user.id,
      name,
      description
    }
  })

  if(!form){
    throw new Error("Form was not created")
  }

  return form.id
}

export async function getForms(){
  const user = await currentUser();
  if (!user){
    throw new UserNotFoundError();
  } 
  return await prisma.form.findMany({
    where:{
      userId: user.id
    },
    orderBy:{
      createdAt: "desc"
    }
  })
} 

export async function getFormById(id: number){
  const user = await currentUser();
  if(!user) throw new UserNotFoundError();

  return await prisma.form.findUnique({
    where:{
      userId: user.id,
      id: id
    }
  })
}

export async function getFormByUrl(formUrl: string){
  return await prisma.form.findUnique({
    where:{
      shareUrl: formUrl
    }
  })
}


export async function updateFormContent(id:number, jsonContent: string){
  const user = await currentUser();
  if(!user) throw new UserNotFoundError();

  return await prisma.form.update({
    where:{
      userId: user.id,
      id
    },
    data:{
      content: jsonContent
    }
  })
}


export async function publishForm(id:number){
  const user = await currentUser();
  if(!user) throw new UserNotFoundError();

  return await prisma.form.update({
    where: {
      userId: user.id,
      id
    },
    data:{
      published: true
    }
  })
}

export async function getFormWithSubmissions(id: number){
  const user = await currentUser();
  if(!user) throw new UserNotFoundError();

  return await prisma.form.findUnique({
    where: {
      id
    },
    include:{
      FormSubmissions: true
    }
  })
}


export async function getFormContentByUrl(formUrl: string){
  return await prisma.form.update({
    select:{
      content: true
    },
    data: {
      visits: {
        increment: 1
      }
    },
    where: {
      shareUrl: formUrl
    }
  })
}

export async function submitForm(formUrl: string, jsonContent: string){
  return await prisma.form.update({
    data: {
      submissions:{
        increment: 1
      },
      FormSubmissions:{
        create:{
          content: jsonContent
        }
      }
    },
    where:{
      shareUrl: formUrl,
      published: true
    }
  })
}