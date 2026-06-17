import { useAppSelector } from '@/redux/hook';

export function useAppCategories() {
  const { categories } = useAppSelector((state) => state.product);
  return categories;
}
