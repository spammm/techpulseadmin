import { Meta, StoryObj } from '@storybook/react';
import { TextEditor } from './TextEditor';

const meta: Meta<typeof TextEditor> = {
  title: 'Shared/UI/TextEditor',
  component: TextEditor,
  parameters: {
    docs: {
      description: {
        component:
          'Компонент TextEditor предоставляет пользователю многофункциональный редактор текста, основанный на библиотеке Quill. ' +
          'Поддерживает вставку изображений, видео и других медиа. Редактор имеет настраиваемую панель инструментов и позволяет пользователям ' +
          'форматировать текст с помощью различных опций, таких как заголовки, списки и выделение.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Текущий HTML-содержимое редактора.',
    },
    onChange: {
      action: 'changed',
      description:
        'Функция обратного вызова, которая вызывается при изменении содержимого редактора.',
    },
  },
} satisfies Meta<typeof TextEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '<p>Введите текст статьи...</p>',
    onChange: (value: string) => console.log('Текущая версия:', value),
  },
};
