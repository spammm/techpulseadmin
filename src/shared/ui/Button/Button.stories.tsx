import { Meta, StoryFn } from '@storybook/react';
import { FcApproval } from 'react-icons/fc';
import { Button, ButtonProps } from './Button';

const meta: Meta<ButtonProps> = {
  title: 'Shared/UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Компонент Button представляет собой кнопку. Поддерживает различные состояния, такие как Loading и Disabled.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      action: 'clicked',
      description: 'Колбек вызываемый при клике на кнопку.',
    },
    loading: {
      control: 'boolean',
      description:
        'Состояние загрузки. Если true, отображается индикатор загрузки вместо текста кнопки и блокирует кнопку.',
    },
    disabled: {
      control: 'boolean',
      description: 'Если true, кнопка будет заблокирована',
    },
    text: {
      control: 'text',
      description: 'Текст, отображаемый на кнопке.',
    },
    children: {
      description:
        'Дочерние элементы, отображаемые в кнопке (например, иконки).',
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'icon'],
      description:
        'Вариант отображения кнопки. Можно выбрать между "primary" (основной) и "icon" (кнопка с иконкой). Иконка передается через children, например можно использовать react-icons',
    },
  },
} satisfies Meta<ButtonProps>;

export default meta;

const Template: StoryFn<ButtonProps> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  text: 'Кнопка по умолчанию',
};

export const Loading = Template.bind({});
Loading.args = {
  text: 'Загрузка',
  loading: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  text: 'Отключенная кнопка',
  disabled: true,
};

export const IconButton = Template.bind({});
IconButton.args = {
  children: <FcApproval />,
  variant: 'icon',
  title: 'Icon Button',
};

export const IconButtonDisabled = Template.bind({});
IconButtonDisabled.args = {
  ...IconButton.args,
  disabled: true,
};
