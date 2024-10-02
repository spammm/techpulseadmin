import { Meta, StoryObj } from '@storybook/react';
import { within, expect, fn } from '@storybook/test';
import { useState } from 'react';
import { Notification } from './Notification';

const meta: Meta<typeof Notification> = {
  title: 'Shared/UI/Notification',
  component: Notification,
  tags: ['autodocs'],
} satisfies Meta<typeof Notification>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    message: 'Успешно выполнено!',
    type: 'success',
    onClose: () => fn(),
  },
};

export const Error: Story = {
  args: {
    message: 'Произошла ошибка!',
    type: 'error',
    onClose: () => fn(),
  },
};

export const Interactive: Story = {
  render: () => {
    const InteractiveComponent = () => {
      const [isVisible, setIsVisible] = useState(true);

      const handleClose = () => {
        setIsVisible(false);
      };

      return (
        <>
          {isVisible && (
            <Notification
              message="Это интерактивное уведомление!"
              type="success"
              onClose={handleClose}
            />
          )}
        </>
      );
    };

    return <InteractiveComponent />;
  },
};

Interactive.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  expect(
    canvas.getByText(/это интерактивное уведомление!/i),
    'уведомление отображается'
  ).toBeInTheDocument();

  // Ждем чтобы уведомление закрылось автоматически
  await new Promise((resolve) => setTimeout(resolve, 4000));

  expect(
    canvas.queryByText(/это интерактивное уведомление!/i),
    'уведомление закрылось'
  ).not.toBeInTheDocument();
};
