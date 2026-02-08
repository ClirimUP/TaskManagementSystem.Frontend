import { useEffect } from 'react';
import { useTasks } from '../context/TasksContext';
import FilterTabs from '../components/FilterTabs';
import TaskCard from '../components/TaskCard';
import styles from './TaskList.module.css';

export default function TaskList() {
  const {
    tasks,
    filter,
    listLoading,
    error,
    setFilter,
    loadTasks,
    toggleComplete,
    deleteTask,
    clearError,
  } = useTasks();

  useEffect(() => {
    loadTasks(filter);
  }, [filter, loadTasks]);

  return (
    <div>
      <div className={styles['task-list__header']}>
        <h1 className={styles['task-list__title']}>My Tasks</h1>
      </div>

      <FilterTabs current={filter} onChange={setFilter} />

      {error && (
        <div className={styles['task-list__error']}>
          <span>{error}</span>
          <button className={styles['task-list__error-close']} onClick={clearError}>
            &times;
          </button>
        </div>
      )}

      {listLoading ? (
        <div className={styles['task-list__loading']}>Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className={styles['task-list__empty']}>
          {filter === 'All'
            ? 'No tasks yet. Create one to get started!'
            : `No ${filter.toLowerCase()} tasks.`}
        </div>
      ) : (
        <div className={styles['task-list__grid']}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleComplete}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
