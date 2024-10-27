import React from "react";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
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
    <Card className="relative group hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="pr-20 text-lg font-semibold line-clamp-2">
          {task.title}
        </CardTitle>
        <div className="absolute top-4 right-4 flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            className="opacity-70 hover:opacity-100 hover:bg-gray-100"
          >
            <Edit className="h-4 w-4 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task)}
            className="opacity-70 hover:opacity-100 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-6 text-sm line-clamp-3 h-8">
          {task.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center bg-gray-50 rounded-full px-3 py-1">
            <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-x-2 bg-gray-50 rounded-full px-3 py-1">
            {task.status === "completed" ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : task.status === "in-progress" ? (
              <Clock className="w-5 h-5 text-yellow-500" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
            {task.status}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
