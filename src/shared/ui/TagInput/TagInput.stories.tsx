import { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { TagInput } from './TagInput';

const meta: Meta<typeof TagInput> = {
  title: 'Shared/UI/TagInput',
  component: TagInput,
  parameters: {
    docs: {
      description: {
        component:
          'Компонент TagInput предоставляет возможность пользователю добавлять, удалять и отображать теги. ' +
          'Теги могут быть введены пользователем в текстовое поле и добавлены по нажатию клавиши "Enter". ' +
          'Каждый добавленный тег отображается на экране с возможностью его удаления.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    tags: {
      description:
        'Массив строк, представляющий текущие теги. ' +
        'Используется для отображения на экране и управления состоянием тэгов.',
      control: 'object',
    },
    onChange: {
      description:
        'Колбэк вызываемый при добавлении или удалении тэгов. ' +
        'Принимает массив тэгов в качестве аргумента.',
      action: 'changed',
    },
  },
} satisfies Meta<typeof TagInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tags: [],
    onChange: fn(),
  },
};

export const WithTags: Story = {
  args: {
    tags: ['Tag1', 'Tag2'],
    onChange: fn(),
  },
};

const firstTag = 'DefaultTag';
export const Interactive: Story = {
  args: {
    tags: [firstTag],
    onChange: fn(),
  },
};

Interactive.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const input = canvas.getByLabelText('Поле для добавления тега');
  const initialTag = 'TestTag';

  expect(input, 'поле ввода отображается').toBeInTheDocument();

  // Добавляем тег
  await userEvent.type(input, initialTag);
  await userEvent.type(input, '{enter}');

  expect(
    Interactive.args?.onChange,
    'onChange была вызвана с новым тегом'
  ).toHaveBeenCalledWith(expect.arrayContaining([initialTag]));

  expect(
    canvas.getByText(firstTag || ''),
    'Дефолтный тег отображается на экране'
  ).toBeInTheDocument();

  await userEvent.click(canvas.getByLabelText(`Удалить тег ${firstTag}`));

  expect(
    Interactive.args?.onChange,
    'onChange была вызвана без удаленного тега'
  ).toHaveBeenCalledWith([]);
};
