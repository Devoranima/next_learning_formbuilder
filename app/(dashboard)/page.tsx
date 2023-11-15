import { getFormStats, getForms } from "@/actions/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import {LuView} from "react-icons/lu";
import {FaEdit, FaWpforms} from "react-icons/fa";
import {HiCursorClick} from "react-icons/hi";
import {TbArrowBounce} from "react-icons/tb";
import { Separator } from "@/components/ui/separator";
import CreateFormButton from "@/components/CreateFormButton";
import { Form } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import {BiRightArrowAlt} from 'react-icons/bi'
import Link from "next/link";

export default function Home() {
  return (
    <div className="container pt-4">
      <Suspense fallback={<StatsCards loading={true}/>}>
        <CardStatsWrapper/>
      </Suspense>
      <Separator className="my-6"/>
      <h2 className="text-4xl font-bold col-span-2">Your forms</h2>
      <Separator className="my-6"/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateFormButton/>
        <Suspense fallback={[1].map((index)=><FormCardSkeleton key={index}/>)}>
          <FormCards/>
        </Suspense>
      </div>
    </div>
  )
}


const CardStatsWrapper = async () =>{
  const stats = await getFormStats();
  return <StatsCards loading={false} data={stats}/>;
}

interface StatsCardProps{
  data?: Awaited <ReturnType<typeof getFormStats>>;
  loading: boolean;
}

const StatsCards = (props: StatsCardProps)=>{
  const {data, loading} = props;
  return <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
    <StatsCard 
      title="Total visits" 
      icon={<LuView className="text-red-600"/>}
      helperText="All time form visits"
      value={data?.visits.toLocaleString() || ""} 
      loading={loading}
      className="shadow-md shadow-red-600"
    />
    <StatsCard 
      title="Total submissions" 
      icon={<FaWpforms className="text-yellow-600"/>}
      helperText="All time form submissions"
      value={data?.submissions.toLocaleString() || ""} 
      loading={loading}
      className="shadow-md shadow-yellow-600"
    />
    <StatsCard 
      title="Submission rate" 
      icon={<HiCursorClick className="text-green-600"/>}
      helperText="All time form submission rate"
      value={data?.submissionRate.toLocaleString()+"%" || ""} 
      loading={loading}
      className="shadow-md shadow-green-600"
    />
    <StatsCard 
      title="Bounce rate" 
      icon={<TbArrowBounce className="text-blue-600"/>}
      helperText="Visits without interacting rate"
      value={data?.bounceRate.toLocaleString()+"%" || ""} 
      loading={loading}
      className="shadow-md shadow-blue-600"
    />
  </div>
}



export const StatsCard = ({title, icon, helperText, value, loading, className} : {title: string, icon: React.ReactNode, helperText: string, value: string, loading: boolean, className: string}) =>{
  return <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between pd-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {
          loading&&
          <Skeleton>
            <span className="opacity-0">0</span>
          </Skeleton>
        }
        {
          !loading && value
        }
      </div>
      <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
    </CardContent>
  </Card>
}


const FormCardSkeleton = () => {
  return <Skeleton className="border-2 border-primary/20 h-[190px] w-full"></Skeleton>
}

const FormCards = async () => {
  const forms = await getForms();
  return (
    <>
      {forms.map((form) => (
        <FormCard key={form.id} form={form}></FormCard>
      ))}
    </>
  )
}

const FormCard = ({form}:{form:Form}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle  className="flex items-center gap-2 justify-between">
          <span className="truncate font-bold">{form.name}</span>
          {form.published && <Badge>Published</Badge>}
          {!form.published && <Badge variant={"destructive"}>Draft</Badge>}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(form.createdAt, new Date(), {
            addSuffix: true
          })}
          {
            form.published && (
              <span className="flex items-center gap-2">
                <LuView className='text-muted-foreground'/>
                <span>{form.visits.toLocaleString()}</span>
                <FaWpforms className='text-muted-foreground'/>
                <span>{form.submissions.toLocaleString()}</span>
              </span>
            )
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
          {form.description || "No Description"}
      </CardContent>
      <CardFooter>
        {form.published && (
          <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={`/forms/${form.id}`}>
              View Submissions <BiRightArrowAlt/>
            </Link>
          </Button>
        )}
        {!form.published && (
          <Button variant={'secondary'} asChild className="w-full mt-2 text-md gap-4">
            <Link href={`/builder/${form.id}`}>
              Edit Form <FaEdit/>
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
} 