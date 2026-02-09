import { Button, Card, Empty, Tooltip } from "antd";
import React from "react";
import toast from "react-hot-toast";
import { CiSettings } from "react-icons/ci";
import {
  FaBell,
  FaBullhorn,
  FaDollarSign,
  FaShoppingCart,
  FaStar,
  FaThumbsUp,
  FaTruck,
  FaVideo,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNotificationPageQuery } from "../../../Redux/businessApis/business_notifications/notificationPageApis";

const getIcon = (type) => {
  switch (type) {
    case "likeOnPost":
      return <FaThumbsUp className="text-blue-500" />;
    case "review":
      return <FaVideo className="text-orange-500" />;
    case "payment":
      return <FaDollarSign className="text-green-500" />;
    case "orderNotification":
      return <FaShoppingCart className="text-purple-500" />;
    case "shipping":
      return <FaTruck className="text-gray-500" />;
    case "general":
      return <FaBullhorn className="text-yellow-500" />;
    default:
      return <FaBell className="text-gray-500" />;
  }
};

// const getActions = (type, isRead) => {
//   switch (type) {
//     case "likeOnPost":
//       return ["View Stats", isRead ? "Marked as read" : "Mark as read"];
//     case "review":
//       return ["Watch Review", isRead ? "Marked as read" : "Mark as read"];
//     case "orderNotification":
//       return ["View Order", isRead ? "Marked as read" : "Mark as read"];
//     case "payment":
//       return ["See details", isRead ? "Marked as read" : "Mark as read"];
//     case "campaign":
//       return ["See details", isRead ? "Marked as read" : "Mark as read"];
//     case "shipping":
//       return ["See details", isRead ? "Marked as read" : "Mark as read"];
//     default:
//       return [isRead ? "Marked as read" : "Mark as read"];
//   }
// };

const AllNotificationPage = () => {
  const [limit, setLimit] = React.useState(10)
  const [type, setType] = React.useState("")
  const { data: notificationRes, isLoading: notificationLoading, isFetching } = useNotificationPageQuery({
    limit,
    sortOrder: "desc",
    ...(type !== "" && { type })
  })
  console.log(notificationRes)
  // LIKE: 'likeOnPost',
  // COMMENT: 'commentOnPost',
  // MENTION: 'mention',
  // FOLLOW: 'newFollower',
  // REPLY: 'mention',
  // ORDER: 'orderNotification',
  // ORDER_SHIPPED: 'orderNotification',
  // REVIEW: 'review',
  // REVIEW_REQUEST: 'reviewRequest',
  // REVIEW_PRODUCT_SHIPPED: 'reviewProductShipped',
  // PAYMENT: 'payment',
  // SHIPPING: 'shipping',
  // ANNOUNCEMENT: 'general',
  // SYSTEM_UPDATE: 'general',
  // GENERAL: 'general',
  // PAYMENT_RECEIVED: 'customerNotification',


  // const handleAction = (type, orderId, action) => {
  //   if (type === "likeOnPost" && action === "Mark as read") {
  //     toast.success("Marked as read");
  //   } else if (type === "review" && action === "Mark as read") {
  //     toast.success("Marked as read");
  //   } else if (type === "orderNotification" && action === "View Order") {
  //     navigate("/sales/single-order", { state: { orderId } });
  //   } else if (type === "payment" && action === "See details") {
  //     toast.success("Marked as read");
  //   } else if (type === "campaign" && action === "See details") {
  //     toast.success("Marked as read");
  //   } else if (type === "shipping" && action === "See details") {
  //     toast.success("Marked as read");
  //   } else if (type === "general" && action === "Mark as read") {
  //     toast.success("Marked as read");
  //   } else {
  //     toast.success("Marked as read");
  //   }
  // };

  const categories = [
    { icon: <FaBell size={18} />, value: "", label: "All" },
    { icon: <FaStar size={18} />, value: "review", label: "Reviews" },
    { icon: <FaBullhorn size={18} />, value: "campaign", label: "Campaign" },
    { icon: <FaDollarSign size={18} />, value: "payment", label: "Payments" },
    { icon: <FaShoppingCart size={18} />, value: "orderNotification", label: "Orders" },
    { icon: <FaTruck size={18} />, value: "shipping", label: "Shipping" },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-10rem)] container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <div className="flex gap-2">
          {/* <Button variant="link" className="text-blue-500">
            Mark all as read
          </Button> */}
          <Link to={"/settings"} state={{ tab: "notifications" }}>
            <Button variant="outline" className="flex items-center gap-2">
              <CiSettings size={18} />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto mb-4">
        {categories.map((category, index) => (
          <Button
            key={index}
            variant={index === 0 ? "default" : "outline"}
            className="flex items-center gap-2"
            onClick={() => setType(category.value)}
          >
            {category.icon}
            <span>{category.label}</span>
          </Button>
        ))}
      </div>

      {/* Notifications list */}
      <Card loading={notificationLoading || isFetching} className="p-4">
        <div className="divide-y divide-gray-200">
          {notificationRes?.data?.result?.length > 0 ? notificationRes?.data?.result?.map((item, index) => (
            <div
              key={index}
              className={`py-4 flex items-start gap-4 ${item?.isRead ? "opacity-60" : ""
                }`}
            >
              <div className="text-xl flex-shrink-0">
                {getIcon(item?.type)}
              </div>
              <div className="flex-grow">
                <h3 className="font-medium">{item?.title}</h3>
                <p className="text-gray-600">{item?.message}</p>


                {/* <div className="flex gap-2">
                  {getActions(item?.type, item?.isRead).map((action, actionIndex) => (
                    <Button
                      key={actionIndex}
                      variant="link"
                      type={item?.isRead ? "default" : "primary"}
                      className="text-blue-500 h-auto p-0"
                      onClick={() => handleAction(item?.type, item?.data?.orderId, action)}
                    //TODO: onclick mark as read
                    >
                      {action}
                    </Button>
                  ))}
                </div> */}
              </div>
              <time className="text-xs text-gray-500">{new Date(item?.createdAt).toLocaleString()}</time>
            </div>
          )) : <Empty description="No notifications" />}
        </div>
        {notificationRes?.data?.result?.length > 0 && <div className="text-center mt-4">
          <Tooltip title={limit >= notificationRes?.data?.meta?.total ? "No more notifications" : ""}>
            <Button
              disabled={notificationLoading || limit >= notificationRes?.data?.meta?.total}
              loading={notificationLoading}
              onClick={() => {
                if (limit >= notificationRes?.data?.meta?.total) {
                  toast.dismiss()
                  toast.error("No more notifications");
                } else {
                  setLimit(limit + 10);
                }
              }} variant="link" className="text-blue-500">
              Load more notifications
            </Button>
          </Tooltip>
        </div>}
      </Card>
    </div>
  );
};

export default AllNotificationPage;
