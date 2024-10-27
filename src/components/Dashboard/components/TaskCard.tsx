import React from "react";
import { Calendar, Clock, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/dashboard.types";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="pr-8">{task.title}</CardTitle>
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(task)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{task.description}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {task.status}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
