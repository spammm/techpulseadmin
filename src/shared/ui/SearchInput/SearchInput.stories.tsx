import { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from './SearchInput';
import { within, userEvent, expect, fn } from '@storybook/test';

const meta: Meta<typeof SearchInput> = {
  title: 'Shared/UI/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
} satisfies Meta<typeof SearchInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    value: '',
    onChange: fn(),
  },
};

export const Filled: Story = {
  args: {
    value: 'exmaple@gmail.com',
    onChange: fn(),
  },
};

export const Interactive: Story = {
  args: {
    value: '',
    onChange: fn(),
  },
};

Interactive.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  // Проверяем, что поле ввода отображается
  const input = canvas.getByPlaceholderText('Поиск по имени или email');
  expect(input).toBeInTheDocument();

  // Вводим значение в поле
  await userEvent.type(input, 't');

  expect(
    Interactive.args?.onChange,
    'onChange получила введеный символ'
  ).toHaveBeenCalledWith('t');
};
