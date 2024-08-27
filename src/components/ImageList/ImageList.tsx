import { Input } from '../shared/Input';
import styles from './ImageList.module.css';

interface ImageListProps {
  imageLinks: { src: string; alt: string }[];
}

export const ImageList: React.FC<ImageListProps> = ({ imageLinks }) => {
  const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
    event.currentTarget.select();
  };
  return (
    <div className={styles.list}>
      {imageLinks.map((link, index) => (
        <div key={index} className={styles.listItem}>
          <img src={link.src} alt={link.alt} />
          <Input defaultValue={link.src} readOnly onClick={handleClick} />
        </div>
      ))}
    </div>
  );
};
