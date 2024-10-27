import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ControlPanelProps {
  filterStatus: string;
  sortOrder: "asc" | "desc";
  searchQuery: string;
  onFilterChange: (status: string) => void;
  onSortChange: (order: "asc" | "desc") => void;
  onSearchChange: (query: string) => void;
  onCreateClick: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  filterStatus,
  sortOrder,
  searchQuery,
  onFilterChange,
  onSortChange,
  onSearchChange,
  onCreateClick,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search tasks..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Select value={filterStatus} onValueChange={onFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tasks</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortOrder} onValueChange={onSortChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sort by due date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Due Date (Earliest)</SelectItem>
          <SelectItem value="desc">Due Date (Latest)</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={onCreateClick}>Create New Task</Button>
    </div>
  );
};
