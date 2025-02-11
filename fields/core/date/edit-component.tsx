"use client";

import { forwardRef } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const EditComponent = forwardRef((props: any, ref: React.Ref<HTMLInputElement>) => {
  const { field, value, onChange } = props;
  const date = value ? new Date(value) : undefined;

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-auto justify-start text-left font-normal text-base",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'yyyy-MM-dd') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => onChange(date ? format(date, 'yyyy-MM-dd') : "")}
            disabled={(date) => {
              if (field?.options?.min && date < new Date(field.options.min)) return true;
              if (field?.options?.max && date > new Date(field.options.max)) return true;
              return false;
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
});

export { EditComponent };