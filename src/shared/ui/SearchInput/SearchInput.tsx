import { Input } from '..';

import styles from './SearchInput.module.scss';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
}) => {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Поиск по имени или email"
      className={styles.searchInput}
    />
  );
};
