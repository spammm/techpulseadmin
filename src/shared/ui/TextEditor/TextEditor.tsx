import { useRef, useEffect, useState } from 'react';
import Quill, { Range } from 'quill';
import { FigureBlot } from './FigureBlot';
import { VideoBlot } from './VideoBlot';
import { ImageModal } from './ImageModal';

import styles from './TextEditor.module.css';
import 'quill/dist/quill.snow.css';
import './FigureBlot.css';
import './VideoBlot.css';
import './TextEditor.scss';

Quill.register(FigureBlot);
Quill.register(VideoBlot);

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
              [{ header: [2, 3, 4, false] }],
              ['bold', 'italic', 'underline'],
              ['link', 'image', 'blockquote', 'video'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['clean'],
            ],
            handlers: {
              image: () => {
                const currentRange = quill.getSelection();
                setRange(currentRange);
                setIsModalOpen(true);
              },
              video: () => {
                const url = prompt('Введите ссылку на видео:');
                if (url && url.trim() && quill) {
                  const range = quill.getSelection();
                  if (range) {
                    quill.insertEmbed(range.index, 'video', { url });
                  }
                } else {
                  alert('Пожалуйста, введите корректную ссылку на видео.');
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

  const handleModalSubmit = (data: {
    src: string;
    alt: string;
    sourceUrl?: string;
    sourceName?: string;
    width?: number;
    height?: number;
  }) => {
    if (range && quillInstanceRef.current) {
      quillInstanceRef.current.insertEmbed(range.index, 'figure', {
        src: data.src,
        alt: data.alt,
        sourceUrl: data.sourceUrl || '',
        sourceName: data.sourceName || '',
        width: data?.width,
        height: data?.height,
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
