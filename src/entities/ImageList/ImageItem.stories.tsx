import { Meta, StoryObj } from '@storybook/react';
import { ImageItem } from './ImageItem';
import { IPostImage } from '../../shared/types/image';
import { expect, fn, userEvent, within } from '@storybook/test';

const mockImage: IPostImage = {
  id: 1,
  alt: 'Пример изображения',
  src: '/avatar.webp',
  source: 'Пример источника',
  sourceUrl: 'https://example.com',
  width: 200,
  height: 200,
  smallSrc: '/avatar.webp',
  smallWidth: 50,
  smallHeight: 50,
};

const meta: Meta<typeof ImageItem> = {
  title: 'Entities/ImageList/ImageItem',
  component: ImageItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Компонент ImageItem отображает изображение с возможностью редактирования его описания и источников. Он позволяет пользователю обновлять данные изображения и сохранять изменения.',
      },
    },
  },
  argTypes: {
    onUpdateImage: {
      action: 'updated',
      description: 'Функция, вызываемая для обновления данных изображения.',
    },
  },
} satisfies Meta<typeof ImageItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    image: mockImage,
    onUpdateImage: fn(),
  },
};

export const Interactive: Story = {
  ...Default,
};

Interactive.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  expect(
    canvas.getByLabelText('Описание:'),
    'Отображения исходного значения описания'
  ).toHaveValue(mockImage.alt);

  const newDescription = 'Новое описание изображения';
  await userEvent.clear(canvas.getByLabelText('Описание:'));
  await userEvent.type(canvas.getByLabelText('Описание:'), newDescription);

  await userEvent.click(canvas.getByText('Сохранить'));

  expect(
    Interactive.args?.onUpdateImage,
    'onUpdateImage был вызван с новыми данными'
  ).toHaveBeenCalledWith(mockImage.id, {
    ...mockImage,
    alt: newDescription,
  });
};
