import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../app/appStore';
import type { IPost, IPostImage } from '../../../shared/types';
import {
  editPost,
  loadPostByUrl,
  setActivePost,
  updateActivePostField,
} from './postsSlice';
import { useAppSelector } from '../../../shared/model';
import {
  selectActivePost,
  selectCurrentUser,
  selectPostsError,
  selectPostStatus,
} from './selectors';

/**
 * Custom hook for editing a post.
 * Handles the fetching, editing, and updating of the active post, including form field changes and submission.
 *
 * @param url - The URL of the post to be loaded for editing (optional).
 * @returns {object} The hook returns various states, handlers, and data related to the active post.
 */
export const useEditPost = (url?: string) => {
  const dispatch = useAppDispatch();

  const activePost = useAppSelector(selectActivePost);
  const postStatus = useAppSelector(selectPostStatus);
  const currentUser = useAppSelector(selectCurrentUser);
  const error = useAppSelector(selectPostsError);
  const isAdmin = currentUser?.role === 'admin';
  const isLoading = postStatus === 'loading';

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const [isCustomPublishDate, setIsCustomPublishDate] = useState(false);

  // Fetch the post based on the URL when the URL or dispatch changes.
  useEffect(() => {
    if (url) {
      dispatch(loadPostByUrl(url));
    }
  }, [url, dispatch]);

  // Cleanup the active post when the component unmounts.
  useEffect(() => {
    return () => {
      dispatch(setActivePost(null));
    };
  }, [dispatch]);

  // Set the notification when there's an error fetching the post.
  useEffect(() => {
    if (error) {
      setNotification({
        message: error,
        type: 'error',
      });
    }
  }, [error]);

  /**
   * Handles changes to the form fields and updates the active post state.
   *
   * @param field - The field name to be updated.
   * @param value - The new value for the field.
   */
  const handleFieldChange = <K extends keyof IPost>(
    field: K,
    value: IPost[K]
  ) => {
    dispatch(updateActivePostField({ field, value }));
  };

  /**
   * Handles the selection of an image for the post.
   * Updates the active post's image field.
   *
   * @param image - The selected image data.
   */
  const handleImageSelect = (image: IPostImage) =>
    handleFieldChange('image', { ...image, src: `${image.smallSrc}` });

  /**
   * Handles the form submission for editing the post.
   * Validates the fields before dispatching the update action.
   *
   * @param e - The form submit event.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields before submitting the form.
    if (!activePost?.title || !activePost?.url) {
      setNotification({
        message: 'Заголовок и URL должны быть заполнены',
        type: 'error',
      });
      return;
    }

    // Dispatch the edit post action with the updated post data.
    await dispatch(
      editPost({
        id: activePost.id.toString(),
        postData: { ...activePost, viewCount: 0 },
      })
    );
  };

  return {
    handleFieldChange,
    handleImageSelect,
    handleSubmit,
    activePost,
    notification,
    setNotification,
    setIsCustomPublishDate,
    isLoading,
    isCustomPublishDate,
    isAdmin,
  };
};
