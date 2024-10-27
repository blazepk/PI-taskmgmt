import React, { useState } from "react";
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
  searchQuery: string;
  onFilterChange: (status: string) => void;
  onSortChange: (order: "asc" | "desc") => void;
  onSearchChange: (query: string) => void;
  onCreateClick: () => void;
  updateDrag: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  filterStatus,
  searchQuery,
  onFilterChange,
  onSortChange,
  onSearchChange,
  onCreateClick,
  updateDrag,
}) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
          <Input
            placeholder="Search tasks..."
            className="w-full pl-10 h-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              updateDrag();
            }}
          />
        </div>

        <div className="w-full">
          <Select
            value={filterStatus}
            onValueChange={(value) => {
              onFilterChange(value);

              updateDrag();
            }}
          >
            <SelectTrigger className="w-full h-10 bg-gray-50 border-gray-200 hover:bg-gray-100">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <Select
            value={sortOrder}
            onValueChange={(valueProps: "asc" | "desc") => {
              onSortChange(valueProps);
              setSortOrder(valueProps);
              updateDrag();
            }}
          >
            <SelectTrigger className="w-full h-10 bg-gray-50 border-gray-200 hover:bg-gray-100">
              <SelectValue placeholder="Sort by due date" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="asc">Due Date (Earliest)</SelectItem>
              <SelectItem value="desc">Due Date (Latest)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={onCreateClick}
          className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
        >
          Create New Task
        </Button>
      </div>
    </div>
  );
};

export default ControlPanel;
