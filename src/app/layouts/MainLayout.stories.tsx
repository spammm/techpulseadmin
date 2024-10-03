import { Meta, StoryObj } from '@storybook/react';
import { MainLayout } from './MainLayout';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';

const mockStore = configureMockStore();

const meta: Meta<typeof MainLayout> = {
  title: 'App/Layouts/MainLayout',
  component: MainLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Компонент MainLayout предоставляет основную структуру для админ-панели, включая навигацию и управление доступом на основе ролей пользователей. Ссылки и действия меняются в зависимости от роли пользователя: администратор, менеджер или писатель.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MainLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template: StoryObj<typeof MainLayout> = {};

export const AdminRole: Story = {
  ...Template,
  render: () => {
    const store = mockStore({
      profile: {
        profile: {
          role: 'admin',
        },
      },
    });

    return (
      <Provider store={store}>
        <Router>
          <MainLayout />
        </Router>
      </Provider>
    );
  },
};

export const ManagerRole: Story = {
  ...Template,
  render: () => {
    const store = mockStore({
      profile: {
        profile: {
          role: 'manager',
        },
      },
    });

    return (
      <Provider store={store}>
        <Router>
          <MainLayout />
        </Router>
      </Provider>
    );
  },
};

export const WriterRole: Story = {
  ...Template,
  render: () => {
    const store = mockStore({
      profile: {
        profile: {
          role: 'writer',
        },
      },
    });

    return (
      <Provider store={store}>
        <Router>
          <MainLayout />
        </Router>
      </Provider>
    );
  },
};
