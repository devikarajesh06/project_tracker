// Helper functions for drag and drop

export interface DragData {
  taskId: string;
  sourceColumn: string;
}

export const onDragStart = (e: React.DragEvent, taskId: string, sourceColumn: string) => {
  const dragData: DragData = {
    taskId,
    sourceColumn
  };
  e.dataTransfer.setData('application/json', JSON.stringify(dragData));
  e.dataTransfer.effectAllowed = 'move';
  
  // Add drag image styling
  if (e.target instanceof HTMLElement) {
    e.target.style.opacity = '0.5';
  }
};

export const onDragEnd = (e: React.DragEvent) => {
  if (e.target instanceof HTMLElement) {
    e.target.style.opacity = '';
  }
};

export const onDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
};

export const onDrop = (e: React.DragEvent, targetColumn: string, onTaskMove: (taskId: string, targetColumn: string) => void) => {
  e.preventDefault();
  
  try {
    const dragData: DragData = JSON.parse(e.dataTransfer.getData('application/json'));
    if (dragData.taskId && dragData.sourceColumn !== targetColumn) {
      onTaskMove(dragData.taskId, targetColumn);
    }
  } catch (error) {
    console.error('Failed to parse drag data:', error);
  }
};

// Touch support for mobile devices
export const onTouchStart = (e: React.TouchEvent, taskId: string, sourceColumn: string) => {
  // Store touch start data
  const touch = e.touches[0];
  const dragData: DragData = { taskId, sourceColumn };
  
  // You can store this in a ref or state
  window.sessionStorage.setItem('dragData', JSON.stringify(dragData));
};

export const onTouchMove = (e: React.TouchEvent) => {
  e.preventDefault();
  // Handle touch move logic here
};

export const onTouchEnd = (e: React.TouchEvent, targetColumn: string, onTaskMove: (taskId: string, targetColumn: string) => void) => {
  const dragDataStr = window.sessionStorage.getItem('dragData');
  if (dragDataStr) {
    try {
      const dragData: DragData = JSON.parse(dragDataStr);
      if (dragData.taskId && dragData.sourceColumn !== targetColumn) {
        onTaskMove(dragData.taskId, targetColumn);
      }
    } catch (error) {
      console.error('Failed to parse drag data:', error);
    }
    window.sessionStorage.removeItem('dragData');
  }
};