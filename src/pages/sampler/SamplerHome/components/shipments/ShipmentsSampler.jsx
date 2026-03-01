import React, { useState } from "react";
import { Table, Tabs, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import OrderDetails from "./components/OrderDetails";
import Loader from "../../../../loader/Loader";
import { useGetMyCampaignOfferQuery } from "../../../../../Redux/sampler/campaignApis";
import { useGetOrderListQuery } from "../../../../../Redux/sampler/orderApis";

const onChange = (key) => {
  console.log(key);
};

const ShipmentsSampler = () => {
  const Navigate = useNavigate();

  const { data: getMyCampaignOffer, isLoading: campaignLoading } =
    useGetMyCampaignOfferQuery({ page: 1, limit: 10 });
  const { data: getAllOrder, isLoading: isLoadingOrder } = useGetOrderListQuery(
    {
      page: 1,
      limit: 10,
    }
  );

  const [isClicked, setIsClicked] = useState(false);

  const productData =
    getMyCampaignOffer?.data?.result?.map((item) => ({
      id: item._id,
      name: item.product?.name,
      image: item.product?.images?.[0],
      date: new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(new Date(item.createdAt)),
      status: item.deliveryStatus,
      statusColor:
        item.deliveryStatus === "Waiting to be shipped"
          ? "orange"
          : item.deliveryStatus === "Delivered"
            ? "green"
            : "red",
    })) || [];

  const columns = [
    {
      title: <span style={{ color: "gray" }}>Item Name</span>,
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div className="flex gap-2 items-center">
          <img src={record.image} alt={record.name} className="w-10 h-10" />
          <h3>{record.name}</h3>
        </div>
      ),
    },
    {
      title: <span style={{ color: "gray" }}>Date</span>,
      dataIndex: "date",
      key: "date",
    },
    {
      title: <span style={{ color: "gray" }}>Status</span>,
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Tag color={record.statusColor}>{status}</Tag>
      ),
    },
  ];

  const productData2 =
    getAllOrder?.data?.result?.map((order) => ({
      key: order._id,
      name: order.items[0]?.product?.name || "Unnamed product",
      image:
        order.items[0]?.product?.images?.[0] ||
        "https://via.placeholder.com/40",
      length: order?.items?.length,
      date: new Date(order.createdAt).toLocaleDateString(),
      status: order.deliveryStatus || "Unknown",
      statusColor:
        order.paymentStatus === "Success"
          ? "green"
          : order.paymentStatus === "Pending"
            ? "orange"
            : "red",
    })) || [];

  const columns2 = [
    {
      title: "Item name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div className="flex gap-2 items-center">
          <img src={record.image} alt={record.name} className="w-10 h-10" />
          <div className="flex items-center">
            <h3 className="text-sm font-medium">{record.name}</h3>
            {record.length > 1 && (
              <span className="text-xs font-light ml-2">
                ({record.length} more items)
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Tag color={record.statusColor} key={status}>
          {status}
        </Tag>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <div
          type="link"
          className="border text-blue-500 border-blue-500 px-2 py-1 cursor-pointer rounded-md hover:bg-gray-100 flex items-center justify-center"
          onClick={() => setIsClicked(true)}
        >
          View
        </div>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: (
        <div className="flex gap-2">
          <div>Offer shipment</div>
          {/* <p className="text-red-400 rounded-full h-5 w-5 p-1.5 bg-red-100 border border-red-400 flex items-center justify-center">
            4
          </p> */}
        </div>
      ),
      children: [
        productData && productData.length > 0 ? (
          <Table
            loading={campaignLoading}
            columns={columns}
            dataSource={productData}
            rowKey="id"
            scroll={{ x: 1200 }}
            pagination={false}
          />
        ) : (
          <div
            key="noOffers"
            className="text-center border rounded-3xl border-gray-200 flex flex-col items-center justify-center py-10 w-full h-[30vh]"
          >
            <p className="font-bold text-xl">No Shipments to Track</p>
            <p className="mt-5 text-gray-500 max-w-[400px] w-full">
              Your shipment list is empty. Once you have active shipments,
              you'll be able to track them here and monitor their delivery
              status in real-time.
            </p>
          </div>
        ),
      ],
    },

    {
      key: "2",
      label: (
        <div className="flex gap-2">
          <div>My purchases</div>
          {/* <p className="text-red-400 rounded-full h-5 w-5 p-1.5 bg-red-100 border border-red-400 flex items-center justify-center">
            4
          </p> */}
        </div>
      ),
      children: [
        productData2 && productData2.length > 0 ? (
          <Table
            key="table1"
            columns={columns2}
            loading={isLoadingOrder || campaignLoading}
            dataSource={productData2}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1200 }}
          />
        ) : (
          <div
            key="noOffers"
            className="text-center flex flex-col items-center justify-center py-10 w-full h-[30vh]"
          >
            <p className="font-bold text-xl">No purchases to Track</p>
            <p className="mt-5 text-gray-500 max-w-[400px] w-full">
              Your purchase list is empty. Once you have active purchases,
              you'll be able to track them here and monitor their delivery
              status in real-time.
            </p>
          </div>
        ),
      ],
    },
  ];
  return (
    <div className="mt-20">
      <div>
        <div className="flex justify-between items-center mb-5 mt-14 ">
          <div className="  text-xl font-semibold">Shipments</div>
          <div
            onClick={() =>
              Navigate("/sampler/campaign/shipments/offer-shipments")
            }
            className="border border-gray-300 px-3 py-2 text-sm text-gray-700  cursor-pointer rounded-md hover:bg-gray-100"
          >
            See all
          </div>
        </div>
        <div className=" overflow-auto scroll-y-auto scrollbar-none">
          {isClicked ? (
            <OrderDetails setIsClicked={setIsClicked} />
          ) : (
            <Tabs
              defaultActiveKey="1"
              items={items}
              className="cursor-pointer"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentsSampler;
