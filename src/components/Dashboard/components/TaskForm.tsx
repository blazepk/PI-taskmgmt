import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskFormData } from "@/types/dashboard.types";

interface TaskFormProps {
  data: TaskFormData;
  onChange: (data: TaskFormData) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="dueDate">Due Date *</Label>
        <Input
          id="dueDate"
          type="date"
          value={data.dueDate}
          onChange={(e) => onChange({ ...data, dueDate: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={data.status}
          onValueChange={(value) =>
            onChange({ ...data, status: value as TaskFormData["status"] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
