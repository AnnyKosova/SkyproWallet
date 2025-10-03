export const category = [
  { name: 'Еда', svgPath: '/category/cat-svg-active-' },
  { name: 'Транспорт', svgPath: '/category/cat-svg-active-' },
  { name: 'Жилье', svgPath: '/category/cat-svg-active-' },
  { name: 'Развлечения', svgPath: '/category/cat-svg-active-' },
  { name: 'Образование', svgPath: '/category/cat-svg-active-' },
  { name: 'Другое', svgPath: '/category/cat-svg-active-' },
];

export const formFields = {
  description: '',
  category: '',
  date: '',
  sum: '',
};

export const descriptionValidateOpt = {
  required: true,
  minLength: {
    value: 4,
    message: 'Описание должно содержать 4 и более символов',
  },
  maxLength: {
    value: 99,
    message: 'Превышен лимит символов',
  },
};

export const categoryValidateOpt = {
  validate: (getFieldState, setError) => {
    const isFilled = getFieldState('category').isDirty;
    if (!isFilled)
      setError('category', {
        type: 'required',
        message: 'Выберите категорию',
      });
    return isFilled;
  },
};

export const dateValidateOpt = {
  required: true,
  pattern:
    /^(?:(?:31\.(?:0[13578]|1[02]))|(?:(?:29|30)\.(?:0[1,3-9]|1[0-2]))|(?:0[1-9]|1\d|2[0-8])\.(?:0[1-9]|1[0-2]))\.\d{4}$|^(29\.02\.(?:\d{2}(?:0[48]|[2468][048]|[13579][26])|(?:[02468][048]00)))$/,
};

export const sumValidateOpt = {
  required: true,
  min: 1,
};
