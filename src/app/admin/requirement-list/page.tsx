'use client'
import { useState, useEffect } from 'react';
import  { getRequirements } from '@/api/requirement';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ChevronDownIcon } from "lucide-react"
import { useRouter } from 'next/navigation';

export default function RequirementList () {
  const router = useRouter();
  const [requirementList, setRequirementList] = useState<any>([]);
  const [memberRequirementList, setMemberRequirementList] = useState<any>([]);
  const [selectedRequirement, setSelectedRequirement] = useState<any | null>(
    null
  );

  useEffect(() => {
    getRequirements().then((item) => {
      console.log(item);          
      setRequirementList(item);      
    })
  }, [])
  
  const selectRequirement = (item: any) => {
    setSelectedRequirement(item);
    if(selectedRequirement){
      console.log(selectedRequirement.requirement.id);
      router.replace(`/admin/create-trip/${selectedRequirement.requirement.id}`);
    }    
  };
  
  return (
    <div>
      <p className='text-2xl font-bold'>Requirement List</p>
      
      <div className='overflow-auto max-h-[500px] border rounded-md'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-base w-1/6'>Start Date</TableHead>
              <TableHead className='text-base w-1/6'>End Date</TableHead>
              <TableHead className='text-base w-1/6'>City</TableHead>
              <TableHead className='text-base w-2/6'>Arrival Location</TableHead>
              <TableHead className='text-base w-2/6'>Departure Location</TableHead>
              <TableHead className='text-base w-1/6 text-right'>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requirementList.map((item: any) => {
              return(
                <TableRow key={item.requirement.id} onClick={() => selectRequirement(item)}>
                  <TableCell className='text-base w-1/6'>{new Date(item.requirement.start_date_time).toLocaleDateString()}</TableCell>
                  <TableCell className='text-base w-1/6'>{new Date(item.requirement.end_date_time).toLocaleDateString()}</TableCell>
                  <TableCell className='text-base'>{item.requirement.city}</TableCell>
                  <TableCell className='text-base w-2/6 truncate'>{item.requirement.arrival_location}</TableCell>
                  <TableCell className='text-base w-/6 truncate'>{item.requirement.departure_location}</TableCell>
                  <TableCell className='text-base w-1/6'>{item.requirement.status}</TableCell>                  
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}