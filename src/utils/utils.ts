import { IProductData, IReview } from "@/types/product-d-t";

// calculate discount
export function discountPercentage(originalPrice: number, salePrice: number) {
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return discount;
}


export function isHot(updateDate: Date | string) {
  const updatedAt = new Date(updateDate);
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const timeDifference = currentDate.getTime() - updatedAt.getTime();

  // Calculate the difference in days
  const daysDifference = timeDifference / (1000 * 3600 * 24);

  // Check if the product is updated within the last month (30 days)
  const isHot = daysDifference < 30;

  return isHot;
}

// Get max price
export function maxPrice(products?: IProductData[]): number {
  const list = products || [];
  const max_price = [...list].reduce((max, product) => {
    return product.price > max ? product.price : max;
  }, 0);
  return max_price
}


export function averageRating(reviews: IReview[]) {
  if (!reviews || reviews.length === 0) {
    return 0; // Return 0 if there are no reviews
  }

  // Calculate the sum of all ratings
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

  // Calculate the average rating
  const avgRating = totalRating / reviews.length;

  return Number(avgRating.toFixed(0));
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

function formatImageUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('/uploads')) {
    return `${BACKEND_URL}${url}`;
  }
  return url;
}

export async function getServerProducts(): Promise<IProductData[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/products`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data || !data.items) return [];
    return data.items.map((p: any) => ({
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
  } catch (e) {
    console.error("Error fetching server products:", e);
    return [];
  }
}
