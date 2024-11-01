"use client";

import { useState, useEffect } from "react";
import { getRequirements } from "@/api/requirement";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

export default function RequirementList() {
  const router = useRouter();
  const [requirementList, setRequirementList] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
    getRequirements().then((items) => {
      setRequirementList(items);
      setFilteredList(items);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const filtered = requirementList.filter((item) => {
        const createdAt = new Date(item.requirement.create_at);
        return (
          createdAt >= (dateRange?.from ?? new Date(0)) &&
          createdAt <= (dateRange?.to ?? new Date())
        );
      });
      setFilteredList(filtered);
    } else {
      setFilteredList(requirementList);
    }
  }, [dateRange, requirementList]);

  const selectRequirement = (item: any) => {
    router.push(`/admin/create-trip/${item.requirement.id}`);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "canceled":
        return "destructive";
      case "completed":
        return "default";
      case "in progress":
        return "outline";
      default:
        return "secondary";
    }
  };
  const onDownLoadClick = async () => {
    const html2pdf = await require("html2pdf.js");
    const element = document.querySelector("#requirement-list");

    // Create options with a customized jsPDF instance
    const options = {
      margin: 20,
      filename: "requirement-list.pdf",
      jsPDF: {
        unit: "pt",
        format: "a4",
        orientation: "landscape",
      },
      pagebreak: { mode: ["css", "legacy"] },
      html2canvas: { scale: 2 },
    };

    // Generate PDF and customize font size
    html2pdf()
      .set(options)
      .from(element)
      .toPdf()
      .get("pdf")
      .then((pdf: any) => {
        pdf.setFontSize(10); // Adjust font size as needed
      })
      .save();
  };

  return (
    <div className="space-y-4" id="requirement-list">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Requirement List</h1>
        <div className="flex justify-between gap-3">
          <Button variant={"outline"} onClick={onDownLoadClick}>
            Download
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[280px] justify-start text-left font-normal"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Filter by date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="border rounded-md shadow-sm overflow-hidden">
        <div className="overflow-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm font-semibold w-[15%] sticky top-0 bg-background z-10">
                  Created At
                </TableHead>
                <TableHead className="text-sm font-semibold w-[8%] sticky top-0 bg-background z-10">
                  Owner
                </TableHead>
                <TableHead className="text-sm font-semibold w-[8%] sticky top-0 bg-background z-10">
                  City
                </TableHead>
                <TableHead className="text-sm font-semibold w-[20%] sticky top-0 bg-background z-10">
                  Arrival Location
                </TableHead>
                <TableHead className="text-sm font-semibold w-[20%] sticky top-0 bg-background z-10">
                  Departure Location
                </TableHead>
                <TableHead className="text-sm font-semibold w-[13%] text-right sticky top-0 bg-background z-10">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No requirements found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredList.map((item: any, index: number) => (
                  <TableRow
                    key={item.requirement.id}
                    onClick={() => selectRequirement(item)}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      index % 2 === 0 ? "bg-muted/20" : ""
                    }`}
                  >
                    <TableCell className="text-sm py-3">
                      {new Date(item.requirement.create_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm py-3">
                      {item.requirement.owner}
                    </TableCell>
                    <TableCell className="text-sm py-3">
                      {item.requirement.city}
                    </TableCell>
                    <TableCell className="text-sm py-3 truncate max-w-[200px]">
                      {item.requirement.arrival_location}
                    </TableCell>
                    <TableCell className="text-sm py-3 truncate max-w-[200px]">
                      {item.requirement.departure_location}
                    </TableCell>
                    <TableCell className="text-sm py-3 text-right">
                      <Badge
                        variant={getStatusBadgeVariant(item.requirement.status)}
                        className="text-[12px] font-medium"
                      >
                        {item.requirement.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
