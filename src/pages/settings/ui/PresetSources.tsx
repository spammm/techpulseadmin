import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/model';
import {
  createSourceThunk,
  deleteSourceThunk,
  fetchSourcesThunk,
} from '../../../shared/model/store/sourcesSlice';
import { SourceInput } from '../../../shared/ui';
import { ISources } from '../../../shared/types/sources';

const PresetSources = () => {
  const dispatch = useAppDispatch();
  const { sources, loading, error } = useAppSelector((state) => state.sources);

  const prevSourcesRef = useRef<ISources[]>(sources);

  useEffect(() => {
    dispatch(fetchSourcesThunk());
  }, [dispatch]);

  useEffect(() => {
    prevSourcesRef.current = sources;
  }, [sources]);

  const handleChange = (newSources: ISources[]) => {
    const prevSources = prevSourcesRef.current;

    newSources.forEach((source) => {
      if (!prevSources.some((s) => s.id === source.id)) {
        dispatch(createSourceThunk(source));
      }
    });

    prevSources.forEach((source) => {
      if (!newSources.some((s) => s.id === source.id)) {
        if (typeof source.id === 'number') {
          dispatch(deleteSourceThunk(source.id));
        } else {
          console.error('Error: source.id is ', source.id);
        }
      }
    });
    prevSourcesRef.current = newSources;
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div>
      <SourceInput sources={sources} onChange={handleChange} />
    </div>
  );
};

export { PresetSources };
