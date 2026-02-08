import { createContext, useContext, useReducer, useCallback, useRef, type ReactNode } from 'react';
import type { TaskResponse, TaskStatusFilter, CreateTaskRequest, UpdateTaskRequest } from '../types';
import * as tasksApi from '../api/tasksApi';
import { parseApiError } from '../utils/errorParser';

/* ───── State ───── */

interface TasksState {
  tasks: TaskResponse[];
  filter: TaskStatusFilter;
  listLoading: boolean;
  submitLoading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  filter: 'All',
  listLoading: false,
  submitLoading: false,
  error: null,
};

/* ───── Actions ───── */

type TasksAction =
  | { type: 'SET_FILTER'; payload: TaskStatusFilter }
  | { type: 'LOAD_TASKS_REQUEST' }
  | { type: 'LOAD_TASKS_SUCCESS'; payload: TaskResponse[] }
  | { type: 'LOAD_TASKS_FAILURE'; payload: string }
  | { type: 'SUBMIT_REQUEST' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_FAILURE'; payload: string }
  | { type: 'DELETE_TASK_REQUEST' }
  | { type: 'DELETE_TASK_SUCCESS'; payload: string }
  | { type: 'DELETE_TASK_FAILURE'; payload: string }
  | { type: 'TOGGLE_COMPLETE_OPTIMISTIC'; payload: { id: string; isCompleted: boolean } }
  | { type: 'TOGGLE_COMPLETE_ROLLBACK'; payload: { id: string; isCompleted: boolean } }
  | { type: 'CLEAR_ERROR' };

/* ───── Reducer ───── */

function tasksReducer(state: TasksState, action: TasksAction): TasksState {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...state, filter: action.payload };

    case 'LOAD_TASKS_REQUEST':
      return { ...state, listLoading: true, error: null };
    case 'LOAD_TASKS_SUCCESS':
      return { ...state, listLoading: false, tasks: action.payload };
    case 'LOAD_TASKS_FAILURE':
      return { ...state, listLoading: false, error: action.payload };

    case 'SUBMIT_REQUEST':
      return { ...state, submitLoading: true, error: null };
    case 'SUBMIT_SUCCESS':
      return { ...state, submitLoading: false };
    case 'SUBMIT_FAILURE':
      return { ...state, submitLoading: false, error: action.payload };

    case 'DELETE_TASK_REQUEST':
      return { ...state, submitLoading: true, error: null };
    case 'DELETE_TASK_SUCCESS':
      return {
        ...state,
        submitLoading: false,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };
    case 'DELETE_TASK_FAILURE':
      return { ...state, submitLoading: false, error: action.payload };

    case 'TOGGLE_COMPLETE_OPTIMISTIC':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, isCompleted: action.payload.isCompleted } : t
        ),
      };
    case 'TOGGLE_COMPLETE_ROLLBACK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, isCompleted: action.payload.isCompleted } : t
        ),
        error: 'Failed to update task completion status.',
      };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

/* ───── Context ───── */

interface TasksContextValue extends TasksState {
  setFilter: (filter: TaskStatusFilter) => void;
  loadTasks: (filter?: TaskStatusFilter) => Promise<void>;
  createTask: (request: CreateTaskRequest) => Promise<boolean>;
  updateTask: (id: string, request: UpdateTaskRequest) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  toggleComplete: (id: string, isCompleted: boolean) => void;
  clearError: () => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

/* ───── Provider ───── */

export function TasksProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tasksReducer, initialState);
  const filterRef = useRef(state.filter);
  filterRef.current = state.filter;

  const setFilter = useCallback((filter: TaskStatusFilter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  const loadTasks = useCallback(async (filter: TaskStatusFilter = 'All') => {
    dispatch({ type: 'LOAD_TASKS_REQUEST' });
    try {
      const tasks = await tasksApi.getTasks(filter);
      dispatch({ type: 'LOAD_TASKS_SUCCESS', payload: tasks });
    } catch (err) {
      dispatch({ type: 'LOAD_TASKS_FAILURE', payload: parseApiError(err) });
    }
  }, []);

  const refetch = useCallback(async () => {
    try {
      const tasks = await tasksApi.getTasks(filterRef.current);
      dispatch({ type: 'LOAD_TASKS_SUCCESS', payload: tasks });
    } catch {
      /* silent — list will refresh on next navigation */
    }
  }, []);

  const createTask = useCallback(async (request: CreateTaskRequest): Promise<boolean> => {
    dispatch({ type: 'SUBMIT_REQUEST' });
    try {
      await tasksApi.createTask(request);
      dispatch({ type: 'SUBMIT_SUCCESS' });
      return true;
    } catch (err) {
      dispatch({ type: 'SUBMIT_FAILURE', payload: parseApiError(err) });
      return false;
    }
  }, []);

  const updateTask = useCallback(async (id: string, request: UpdateTaskRequest): Promise<boolean> => {
    dispatch({ type: 'SUBMIT_REQUEST' });
    try {
      await tasksApi.updateTask(id, request);
      dispatch({ type: 'SUBMIT_SUCCESS' });
      return true;
    } catch (err) {
      dispatch({ type: 'SUBMIT_FAILURE', payload: parseApiError(err) });
      return false;
    }
  }, []);

  const deleteTaskAction = useCallback(async (id: string): Promise<boolean> => {
    dispatch({ type: 'DELETE_TASK_REQUEST' });
    try {
      await tasksApi.deleteTask(id);
      dispatch({ type: 'DELETE_TASK_SUCCESS', payload: id });
      return true;
    } catch (err) {
      dispatch({ type: 'DELETE_TASK_FAILURE', payload: parseApiError(err) });
      return false;
    }
  }, []);

  const toggleComplete = useCallback((id: string, isCompleted: boolean) => {
    const previous = !isCompleted;
    dispatch({ type: 'TOGGLE_COMPLETE_OPTIMISTIC', payload: { id, isCompleted } });

    tasksApi.toggleComplete(id, { isCompleted }).then(
      () => refetch(),
      () => dispatch({ type: 'TOGGLE_COMPLETE_ROLLBACK', payload: { id, isCompleted: previous } })
    );
  }, [refetch]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: TasksContextValue = {
    ...state,
    setFilter,
    loadTasks,
    createTask,
    updateTask,
    deleteTask: deleteTaskAction,
    toggleComplete,
    clearError,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

/* ───── Hook ───── */

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within a TasksProvider');
  return ctx;
}
