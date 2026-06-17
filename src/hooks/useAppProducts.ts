import { useAppSelector } from '@/redux/hook';

export function useAppProducts() {
  const { products } = useAppSelector((state) => state.product);
  return products;
}
