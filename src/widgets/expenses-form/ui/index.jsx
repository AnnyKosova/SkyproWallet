import { useForm } from 'react-hook-form';
import cn from 'classnames';

import { useExpensesCtx } from '@/shared/context/expenses-ctx';
import { FormCheckbox } from '@/shared/ui/checkbox';
import { FormItem } from '@/shared/ui/input';
import { category, categoryMap } from '../config';
import { formFields } from '../config';

import styles from './style.module.css';

export function ExpensesForm() {
  const expensesCtx = useExpensesCtx();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    getFieldState,
    setError,
    reset,
  } = useForm({
    mode: 'onTouched',
    defaultValues: formFields,
  });

  const onSubmit = (data) => {
    const body = {
      ...data,
      category: categoryMap[data.category[0]],
      date: data.date.replaceAll('.', '-'),
      sum: Number(data.sum),
    };

    expensesCtx.createExpense(body).then(() => reset());
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
          error={errors.description}
          {...register('description', {
            required: true,
            minLength: {
              value: 4,
              message: 'Описание должно содержать 4 и более символов',
            },
            maxLength: {
              value: 99,
              message: 'Превышен лимит символов',
            },
          })}
        />

        <div>
          <p
            role="label"
            className={cn(styles.category__label, {
              [styles['error-star']]: errors?.category?.type === 'validate',
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
            pattern:
              /^(?:(?:31\.(?:0[13578]|1[02]))|(?:29|30\.(?:0[1,3-9]|1[0-2]))|(?:0[1-9]|1\d|2[0-8])\.(?:0[1-9]|1[0-2]))\.\d{4}$|^(29\.02\.(?:\d{2}(?:0[48]|[2468][048]|[13579][26])|(?:[02468][048]00)))$/,
          })}
          error={errors.date}
        />

        <FormItem
          label="Сумма"
          id="sum"
          type="number"
          placeholder="Введите сумму"
          error={errors.sum}
          {...register('sum', {
            required: true,
          })}
        />
        <input
          className={styles.form__submit}
          type="submit"
          value="Добавить новый расход"
          disabled={isSubmitSuccessful || Object.keys(errors).length > 0}
        />
      </form>
    </div>
  );
}
