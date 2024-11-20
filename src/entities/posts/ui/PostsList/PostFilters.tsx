import { Input, Select } from '../../../../shared/ui';
import styles from './PostFilters.module.scss';

interface PostFiltersProps {
  filters: {
    search: string;
    tags: string[];
    published?: 'all' | 'published' | 'unpublished';
    author?: string;
  };
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTagChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const PostFilters: React.FC<PostFiltersProps> = ({
  filters,
  onSearchChange,
  onTagChange,
  onFilterChange,
}) => (
  <div className={styles.filters}>
    <Input
      type="text"
      name="search"
      placeholder="Поиск по заголовку/подзаголовку"
      value={filters.search}
      onChange={onSearchChange}
      className={styles.searchInput}
    />
    <Input
      type="text"
      name="tags"
      placeholder="Фильтр по тегам (через запятую)"
      value={filters.tags.join(', ')}
      onChange={onTagChange}
      className={styles.tagInput}
    />
    <Select
      name="published"
      value={filters.published || 'all'}
      onChange={onFilterChange}
      options={[
        { value: 'published', label: 'Опубликовано' },
        { value: 'unpublished', label: 'Не опубликовано' },
        { value: 'all', label: 'Все' },
      ]}
      className={styles.selectInput}
    />
    <Input
      type="text"
      name="author"
      placeholder="Фильтр по автору"
      value={filters.author || ''}
      onChange={onFilterChange}
      className={styles.authorInput}
    />
  </div>
);

export default PostFilters;
