import { Meta, StoryObj } from '@storybook/react';
import { ContactForm } from './ContactForm';
import { within, userEvent, waitFor, expect, fn } from '@storybook/test';

const meta: Meta<typeof ContactForm> = {
  title: 'Shared/UI/ContactForm',
  component: ContactForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    initialContacts: {
      control: 'object',
      description:
        'Начальный список контактов для отображения в форме. Каждый контакт должен быть объектом с полями name и value.',
    },
    onContactsChange: {
      action: 'changed',
      description:
        'Функция, вызываемая при изменении списка контактов. Принимает массив объектов контактов.',
    },
  },
} satisfies Meta<typeof ContactForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialContacts: [
      { name: 'Контакт 1', value: 'Значение 1' },
      { name: 'Контакт 2', value: 'Значение 2' },
    ],
    onContactsChange: fn(),
  },
};

export const Interactive: Story = {
  args: {
    initialContacts: [],
    onContactsChange: fn(),
  },
};

Interactive.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await waitFor(() => {
    const contactInputs =
      canvas.queryAllByPlaceholderText(/Введите имя контакта/i);
    expect(contactInputs, 'Форма должна быть изначально пустая').toHaveLength(
      0
    );
  });

  // Нажимаем кнопку "Добавить контакт"
  await userEvent.click(
    canvas.getByRole('button', { name: /Добавить контакт/i })
  );

  await waitFor(() => {
    const contactInputs =
      canvas.queryAllByPlaceholderText(/Введите имя контакта/i);
    expect(contactInputs, 'Появились поля ввода контакта').toHaveLength(1);
  });

  // Вводим имя и значение контакта
  await userEvent.type(
    canvas.getByPlaceholderText(/Введите имя контакта/i),
    'Имя теста'
  );
  await userEvent.type(
    canvas.getByPlaceholderText(/Введите значение контакта/i),
    'Значение теста'
  );

  // Еще раз нажимаем кнопку "Добавить контакт"
  await userEvent.click(
    canvas.getByRole('button', { name: /Добавить контакт/i })
  );

  await waitFor(() => {
    const contactInputs =
      canvas.queryAllByPlaceholderText(/Введите имя контакта/i);
    expect(contactInputs, 'Должно быть два поля ввода').toHaveLength(2);
  });

  // Удаляем первый контакт
  await userEvent.click(canvas.getAllByRole('button', { name: /Удалить/i })[0]);

  await waitFor(() => {
    const contactInputs =
      canvas.queryAllByPlaceholderText(/Введите имя контакта/i);
    expect(contactInputs, 'Должно остаться одно поле ввода').toHaveLength(1);
  });
};
