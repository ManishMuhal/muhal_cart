"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter } from "next/navigation";
import { useAppCategories } from "@/hooks/useAppCategories";

// prop type
type IProps = {
  cls?: string;
  perView?: number;
  showCount?: boolean;
};

const CategoryArea = ({cls,perView=8,showCount=true}:IProps) => {
  const router = useRouter();
  const categories = useAppCategories();
  // slider setting
  const slider_setting = {
    slidesPerView: perView,
    spaceBetween: 20,
    autoplay: {
      delay: 3500,
      disableOnInteraction: true,
    },
    breakpoints: {
      "1400": {
        slidesPerView: perView,
      },
      "1200": {
        slidesPerView: 6,
      },
      "992": {
        slidesPerView: 5,
      },
      "768": {
        slidesPerView: 4,
      },
      "576": {
        slidesPerView: 3,
      },
      "0": {
        slidesPerView: 2,
      },
    },
  };

  // handle search 
  const handleCategorySearch = (title:string) => {
    router.push(`/search?category=${title.split(" ").join("-").toLowerCase()}`);
  }
  return (
    <>
      <Swiper {...slider_setting} className={`swiper-container ${cls}`}>
        {categories.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="category__item mb-30">
              <div className="category__thumb fix mb-15">
                <a onClick={() => handleCategorySearch(item.name)} className="pointer">
                  {item.img ? (
                    <Image
                      src={item.img}
                      width={80}
                      height={80}
                      alt="category-thumb"
                    />
                  ) : (
                    <div style={{ width: 80, height: 80, backgroundColor: '#eee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span>{item.name.substring(0, 2)}</span>
                    </div>
                  )}
                </a>
              </div>
              <div className="category__content">
                <h5 className="category__title">
                  <Link href="/shop">{item.name}</Link>
                </h5>
                {showCount && (
                  <span className="category__count">
                    {item.product_id.length <= 9 && item.product_id.length !== 0
                      ? `0${item.product_id.length}`
                      : `${item.product_id.length}`}{" "}
                    items
                  </span>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default CategoryArea;
