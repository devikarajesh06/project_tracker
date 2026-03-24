import React, { useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { VirtualScroll } from './VirtualScroll';
import { Task, TaskStatus } from '../../types';

// Move priorityOrder outside component
const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

// Custom SVG Icons
const ChevronUpIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

type SortField = 'title' | 'priority' | 'dueDate';
type SortDirection = 'asc' | 'desc';

export const ListView: React.FC = () => {
  const { tasks, updateTaskStatus } = useStore();
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const filteredTasks = useMemo(() => {
    const state = useStore.getState();
    const { filters } = state;
    
    return tasks.filter(task => {
      if (filters.statuses.length > 0 && !filters.statuses.includes(task.status)) {
        return false;
      }
      if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
        return false;
      }
      if (filters.assignees.length > 0 && !filters.assignees.includes(task.assignee)) {
        return false;
      }
      if (filters.dateRange.from && task.dueDate < filters.dateRange.from) {
        return false;
      }
      if (filters.dateRange.to && task.dueDate > filters.dateRange.to) {
        return false;
      }
      return true;
    });
  }, [tasks]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortField === 'priority') {
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortField === 'dueDate') {
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredTasks, sortField, sortDirection]);

  // Rest of your component remains the same...
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUpIcon className="w-4 h-4" /> : 
      <ChevronDownIcon className="w-4 h-4" />;
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus);
  };

  const formatDueDate = (date: string) => {
    const today = new Date();
    const dueDate = new Date(date);
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due Today';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    return dueDate.toLocaleDateString();
  };

  const renderRow = (task: Task, index: number) => (
    <div key={task.id} className="grid grid-cols-12 gap-4 p-3 border-b hover:bg-gray-50 items-center">
      <div className="col-span-4 font-medium truncate" title={task.title}>
        {task.title}
      </div>
      <div className="col-span-2">
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
          className="px-2 py-1 border rounded text-sm w-full"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="in-review">In Review</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div className="col-span-2">
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          task.priority === 'critical' ? 'bg-red-100 text-red-800' :
          task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {task.priority}
        </span>
      </div>
      <div className="col-span-2 truncate" title={task.assignee}>
        {task.assignee}
      </div>
      <div className="col-span-2">
        <span className={new Date(task.dueDate) < new Date() ? 'text-red-600 font-medium' : 'text-gray-600'}>
          {formatDueDate(task.dueDate)}
        </span>
      </div>
    </div>
  );

  if (sortedTasks.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 mb-4">No tasks match your filters</div>
        <button
          onClick={() => useStore.getState().clearFilters()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-12 gap-4 p-3 bg-gray-100 font-semibold rounded-t-lg border-b">
        <button onClick={() => handleSort('title')} className="col-span-4 text-left flex items-center gap-1 hover:text-blue-600">
          Title <SortIcon field="title" />
        </button>
        <div className="col-span-2">Status</div>
        <button onClick={() => handleSort('priority')} className="col-span-2 text-left flex items-center gap-1 hover:text-blue-600">
          Priority <SortIcon field="priority" />
        </button>
        <div className="col-span-2">Assignee</div>
        <button onClick={() => handleSort('dueDate')} className="col-span-2 text-left flex items-center gap-1 hover:text-blue-600">
          Due Date <SortIcon field="dueDate" />
        </button>
      </div>
      
      <VirtualScroll
        items={sortedTasks}
        height={600}
        itemHeight={60}
        renderItem={renderRow}
      />
    </div>
  );
};