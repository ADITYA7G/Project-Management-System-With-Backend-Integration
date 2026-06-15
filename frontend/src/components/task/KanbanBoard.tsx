"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Task } from "@/types";
import { useTaskStore } from "@/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRIORITIES, CATEGORIES } from "@/constants";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface KanbanBoardProps {
  tasks: Task[];
}

const COLUMNS = [
  { id: "Pending", title: "Pending", filter: (t: Task) => !t.completed && t.priority !== "High" },
  { id: "In Progress", title: "In Progress", filter: (t: Task) => !t.completed && t.priority === "High" },
  { id: "Completed", title: "Completed", filter: (t: Task) => t.completed },
];

export default function KanbanBoard({ tasks }: KanbanBoardProps) {
  const { updateTask } = useTaskStore();

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId;

    // Map Kanban column to task property
    if (newStatus === "Completed") {
      await updateTask(taskId, { completed: true });
    } else if (newStatus === "Pending") {
      await updateTask(taskId, { completed: false, priority: "Low" });
    } else if (newStatus === "In Progress") {
      await updateTask(taskId, { completed: false, priority: "High" });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {COLUMNS.map((column) => (
          <div key={column.id} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                {column.title}
              </h3>
              <Badge variant="secondary">{tasks.filter(column.filter).length}</Badge>
            </div>
            
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-col gap-3 min-h-[500px] p-2 bg-muted/30 rounded-lg border-2 border-dashed border-muted"
                >
                  {tasks.filter(column.filter).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="p-4 shadow-sm group cursor-grab active:cursor-grabbing"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div {...provided.dragHandleProps} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                              <GripVertical className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                              <span className={cn("text-sm font-medium", task.completed && "line-through text-muted-foreground")}>
                                {task.title}
                              </span>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", PRIORITIES.find(p => p.value === task.priority)?.color)}>
                                  {task.priority}
                                </Badge>
                                <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", CATEGORIES.find(c => c.value === task.category)?.color)}>
                                  {task.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
