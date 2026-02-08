import { useNavigate } from 'react-router-dom';
import type { TaskResponse } from '../types';
import styles from './TaskCard.module.css';

interface Props {
  task: TaskResponse;
  onToggle: (id: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onToggle, onDelete }: Props) {
  const navigate = useNavigate();

  const isOverdue =
    task.dueDate && !task.isCompleted && new Date(task.dueDate) < new Date();

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className={`${styles.card} ${task.isCompleted ? styles['card--completed'] : ''}`}>
      <input
        type="checkbox"
        className={styles.card__checkbox}
        checked={task.isCompleted}
        onChange={() => onToggle(task.id, !task.isCompleted)}
        aria-label={`Mark "${task.title}" as ${task.isCompleted ? 'incomplete' : 'complete'}`}
      />

      <div className={styles.card__body}>
        <h3 className={styles.card__title}>{task.title}</h3>

        {task.description && (
          <p className={styles.card__description}>{task.description}</p>
        )}

        <div className={styles.card__meta}>
          {task.priority && (
            <span
              className={`${styles.badge} ${
                styles[`badge--${task.priority.toLowerCase()}`]
              }`}
            >
              {task.priority}
            </span>
          )}

          {task.dueDate && (
            <span className={isOverdue ? styles['card__due--overdue'] : ''}>
              Due: {formatDate(task.dueDate)}
            </span>
          )}

          <span>Created: {formatDate(task.createdAt)}</span>
        </div>
      </div>

      <div className={styles.card__actions}>
        <button
          className={styles['card__action-btn']}
          onClick={() => navigate(`/tasks/${task.id}/edit`)}
        >
          Edit
        </button>
        <button
          className={`${styles['card__action-btn']} ${styles['card__action-btn--delete']}`}
          onClick={() => {
            if (window.confirm(`Delete "${task.title}"?`)) {
              onDelete(task.id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
