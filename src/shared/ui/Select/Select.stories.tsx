import { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent, waitFor } from '@storybook/test';
import { Select, SelectProps } from './Select';

const meta: Meta<SelectProps> = {
  title: 'Shared/UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: { type: 'object' },
    },
    errorMessage: { control: 'text' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<SelectProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Select an option',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    errorMessage: '',
  },
};

export const WithError: Story = {
  args: {
    label: 'Select an option with error',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    errorMessage: 'This field is required',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Select',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    errorMessage: '',
    disabled: true,
  },
};

export const Interactive: Story = {
  args: {
    label: 'Interactive Select',
    options: [
      { value: '', label: 'Select an option' },
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    errorMessage: '',
  },
};

Interactive.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const select = canvas.getByRole('combobox');

  await waitFor(() => {
    expect(select, 'Cелект пустой по умолчанию').toHaveValue('');
  });

  // Выбор второго варианта в селекте
  await userEvent.selectOptions(select, 'option2');

  await waitFor(() => {
    expect(select, 'Проверка, что выбранный вариант - "Option 2"').toHaveValue(
      'option2'
    );
  });

  await userEvent.selectOptions(select, '');

  await waitFor(() => {
    expect(select, 'После сброса селект снова пустой').toHaveValue('');
  });
};
