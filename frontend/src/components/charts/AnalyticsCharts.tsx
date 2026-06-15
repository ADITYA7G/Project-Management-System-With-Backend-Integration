"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/types";

interface AnalyticsChartsProps {
  tasks: Task[];
}

export default function AnalyticsCharts({ tasks }: AnalyticsChartsProps) {
  // Status Data
  const statusData = [
    { name: "Completed", value: tasks.filter(t => t.completed).length, color: "#10b981" },
    { name: "Pending", value: tasks.filter(t => !t.completed).length, color: "#f59e0b" },
  ];

  // Priority Data
  const priorityData = [
    { name: "Low", value: tasks.filter(t => t.priority === "Low").length },
    { name: "Medium", value: tasks.filter(t => t.priority === "Medium").length },
    { name: "High", value: tasks.filter(t => t.priority === "High").length },
  ];

  // Category Data
  const categoryData = [
    { name: "Work", value: tasks.filter(t => t.category === "Work").length },
    { name: "Personal", value: tasks.filter(t => t.category === "Personal").length },
    { name: "Study", value: tasks.filter(t => t.category === "Study").length },
    { name: "Health", value: tasks.filter(t => t.category === "Health").length },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Task Status</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Priority Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Tasks by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
