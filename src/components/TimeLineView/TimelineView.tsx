import React, { useRef, useEffect } from 'react'; // Removed useMemo
import { useStore } from '../../store/useStore';
import { Task } from '../../types';

export const TimelineView: React.FC = () => {
  const { tasks } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysInMonth = endOfMonth.getDate();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), i + 1);
    return date;
  });

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getTaskPosition = (task: Task) => {
    const startDate = task.startDate ? new Date(task.startDate) : new Date(task.dueDate);
    const dueDate = new Date(task.dueDate);
    
    const leftDays = Math.max(0, startDate.getDate() - 1);
    const leftPercent = (leftDays / daysInMonth) * 100;
    
    const widthDays = Math.max(1, dueDate.getDate() - startDate.getDate() + 1);
    const widthPercent = (widthDays / daysInMonth) * 100;
    
    return { left: `${leftPercent}%`, width: `${widthPercent}%` };
  };

  useEffect(() => {
    if (scrollRef.current) {
      const todayIndex = today.getDate() - 1;
      const scrollPosition = (todayIndex / daysInMonth) * scrollRef.current.scrollWidth;
      scrollRef.current.scrollLeft = scrollPosition - 200;
    }
  }, [today, daysInMonth]); // Added missing dependencies

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b bg-gray-50">
          <div className="flex">
            <div className="w-64 flex-shrink-0 p-3 font-semibold border-r bg-gray-50">
              Tasks
            </div>
            <div 
              ref={scrollRef}
              className="flex-1 overflow-x-auto"
              style={{ scrollBehavior: 'smooth' }}
            >
              <div className="flex min-w-max">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-16 p-3 text-center text-sm border-r ${
                      day.toDateString() === today.toDateString() 
                        ? 'bg-blue-50 text-blue-600 font-semibold' 
                        : 'text-gray-600'
                    }`}
                  >
                    <div>{day.getDate()}</div>
                    <div className="text-xs">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {tasks.map(task => {
            const { left, width } = getTaskPosition(task);
            
            return (
              <div key={task.id} className="flex border-b hover:bg-gray-50">
                <div className="w-64 flex-shrink-0 p-3 border-r">
                  <div className="font-medium text-sm">{task.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{task.assignee}</div>
                </div>
                
                <div className="flex-1 relative p-2">
                  <div className="relative h-12 bg-gray-100 rounded">
                    <div
                      className={`absolute h-full rounded ${getPriorityColor(task.priority)} opacity-75`}
                      style={{
                        left,
                        width,
                        top: 0,
                      }}
                    >
                      <div className="px-2 py-1 text-xs text-white truncate">
                        {task.title}
                      </div>
                    </div>
                    
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                      style={{
                        left: `${((today.getDate() - 1) / daysInMonth) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {tasks.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No tasks to display
        </div>
      )}
    </div>
  );
};