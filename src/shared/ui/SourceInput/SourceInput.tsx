import { useEffect, useState } from 'react';
import styles from './SourceInput.module.scss';
import { useAppDispatch, useAppSelector } from '../../model';
import { fetchSourcesThunk } from '../../model/store/sourcesSlice';

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
  const [suggestions, setSuggestions] = useState<Source[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dispatch = useAppDispatch();
  const {
    sources: predefinedSources,
    loading,
    loaded,
  } = useAppSelector((state) => state.sources);

  useEffect(() => {
    if (!loaded && !loading) {
      dispatch(fetchSourcesThunk());
    }
  }, [dispatch, loaded, loading]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputName = e.target.value;
    setName(inputName);

    if (inputName.trim()) {
      const filteredSuggestions = predefinedSources.filter((source) =>
        source.name.toLowerCase().includes(inputName.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setLink('');
    }
  };

  const handleSuggestionClick = (suggestion: Source) => {
    setName(suggestion.name);
    setLink(suggestion.link);
    setSuggestions([]);
    setShowSuggestions(false);
  };

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
          onChange={handleNameChange}
          placeholder="Название источника"
          className={styles.input}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 100);
          }}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className={styles.suggestionItem}
                onMouseDown={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
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
