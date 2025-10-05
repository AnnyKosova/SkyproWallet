import cn from 'classnames';
import styles from './styles.module.css';

export function FormRadio({
  label,
  id,
  register,
  value,
  imgUrl,
  ...inputProps
}) {
  return (
    <div className={styles.radio__wrapper}>
      <input
        id={id}
        className={styles.radio}
        type="radio"
        value={value}
        {...register}
        {...inputProps}
      />
      <label className={cn(styles['radio-label'])} htmlFor={id}>
        <img className={styles['category-image']} src={imgUrl} alt="svg" />
        {label}
      </label>
    </div>
  );
}
