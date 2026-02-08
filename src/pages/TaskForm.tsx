import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTasks } from '../context/TasksContext';
import { getTask } from '../api/tasksApi';
import type { Priority } from '../types';
import styles from './TaskForm.module.css';

interface FormErrors {
  title?: string;
  description?: string;
  dueDate?: string;
}

export default function TaskForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { createTask, updateTask, submitLoading, error, clearError } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!isEdit || !id) return;
    let cancelled = false;

    (async () => {
      try {
        const task = await getTask(id);
        if (cancelled) return;
        setTitle(task.title);
        setDescription(task.description ?? '');
        setPriority(task.priority ?? 'Medium');
        setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
      } catch {
        if (!cancelled) navigate('/tasks');
      } finally {
        if (!cancelled) setFetchLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, isEdit, navigate]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!title.trim()) {
      next.title = 'Title is required.';
    } else if (title.trim().length < 3) {
      next.title = 'Title must be at least 3 characters.';
    } else if (title.trim().length > 120) {
      next.title = 'Title must not exceed 120 characters.';
    }

    if (description.length > 2000) {
      next.description = 'Description must not exceed 2000 characters.';
    }

    if (dueDate) {
      const parsed = new Date(dueDate);
      if (isNaN(parsed.getTime())) {
        next.dueDate = 'Please enter a valid date.';
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      priority: priority as Priority,
      dueDate: dueDate ? `${dueDate}T00:00:00.000Z` : null,
    };

    let success: boolean;
    if (isEdit && id) {
      success = await updateTask(id, payload);
    } else {
      success = await createTask(payload);
    }

    if (success) navigate('/tasks');
  };

  if (fetchLoading) {
    return <div className={styles.form__loading}>Loading task...</div>;
  }

  return (
    <div className={styles['form-page']}>
      <h1 className={styles['form-page__title']}>
        {isEdit ? 'Edit Task' : 'New Task'}
      </h1>

      {error && <div className={styles['form__api-error']}>{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.form__group}>
          <label className={styles.form__label} htmlFor="title">
            Title *
          </label>
          <input
            id="title"
            className={`${styles.form__input} ${errors.title ? styles['form__input--error'] : ''}`}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            autoFocus
          />
          {errors.title && <div className={styles['form__error-text']}>{errors.title}</div>}
        </div>

        <div className={styles.form__group}>
          <label className={styles.form__label} htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className={`${styles.form__textarea} ${
              errors.description ? styles['form__input--error'] : ''
            }`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            rows={4}
          />
          {errors.description && (
            <div className={styles['form__error-text']}>{errors.description}</div>
          )}
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.2rem' }}>
            {description.length} / 2000
          </div>
        </div>

        <div className={styles.form__group}>
          <label className={styles.form__label} htmlFor="priority">
            Priority
          </label>
          <select
            id="priority"
            className={styles.form__select}
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className={styles.form__group}>
          <label className={styles.form__label} htmlFor="dueDate">
            Due Date
          </label>
          <input
            id="dueDate"
            className={`${styles.form__input} ${errors.dueDate ? styles['form__input--error'] : ''}`}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          {errors.dueDate && <div className={styles['form__error-text']}>{errors.dueDate}</div>}
        </div>

        <div className={styles.form__actions}>
          <button
            type="submit"
            className={`${styles.form__btn} ${styles['form__btn--primary']}`}
            disabled={submitLoading}
          >
            {submitLoading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Task'}
          </button>
          <button
            type="button"
            className={styles.form__btn}
            onClick={() => navigate('/tasks')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
