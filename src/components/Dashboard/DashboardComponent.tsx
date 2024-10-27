import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./components/TaskCard";
import { TaskForm } from "./components/TaskForm";
import { ControlPanel } from "./components/TaskControls";
import { useLocalStorage } from "@/hooks/useLocalstorage";
import { Task, TaskFormData } from "@/types/dashboard.types";

const emptyTaskForm: TaskFormData = {
  title: "",
  description: "",
  status: "pending",
  dueDate: "",
};

export const DashboardComponent: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState<TaskFormData>(emptyTaskForm);

  const handleCreateTask = () => {
    if (!taskForm.title || !taskForm.dueDate) return;

    const newTask: Task = {
      id: Date.now(),
      ...taskForm,
      createdAt: new Date().toISOString(),
    };

    setTasks([...tasks, newTask]);
    setTaskForm(emptyTaskForm);
    setShowTaskForm(false);
  };

  const handleUpdateTask = () => {
    if (!editingTask || !editingTask.title || !editingTask.dueDate) return;

    const updatedTasks = tasks.map((t) =>
      t.id === editingTask.id ? editingTask : t
    );

    setTasks(updatedTasks);
    setEditingTask(null);
  };

  const handleDeleteTask = () => {
    if (!taskToDelete) return;

    setTasks(tasks.filter((task) => task.id !== taskToDelete.id));
    setShowDeleteConfirm(false);
    setTaskToDelete(null);
  };

  const filteredAndSortedTasks = tasks
    .filter((task) => {
      const matchesStatus =
        filterStatus === "all" || task.status === filterStatus;
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return sortOrder === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });
  console.log("editying task", editingTask);
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Task Dashboard
          </h1>

          <ControlPanel
            filterStatus={filterStatus}
            sortOrder={sortOrder}
            searchQuery={searchQuery}
            onFilterChange={setFilterStatus}
            onSortChange={setSortOrder}
            onSearchChange={setSearchQuery}
            onCreateClick={() => setShowTaskForm(true)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedTasks.map((task) => {
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={setEditingTask}
                  onDelete={(task) => {
                    setTaskToDelete(task);
                    setShowDeleteConfirm(true);
                  }}
                />
              );
            })}
          </div>

          <Dialog
            open={showTaskForm || !!editingTask?.id}
            onOpenChange={() => {
              setShowTaskForm(false);
              setEditingTask(null);
              setTaskForm(emptyTaskForm);
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTask?.id ? "Edit Task" : "Create New Task"}
                </DialogTitle>
              </DialogHeader>
              <TaskForm
                data={editingTask || taskForm}
                onChange={editingTask?.id ? setEditingTask : setTaskForm}
              />
              <DialogFooter>
                <Button
                  onClick={editingTask ? handleUpdateTask : handleCreateTask}
                  disabled={
                    editingTask
                      ? !editingTask?.title || !editingTask?.dueDate
                      : !taskForm.title || !taskForm.dueDate
                  }
                >
                  {editingTask ? "Update Task" : "Create Task"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Task</DialogTitle>
              </DialogHeader>
              <p>
                Are you sure you want to delete "{taskToDelete?.title}"? This
                action cannot be undone.
              </p>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteTask}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
