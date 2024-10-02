import { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent, waitFor } from '@storybook/test';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Shared/UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    errorMessage: { control: 'text' },
    label: { control: 'text' },
    required: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Enter text',
    required: false,
    errorMessage: '',
  },
};

export const WithError: Story = {
  args: {
    label: 'Input with Error',
    required: true,
    errorMessage: 'This field is required',
  },
};

export const InputInteraction: Story = {
  args: {
    label: 'Interactive Input',
    required: true,
    errorMessage: '',
  },
};

InputInteraction.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const input = canvas.getByRole('textbox');

  await waitFor(() => {
    expect(input, 'Поле ввода по умолчанию должно быть пустое').toHaveValue('');
  });

  await userEvent.type(input, 'Test input');

  await waitFor(() => {
    expect(input, 'Возможность ввести текст').toHaveValue('Test input');
  });

  await userEvent.clear(input);

  await waitFor(() => {
    expect(input, 'Возможность очистить поле').toHaveValue('');
  });

  expect(args.errorMessage, 'Поле не обязательное не должно быть ошибки').toBe(
    ''
  );
};

export const ErrorCheck: Story = {
  args: {
    label: 'Error Check Input',
    required: true,
    errorMessage: 'This field is required',
  },
};

ErrorCheck.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const input = canvas.getByRole('textbox');

  await userEvent.clear(input);

  const errorMessage = canvas.getByText(args.errorMessage || '');
  await waitFor(() => {
    expect(
      errorMessage,
      'Если обязательное поле пустое, должна отображаться ошибка'
    ).toBeInTheDocument();
  });
};
