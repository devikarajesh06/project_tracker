import { create } from 'zustand';
import { Task, TaskStatus } from '../types';
import { generateTasks } from '../utils/dataGenerator';

interface FilterState {
  statuses: TaskStatus[];
  priorities: string[];
  assignees: string[];
  dateRange: { from: string; to: string };
}

interface AppState {
  tasks: Task[];
  filters: FilterState;
  view: 'kanban' | 'list' | 'timeline';
  setView: (view: 'kanban' | 'list' | 'timeline') => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
}

export const useStore = create<AppState>((set) => ({
  tasks: generateTasks(500), // Generate 500 tasks
  filters: {
    statuses: [],
    priorities: [],
    assignees: [],
    dateRange: { from: '', to: '' }
  },
  view: 'kanban',
  
  setView: (view) => set({ view }),
  
  updateTaskStatus: (taskId, newStatus) => 
    set((state) => ({
      tasks: state.tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    })),
    
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    })),
    
  clearFilters: () =>
    set({
      filters: {
        statuses: [],
        priorities: [],
        assignees: [],
        dateRange: { from: '', to: '' }
      }
    })
}));