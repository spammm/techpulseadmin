import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { ImageSelector } from './ImageSelector';
import { expect, fn, userEvent, within } from '@storybook/test';

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
    docs: {
      description: {
        component:
          'Компонент ImageSelector позволяет пользователям выбирать изображения из списка доступных изображений. ' +
          'Пользователь может выбрать изображение, которое будет отображаться в компоненте. ' +
          'Компонент принимает пропсы onSelectImage для обработки выбранного изображения и apiServer для указания базового URL для изображений.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onSelectImage: {
      description:
        'Функция, вызываемая при выборе изображения. Принимает объект изображения как аргумент.',
      action: 'selectedImage',
    },
    defaultImageId: {
      description:
        'ID изображения, которое будет выбрано по умолчанию, если оно присутствует в списке доступных изображений.',
      control: { type: 'number' },
    },
    apiServer: {
      description:
        'Базовый URL для получения изображений. По умолчанию используется переменная окружения VITE_API_SERVER.',
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof ImageSelector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Provider store={store}>
      <ImageSelector onSelectImage={fn()} apiServer={apiServer} />
    </Provider>
  ),
};

export const WithDefaultImage: Story = {
  render: () => (
    <Provider store={store}>
      <ImageSelector
        onSelectImage={fn()}
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
      <ImageSelector onSelectImage={fn()} apiServer={apiServer} />
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
