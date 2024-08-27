import React, { useRef, useEffect } from 'react';
import Quill from 'quill';
import { FigureBlot } from './FigureBlot';
import 'quill/dist/quill.snow.css';
import styles from './TextEditor.module.css';
import './FigureBlot.css';

Quill.register(FigureBlot);

interface TextEditorProps {
  value?: string;
  onChange: (value: string) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({ onChange, value }) => {
  const quillRef = useRef<HTMLDivElement | null>(null);
  const quillInstanceRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (quillRef.current && !quillInstanceRef.current) {
      const quill = new Quill(quillRef.current, {
        theme: 'snow',
        placeholder: 'Введите текст статьи...',
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline'],
              ['link', 'image', 'blockquote'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['clean'],
            ],
            handlers: {
              image: () => {
                const range = quill.getSelection();
                const imageLink = prompt(
                  'Введите ссылку на изображение(обязательно):'
                );
                const alt = prompt(
                  'Введите описание изображения(обязательно):'
                );
                const sourceLink = prompt(
                  'Введите ссылку на источник изображения:'
                );
                const sourceName = prompt('Введите имя источника изображения:');

                if (range && alt && imageLink) {
                  quill.insertEmbed(range.index, 'figure', {
                    src: imageLink,
                    alt,
                    sourceUrl: sourceLink || '',
                    sourceName: sourceName || '',
                  });
                }
              },
            },
          },
        },
      });

      quill.on('text-change', () => {
        onChange(quill.root.innerHTML);
      });

      quillInstanceRef.current = quill;
    }
  }, [onChange]);

  useEffect(() => {
    if (
      quillInstanceRef.current &&
      value !== quillInstanceRef.current.root.innerHTML
    ) {
      const quill = quillInstanceRef.current;

      const selection = quill.getSelection();
      const delta = quill.clipboard.convert({ html: value || '' });
      quill.setContents(delta, 'silent');
      if (selection) {
        quill.setSelection(selection);
      }
    }
  }, [value]);

  return <div ref={quillRef} className={styles.textEditor} />;
};
