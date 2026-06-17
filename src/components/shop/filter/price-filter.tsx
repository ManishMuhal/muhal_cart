"use client";
import React from "react";
import { set_price_value } from "@/redux/features/filter";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import InputRange from "@/components/ui/input-range";
import { maxPrice } from "@/utils/utils";
import { useAppProducts } from "@/hooks/useAppProducts";

const PriceFilter = () => {
  const { priceValue } = useAppSelector((state) => state.filter);
  const products = useAppProducts();
  const dispatch = useAppDispatch();

  const maxVal = Math.max(maxPrice(products), 10); // Guarantee max is at least 10 to avoid 0 boundaries

  React.useEffect(() => {
    if (products.length > 0 && priceValue[1] === 99999) {
      dispatch(set_price_value([0, maxVal]));
    }
  }, [products, maxVal, priceValue, dispatch]);

  // handleChanges
  const handleChanges = (val: number[]) => {
    dispatch(set_price_value(val));
  };

  const displayValues = [
    priceValue[0],
    priceValue[1] === 99999 ? maxVal : priceValue[1],
  ];

  return (
    <div className="tpshop__widget mb-30 pb-25">
      <h4 className="tpshop__widget-title mb-20">FILTER BY PRICE</h4>
      <div className="productsidebar">
        <div className="productsidebar__head"></div>
        <div className="productsidebar__range">
          <div id="slider-range">
            <InputRange
              MAX={maxVal}
              MIN={0}
              STEP={1}
              values={displayValues}
              handleChanges={handleChanges}
            />
          </div>
          <div className="price-filter mt-10">
            <span>₹{displayValues[0]} - ₹{displayValues[1]}</span>
          </div>
        </div>
      </div>
      <div className="productsidebar__btn mt-15 mb-15">
        <a href="#">FILTER</a>
      </div>
    </div>
  );
};

export default PriceFilter;
