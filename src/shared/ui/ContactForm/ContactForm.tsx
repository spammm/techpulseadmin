import { useState } from 'react';
import { Input, Button } from '../../../shared/ui';

import styles from './ContactForm.module.scss';

type Contact = {
  name: string;
  value: string;
};

type ContactFormProps = {
  initialContacts?: Contact[];
  onContactsChange: (contacts: Contact[]) => void;
};

export const ContactForm: React.FC<ContactFormProps> = ({
  initialContacts = [],
  onContactsChange,
}) => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);

  const handleContactChange = (
    index: number,
    field: keyof Contact,
    value: string
  ) => {
    const updatedContacts = contacts.map((contact, i) =>
      i === index ? { ...contact, [field]: value } : contact
    );
    setContacts(updatedContacts);
    onContactsChange(updatedContacts);
  };

  const handleAddContact = () => {
    setContacts([...contacts, { name: '', value: '' }]);
  };

  const handleRemoveContact = (index: number) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
    onContactsChange(updatedContacts);
  };

  return (
    <div className={styles.contactFormContainer}>
      {contacts.map((contact, index) => (
        <div key={index} className={styles.contactFormGroup}>
          <Input
            label="Имя контакта"
            name={`contact-name-${index}`}
            value={contact.name}
            onChange={(e) => handleContactChange(index, 'name', e.target.value)}
            placeholder="Введите имя контакта"
            required
          />
          <Input
            label="Значение контакта"
            name={`contact-value-${index}`}
            value={contact.value}
            onChange={(e) =>
              handleContactChange(index, 'value', e.target.value)
            }
            placeholder="Введите значение контакта"
            required
          />
          <Button
            text="Удалить"
            type="button"
            onClick={() => handleRemoveContact(index)}
            className={styles.deleteButton}
          />
        </div>
      ))}
      <Button
        text="Добавить контакт"
        type="button"
        onClick={handleAddContact}
        className={styles.addButton}
      />
    </div>
  );
};
