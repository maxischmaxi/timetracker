"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useJobsByDate } from "@/hooks/use-jobs";
import { Dispatch, SetStateAction, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Button } from "./ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { addDays, format } from "date-fns";

type Props = {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
};

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function JobCharts(props: Props) {
  const jobs = useJobsByDate(props.date);

  const data = useMemo(
    () =>
      jobs.data?.map((job) => ({
        project: job.project?.name || "Unknown",
        minutes:
          (Number(job.job?.hours) || 0) * 60 + (Number(job.job?.minutes) || 0),
      })) || [],
    [jobs.data],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-row flex-nowrap justify-between items-center">
        <Button
          size="sm"
          variant="outline"
          onClick={() => props.setDate((prev) => addDays(prev, -1))}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <p>{format(props.date, "dd.MM.yy")}</p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => props.setDate((prev) => addDays(prev, 1))}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[300px] w-full"
      >
        <BarChart data={data}>
          <XAxis dataKey="project" />
          <YAxis dataKey="minutes" />
          <Bar dataKey="minutes" fill="var(--color-desktop)" radius={4} />
          <CartesianGrid vertical={false} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
