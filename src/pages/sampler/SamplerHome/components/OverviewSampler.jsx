import React, { useState, useMemo } from "react";
import { Card, Dropdown, Menu, Spin } from "antd";
import { DownOutlined, FilterOutlined } from "@ant-design/icons";
import itemsInShipment from "../../../../assets/items-in-shipment.svg";
import totalReviews from "../../../../assets/total-reviews.svg";
import totalEarnings from "../../../../assets/total-earnings.svg";
import { useGetOverviewQuery } from "../../../../Redux/sampler/overviewApis";

const OverviewSampler = () => {
  // Default filter
  const [selectedFilter, setSelectedFilter] = useState("thisMonth");
  const [labelName, setLabelName] = useState("This Month");

  const { data, isLoading, isFetching } = useGetOverviewQuery({
    dateRange: selectedFilter,
  });

  // Create a mapping for labels
  const filterLabels = {
    today: "Today",
    thisWeek: "This Week",
    lastWeek: "Last Week",
    thisMonth: "This Month",
    lastMonth: "Last Month",
    last6Months: "Last 6 Month",
    thisYear: "This Year",
  };

  const handleMenuClick = (e) => {
    setSelectedFilter(e.key);
    setLabelName(filterLabels[e.key]);
  };

  const menu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        { label: "Today", key: "today" },
        { label: "This Week", key: "thisWeek" },
        { label: "Last Week", key: "lastWeek" },
        { label: "This Month", key: "thisMonth" },
        { label: "Last Month", key: "lastMonth" },
        { label: "Last 6 Month", key: "last6Months" },
        { label: "This Year", key: "thisYear" },
      ]}
    />
  );

  const overviewItems = useMemo(() => {
    if (!data?.data) return [];

    return [
      {
        id: 1,
        icon: totalEarnings,
        name: "Total Earnings",
        earn: data.data.totalEarning.value,
        currency: "$",
        percentage: `${data.data.totalEarning.change}%`,
        type: `${labelName}`,
        percentageType:
          data.data.totalEarning.change > 0
            ? "increase"
            : data.data.totalEarning.change < 0
            ? "decrease"
            : "neutral",
      },
      {
        id: 2,
        icon: totalReviews,
        name: "Total Reviews",
        earn: data.data.totalReview.value,
        percentage: `${data.data.totalReview.change}%`,
        type: labelName,
        percentageType:
          data.data.totalReview.change > 0
            ? "increase"
            : data.data.totalReview.change < 0
            ? "decrease"
            : "neutral",
      },
      {
        id: 3,
        icon: itemsInShipment,
        name: "Items in Shipment",
        earn: data.data.itemInShipment.value,
        percentage: `${data.data.itemInShipment.change}%`,
        type: labelName,
        percentageType:
          data.data.itemInShipment.change > 0
            ? "increase"
            : data.data.itemInShipment.change < 0
            ? "decrease"
            : "neutral",
      },
    ];
  }, [data, labelName]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card loading key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mt-14">
        <h2 className="text-xl font-semibold mb-5">Overview</h2>
        <Dropdown overlay={menu} trigger={["click"]}>
          <button className="border border-gray-300 px-3 py-1 rounded-lg flex items-center gap-2 text-gray-600 hover:bg-gray-100">
            <FilterOutlined />
            {isFetching ? "Loading..." : labelName} <DownOutlined />
          </button>
        </Dropdown>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4">
        {overviewItems.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex gap-2 items-center mb-3">
              {<img src={item.icon} alt={item.name} className="mb-3" />}
              <p className="text-gray-500">{item.name}</p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              {isFetching ? (
                <div className="mb-4">
                  <Spin />
                </div>
              ) : (
                <>
                  <p className="text-xl font-semibold">
                    {item.currency || ""}
                    {item.earn.toLocaleString()}
                  </p>

                  <p
                    className={`text-sm ${
                      item.percentageType === "increase"
                        ? "text-green-500"
                        : item.percentageType === "decrease"
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {item.percentageType === "increase"
                      ? "▲"
                      : item.percentageType === "decrease"
                      ? "▼"
                      : ""}{" "}
                    {item.percentage}
                  </p>
                </>
              )}
              <p className="text-gray-600 text-sm">{item.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewSampler;
