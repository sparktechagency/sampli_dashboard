import { Card, Empty, Pagination } from "antd";
import React from "react";
import { FaRegComment, FaTruck } from "react-icons/fa";
import { FiDollarSign } from "react-icons/fi";
import { GrGift } from "react-icons/gr";
import { IoIosStarOutline } from "react-icons/io";
import { useGetProductsNotificationsQuery } from "../../../../../../Redux/sampler/notificationsApis";

const icons = {
  review: <GrGift className="w-5 mr-2 mt-1" />,
  reviewer: <IoIosStarOutline className="w-5 mr-2 mt-1" />,
  orderNotification: <FaTruck className="w-5 mr-2 mt-1" />,
  payment: <FiDollarSign className="w-5 mr-2 mt-1" />,
  commentOnPost: <FaRegComment className="w-5 mr-2 mt-1" />,
};

const NotificationCard = ({ notification }) => {
  const product = notification.data?.product;
  return (
    <div
      className={`flex justify-between border border-gray-200 p-4 rounded-lg mb-4 text-gray-700 ${notification.isRead ? "bg-white" : "bg-gray-50"
        }`}
    >
      {icons[notification.type] || null}

      <div className="flex-1">
        <section className="flex justify-between">
          <div className="flex items-center gap-3">
            <div className="font-medium">{notification.title}</div>
          </div>
          <div className="text-gray-400 text-sm">
            <h1 className='text-xs'>{new Date(notification.createdAt).toLocaleString()}</h1>
          </div>
        </section>

        <div className="flex justify-between items-start mt-3">
          <section className="text-gray-500 max-w-[400px] w-full text-[14px]">
            {notification.message}
          </section>

          {product ? null : (
            <div className="border border-blue-500 w-[120px] flex items-center justify-center text-blue-500 p-2 rounded-md text-[14px] cursor-pointer hover:bg-gray-100">
              View
            </div>
          )}
        </div>

        {product?.name && (
          <div className="flex items-center justify-between border p-2 mt-3 border-gray-200 rounded-md">
            <div className="flex items-center gap-2">
              {product.images?.[0] && (
                <img
                  src={product.images[0]}
                  className="w-16 h-16 border rounded"
                  alt={product.name}
                />
              )}
              <div>
                <div className="font-medium">{product.name}</div>
              </div>
            </div>
            {/* <div className="border flex items-center justify-center border-blue-500 w-[120px] text-blue-500 p-2 rounded-md text-[14px] cursor-pointer hover:bg-gray-100">
              View
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

const NotificationsSampler = () => {
  const [page, setPage] = React.useState(1);
  const { data: notificationData, isLoading } =
    useGetProductsNotificationsQuery({
      limit: 10,
      page,
    });

  if (isLoading)
    return (
      <div className="h-[94vh] gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card loading key={index} className="!mb-2" />
        ))}
      </div>
    );

  return (
    <div className="h-[94vh] overflow-auto scrollbar-none">
      <h1 className="text-xl font-semibold mb-6">Notifications</h1>
      <div>
        {notificationData?.data?.result?.length > 0 ? (
          notificationData?.data?.result?.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
            />
          ))
        ) : (
          <div>
            <div className="flex items-center justify-center">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No data found"
              />
            </div>
          </div>
        )}
        <Pagination
          current={page}
          onChange={(page) => setPage(page + 10)}
          defaultPageSize={10}
          total={notificationData?.data?.meta?.total}
          hideOnSinglePage
          showSizeChanger={false}
          className="!my-12 flex items-center justify-center"
        />
      </div>
    </div>
  );
};

export default NotificationsSampler;
