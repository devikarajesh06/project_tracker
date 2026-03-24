import { Task, TaskStatus, Priority } from '../types';

const assignees = [
  'Alice Chen', 'Bob Smith', 'Carol Davis', 
  'David Wilson', 'Emma Brown', 'Frank Miller'
];

const priorities: Priority[] = ['critical', 'high', 'medium', 'low'];
const statuses: TaskStatus[] = ['todo', 'in-progress', 'in-review', 'done'];

const titles = [
  'Fix login bug', 'Design dashboard', 'Write documentation', 'Code review',
  'Update API', 'Test feature', 'Deploy to production', 'Create mockups',
  'User research', 'Performance optimization', 'Security audit', 'Team meeting',
  'Database migration', 'UI redesign', 'Bug fixes', 'Feature implementation'
];

export function generateTasks(count: number): Task[] {
  const tasks: Task[] = [];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + Math.floor(Math.random() * 30) - 10);
    
    tasks.push({
      id: `task-${i + 1}`,
      title: titles[Math.floor(Math.random() * titles.length)] + ` ${i + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      assignee: assignees[Math.floor(Math.random() * assignees.length)],
      dueDate: dueDate.toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    });
  }
  
  return tasks;
}