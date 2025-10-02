import { useRef, useState } from 'react';
import { useClickOutside } from '@/shared/lib/use-click-outside';

import cn from 'classnames';
import styles from './styles.module.css';

export function FormCheckbox({
  label,
  id,
  register,
  value,
  imgUrl,
  ...inputProps
}) {
  const [isChecked, setIsChecked] = useState(false);
  const elRef = useRef(null);

  useClickOutside(elRef, setIsChecked);

  const handleClick = () => {
    setIsChecked((prev) => !prev);
  }

  return (
    <div className={styles.checkbox__wrapper} ref={elRef}>
      <input
        id={id}
        className={styles.checkbox}
        type="checkbox"
        value={value}
        checked={isChecked}
        onClick={handleClick}
        {...register}
        {...inputProps}
      />
      <label className={cn(styles['checkbox-label'])} htmlFor={id}>
        <img className={styles['category-image']} src={imgUrl} alt="svg" />
        {label}
      </label>
    </div>
  );
}
