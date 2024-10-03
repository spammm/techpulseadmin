import { Meta, StoryObj } from '@storybook/react';
import { SourceInput } from './SourceInput';
import { within, userEvent, expect, fn } from '@storybook/test';

const meta: Meta<typeof SourceInput> = {
  title: 'Shared/UI/SourceInput',
  component: SourceInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Компонент SourceInput позволяет пользователю добавлять, отображать и удалять источники. ' +
          'Каждый источник содержит название и ссылку. ' +
          'Пользователь может добавлять новый источник, заполнив соответствующие поля и нажав кнопку "Добавить". ' +
          'Добавленные источники отображаются под полями ввода, и их можно удалить при необходимости.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    sources: {
      description:
        'Массив источников, каждый из которых представляет собой объект с полями name и link.',
      control: 'object',
    },
    onChange: {
      description:
        'Колбэк вызываемый при изменении списка источников. Принимает массив источников в качестве аргумента.',
      action: 'changed',
    },
  },
} satisfies Meta<typeof SourceInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sources: [],
    onChange: fn(),
  },
};

export const Interactive: Story = {
  args: {
    sources: [],
    onChange: fn(),
  },
};

Interactive.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const sourceName = 'Test Source';
  const sourceLink = 'https://testsource.com';

  const nameInput = canvas.getByPlaceholderText('Название источника');
  const linkInput = canvas.getByPlaceholderText('Ссылка на источник');
  expect(nameInput, 'Поле имени источника отображается').toBeInTheDocument();
  expect(linkInput, 'Поле линка источника отображается').toBeInTheDocument();

  // Добавление источника
  await userEvent.type(nameInput, sourceName);
  await userEvent.type(linkInput, sourceLink);
  await userEvent.click(canvas.getByText('Добавить'));

  expect(
    Interactive.args?.onChange,
    'onChange была вызвана с ожидаемыми параметрами'
  ).toHaveBeenCalledWith(
    expect.arrayContaining([
      expect.objectContaining({
        name: sourceName,
        link: sourceLink,
      }),
    ])
  );

  expect(
    (nameInput as HTMLInputElement).value,
    'Поле имени должно стать пустым'
  ).toBe('');
  expect(
    (linkInput as HTMLInputElement).value,
    'Поле линка должно стать пустым'
  ).toBe('');
};
