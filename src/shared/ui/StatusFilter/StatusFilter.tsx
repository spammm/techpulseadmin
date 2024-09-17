import { Select } from '..';

import styles from './StatusFilter.module.scss';

type StatusOption = {
  label: string;
  value: string;
};

type StatusFilterProps<T extends string> = {
  status: T;
  setStatus: (status: T) => void;
  options: StatusOption[];
};

export const StatusFilter = <T extends string>({
  status,
  setStatus,
  options,
}: StatusFilterProps<T>) => {
  return (
    <Select
      options={options}
      value={status}
      onChange={(e) => setStatus(e.target.value as T)}
      className={styles.statusFilter}
    />
  );
};
