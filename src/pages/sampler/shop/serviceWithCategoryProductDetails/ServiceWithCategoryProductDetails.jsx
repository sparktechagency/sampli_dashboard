import { Button, Card, Carousel, Pagination, Skeleton } from "antd";
import React, { useEffect, useRef, useState } from "react";
import CardComponent from "../components/cardComponent/CardComponent";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import SCProductDetails from "./SCProductDetails";
import ReviewRatingSampler from "./ReviewRatingSampler";
import ReviewCardSampler from "./ReviewCardSampler";
import StoreProfileSampler from "./StoreProfileSampler";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import productImage from "/public/product_image.svg";
import { useLocation, useParams } from "react-router-dom";
import {
  useGetBusinessProductApisQuery,
  useGetCategoryProductApisQuery,
  useGetSingleProductApisQuery,
  useGetVariantProductApisQuery,
} from "../../../../Redux/sampler/productApis";
import Meta from "antd/es/card/Meta";
import { useGetSingleProductReviewQuery } from "../../../../Redux/sampler/reviewApis";
import Loader from "../../../loader/Loader";

const ServiceWithCategoryProductDetails = () => {
  const location = useLocation();
  const { id } = useParams();
  const { referral } = location.state || {};
  const [businessId, setBusinessId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [reviewPage, setReviewPage] = useState(1);

  const carouselRef = useRef(null);
  const { data: getSingleProduct, isLoading: singleProductLoading } =
    useGetSingleProductApisQuery({
      id,
    });

  const {
    data: getSingleProductReview,
    isLoading: singleProductReviewLoading,
  } = useGetSingleProductReviewQuery({
    id,
  });

  const { data: getBusinessProducts, isLoading: businessProductLoading } =
    useGetBusinessProductApisQuery(businessId ? { id: businessId } : {}, {
      skip: !businessId,
    });
  const { data: getCategoryProducts, isLoading: categoryProductLoading } =
    useGetCategoryProductApisQuery(categoryId ? { id: categoryId } : {}, {
      skip: !categoryId,
    });

  useEffect(() => {
    if (getSingleProduct) {
      setBusinessId(getSingleProduct?.data?.bussiness?._id);
      setCategoryId(getSingleProduct?.data?.category?._id);
    }
  }, [getSingleProduct]);

  if (
    singleProductLoading ||
    singleProductReviewLoading ||
    businessProductLoading ||
    categoryProductLoading
  ) {
    return (
      <div className="h-screen">
        <Loader />
      </div>
    );
  }

  const onReviewPageChange = (page) => {
    setReviewPage(page);
  };

  const meta = getSingleProductReview?.data?.meta;

  return (
    <div className="responsive-width !mb-32">
      {/* product details */}
      <section>
        <SCProductDetails referral={referral} />
      </section>

      {/*From same seller  */}
      <section className=" px-4  mt-24 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">From same seller</h2>
        </div>

        <button
          className="absolute left-0 top-1/2 transform cursor-pointer -translate-y-1/2 bg-gray-900 text-white p-3 rounded-full shadow-md hover:bg-gray-700 transition z-10"
          onClick={() => carouselRef.current.prev()}
        >
          <LeftOutlined className="!text-white" />
        </button>

        <button
          className="absolute cursor-pointer right-0 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white p-3 rounded-full shadow-md hover:bg-gray-700 transition z-10"
          onClick={() => carouselRef.current.next()}
        >
          <RightOutlined className="!text-white" />
        </button>

        {businessProductLoading && (
          <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 ">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card
                key={index}
                className="border border-gray-200 w-full max-w-[250px] rounded-lg overflow-hidden h-[400px]"
                cover={
                  <div className="relative">
                    <Skeleton.Image
                      active
                      className="!w-full !h-[230px] object-cover object-center"
                    />
                    <div className="absolute top-4 right-4 z-10">
                      <Skeleton.Avatar active size="large" shape="circle" />
                    </div>
                  </div>
                }
              >
                <Meta
                  title={
                    <Skeleton.Input
                      style={{ width: 120 }}
                      active
                      size="small"
                    />
                  }
                  description={
                    <div className="flex justify-between flex-col h-[100px]">
                      <div className="text-sm text-gray-600">
                        <Skeleton
                          active
                          paragraph={{ rows: 2 }}
                          title={false}
                        />
                      </div>
                      <div className="flex gap-3 items-center mt-2 text-[18px]">
                        <Skeleton.Input
                          style={{ width: 60 }}
                          active
                          size="small"
                        />
                        <Skeleton.Input
                          style={{ width: 60 }}
                          active
                          size="small"
                        />
                      </div>
                    </div>
                  }
                />
              </Card>
            ))}
          </div>
        )}

        {getBusinessProducts?.data?.result?.length > 0 && (
          <Carousel
            ref={carouselRef}
            dots={false}
            slidesToShow={4}
            slidesToScroll={2}
            responsive={[
              { breakpoint: 1024, settings: { slidesToShow: 3 } },
              { breakpoint: 768, settings: { slidesToShow: 2 } },
              { breakpoint: 480, settings: { slidesToShow: 1 } },
            ]}
          >
            {getBusinessProducts?.data?.result?.map((item, index) => (
              <div className="ml-7" key={index}>
                <CardComponent item={item} />
              </div>
            ))}
          </Carousel>
        )}
      </section>

      {/* store info */}
      <section className="!my-20  px-4">
        <StoreProfileSampler businessId={businessId} />
      </section>

      {/* Review products */}
      <div className="px-5">
        <div className="text-xl  mb-5">Reviews</div>
        <div className="flex gap-5 items-start ">
          <div className="flex-1">
            <ReviewRatingSampler id={id} />
          </div>
          <div className="flex-1">
            {getSingleProductReview?.data?.result?.map((review, index) => (
              <ReviewCardSampler key={index} review={review} />
            ))}
            <Pagination
              current={reviewPage || meta?.page}
              total={meta?.total || 0}
              pageSize={meta?.limit || 10}
              onChange={onReviewPageChange}
              className="!my-12 flex items-center justify-center"
              showSizeChanger={false}
              itemRender={(current, type, originalElement) => {
                if (type === "prev") {
                  return (
                    <Button className="!border-none">
                      <FaAngleLeft />
                    </Button>
                  );
                }
                if (type === "next") {
                  return (
                    <Button className="!border-none">
                      <FaAngleRight />
                    </Button>
                  );
                }
                if (type === "page") {
                  return <Button className="!border-none">{current}</Button>;
                }
                return originalElement;
              }}
            />
          </div>
        </div>
      </div>

      {/* similar products */}
      <section className=" px-4  mt-24 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Similar Products</h2>
        </div>

        <button
          className="absolute left-0 top-1/2 transform cursor-pointer -translate-y-1/2 bg-gray-900 text-white p-3 rounded-full shadow-md hover:bg-gray-700 transition z-10"
          onClick={() => carouselRef.current.prev()}
        >
          <LeftOutlined className="!text-white" />
        </button>

        <button
          className="absolute cursor-pointer right-0 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white p-3 rounded-full shadow-md hover:bg-gray-700 transition z-10"
          onClick={() => carouselRef.current.next()}
        >
          <RightOutlined className="!text-white" />
        </button>

        {getCategoryProducts?.data?.result?.length > 0 ? (
          <Carousel
            ref={carouselRef}
            dots={false}
            slidesToShow={4}
            slidesToScroll={2}
            responsive={[
              { breakpoint: 1024, settings: { slidesToShow: 3 } },
              { breakpoint: 768, settings: { slidesToShow: 2 } },
              { breakpoint: 480, settings: { slidesToShow: 1 } },
            ]}
          >
            {getCategoryProducts?.data?.result?.map((item, index) => (
              <div className="ml-7" key={index}>
                <CardComponent item={item} />
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 !mb-5"></div>
            <p className="text-[20px] font-semibold ml-2 mt-5">Loading...</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ServiceWithCategoryProductDetails;
