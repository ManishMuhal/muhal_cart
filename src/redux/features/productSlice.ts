import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IProductData } from '@/types/product-d-t';
import { ICategoryData } from '@/types/category-d-t';

interface ProductState {
  products: IProductData[];
  categories: ICategoryData[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  categories: [],
  loading: false,
  error: null,
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

function formatImageUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('/uploads')) {
    return `${BACKEND_URL}${url}`;
  }
  return url;
}

export const fetchProductsAndCategories = createAsyncThunk(
  'product/fetchProductsAndCategories',
  async (_, { rejectWithValue }) => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/v1/products`),
        fetch(`${BACKEND_URL}/api/v1/categories`)
      ]);
      
      if (!prodRes.ok || !catRes.ok) {
        throw new Error('Failed to fetch from backend');
      }

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      const categories: ICategoryData[] = catData.map((c: any) => ({
        id: c.id,
        img: formatImageUrl(c.image?.url),
        name: c.name,
        slug: c.slug,
        parent: c.name,
        children: c.children || [],
        product_id: c.product_id || []
      }));

      const products: IProductData[] = prodData.items.map((p: any) => ({
        ...p,
        image: p.thumbnail ? {
          id: Number(p.thumbnail.id) || 1,
          original: formatImageUrl(p.thumbnail.url),
          thumbnail: formatImageUrl(p.thumbnail.url)
        } : { id: 1, original: '' },
        category: p.category ? {
          parent: p.category.parent || '',
          child: p.category.child || ''
        } : { parent: '', child: '' },
        reviews: p.reviews || [],
        gallery: (p.gallery || (p.images || []).map((img: any) => img.url)).map(formatImageUrl)
      }));

      return { products, categories };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error occurred');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAndCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsAndCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.categories = action.payload.categories;
      })
      .addCase(fetchProductsAndCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;
