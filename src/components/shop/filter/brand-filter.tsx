'use client';
import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { add_brand } from "@/redux/features/filter";
import { useAppProducts } from "@/hooks/useAppProducts";

const BrandFilter = () => {
  const products = useAppProducts();
  const { brand: stateBrand } = useAppSelector((state) => state.filter);
  const dispatch = useAppDispatch();

  // Get unique brands and count how many products belong to each brand
  const brands = React.useMemo(() => {
    const brandMap: { [key: string]: number } = {};
    products.forEach((p) => {
      if (p.brand) {
        const normalized = p.brand.trim();
        brandMap[normalized] = (brandMap[normalized] || 0) + 1;
      }
    });
    return Object.entries(brandMap).map(([name, count], index) => ({
      id: index + 1,
      name,
      count,
    }));
  }, [products]);

  return (
    <div className="tpshop__widget mb-30 pb-25">
      <h4 className="tpshop__widget-title">FILTER BY BRAND</h4>
      {brands.map((brand) => (
        <div key={brand.id} className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id={`brand-check-${brand.id}`}
            onChange={() => dispatch(add_brand(brand.name))}
            checked={stateBrand === brand.name}
          />
          <label
            className="form-check-label"
            htmlFor={`brand-check-${brand.id}`}
          >
            {brand.name} ({brand.count})
          </label>
        </div>
      ))}
    </div>
  );
};

export default BrandFilter;
