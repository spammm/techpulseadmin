import { Meta, StoryFn } from '@storybook/react';
import { Button, ButtonProps } from './Button';

export default {
  title: 'Shared/UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    text: { control: 'text' },
  },
} as Meta;

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

export const WithChildren = Template.bind({});
WithChildren.args = {
  children: <a href="#">Кнопка с дочерними элементами</a>,
};
