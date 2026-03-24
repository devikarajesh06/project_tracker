import React, { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  color: string;
}

const mockUsers: User[] = [
  { id: 'user1', name: 'Alice', color: 'bg-pink-500' },
  { id: 'user2', name: 'Bob', color: 'bg-blue-500' },
  { id: 'user3', name: 'Carol', color: 'bg-green-500' },
  { id: 'user4', name: 'David', color: 'bg-purple-500' }
];

export const CollaborationIndicators: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  // Remove unused userTasks state or use it
  const [, setUserTasks] = useState<Record<string, string>>({});

  useEffect(() => {
    const tasks = ['task-1', 'task-2', 'task-3', 'task-4', 'task-5'];
    
    const interval = setInterval(() => {
      const newUserTasks: Record<string, string> = {};
      const numActive = Math.floor(Math.random() * 3) + 2;
      const randomUsers = [...mockUsers].sort(() => 0.5 - Math.random()).slice(0, numActive);
      
      randomUsers.forEach(user => {
        const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
        newUserTasks[user.id] = randomTask;
      });
      
      setActiveUsers(randomUsers);
      setUserTasks(newUserTasks); // Now it's used
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white border-b px-4 py-2 flex items-center gap-2">
      <span className="text-sm text-gray-600">
        {activeUsers.length} {activeUsers.length === 1 ? 'person is' : 'people are'} viewing this board
      </span>
      <div className="flex gap-1">
        {activeUsers.map(user => (
          <div
            key={user.id}
            className={`w-8 h-8 rounded-full ${user.color} text-white flex items-center justify-center text-sm`}
            title={user.name}
          >
            {user.name[0]}
          </div>
        ))}
      </div>
    </div>
  );
};