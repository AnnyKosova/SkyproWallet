import { useForm } from 'react-hook-form';
import cn from 'classnames';

import { useExpensesCtx } from '@/shared/context/expenses-ctx';
import { FormRadio } from '@/shared/ui/radio-category';
import { FormItem } from '@/shared/ui/input';
import { categoryMap } from '@/shared/model/index';
import { convertDateToMMDDYYYY } from '@/shared/lib/convert-date';
import {
  category,
  formFields,
  descriptionValidateOpt,
  sumValidateOpt,
  dateValidateOpt,
  categoryValidateOpt,
} from '../config';

import styles from './style.module.css';
import { MobileBtn } from '@/shared/ui/mobile-btn';
import { Link } from 'react-router-dom';

export function ExpensesForm() {
  const expensesCtx = useExpensesCtx();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm({
    mode: 'onTouched',
    defaultValues: formFields,
  });

  const onSubmit = (data) => {
    const body = {
      ...data,
      category: categoryMap[data.category],
      date: convertDateToMMDDYYYY(data.date),
      sum: Number(data.sum),
    };
    expensesCtx.createExpense(body).finally(() => reset());
  };

  return (
    <div className={cn(styles['form-wrapper'])}>
      <div className={styles['form__title-md-sm']}>
        <Link to={'/expenses'} className={styles['back-to__expenses_btn']}>
          Мои расходы
        </Link>
      </div>
      <form
        className={styles.form}
        id="expenses-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className={styles.form__title}>Новый расход</h2>
        <FormItem
          label="Описание"
          id="description"
          placeholder="Введите описание"
          error={errors.description}
          {...register('description', descriptionValidateOpt)}
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
              <FormRadio
                key={`category-${value.name}-${index}`}
                label={value.name}
                id={`category-${value.name}`}
                value={value.name}
                imgUrl={`${value.svgPath}${index}.svg`}
                {...register('category', categoryValidateOpt)}
              />
            ))}
          </div>
        </div>

        <FormItem
          label="Дата"
          id="date"
          placeholder="Введите дату (дд.мм.гггг)"
          error={errors.date}
          {...register('date', dateValidateOpt)}
        />

        <FormItem
          label="Сумма"
          id="sum"
          type="number"
          placeholder="Введите сумму"
          error={errors.sum}
          {...register('sum', sumValidateOpt)}
        />
        <input
          className={styles.form__submit}
          type="submit"
          value="Добавить новый расход"
          disabled={isSubmitSuccessful || Object.keys(errors).length > 0}
        />
      </form>
      <MobileBtn
        formId={'expenses-form'}
        classNames={styles['show__mobile-btn']}
        type="submit"
        description={'Добавить новый расход'}
        disabled={isSubmitSuccessful || Object.keys(errors).length > 0}
      />
    </div>
  );
}
