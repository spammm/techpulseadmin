import {
  useState,
  KeyboardEvent,
  ChangeEvent,
  useCallback,
  useMemo,
  memo,
} from 'react';
import { MdClose } from 'react-icons/md';
import { Button, Input } from '..';
import styles from './TagInput.module.scss';

type TagInputProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
};

export const TagInput: React.FC<TagInputProps> = memo(
  ({ tags, onChange, placeholder = 'Добавить тег...' }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputValue.trim()) {
          event.preventDefault();
          const cleanedValue = inputValue.replace(/[\s_-]/g, '');
          const newTags = cleanedValue
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag);
          const uniqueTags = newTags.filter((tag) => !tags.includes(tag));

          if (uniqueTags.length > 0) {
            onChange([...tags, ...uniqueTags]);
            setInputValue('');
          }
        }
      },
      [inputValue, tags, onChange]
    );

    const handleRemoveTag = useCallback(
      (tag: string) => {
        onChange(tags.filter((t) => t !== tag));
      },
      [tags, onChange]
    );

    const handleInputChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
      },
      []
    );

    const renderedTags = useMemo(() => {
      return tags.map((tag, index) => (
        <span key={index} className={styles.tag}>
          {tag}
          <Button
            type="button"
            variant="icon"
            className={styles.removeTagButton}
            onClick={() => handleRemoveTag(tag)}
            aria-label={`Удалить тег ${tag}`}
          >
            <MdClose />
          </Button>
        </span>
      ));
    }, [tags, handleRemoveTag]);

    return (
      <div className={styles.tagInputContainer}>
        <div className={styles.tags}>{renderedTags}</div>
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={styles.tagInput}
          aria-label="Поле для добавления тега"
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.tags.length === nextProps.tags.length;
  }
);
