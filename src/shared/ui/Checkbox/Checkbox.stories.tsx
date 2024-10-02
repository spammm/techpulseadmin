import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Checkbox, CheckboxProps } from './Checkbox';

const meta: Meta<CheckboxProps> = {
  title: 'Shared/UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    onChange: { action: 'changed' },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<CheckboxProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  args: {
    label: 'Unchecked Checkbox',
    checked: false,
    disabled: false,
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked Checkbox',
    checked: true,
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Checkbox',
    checked: false,
    disabled: true,
  },
};

export const DisabledAndChecked: Story = {
  args: {
    label: 'Disabled Checkbox',
    checked: true,
    disabled: true,
  },
};
