import React, { useRef } from "react";
import { Card, Carousel, Skeleton } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useCategorySectionApisQuery } from "../../../../../Redux/sampler/categoryApis";
import circleBg from "../../../../../assets/circle.png";
const CategoryCarousel = () => {
  const carouselRef = useRef(null);

  const { data: getAllCategory, isLoading } = useCategorySectionApisQuery();

  const categories = getAllCategory?.data;

  return (
    <div className="my-8 relative">
      <h2 className="text-[24px] font-bold mb-4 p-2 ">Shop by Category</h2>
      {categories?.length !== 0 ? (
        <>
          <button
            className="absolute left-0 top-1/2 transform cursor-pointer -translate-y-1/2 bg-gray-900  text-white p-3 !mt-5 rounded-full shadow-md hover:bg-gray-700 transition z-10"
            onClick={() => carouselRef.current.prev()}
          >
            <LeftOutlined className="!text-white" />
          </button>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer bg-gray-900 text-white p-3 !mt-5 rounded-full shadow-md hover:bg-gray-700 transition z-10"
            onClick={() => carouselRef.current.next()}
          >
            <RightOutlined className="!text-white" />
          </button>
          {/* {isLoading && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
              <p className="text-[20px] font-semibold ml-2 !mt-5">Loading...</p>
            </div>
          )} */}
          <Carousel
            ref={carouselRef}
            dots={false}
            slidesToShow={4}
            slidesToScroll={1}
            responsive={[
              { breakpoint: 1024, settings: { slidesToShow: 3 } },
              { breakpoint: 768, settings: { slidesToShow: 2 } },
              { breakpoint: 480, settings: { slidesToShow: 1 } },
            ]}
          >
            {isLoading ?
              Array.from({ length: 4 }).map((_, index) => (
                <div className="flex ml-12 items-center justify-center">
                  <div
                    key={index}
                    className="max-w-52 aspect-square h-52 rounded-full animate-pulse bg-gray-200 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-l2 border-b-2 animate-spin"></div>
                  </div>
                </div>
              ))
              : categories?.map((category, index) => (
                <Link
                  to={`/sampler/shop/${category._id}/${category.name}`}
                  key={index}
                  className="p-2"
                  state={{ categoryId: category.id }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      style={{
                        backgroundImage: `url(${circleBg})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}
                      className="flex flex-col items-center overflow-hidden justify-center w-52 h-52 
                      p-4 border-gray-300 rounded-full border cursor-pointer hover:shadow-lg transition"
                    >
                      <img
                        src={category.category_image}
                        alt={category.name}
                        className="w-52 h-52 bg-transparent rounded-full mx-auto  object-cover object-center"
                      />
                    </div>
                    <p className="text-sm text-black font-medium !mt-5 text-center">
                      {category.name}
                    </p>
                  </div>
                </Link>
              ))}
          </Carousel>
        </>
      ) : (
        <div className="text-center">
          <p className="text-2xl font-semibold ">No categories found.</p>
          <div className="text-gray-600 text-sm">
            Looks like you don't have any categories yet. Check back soon!
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCarousel;
