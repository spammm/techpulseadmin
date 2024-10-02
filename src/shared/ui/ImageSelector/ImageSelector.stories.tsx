import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { ImageSelector } from './ImageSelector';
import { expect, userEvent, within } from '@storybook/test';

const apiServer = `http://${window.location.host}`;

// мок-стора
const mockStore = configureMockStore();
const store = mockStore({
  images: {
    images: [
      {
        id: 1,
        alt: 'Image 1',
        smallSrc: '/avatar.webp',
      },
      {
        id: 2,
        alt: 'Image 2',
        smallSrc: '/avatar.webp',
      },
      {
        id: 3,
        alt: 'Image 3',
        smallSrc: '/avatar.webp',
      },
    ],
  },
});

const meta: Meta<typeof ImageSelector> = {
  title: 'Shared/UI/ImageSelector',
  component: ImageSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ImageSelector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Provider store={store}>
      <ImageSelector
        onSelectImage={(image) => console.log('Selected Image:', image)}
        apiServer={apiServer}
      />
    </Provider>
  ),
};

export const WithDefaultImage: Story = {
  render: () => (
    <Provider store={store}>
      <ImageSelector
        onSelectImage={(image) => console.log('Selected Image:', image)}
        defaultImageId={2}
        apiServer={apiServer}
      />
    </Provider>
  ),
};

// Интерактивный тест
export const Interactive: Story = {
  render: () => (
    <Provider store={store}>
      <ImageSelector
        onSelectImage={(image) => console.log('Selected Image:', image)}
        apiServer={apiServer}
      />
    </Provider>
  ),
};

Interactive.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  // Открытие селектора изображений
  await userEvent.click(canvas.getByText('Выберите изображение'));

  const imageOptions = canvas.getAllByRole('listitem');
  expect(imageOptions, 'Должно отображаться три изображения').toHaveLength(3);

  // Выбираем первое изображение
  await userEvent.click(imageOptions[0]);

  expect(
    canvas.getByText('Image 1'),
    'Проверка что отображается первая картинка'
  ).toBeInTheDocument();
};
