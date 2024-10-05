import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { expect, fn, within, userEvent } from '@storybook/test';
import { ImageList } from './ImageList';
import { IPostImage } from '../../shared/types/image';

const apiServer = `http://${window.location.host}`;

const image1: IPostImage = {
  id: 1,
  alt: 'Пример изображения 1',
  src: '/avatar.webp',
  source: 'Источник 1',
  sourceUrl: 'https://example.com/1',
  width: 200,
  height: 200,
  smallSrc: '/avatar.webp',
  smallWidth: 100,
  smallHeight: 100,
};

const image2: IPostImage = {
  id: 2,
  alt: 'Пример изображения 2',
  src: '/avatar.webp',
  source: 'Источник 2',
  sourceUrl: 'https://example.com/2',
  width: 200,
  height: 200,
  smallSrc: '/avatar.webp',
  smallWidth: 100,
  smallHeight: 100,
};

const mockStore = configureMockStore();
const store = mockStore({
  images: {
    images: [image1, image2],
  },
});

const meta: Meta<typeof ImageList> = {
  title: 'Entities/ImageList',
  component: ImageList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Компонент ImageList отображает список изображений и предоставляет возможность редактирования их данных через компонент ImageItem.',
      },
    },
  },
  argTypes: {
    onUpdateImage: {
      action: 'updated',
      description: 'Функция для обновления данных изображения.',
    },
  },
} satisfies Meta<typeof ImageList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Provider store={store}>
      <ImageList onUpdateImage={fn()} apiServer={apiServer} />
    </Provider>
  ),
};

const handlerUploadImage = fn();

export const Interactive: Story = {
  render: () => (
    <Provider store={store}>
      <ImageList onUpdateImage={handlerUploadImage} apiServer={apiServer} />
    </Provider>
  ),
};

Interactive.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const newDescription = 'Новое описание';

  expect(
    canvas.getByDisplayValue('Пример изображения 1'),
    'Изображение 1 отображается'
  ).toBeInTheDocument();
  expect(
    canvas.getByDisplayValue('Пример изображения 2'),
    'Изображение 2 отображается'
  ).toBeInTheDocument();

  const descriptionFields = canvas.getAllByLabelText('Описание:');
  expect(
    descriptionFields.length,
    'есть хотя бы одно поле "Описание"'
  ).toBeGreaterThan(0);
  expect(
    descriptionFields[0],
    'Поле для "Описания" существует'
  ).toBeInTheDocument();

  // Обновляем описание
  await userEvent.clear(descriptionFields[0]);
  await userEvent.type(descriptionFields[0], newDescription);

  const saveButton = canvas.getByRole('button', { name: /Сохранить/i });
  await userEvent.click(saveButton);

  expect(
    handlerUploadImage,
    'onUpdateImage получил нужное занчение поля'
  ).toHaveBeenCalledWith(image1.id, {
    ...image1,
    alt: newDescription,
  });
};
