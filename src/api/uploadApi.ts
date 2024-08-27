const API_SERVER = import.meta.env.VITE_API_SERVER;

export interface UploadResponse {
  path: string;
}

export const uploadImage = async (
  file: File,
  token: string
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_SERVER}/posts/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Ошибка загрузки файла');
  }

  return response.json();
};
