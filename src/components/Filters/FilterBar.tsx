import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { TaskStatus } from '../../types';

export const FilterBar: React.FC = () => {
  const { filters, setFilters, clearFilters, tasks } = useStore();
  
  const [localStatuses, setLocalStatuses] = useState<string[]>(filters.statuses);
  const [localPriorities, setLocalPriorities] = useState<string[]>(filters.priorities);
  const [localAssignees, setLocalAssignees] = useState<string[]>(filters.assignees);
  const [localFromDate, setLocalFromDate] = useState<string>(filters.dateRange.from);
  const [localToDate, setLocalToDate] = useState<string>(filters.dateRange.to);

  const updateURL = (newFilters: any) => {
    const params = new URLSearchParams();
    
    if (newFilters.statuses?.length) {
      params.set('statuses', newFilters.statuses.join(','));
    }
    if (newFilters.priorities?.length) {
      params.set('priorities', newFilters.priorities.join(','));
    }
    if (newFilters.assignees?.length) {
      params.set('assignees', newFilters.assignees.join(','));
    }
    if (newFilters.dateRange?.from) {
      params.set('from', newFilters.dateRange.from);
    }
    if (newFilters.dateRange?.to) {
      params.set('to', newFilters.dateRange.to);
    }
    
    const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.pushState({}, '', newURL);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    const urlStatuses = params.get('statuses')?.split(',') || [];
    const urlPriorities = params.get('priorities')?.split(',') || [];
    const urlAssignees = params.get('assignees')?.split(',') || [];
    const urlFrom = params.get('from') || '';
    const urlTo = params.get('to') || '';
    
    setLocalStatuses(urlStatuses);
    setLocalPriorities(urlPriorities);
    setLocalAssignees(urlAssignees);
    setLocalFromDate(urlFrom);
    setLocalToDate(urlTo);
    
    setFilters({
      statuses: urlStatuses as TaskStatus[],
      priorities: urlPriorities,
      assignees: urlAssignees,
      dateRange: { from: urlFrom, to: urlTo }
    });
  }, [setFilters]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      
      const urlStatuses = params.get('statuses')?.split(',') || [];
      const urlPriorities = params.get('priorities')?.split(',') || [];
      const urlAssignees = params.get('assignees')?.split(',') || [];
      const urlFrom = params.get('from') || '';
      const urlTo = params.get('to') || '';
      
      setLocalStatuses(urlStatuses);
      setLocalPriorities(urlPriorities);
      setLocalAssignees(urlAssignees);
      setLocalFromDate(urlFrom);
      setLocalToDate(urlTo);
      
      setFilters({
        statuses: urlStatuses as TaskStatus[],
        priorities: urlPriorities,
        assignees: urlAssignees,
        dateRange: { from: urlFrom, to: urlTo }
      });
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setFilters]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, opt => opt.value);
    setLocalStatuses(values);
    const newFilters = { ...filters, statuses: values as TaskStatus[] };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, opt => opt.value);
    setLocalPriorities(values);
    const newFilters = { ...filters, priorities: values };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, opt => opt.value);
    setLocalAssignees(values);
    const newFilters = { ...filters, assignees: values };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalFromDate(value);
    const newFilters = { 
      ...filters, 
      dateRange: { ...filters.dateRange, from: value } 
    };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalToDate(value);
    const newFilters = { 
      ...filters, 
      dateRange: { ...filters.dateRange, to: value } 
    };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleClearAll = () => {
    setLocalStatuses([]);
    setLocalPriorities([]);
    setLocalAssignees([]);
    setLocalFromDate('');
    setLocalToDate('');
    clearFilters();
    updateURL({
      statuses: [],
      priorities: [],
      assignees: [],
      dateRange: { from: '', to: '' }
    });
  };

  const uniqueAssignees = Array.from(new Set(tasks.map(t => t.assignee)));
  const hasActiveFilters = 
    localStatuses.length > 0 || 
    localPriorities.length > 0 || 
    localAssignees.length > 0 ||
    localFromDate ||
    localToDate;

  return (
    <div className="bg-white border-b shadow-sm sticky top-[57px] z-10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-gray-700">🔍 Filters</span>
          <span className="text-xs text-gray-400">|</span>
          <span className="text-xs text-gray-500">Apply filters to narrow down tasks</span>
        </div>
        
        <div className="flex gap-3 flex-wrap items-end">
          {/* Status Filter */}
          <div className="flex flex-col min-w-[130px]">
            <label className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <span>📌</span> Status
            </label>
            <select 
              multiple
              value={localStatuses}
              onChange={handleStatusChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              size={4}
            >
              <option value="todo">📋 To Do</option>
              <option value="in-progress">⚡ In Progress</option>
              <option value="in-review">👀 In Review</option>
              <option value="done">✅ Done</option>
            </select>
          </div>
          
          {/* Priority Filter */}
          <div className="flex flex-col min-w-[120px]">
            <label className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <span>⚠️</span> Priority
            </label>
            <select
              multiple
              value={localPriorities}
              onChange={handlePriorityChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              size={4}
            >
              <option value="critical">🔴 Critical</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>
          
          {/* Assignee Filter */}
          <div className="flex flex-col min-w-[140px]">
            <label className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <span>👤</span> Assignee
            </label>
            <select
              multiple
              value={localAssignees}
              onChange={handleAssigneeChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              size={4}
            >
              {uniqueAssignees.map(assignee => (
                <option key={assignee} value={assignee}>{assignee}</option>
              ))}
            </select>
          </div>
          
          {/* Date Range */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <span>📅</span> From Date
            </label>
            <input
              type="date"
              value={localFromDate}
              onChange={handleFromDateChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <span>📅</span> To Date
            </label>
            <input
              type="date"
              value={localToDate}
              onChange={handleToDateChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-colors shadow-sm"
            >
              ✖ Clear All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};