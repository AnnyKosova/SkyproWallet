import cn from 'classnames';
import styles from './styles.module.css';

export function FormItem({
  label,
  id,
  type = 'text',
  placeholder,
  register,
  error = null,
  ...inputProps
}) {
  return (
    <div className={styles.form__item}>
      <label
        className={cn(styles['item-label'], {
          [styles['error-star']]: error ? true : false,
        })}
        htmlFor={id}
      >
        {label}
      </label>

      <input
        className={cn(styles.form__input, {
          [styles.error]: error ? true : false,
        })}
        id={id}
        type={type}
        placeholder={placeholder}
        {...register}
        {...inputProps}
      />
    </div>
  );
}
