import { getFormById, getFormWithSubmissions } from '@/actions/form';
import FormLinkShare from '@/components/FormLinkShare';
import VisitBtn from '@/components/VisitBtn';
import React, { ReactNode } from 'react';
import { FaWpforms } from 'react-icons/fa';
import { HiCursorClick } from 'react-icons/hi';
import { LuView } from 'react-icons/lu';
import { TbArrowBounce } from 'react-icons/tb';
import { StatsCard } from '../../page';
import { ElementsType, FormElementInstance } from '@/components/FormElements';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistance } from 'date-fns';

const FormDetailPage = async ({params}:{params: {id:string}}) => {
  const form = await getFormById(Number(params.id));
  if (!form) throw new Error("form not found");

  const {visits, submissions} = form;

  let submissionRate = 0;
  if (visits > 0) submissionRate = (submissions/visits)*100

  const bounceRate = 100 - submissionRate;

  return (
    <>
      <div className="py-10 border-b border-muted">
        <div className="flex justify-between container">
          <h1 className='text-4xl font-bold truncate'>{form.name}</h1>
          <VisitBtn shareUrl = {form.shareUrl}/>
        </div>
      </div>
      <div className="py-4 border-b border-muted">
        <div className="container flex gap-2 items-center justify-between">
          <FormLinkShare shareUrl={form.shareUrl}/>
        </div>
      </div>
      <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
        <StatsCard 
          title="Total visits" 
          icon={<LuView className="text-red-600"/>}
          helperText="All time form visits"
          value={visits.toLocaleString()} 
          loading={false}
          className="shadow-md shadow-red-600"
        />
        <StatsCard 
          title="Total submissions" 
          icon={<FaWpforms className="text-yellow-600"/>}
          helperText="All time form submissions"
          value={submissions.toLocaleString()} 
          loading={false}
          className="shadow-md shadow-yellow-600"
        />
        <StatsCard 
          title="Submission rate" 
          icon={<HiCursorClick className="text-green-600"/>}
          helperText="All time form submission rate"
          value={submissionRate.toLocaleString()+"%"} 
          loading={false}
          className="shadow-md shadow-green-600"
        />
        <StatsCard 
          title="Bounce rate" 
          icon={<TbArrowBounce className="text-blue-600"/>}
          helperText="Visits without interacting rate"
          value={bounceRate.toLocaleString()+"%"} 
          loading={false}
          className="shadow-md shadow-blue-600"
        />
      </div>
      <div className="container pt-10">
        <SubmissionsTable id={form.id}/>
      </div>
    </>
  );
};

export default FormDetailPage;

type Row = {
  [keys: string] : string
} & {
  submittedAt: Date
}

const SubmissionsTable = async ({id} : {id: number}) => {

  const form = await getFormWithSubmissions(id);

  if(!form) throw new Error(`Form not found`);
  
  if (form.FormSubmissions.length === 0){
    return (
      <div className="container">
        <h1 className="text-2xl font-bold">No submissions yet</h1>
      </div>
    );
  }
  const formElements = JSON.parse(form.content) as FormElementInstance[];
  const columns: {
    id: string;
    label: string;
    required: boolean;
    type: ElementsType;
  }[] = [];

  formElements.forEach((element) => {
    switch (element.type) {
      case 'TextField':
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.type
        })
        break;
      case 'NumberField':
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.type
        })
        break;
      case 'TextareaField':
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.type
        })
        break;
      case 'DateField':
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.type
        })
        break;
      default:
        break;
    }
  })

  const rows: Row[] = [];

  form.FormSubmissions.forEach(submission=>{
    const content = JSON.parse(submission.content);
    rows.push({...content, submittedAt: submission.createdAt});
  })
  

  return (
    <>
      <h1 className='text-2xl font-bold my-4'>Submissions</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead key={column.id} className='uppercase'>
                  {column.label}
                </TableHead>
              ))}
              <TableHead className='text-muted-foreground text-right uppercase'>
                Submitted at {}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map(column => (
                  <RowCell 
                    key ={column.id} 
                    type={column.type} 
                    value={row[column.id]}
                  />
                ))}
                <TableCell className='text-muted-foreground text-right'>
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true
                  })}
                  {}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

const RowCell = ({type, value} : {type: ElementsType, value: string}) => {
  let node: ReactNode = value;

  //switch(type){
  //  case 'TextField':

  //    break;
  //  default:
  //    break;
  //}

  return <TableCell className="">{node}</TableCell>
}