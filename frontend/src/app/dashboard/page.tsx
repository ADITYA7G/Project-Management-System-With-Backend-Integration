"use client";

import { useEffect, useState } from "react";
import { useTaskStore } from "@/store";
import Navbar from "@/components/layout/Navbar";
import StatCard from "@/components/dashboard/StatCard";
import TaskItem from "@/components/task/TaskItem";
import TaskModal from "@/components/task/TaskModal";
import KanbanBoard from "@/components/task/KanbanBoard";
import AnalyticsCharts from "@/components/charts/AnalyticsCharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, SortAsc } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Priority, Category } from "@/types";

export default function DashboardPage() {
  const { tasks, fetchTasks, deleteTask, toggleTaskStatus, loading } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Priority | Category | any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  useEffect(() => {
    fetchTasks();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "n" || e.key === "N") {
        // Prevent triggering when typing in an input
        if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "TEXTAREA") {
          return;
        }
        e.preventDefault();
        openCreateModal();
      }
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fetchTasks]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (filter === "Completed") matchesFilter = task.completed;
    else if (filter === "Pending") matchesFilter = !task.completed;
    else if (filter === "High Priority") matchesFilter = task.priority === "High";
    else if (filter === "Overdue") matchesFilter = !task.completed && new Date(task.due_date) < new Date();

    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (sortBy === "Newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === "Oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortBy === "Priority") {
      const priorityMap = { High: 3, Medium: 2, Low: 1 };
      return priorityMap[b.priority as Priority] - priorityMap[a.priority as Priority];
    }
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  const openEditModal = (task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    highPriority: tasks.filter(t => t.priority === "High").length,
    completionRate: tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col gap-8">
          
          {/* Header & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
              <p className="text-muted-foreground">Manage your daily productivity</p>
            </div>
            <Button onClick={openCreateModal} className="w-fit">
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard title="Total Tasks" value={stats.total} icon={Search} description="All tasks" color="text-blue-500" />
            <StatCard title="Completed" value={stats.completed} icon={Search} description="Finished" color="text-green-500" />
            <StatCard title="Pending" value={stats.pending} icon={Search} description="Remaining" color="text-yellow-500" />
            <StatCard title="High Priority" value={stats.highPriority} icon={Search} description="Urgent" color="text-red-500" />
            <StatCard title="Completion" value={`${stats.completionRate}%`} icon={Search} description="Progress" color="text-purple-500" />
          </div>

          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border shadow-sm">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search tasks..." 
                    className="pl-10" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Filter className="h-4 w-4" />
                    <select 
                      className="bg-transparent border-none focus:ring-0 cursor-pointer font-medium"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="All">All Tasks</option>
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="High Priority">High Priority</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground border-l pl-3">
                    <SortAsc className="h-4 w-4" />
                    <select 
                      className="bg-transparent border-none focus:ring-0 cursor-pointer font-medium"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="Newest">Newest</option>
                      <option value="Oldest">Oldest</option>
                      <option value="Priority">Priority</option>
                      <option value="DueDate">Due Date</option>
                    </select>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredTasks.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {filteredTasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggle={toggleTaskStatus}
                      onDelete={deleteTask}
                      onEdit={openEditModal}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="bg-muted p-6 rounded-full">
                    <Search className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">No tasks found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                  <Button onClick={openCreateModal}>Create your first task</Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="kanban">
              <KanbanBoard tasks={tasks} />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsCharts tasks={tasks} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        task={selectedTask} 
      />
    </div>
  );
}
