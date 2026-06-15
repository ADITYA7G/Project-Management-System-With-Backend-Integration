"use client";

import { Task, Priority, Category } from "@/types";
import { PRIORITIES, CATEGORIES } from "@/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Calendar, AlertCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const priorityColor = PRIORITIES.find(p => p.value === task.priority)?.color || "";
  const categoryColor = CATEGORIES.find(c => c.value === task.category)?.color || "";
  
  const isOverdue = !task.completed && new Date(task.due_date) < new Date();

  return (
    <Card className="group flex items-center justify-between p-4 transition-all hover:bg-muted/50">
      <div className="flex items-center gap-4">
        <Checkbox 
          checked={task.completed} 
          onCheckedChange={(checked) => onToggle(task.id, !!checked)}
        />
        <div className="flex flex-col">
          <span className={cn(
            "text-sm font-medium transition-all",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </span>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{task.due_date ? format(new Date(task.due_date), "MMM d") : "No date"}</span>
              {isOverdue && (
                <span className="flex items-center gap-1 text-red-500 font-medium">
                  <AlertCircle className="h-3 w-3" />
                  Overdue
                </span>
              )}
            </div>
            <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", priorityColor)}>
              {task.priority}
            </Badge>
            <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", categoryColor)}>
              {task.category}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(task)}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
