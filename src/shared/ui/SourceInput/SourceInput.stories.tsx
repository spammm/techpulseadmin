import { Meta, StoryObj } from '@storybook/react';
import { SourceInput } from './SourceInput';
import { within, userEvent, expect, fn } from '@storybook/test';

const meta: Meta<typeof SourceInput> = {
  title: 'Shared/UI/SourceInput',
  component: SourceInput,
  tags: ['autodocs'],
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
    onChange: fn(), // Используем fn для отслеживания вызовов
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
