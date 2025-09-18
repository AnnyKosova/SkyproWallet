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
  return (
    <div className={styles.checkbox__wrapper}>
      <input
        id={id}
        className={styles.checkbox}
        type="checkbox"
        value={value}
        {...register}
        {...inputProps}
      />
      <label className={cn(styles['checkbox-label'])} htmlFor={id}>
        <img className={styles['category-image']} src={imgUrl} alt="svg"  />
        {label}
      </label>
    </div>
  );
}
