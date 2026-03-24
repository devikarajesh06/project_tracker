import React from 'react';
import './TaskCard.css';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  isDragging?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onDragStart, 
  onDragEnd,
  isDragging 
}) => {
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      default: return '🟢';
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const formatDueDate = (date: string) => {
    const today = new Date();
    const dueDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return { text: 'Due Today', icon: '📅', color: 'bg-yellow-100 text-yellow-800' };
    } else if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, icon: '⚠️', color: 'bg-red-100 text-red-800' };
    } else if (diffDays <= 3) {
      return { text: `Due in ${diffDays} days`, icon: '⏰', color: 'bg-orange-100 text-orange-800' };
    } else {
      return { text: dueDate.toLocaleDateString(), icon: '📅', color: 'bg-gray-100 text-gray-600' };
    }
  };

  const priorityClass = getPriorityColor(task.priority);
  const priorityIcon = getPriorityIcon(task.priority);
  const dueInfo = formatDueDate(task.dueDate);
  const avatarColor = getAvatarColor(task.assignee);
  const initials = getInitials(task.assignee);
  const taskNumber = task.id.split('-')[1] || task.id;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
      style={{
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'scale(0.98)' : 'scale(1)',
        transition: 'all 0.2s ease'
      }}
      className="bg-white rounded-lg shadow-md p-4 mb-3 cursor-move hover:shadow-lg border border-gray-200"
    >
      {/* Title */}
      <h4 className="font-bold text-gray-800 text-base mb-3">
        {task.title}
      </h4>
      
      {/* Priority and Assignee Row */}
      <div className="flex justify-between items-center mb-3">
        <div className={`${priorityClass} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
          <span>{priorityIcon}</span>
          <span className="capitalize">{task.priority}</span>
        </div>
        
        <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
          {initials}
        </div>
      </div>
      
      {/* Due Date */}
      <div className={`${dueInfo.color} px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1`}>
        <span>{dueInfo.icon}</span>
        <span>{dueInfo.text}</span>
      </div>
      
      {/* Task ID */}
      <div className="text-xs text-gray-400 mt-2">
        #{taskNumber}
      </div>
    </div>
  );
};