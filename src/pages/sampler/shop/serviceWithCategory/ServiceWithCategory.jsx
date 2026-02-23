import React, { useState } from "react";
import { Card, Input, Select, Typography, Badge } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../../breadcrumbs/Breadcrumbs";
import { useCategorySectionApisQuery } from "../../../../Redux/sampler/categoryApis";
import {
  useBookmarkUpdateMutation,
  useGetProductApisQuery,
} from "../../../../Redux/sampler/productApis";
import toast from "react-hot-toast";
import circleBg from "../../../../assets/circle.png";

const { Search } = Input;
const { Title, Text } = Typography;
const { Meta } = Card;

const ServiceWithCategory = () => {
  const { id, name } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(id);
  const [sortBy, setSortBy] = useState("");

  const { data: getAllCategory, isLoading } = useCategorySectionApisQuery();
  const [bookmarkUpdate] = useBookmarkUpdateMutation();

  const categories = getAllCategory?.data;

  const {
    data: getProducts,
    isLoading: isLoadingProducts,
    refetch,
  } = useGetProductApisQuery({ selectedCategory, sortBy, searchTerm });

  const navigate = useNavigate();

  const handleClickBookmark = async (product) => {
    try {
      const res = await bookmarkUpdate({
        id: product,
      }).unwrap();
      if (res.success) {
        toast.success(res.message);
      }
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="responsive-width ">
      <div className="h-[100vh]  mx-auto px-4 !mt-5   overflow-y-auto scrollbar-none mb-20 ">
        <Breadcrumbs />
        <div className="flex justify-between items-center mb-6">
          <Title level={2}>{name}</Title>
        </div>

        <div className="flex gap-6 mb-6 overflow-x-auto  pb-4">
          {isLoading && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
              <p className="text-[20px] font-semibold ml-2 !mt-5">Loading...</p>
            </div>
          )}
          {categories?.map((category) => (
            <div
              key={category?.name}
              className="p-2 flex items-center justify-center"
            >
              <Badge
                style={{
                    backgroundImage: `url(${circleBg})`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                className={
                  selectedCategory === category?._id
                    ? " overflow-hidden rounded-4xl  !mt-2"
                    : ""
                }
              >
                <div
                  className="w-48 h-48 text-center cursor-pointer rounded-full"
                  bodyStyle={{ padding: "12px" }}
                  onClick={() => setSelectedCategory(category?._id)}
                >
                  <div>
                    <img
                      className="w-30 h-30 bg-gray-100 rounded-full mx-auto mb-2 object-cover object-center"
                      src={category?.category_image}
                      alt=""
                    />
                  </div>
                  <Text>{category?.name}</Text>
                </div>
              </Badge>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex-1">
            <Search
              placeholder="Search products..."
              allowClear
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select
            defaultValue="newest"
            className="w-48"
            onChange={(value) => setSortBy(value)}
            options={[
              { value: "-price", label: "Low to High" },
              { value: "price", label: "High to Low" },
              { value: "", label: "Newest" },
            ]}
          />
        </div>
        {isLoadingProducts && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
            <p className="text-[20px] font-semibold ml-2 !mt-5">
              Loading Products...
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {getProducts?.data?.result?.map((product) => (
            <Card
              key={product?._id}
              className=" border  cursor-pointer border-gray-200 w-full max-w-[250px] rounded-lg overflow-hidden h-[400px]"
              cover={
                <div className="relative">
                  {product?.isBookmark ? (
                    <HeartFilled
                      onClick={() => {
                        handleClickBookmark(product?._id);
                      }}
                      className="cursor-pointer absolute top-2 right-2 text-4xl font-bold !text-red-500 rounded-full p-1"
                    />
                  ) : (
                    <HeartOutlined
                      onClick={() => {
                        handleClickBookmark(product?._id);
                      }}
                      className="cursor-pointer absolute top-2 right-2 text-4xl !text-gray-600 rounded-full p-1 hover:!text-red-500"
                    />
                  )}
                  <img
                    className="w-full h-[230px] object-cover object-center"
                    alt={product?.name}
                    src={product?.images?.[0]}
                  />
                </div>
              }
            >
              <Meta
                onClick={() => {
                  navigate(
                    `/sampler/shop/category/${product?.name}/${product?._id}`,
                  );
                }}
                title={product?.name}
                description={
                  <div className="flex justify-between flex-col h-[100px]">
                    <p
                      className="text-sm text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html:
                          product?.description?.length > 50
                            ? `${product?.description?.slice(0, 50)}...`
                            : product?.description,
                      }}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xl font-semibold">
                        ${product?.price}
                      </span>
                    </div>
                  </div>
                }
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceWithCategory;
