import React, { useRef, useEffect, useState } from 'react';
import Quill, { Range } from 'quill';
import { FigureBlot } from './FigureBlot';
import 'quill/dist/quill.snow.css';
import styles from './TextEditor.module.css';
import './FigureBlot.css';
import { ImageModal } from './ImageModal';

Quill.register(FigureBlot);

interface TextEditorProps {
  value?: string;
  onChange: (value: string) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({ onChange, value }) => {
  const quillRef = useRef<HTMLDivElement | null>(null);
  const quillInstanceRef = useRef<Quill | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [range, setRange] = useState<Range | null>(null);

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
                const currentRange = quill.getSelection();
                setRange(currentRange);
                setIsModalOpen(true);
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

  const handleModalSubmit = (data: {
    imageLink: string;
    alt: string;
    sourceLink?: string;
    sourceName?: string;
  }) => {
    if (range && quillInstanceRef.current) {
      quillInstanceRef.current.insertEmbed(range.index, 'figure', {
        src: data.imageLink,
        alt: data.alt,
        sourceUrl: data.sourceLink || '',
        sourceName: data.sourceName || '',
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div ref={quillRef} className={styles.textEditor} />
      {isModalOpen && (
        <ImageModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};
