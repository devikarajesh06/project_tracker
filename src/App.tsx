import React, { useState } from 'react';

// Define types
type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done';
type Priority = 'critical' | 'high' | 'medium' | 'low';

interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  priority: Priority;
  assignee: string;
  dueDate: string;
}

// Generate sample data
const generateTasks = (): Task[] => {
  const tasks: Task[] = [];
  const titles = ['Fix login bug', 'Design dashboard', 'Write docs', 'Code review', 'Update API', 'Test feature', 'Deploy app', 'Create mockups'];
  const assignees = ['Alice Chen', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown'];
  const priorities: Priority[] = ['critical', 'high', 'medium', 'low'];
  const statuses: TaskStatus[] = ['todo', 'in-progress', 'in-review', 'done'];
  
  for (let i = 1; i <= 100; i++) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 20) - 10);
    tasks.push({
      id: i,
      title: `${titles[i % titles.length]} ${i}`,
      status: statuses[i % 4],
      priority: priorities[i % 4],
      assignee: assignees[i % 5],
      dueDate: dueDate.toISOString().split('T')[0]
    });
  }
  return tasks;
};

// Styles
const styles = {
  app: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '24px 32px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  title: {
    color: 'white',
    fontSize: '28px',
    margin: 0,
    fontWeight: 'bold' as const,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: '4px',
    fontSize: '14px',
  },
  nav: {
    background: 'white',
    padding: '12px 32px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    borderBottom: '1px solid #e5e7eb',
  },
  navContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    gap: '12px',
  },
  button: {
    padding: '8px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  buttonActive: {
    background: '#667eea',
    color: 'white',
  },
  buttonInactive: {
    background: '#e5e7eb',
    color: '#374151',
  },
  container: {
    maxWidth: '1400px',
    margin: '32px auto',
    padding: '0 32px',
  },
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  column: {
    background: '#f8fafc',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    height: 'calc(100vh - 220px)',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  columnHeader: (color: string) => ({
    background: color,
    borderRadius: '12px',
    padding: '12px',
    marginBottom: '16px',
    color: 'white',
  }),
  columnHeaderContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  columnTitle: {
    fontWeight: 'bold',
    fontSize: '16px',
  },
  columnCount: {
    background: 'rgba(255,255,255,0.2)',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
  },
  tasksContainer: {
    overflowY: 'auto' as const,
    flex: 1,
    paddingRight: '4px',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '14px',
    marginBottom: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
    cursor: 'grab',
    transition: 'all 0.2s',
  },
  cardTitle: {
    fontWeight: 600,
    marginBottom: '12px',
    color: '#1f2937',
    fontSize: '14px',
  },
  cardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  avatar: (name: string) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    return {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: colors[name.length % colors.length],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '12px',
      fontWeight: 'bold',
    };
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#9ca3af',
    fontSize: '14px',
    border: '2px dashed #e5e7eb',
    borderRadius: '12px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  th: {
    padding: '16px',
    textAlign: 'left' as const,
    background: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    fontWeight: 600,
    cursor: 'pointer',
  },
  td: {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
  },
  select: {
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    background: 'white',
    cursor: 'pointer',
  },
};

function App() {
  const [tasks, setTasks] = useState<Task[]>(generateTasks());
  const [view, setView] = useState<'board' | 'list'>('board');

  const updateTaskStatus = (taskId: number, newStatus: TaskStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const columns = [
    { id: 'todo' as const, title: '📋 To Do', color: '#64748b' },
    { id: 'in-progress' as const, title: '⚡ In Progress', color: '#3b82f6' },
    { id: 'in-review' as const, title: '👀 In Review', color: '#8b5cf6' },
    { id: 'done' as const, title: '✅ Done', color: '#10b981' }
  ];

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const getPriorityStyle = (priority: Priority) => {
    const priorityColors = {
      critical: { bg: '#dc2626', color: 'white', icon: '🔴' },
      high: { bg: '#f97316', color: 'white', icon: '🟠' },
      medium: { bg: '#eab308', color: 'white', icon: '🟡' },
      low: { bg: '#22c55e', color: 'white', icon: '🟢' },
    };
    return priorityColors[priority];
  };

  const getDueDateStyle = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return { bg: '#fef3c7', color: '#92400e', text: 'Due Today', icon: '📅' };
    if (diffDays < 0) return { bg: '#fee2e2', color: '#991b1b', text: `${Math.abs(diffDays)} days late`, icon: '⚠️' };
    if (diffDays <= 3) return { bg: '#fed7aa', color: '#9a3412', text: `${diffDays} days left`, icon: '⏰' };
    return { bg: '#f3f4f6', color: '#4b5563', text: dueDate, icon: '📅' };
  };

  const TaskCard = ({ task, onDragStart }: { task: Task; onDragStart: (id: number) => void }) => {
    const priorityStyle = getPriorityStyle(task.priority);
    const dueDateStyle = getDueDateStyle(task.dueDate);
    const avatarStyle = styles.avatar(task.assignee);

    return (
      <div
        draggable
        onDragStart={() => onDragStart(task.id)}
        style={styles.card}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        }}
      >
        <div style={styles.cardTitle}>{task.title}</div>
        
        <div style={styles.cardRow}>
          <div style={{
            background: priorityStyle.bg,
            color: priorityStyle.color,
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <span>{priorityStyle.icon}</span>
            <span>{task.priority}</span>
          </div>
          
          <div style={avatarStyle}>
            {getInitials(task.assignee)}
          </div>
        </div>
        
        <div style={{
          background: dueDateStyle.bg,
          color: dueDateStyle.color,
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '11px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <span>{dueDateStyle.icon}</span>
          <span>{dueDateStyle.text}</span>
        </div>
      </div>
    );
  };

  const BoardView = () => {
    const [draggedTask, setDraggedTask] = useState<number | null>(null);

    const handleDragStart = (taskId: number) => setDraggedTask(taskId);
    const handleDrop = (newStatus: TaskStatus) => {
      if (draggedTask) {
        updateTaskStatus(draggedTask, newStatus);
        setDraggedTask(null);
      }
    };

    return (
      <div style={styles.board}>
        {columns.map(col => (
          <div
            key={col.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(col.id)}
            style={styles.column}
          >
            <div style={styles.columnHeader(col.color)}>
              <div style={styles.columnHeaderContent}>
                <span style={styles.columnTitle}>{col.title}</span>
                <span style={styles.columnCount}>
                  {tasks.filter(t => t.status === col.id).length}
                </span>
              </div>
            </div>
            
            <div style={styles.tasksContainer}>
              {tasks.filter(t => t.status === col.id).map(task => (
                <TaskCard key={task.id} task={task} onDragStart={handleDragStart} />
              ))}
              {tasks.filter(t => t.status === col.id).length === 0 && (
                <div style={styles.emptyState}>
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const ListView = () => {
    const [sortBy, setSortBy] = useState<'title' | 'priority' | 'dueDate'>('dueDate');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const sortedTasks = [...tasks].sort((a, b) => {
      if (sortBy === 'title') {
        return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      }
      if (sortBy === 'priority') {
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        const aVal = order[a.priority];
        const bVal = order[b.priority];
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const aDate = new Date(a.dueDate).getTime();
      const bDate = new Date(b.dueDate).getTime();
      return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
    });

    const handleSort = (field: 'title' | 'priority' | 'dueDate') => {
      if (sortBy === field) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(field);
        setSortOrder('asc');
      }
    };

    const getPriorityBadgeStyle = (priority: Priority) => {
      const styles = {
        critical: { bg: '#dc2626', color: 'white' },
        high: { bg: '#f97316', color: 'white' },
        medium: { bg: '#eab308', color: 'white' },
        low: { bg: '#22c55e', color: 'white' }
      };
      return styles[priority];
    };

    return (
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th} onClick={() => handleSort('title')}>
              Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th style={styles.th}>Status</th>
            <th style={styles.th} onClick={() => handleSort('priority')}>
              Priority {sortBy === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th style={styles.th}>Assignee</th>
            <th style={styles.th} onClick={() => handleSort('dueDate')}>
              Due Date {sortBy === 'dueDate' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map(task => {
            const priorityStyle = getPriorityBadgeStyle(task.priority);
            return (
              <tr key={task.id}>
                <td style={styles.td}>{task.title}</td>
                <td style={styles.td}>
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                    style={styles.select}
                  >
                    <option value="todo">📋 To Do</option>
                    <option value="in-progress">⚡ In Progress</option>
                    <option value="in-review">👀 In Review</option>
                    <option value="done">✅ Done</option>
                  </select>
                </td>
                <td style={styles.td}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    background: priorityStyle.bg,
                    color: priorityStyle.color,
                  }}>
                    {task.priority}
                  </span>
                </td>
                <td style={styles.td}>{task.assignee}</td>
                <td style={styles.td}>{task.dueDate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>✨ ProjectFlow</h1>
          <p style={styles.subtitle}>Beautiful task management for modern teams</p>
        </div>
      </header>

      <div style={styles.nav}>
        <div style={styles.navContent}>
          <button
            onClick={() => setView('board')}
            style={{
              ...styles.button,
              ...(view === 'board' ? styles.buttonActive : styles.buttonInactive),
            }}
          >
            📋 Board View
          </button>
          <button
            onClick={() => setView('list')}
            style={{
              ...styles.button,
              ...(view === 'list' ? styles.buttonActive : styles.buttonInactive),
            }}
          >
            📝 List View
          </button>
        </div>
      </div>

      <div style={styles.container}>
        {view === 'board' ? <BoardView /> : <ListView />}
      </div>
    </div>
  );
}

export default App;