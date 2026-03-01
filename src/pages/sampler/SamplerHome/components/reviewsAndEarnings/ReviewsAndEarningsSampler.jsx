import React from "react";
import { Table, Tag } from "antd";
import { Link, useNavigate } from "react-router-dom";
import productImage from "/public/product_image.svg";
import { useGetMyReviewsQuery } from "../../../../../Redux/sampler/profileApis";

const ReviewsAndEarningsSampler = () => {
  const Navigate = useNavigate();

  const { data: getMyReviewsProduct, isLoading } = useGetMyReviewsQuery();

  const productData =
    getMyReviewsProduct?.data?.data?.result?.map((item) => ({
      id: item._id,
      name: item.product?.name,
      image: item.product?.images?.[0],
      date: item.createdAt,
      ReviewEarnings: item.amount,
      Commission: item.totalCommissions,
      Total: item.amount + item.totalCommissions,
    })) || [];

  const columns = [
    {
      title: "Item name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div className="flex gap-2 items-center">
          <img
            src={record.image}
            alt={record.name}
            className="w-10 h-10 rounded-md"
          />
          <h3>{record.name}</h3>
        </div>
      ),
    },
    {
      title: <div className="text-gray-500">Date</div>,
      dataIndex: "date",
      key: "date",
      render: (_, record) => (
        <p className="text-gray-500">
          {new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }).format(new Date(record?.date))}
        </p>
      ),
    },
    {
      title: <div className="text-gray-500 text-center">Review Earnings</div>,
      dataIndex: "ReviewEarnings",
      key: "reviewEarnings",
      render: (_, record) => (
        <p className="text-gray-500 text-center">${record.ReviewEarnings}</p>
      ),
    },
    {
      title: <div className="text-gray-500 text-center">Commission</div>,
      dataIndex: "Commission",
      key: "commission",
      render: (_, record) => (
        <p className="text-gray-500 text-center">${record.Commission}</p>
      ),
    },
    {
      title: "Total",
      dataIndex: "Total",
      key: "total",
      render: (_, record) => (
        <div className="mb-3">
          {" "}
          <b>${record.Total}</b>
        </div>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Link
          className="border text-blue-500 border-blue-500 px-2 py-1 cursor-pointer rounded-md hover:bg-gray-100 flex items-center justify-center"
          to={`/sampler/review/${record.id}`}
          state={getMyReviewsProduct?.data?.data?.result?.find(
            (item) => item._id === record.id
          )}
        >
          View
        </Link>
      ),
    },
  ];
  return (
    <div className="mt-20">
      <div>
        <div className="flex justify-between items-center mb-5 mt-14 ">
          <div className="  text-xl font-semibold">
            Recent Reviews & Earnings
          </div>
          <div
            onClick={() => Navigate("/sampler/campaign/earnings")}
            className="border whitespace-nowrap border-gray-300 px-3 py-2 text-sm text-gray-700  cursor-pointer rounded-md hover:bg-gray-100"
          >
            See all
          </div>
        </div>
        <div>
          {productData && productData.length > 0 ? (
            <Table
              key="table"
              columns={columns}
              dataSource={productData}
              rowKey="id"
              loading={isLoading}
              pagination={false}
              scroll={{ x: 1200 }}
            />
          ) : (
            <div
              key="noOffers"
              className="text-center flex flex-col border rounded-3xl border-gray-200 items-center justify-center py-10 w-full h-[30vh]"
            >
              <p className="font-bold text-xl">No Reviews & Earnings Yet</p>
              <p className="mt-5 text-gray-500 max-w-[400px] w-full">
                Looks like you don't have any reviews yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsAndEarningsSampler;
