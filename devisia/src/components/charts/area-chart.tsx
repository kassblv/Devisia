"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

const chartData = [
  { date: "2024-04-01", accepted: 222, pending: 150 },
  { date: "2024-04-02", accepted: 97, pending: 180 },
  { date: "2024-04-03", accepted: 167, pending: 120 },
  { date: "2024-04-04", accepted: 242, pending: 260 },
  { date: "2024-04-05", accepted: 373, pending: 290 },
  { date: "2024-04-06", accepted: 301, pending: 340 },
  { date: "2024-04-07", accepted: 245, pending: 180 },
  { date: "2024-04-08", accepted: 409, pending: 320 },
  { date: "2024-04-09", accepted: 59, pending: 110 },
  { date: "2024-04-10", accepted: 261, pending: 190 },
  { date: "2024-04-11", accepted: 327, pending: 350 },
  { date: "2024-04-12", accepted: 292, pending: 210 },
  { date: "2024-04-13", accepted: 342, pending: 380 },
  { date: "2024-04-14", accepted: 137, pending: 220 },
  { date: "2024-04-15", accepted: 120, pending: 170 },
  { date: "2024-04-16", accepted: 138, pending: 190 },
  { date: "2024-04-17", accepted: 446, pending: 360 },
  { date: "2024-04-18", accepted: 364, pending: 410 },
  { date: "2024-04-19", accepted: 243, pending: 180 },
  { date: "2024-04-20", accepted: 89, pending: 150 },
  { date: "2024-04-21", accepted: 137, pending: 200 },
  { date: "2024-04-22", accepted: 224, pending: 170 },
  { date: "2024-04-23", accepted: 138, pending: 230 },
  { date: "2024-04-24", accepted: 387, pending: 290 },
  { date: "2024-04-25", accepted: 215, pending: 250 },
  { date: "2024-04-26", accepted: 75, pending: 130 },
  { date: "2024-04-27", accepted: 383, pending: 420 },
  { date: "2024-04-28", accepted: 122, pending: 180 },
  { date: "2024-04-29", accepted: 315, pending: 240 },
  { date: "2024-04-30", accepted: 454, pending: 380 },
  { date: "2024-05-01", accepted: 165, pending: 220 },
  { date: "2024-05-02", accepted: 293, pending: 310 },
  { date: "2024-05-03", accepted: 247, pending: 190 },
  { date: "2024-05-04", accepted: 385, pending: 420 },
  { date: "2024-05-05", accepted: 481, pending: 390 },
  { date: "2024-05-06", accepted: 498, pending: 520 },
  { date: "2024-05-07", accepted: 388, pending: 300 },
  { date: "2024-05-08", accepted: 149, pending: 210 },
  { date: "2024-05-09", accepted: 227, pending: 180 },
  { date: "2024-05-10", accepted: 293, pending: 330 },
  { date: "2024-05-11", accepted: 335, pending: 270 },
  { date: "2024-05-12", accepted: 197, pending: 240 },
  { date: "2024-05-13", accepted: 197, pending: 160 },
  { date: "2024-05-14", accepted: 448, pending: 490 },
  { date: "2024-05-15", accepted: 473, pending: 380 },
  { date: "2024-05-16", accepted: 338, pending: 400 },
  { date: "2024-05-17", accepted: 499, pending: 420 },
  { date: "2024-05-18", accepted: 315, pending: 350 },
  { date: "2024-05-19", accepted: 235, pending: 180 },
  { date: "2024-05-20", accepted: 177, pending: 230 },
  { date: "2024-05-21", accepted: 82, pending: 140 },
  { date: "2024-05-22", accepted: 81, pending: 120 },
  { date: "2024-05-23", accepted: 252, pending: 290 },
  { date: "2024-05-24", accepted: 294, pending: 220 },
  { date: "2024-05-25", accepted: 201, pending: 250 },
  { date: "2024-05-26", accepted: 213, pending: 170 },
  { date: "2024-05-27", accepted: 420, pending: 460 },
  { date: "2024-05-28", accepted: 233, pending: 190 },
  { date: "2024-05-29", accepted: 78, pending: 130 },
  { date: "2024-05-30", accepted: 340, pending: 280 },
  { date: "2024-05-31", accepted: 178, pending: 230 },
  { date: "2024-06-01", accepted: 178, pending: 200 },
  { date: "2024-06-02", accepted: 470, pending: 410 },
  { date: "2024-06-03", accepted: 103, pending: 160 },
  { date: "2024-06-04", accepted: 439, pending: 380 },
  { date: "2024-06-05", accepted: 88, pending: 140 },
  { date: "2024-06-06", accepted: 294, pending: 250 },
  { date: "2024-06-07", accepted: 323, pending: 370 },
  { date: "2024-06-08", accepted: 385, pending: 320 },
  { date: "2024-06-09", accepted: 438, pending: 480 },
  { date: "2024-06-10", accepted: 155, pending: 200 },
  { date: "2024-06-11", accepted: 92, pending: 150 },
  { date: "2024-06-12", accepted: 492, pending: 420 },
  { date: "2024-06-13", accepted: 81, pending: 130 },
  { date: "2024-06-14", accepted: 426, pending: 380 },
  { date: "2024-06-15", accepted: 307, pending: 350 },
  { date: "2024-06-16", accepted: 371, pending: 310 },
  { date: "2024-06-17", accepted: 475, pending: 520 },
  { date: "2024-06-18", accepted: 107, pending: 170 },
  { date: "2024-06-19", accepted: 341, pending: 290 },
  { date: "2024-06-20", accepted: 408, pending: 450 },
  { date: "2024-06-21", accepted: 169, pending: 210 },
  { date: "2024-06-22", accepted: 317, pending: 270 },
  { date: "2024-06-23", accepted: 480, pending: 530 },
  { date: "2024-06-24", accepted: 132, pending: 180 },
  { date: "2024-06-25", accepted: 141, pending: 190 },
  { date: "2024-06-26", accepted: 434, pending: 380 },
  { date: "2024-06-27", accepted: 448, pending: 490 },
  { date: "2024-06-28", accepted: 149, pending: 200 },
  { date: "2024-06-29", accepted: 103, pending: 160 },
  { date: "2024-06-30", accepted: 446, pending: 400 },
]

const chartConfig = {
  revenue: {
    label: "Chiffre d'affaires",
  },
  accepted: {
    label: "Devis acceptés",
    color: "hsl(var(--emerald-500, 16 185 129))",
  },
  pending: {
    label: "Devis en attente",
    color: "hsl(var(--indigo-500, 99 102 241))",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="relative">
        <CardTitle className="dark:text-white">Chiffre d'affaires quotidien</CardTitle>
        <CardDescription className="dark:text-gray-300">
          <span className="@[540px]/card:block hidden">
            Total pour les 3 derniers mois
          </span>
          <span className="@[540px]/card:hidden">3 derniers mois</span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5 dark:text-white dark:data-[state=on]:bg-indigo-900 dark:data-[state=on]:text-white">
              3 derniers mois
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5 dark:text-white dark:data-[state=on]:bg-indigo-900 dark:data-[state=on]:text-white">
              30 derniers jours
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5 dark:text-white dark:data-[state=on]:bg-indigo-900 dark:data-[state=on]:text-white">
              7 derniers jours
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="@[767px]/card:hidden flex w-40 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              aria-label="Sélectionner une période"
            >
              <SelectValue placeholder="3 derniers mois" />
            </SelectTrigger>
            <SelectContent className="rounded-xl dark:bg-gray-800">
              <SelectItem value="90d" className="rounded-lg dark:text-white dark:focus:bg-gray-700">
                3 derniers mois
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg dark:text-white dark:focus:bg-gray-700">
                30 derniers jours
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg dark:text-white dark:focus:bg-gray-700">
                7 derniers jours
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillAccepted" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="rgb(16, 185, 129)" 
                  stopOpacity={0.8}
                  className="dark:stop-color-emerald-400"
                />
                <stop
                  offset="95%"
                  stopColor="rgb(16, 185, 129)"
                  stopOpacity={0.1}
                  className="dark:stop-color-emerald-400"
                />
              </linearGradient>
              <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="rgb(99, 102, 241)"
                  stopOpacity={0.8}
                  className="dark:stop-color-indigo-300"
                />
                <stop
                  offset="95%"
                  stopColor="rgb(99, 102, 241)"
                  stopOpacity={0.1}
                  className="dark:stop-color-indigo-300"
                />
              </linearGradient>
            </defs>
            <CartesianGrid 
              vertical={false} 
              stroke="rgba(107, 114, 128, 0.2)" 
              className="dark:stroke-gray-700" 
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              stroke="rgba(107, 114, 128, 0.5)" 
              className="dark:text-gray-400 dark:stroke-gray-600"
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("fr-FR", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value: string) => {
                    return new Date(value).toLocaleDateString("fr-FR", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="pending"
              type="natural"
              fill="url(#fillPending)"
              stroke="rgb(99, 102, 241)"
              strokeWidth={2}
              stackId="a"
              className="dark:stroke-indigo-300"
            />
            <Area
              dataKey="accepted"
              type="natural"
              fill="url(#fillAccepted)"
              stroke="rgb(16, 185, 129)"
              strokeWidth={2}
              stackId="a"
              className="dark:stroke-emerald-400"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
