import cn from 'classnames';
import styles from './styles.module.css';

export const MobileBtn = ({
  classNames = '',
  type = 'button',
  description = 'Mobile Btn',
  formId,
  disabled = false
}) => {
  return (
    <div className={cn(styles['mobile-btn'], classNames)}>
        <input
          form={formId}
          className={styles.btn}
          value={description}
          type={type}
          disabled={disabled}
        />
    </div>
  );
};
