import { useState, KeyboardEvent, ChangeEvent } from 'react';
import { MdClose } from 'react-icons/md';
import { Button, Input } from '..';

import styles from './TagInput.module.scss';

type TagInputProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
};

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = 'Добавить тег...',
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      event.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        onChange([...tags, inputValue.trim()]);
        setInputValue('');
      }
    }
  };

  const handleRemoveTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className={styles.tagInputContainer}>
      <div className={styles.tags}>
        {tags.map((tag, index) => (
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
        ))}
      </div>
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
};
