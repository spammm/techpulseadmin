import { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';
import { within, expect, userEvent } from '@storybook/test';

const meta: Meta<typeof Textarea> = {
  title: 'Shared/UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Введите текст',
    placeholder: 'Текст...',
  },
};

export const WithError: Story = {
  args: {
    label: 'Введите текст с ошибкой',
    placeholder: 'Текст...',
    errorMessage: 'Это поле обязательно для заполнения',
  },
};

export const Interactive: Story = {
  args: {
    label: 'Интерактивный текст',
    placeholder: 'Введите текст...',
  },
};

Interactive.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const textarea = canvas.getByLabelText('Интерактивный текст');
  expect(textarea, 'Gоле ввода отображается').toBeInTheDocument();

  const inputText = 'Тестовый текст';
  await userEvent.type(textarea, inputText);

  expect(textarea, 'Проверяем, что текст был введен').toHaveValue(inputText);

  await userEvent.clear(textarea);

  expect(textarea, 'Проверяем, что текстовое поле пустое').toHaveValue('');
};
