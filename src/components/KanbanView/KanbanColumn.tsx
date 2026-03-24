import React from 'react';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  draggingTaskId: string | null;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  tasks,
  onDragOver,
  onDrop,
  onDragStart,
  onDragEnd,
  draggingTaskId
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
    onDragOver(e);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(e, status);
  };

  const getColumnColor = () => {
    switch(status) {
      case 'todo': return 'border-t-4 border-t-gray-400';
      case 'in-progress': return 'border-t-4 border-t-blue-500';
      case 'in-review': return 'border-t-4 border-t-purple-500';
      case 'done': return 'border-t-4 border-t-green-500';
      default: return '';
    }
  };

  const getColumnBg = () => {
    return isDragOver ? 'bg-blue-50' : 'bg-gray-50';
  };

  return (
    <div
      className={`${getColumnBg()} ${getColumnColor()} rounded-lg p-4 min-w-[300px] max-h-[calc(100vh-200px)] flex flex-col shadow-sm transition-colors duration-200`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-700 text-lg">{title}</h3>
        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
          {tasks.length}
        </span>
      </div>
      
      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No tasks</p>
            <p className="text-xs mt-1">Drag tasks here</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isDragging={draggingTaskId === task.id}
            />
          ))
        )}
      </div>
    </div>
  );
};