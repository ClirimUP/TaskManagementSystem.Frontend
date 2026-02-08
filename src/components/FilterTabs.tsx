import type { TaskStatusFilter } from '../types';
import styles from './FilterTabs.module.css';

const FILTERS: TaskStatusFilter[] = ['All', 'Active', 'Completed'];

interface Props {
  current: TaskStatusFilter;
  onChange: (filter: TaskStatusFilter) => void;
}

export default function FilterTabs({ current, onChange }: Props) {
  return (
    <div className={styles.tabs}>
      {FILTERS.map((f) => (
        <button
          key={f}
          className={`${styles.tabs__btn} ${f === current ? styles['tabs__btn--active'] : ''}`}
          onClick={() => onChange(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
