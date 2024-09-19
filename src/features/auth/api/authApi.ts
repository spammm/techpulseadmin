import { api } from '../../../shared/api';

const API_SERVER = import.meta.env.VITE_API_SERVER;

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
}

export const loginUser = async (
  username: string,
  password: string
): Promise<AuthTokens> => {
  const response = await api.post<AuthTokens>(API_SERVER + '/auth/login', {
    username,
    password,
  });

  if (
    response.data.accessToken &&
    response.data.refreshToken &&
    response.data.accessTokenExpiresIn
  ) {
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem(
      'accessTokenExpires',
      (Date.now() + response.data.accessTokenExpiresIn).toString()
    );
  } else {
    console.error('Access token or refresh token is missing');
  }
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    logoutUser();
    throw new Error('Refresh token is missing');
  }

  try {
    const response = await api.post<AuthTokens>(
      `${API_SERVER}/auth/refresh-token`,
      { refreshToken }
    );

    const {
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenExpiresIn,
    } = response.data;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    localStorage.setItem(
      'accessTokenExpires',
      (Date.now() + accessTokenExpiresIn).toString()
    );

    return accessToken;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    logoutUser();
    throw new Error('Unable to refresh token');
  }
};
