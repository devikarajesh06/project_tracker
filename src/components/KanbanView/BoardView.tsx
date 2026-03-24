import React from 'react';
import { useStore } from '../../store/useStore';
import { KanbanColumn } from './KanbanColumn';
import { TaskStatus } from '../../types';

export const KanbanView: React.FC = () => {
  const { tasks, updateTaskStatus } = useStore();
  const [draggingTaskId, setDraggingTaskId] = React.useState<string | null>(null);

  const columns = [
    { title: 'To Do', status: 'todo' as TaskStatus },
    { title: 'In Progress', status: 'in-progress' as TaskStatus },
    { title: 'In Review', status: 'in-review' as TaskStatus },
    { title: 'Done', status: 'done' as TaskStatus }
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    const state = useStore.getState();
    const { filters } = state;
    
    return tasks.filter(task => {
      if (task.status !== status) return false;
      // Apply filters
      if (filters.statuses.length > 0 && !filters.statuses.includes(task.status)) return false;
      if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) return false;
      if (filters.assignees.length > 0 && !filters.assignees.includes(task.assignee)) return false;
      if (filters.dateRange.from && task.dueDate < filters.dateRange.from) return false;
      if (filters.dateRange.to && task.dueDate > filters.dateRange.to) return false;
      return true;
    });
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggingTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    updateTaskStatus(taskId, newStatus);
    setDraggingTaskId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map(column => (
        <KanbanColumn
          key={column.status}
          title={column.title}
          status={column.status}
          tasks={getTasksByStatus(column.status)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          draggingTaskId={draggingTaskId}
        />
      ))}
    </div>
  );
};