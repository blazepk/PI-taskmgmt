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
import { ArrowUpDown } from "lucide-react";

const emptyTaskForm: TaskFormData = {
  title: "",
  description: "",
  status: "pending",
  dueDate: "",
};

const INITIAL_SORT_ORDER = [
  {
    status: "pending",
    sort: "asc",
  },
  {
    status: "in-progress",
    sort: "asc",
  },
  {
    status: "completed",
    sort: "asc",
  },
];

export const DashboardComponent: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [isDragged, setIsDragged] = useState(false);
  const [taskForm, setTaskForm] = useState<TaskFormData>(emptyTaskForm);
  const [sortStatus, setSortStatus] = useState(INITIAL_SORT_ORDER);

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

  const mappedTasks = (dragged: boolean, status = "pending") => {
    const columnSort = sortStatus.find((item) => item.status === status);
    if (dragged) {
      return tasks.filter((task) => task.status === status);
    } else {
      return tasks
        .filter((task) => task.status === status)
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
          return columnSort.sort === "asc"
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        });
    }
  };

  const swapTasks = (
    fromTask: { id: number; status: "pending" | "in-progress" | "completed" },
    toTask: { id: number; status: "pending" | "in-progress" | "completed" }
  ) => {
    let taskList = tasks.slice();
    const fromIndex =
      taskList.findIndex((task) => task.id === fromTask.id) ?? -1;
    const toIndex = taskList.findIndex((task) => task.id === toTask.id) ?? -1;
    const isStatusUpdated = fromTask.status !== toTask.status;

    if (isStatusUpdated) {
      taskList = taskList.map((item) => {
        if (item.id === fromTask.id) {
          item.status = toTask.status;
          return item;
        }
        return item;
      });
      setTasks(taskList.filter((item) => item !== null));
      return;
    }

    if (fromIndex != -1 && toIndex != -1 && !isStatusUpdated) {
      const temp = taskList[fromIndex];
      taskList[fromIndex] = {
        ...taskList[toIndex],
      };
      taskList[toIndex] = { ...temp };
      setIsDragged(true);
      setTasks(taskList);
    }
  };

  const handleDragStart = (data) => (event) => {
    const fromTask = JSON.stringify({ id: data.id, status: data.status });
    event.dataTransfer.setData("dragContent", fromTask);
  };

  const handleDragOver = () => (event) => {
    event.preventDefault();
    return false;
  };

  const handleDrop = (data) => (event) => {
    event.preventDefault();
    const fromTask = JSON.parse(event.dataTransfer.getData("dragContent"));
    const toTask = { id: data.id, status: data.status } as {
      id: number;
      status: "pending" | "in-progress" | "completed";
    };
    swapTasks(fromTask, toTask);
    return false;
  };

  const handleSort = (status: "pending" | "in-progress" | "completed") => {
    setSortStatus((prev) => {
      const sortStatusValue = prev.find((item) => item.status === status);
      const newSortArray = prev.map((item) => {
        if (item.status === status) {
          item.sort = sortStatusValue.sort === "asc" ? "dsc" : "asc";
          return item;
        }
        return item;
      });
      return [...newSortArray];
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Task Management Dashboard
          </h1>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <ControlPanel
              filterStatus={filterStatus}
              searchQuery={searchQuery}
              updateDrag={() => setIsDragged(false)}
              onFilterChange={setFilterStatus}
              onSortChange={(value) => {
                const updatedSortStatus = INITIAL_SORT_ORDER.map((item) => ({
                  ...item,
                  sort: value,
                }));
                setSortStatus(updatedSortStatus);
              }}
              onSearchChange={setSearchQuery}
              onCreateClick={() => setShowTaskForm(true)}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending Column */}
            <div
              className="bg-gradient-to-b from-orange-50 to-orange-100 rounded-lg p-4 shadow-md min-h-[500px]"
              onDragOver={handleDragOver()}
              onDrop={handleDrop({ id: 123, status: "pending" })}
            >
              <h2 className="flex justify-around items-center text-lg font-semibold mb-4 p-2 bg-orange-400 text-white rounded-md text-center">
                <div className="flex-grow">Pending Tasks </div>
                <ArrowUpDown
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => handleSort("pending")}
                />
              </h2>
              <div className="flex flex-col gap-3">
                {mappedTasks(isDragged, "pending").map((task) => (
                  <div
                    key={task.id}
                    className="transform transition-all duration-200 hover:-translate-y-1 cursor-move"
                    draggable={true}
                    onDragStart={handleDragStart({
                      id: task.id,
                      status: "pending",
                    })}
                    onDragOver={handleDragOver()}
                    onDrop={handleDrop({ id: task.id, status: "pending" })}
                  >
                    <TaskCard
                      task={task}
                      onEdit={setEditingTask}
                      onDelete={(task) => {
                        setTaskToDelete(task);
                        setShowDeleteConfirm(true);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div
              className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg p-4 shadow-md min-h-[500px]"
              onDragOver={handleDragOver()}
              onDrop={handleDrop({ id: 456, status: "in-progress" })}
            >
              <h2 className="flex justify-around items-center text-lg font-semibold mb-4 p-2 bg-blue-400 text-white rounded-md text-center">
                <div className="flex-grow">In Progress </div>
                <ArrowUpDown
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => handleSort("in-progress")}
                />
              </h2>
              <div className="flex flex-col gap-3">
                {mappedTasks(isDragged, "in-progress").map((task) => (
                  <div
                    key={task.id}
                    className="transform transition-all duration-200 hover:-translate-y-1 cursor-move"
                    draggable={true}
                    onDragStart={handleDragStart({
                      id: task.id,
                      status: "in-progress",
                    })}
                    onDragOver={handleDragOver()}
                    onDrop={handleDrop({ id: task.id, status: "in-progress" })}
                  >
                    <TaskCard
                      task={task}
                      onEdit={setEditingTask}
                      onDelete={(task) => {
                        setTaskToDelete(task);
                        setShowDeleteConfirm(true);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Column */}
            <div
              className="bg-gradient-to-b from-green-50 to-green-100 rounded-lg p-4 shadow-md min-h-[500px]"
              onDragOver={handleDragOver()}
              onDrop={handleDrop({ id: 789, status: "completed" })}
            >
              <h2 className="flex justify-around items-center text-lg font-semibold mb-4 p-2 bg-green-400 text-white rounded-md text-center">
                <div className="flex-grow">Completed </div>
                <ArrowUpDown
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => handleSort("completed")}
                />
              </h2>
              <div className="flex flex-col gap-3">
                {mappedTasks(isDragged, "completed").map((task) => (
                  <div
                    key={task.id}
                    className="transform transition-all duration-200 hover:-translate-y-1 cursor-move"
                    draggable={true}
                    onDragStart={handleDragStart({
                      id: task.id,
                      status: "completed",
                    })}
                    onDragOver={handleDragOver()}
                    onDrop={handleDrop({ id: task.id, status: "completed" })}
                  >
                    <TaskCard
                      task={task}
                      onEdit={setEditingTask}
                      onDelete={(task) => {
                        setTaskToDelete(task);
                        setShowDeleteConfirm(true);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Task Form Dialog */}
          <Dialog
            open={showTaskForm || !!editingTask?.id}
            onOpenChange={() => {
              setShowTaskForm(false);
              setEditingTask(null);
              setTaskForm(emptyTaskForm);
            }}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {editingTask?.id ? "Edit Task" : "Create New Task"}
                </DialogTitle>
              </DialogHeader>
              <TaskForm
                data={editingTask || taskForm}
                // @ts-ignore
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
                  className="w-full sm:w-auto"
                >
                  {editingTask ? "Update Task" : "Create Task"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-red-600">
                  Delete Task
                </DialogTitle>
              </DialogHeader>
              <p className="text-gray-600">
                Are you sure you want to delete "{taskToDelete?.title}"? This
                action cannot be undone.
              </p>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteTask}
                  className="w-full sm:w-auto"
                >
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
