import { categoryMap } from '@/shared/model';

export const getCategoryKey = (category) => {
  const keys = Object.keys(categoryMap);
  for (const key of keys) {
    const value = categoryMap[key];
    if (value === category) return key;
  }
  return '';
};
