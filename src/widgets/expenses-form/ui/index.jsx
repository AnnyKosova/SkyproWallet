import { useForm } from 'react-hook-form';
import cn from 'classnames';

import { FormCheckbox } from '@/shared/ui/checkbox';
import { FormItem } from '@/shared/ui/input';
import { category } from '../config';

import styles from './style.module.css';

export function ExpensesForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getFieldState,
    setError,
    reset,
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      description: '',
      category: [],
      date: '',
      sum: '',
    },
  });

  const onSubmit = (data) => {
    console.log('SEND', data);
    reset();
  };
  const onError = (error) => {
    console.log('ERROR', error);
  };

  return (
    <div className={styles['form-wrapper']}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit, onError)}>
        <h2 className={styles.form__title}>Новый расход</h2>
        <FormItem
          label="Описание"
          id="description"
          placeholder="Введите описание"
          {...register('description', {
            required: true,
            maxLength: {
              value: 99,
              message: 'Превышен лимит символов',
            },
          })}
          error={errors.description}
        />

        <div>
          <p
            role="label"
            className={cn(styles.category__label, {
              [styles['error-star']]:
                errors?.category?.type === 'validate' ? true : false,
            })}
          >
            Категория
          </p>
          <div className={styles['category-content']}>
            {category.map((value, index) => (
              <FormCheckbox
                key={`category-${value.name}-${index}`}
                label={value.name}
                id={`category-${value.name}`}
                value={value.name}
                imgUrl={`${value.svgPath}${index}.svg`}
                {...register('category', {
                  validate: () => {
                    const isFilled = getFieldState('category').isDirty;
                    if (!isFilled)
                      setError('category', {
                        type: 'required',
                        message: 'Выберите категорию',
                      });
                    return isFilled;
                  },
                })}
              />
            ))}
          </div>
        </div>

        <FormItem
          label="Дата"
          id="date"
          placeholder="Введите дату (дд.мм.гггг)"
          {...register('date', {
            required: true,
            pattern: /\d{2}\.\d{2}\.(\d{2}|\d{4})/,
          })}
          error={errors.date}
        />

        <FormItem
          label="Сумма"
          id="sum"
          type="number"
          placeholder="Введите сумму"
          {...register('sum', {
            required: true,
          })}
          error={errors.sum}
        />
        <input
          className={styles.form__submit}
          type="submit"
          value="Добавить новый расход"
          disabled={Object.keys(errors).length > 0}
        />
      </form>
    </div>
  );
}
