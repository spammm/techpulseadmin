import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/appStore';
import { IPost } from '../../../shared/types/post';
import {
  editPost,
  loadPostByUrl,
  setActivePost,
  updateActivePostField,
} from '../../../shared/model/store/postsSlice';

export const useEditPost = (url?: string) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (url) {
      dispatch(loadPostByUrl(url));
    }
  }, [url, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(setActivePost(null)); // Очищаем активный пост при размонтировании
    };
  }, [dispatch]);

  const handleFieldChange = <K extends keyof IPost>(
    field: K,
    value: IPost[K]
  ) => {
    dispatch(updateActivePostField({ field, value }));
  };

  const handleSubmit = async (activePost: IPost) => {
    if (!activePost || !activePost.id) return;

    const formData = {
      ...activePost,
      viewCount: 0,
    };

    try {
      const resultAction = await dispatch(
        editPost({
          id: activePost.id.toString(),
          postData: formData,
        })
      );

      if (editPost.fulfilled.match(resultAction)) {
        navigate(`/posts/${resultAction.payload.url}`);
      } else {
        console.error('Ошибка:', resultAction.payload);
      }
    } catch (error) {
      console.error('Ошибка при обновлении поста:', error);
    }
  };

  return { handleFieldChange, handleSubmit };
};
