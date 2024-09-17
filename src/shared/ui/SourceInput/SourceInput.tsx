import { useState } from 'react';

import styles from './SourceInput.module.css';

type Source = {
  name: string;
  link: string;
};

type SourceInputProps = {
  sources: Source[];
  onChange: (sources: Source[]) => void;
};

export const SourceInput: React.FC<SourceInputProps> = ({
  sources,
  onChange,
}) => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  const handleAddSource = () => {
    if (name.trim() && link.trim()) {
      onChange([...sources, { name, link }]);
      setName('');
      setLink('');
    }
  };

  const handleRemoveSource = (index: number) => {
    const updatedSources = sources.filter((_, i) => i !== index);
    onChange(updatedSources);
  };

  return (
    <div className={styles.sourceInputContainer}>
      {sources.map((source, index) => (
        <div key={index} className={styles.sourceItem}>
          <span>{source.name}</span>
          <a href={source.link} target="_blank" rel="noopener noreferrer">
            {source.link}
          </a>
          <button
            type="button"
            className={styles.removeSourceButton}
            onClick={() => handleRemoveSource(index)}
          >
            &times;
          </button>
        </div>
      ))}

      <div className={styles.sourceForm}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название источника"
          className={styles.input}
        />
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Ссылка на источник"
          className={styles.input}
        />
        <button
          type="button"
          onClick={handleAddSource}
          className={styles.addButton}
        >
          Добавить
        </button>
      </div>
    </div>
  );
};
