import { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';
import { expect, fn, userEvent, within } from '@storybook/test';

const meta: Meta<typeof Pagination> = {
  title: 'Shared/UI/Pagination',
  component: Pagination,
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const OnePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
    onPageChange: fn(),
  },
};

export const TwoPages: Story = {
  args: {
    currentPage: 1,
    totalPages: 2,
    onPageChange: fn(),
  },
};

export const MultiplePages: Story = {
  args: {
    currentPage: 3,
    totalPages: 15,
    onPageChange: fn(),
  },
};

export const Interactive: Story = {
  args: {
    currentPage: 3,
    totalPages: 5,
    onPageChange: fn(),
  },
};

Interactive.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  expect(
    canvas.getByText('3'),
    'текущая страница отображается'
  ).toBeInTheDocument();

  // Переход на следующую страницу
  await userEvent.click(canvas.getByText('Следующая'));

  expect(
    Interactive.args?.onPageChange,
    'onPageChange была вызвана и получила следующую страницу(4)'
  ).toHaveBeenCalledWith(4);

  // Переход на предыдущую страницу
  await userEvent.click(canvas.getByText('Предыдущая'));

  expect(
    Interactive.args?.onPageChange,
    'onPageChange была вызвана и получила предыдущую страницу(2)'
  ).toHaveBeenCalledWith(2);

  // Переход на конкретную сраницу страницу
  await userEvent.click(canvas.getByText('5'));
  expect(
    Interactive.args?.onPageChange,
    'onPageChange была вызвана и получила страницу 5'
  ).toHaveBeenCalledWith(5);
};
