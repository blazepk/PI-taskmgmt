import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type TaskHeaderProps = {
  onAddClick: () => void;
};

export const TaskHeader: React.FC<TaskHeaderProps> = ({ onAddClick }) => (
  <div className="flex justify-between items-center">
    <h1 className="text-3xl font-bold">Task Management Dashboard</h1>
    <Button onClick={onAddClick}>
      <Plus className="mr-2 h-4 w-4" /> Add Task
    </Button>
  </div>
);
