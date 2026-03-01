import React, { memo, useState } from "react";
import { useBookmarkUpdateMutation } from "../../../../../Redux/sampler/productApis";
import { Card } from "antd";
import toast from "react-hot-toast";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Meta from "antd/es/card/Meta";

const CardComponent = ({ item }) => {
  const navigate = useNavigate();
  const [bookmarkUpdate] = useBookmarkUpdateMutation();
  const [localBookmark, setLocalBookmark] = useState(item?.isBookmark);

  const handleClickBookmark = async () => {
    const previousState = localBookmark;
    setLocalBookmark(!localBookmark);

    try {
      const res = await bookmarkUpdate({ id: item?._id }).unwrap();
      toast.success(res?.message);
    } catch (error) {
      setLocalBookmark(previousState);
      toast.error(error?.data?.message || error?.message || 'Something went wrong!');
    }
  };
  console.log(item)
  return (
    <Card
      className="border border-gray-200 w-full max-w-62.5 rounded-lg overflow-hidden h-100"
      cover={
        <div>
          <button className="absolute bg-white rounded-sm top-4 right-4 z-10">
            {localBookmark ? (
              <HeartFilled
                className="text-2xl font-bold !text-red-500 rounded-full p-1"
                onClick={handleClickBookmark}
              />
            ) : (
              <HeartOutlined
                className="text-2xl text-gray-600 font-bold rounded-full p-1"
                onClick={handleClickBookmark}
              />
            )}
          </button>

          <img
            className="w-full h-57.5 object-cover object-center"
            alt={item?.name}
            src={item?.images?.[0]}
          />
        </div>
      }
    >
      <Meta
        onClick={() => navigate(`/sampler/shop/category/${item?.name}/${item?._id}`)}
        className="cursor-pointer p-0!"
        title={item?.name}
        description={item?.shortDescription ? <p className='line-clamp-3'>{item?.shortDescription}</p> : 'No description available'}
      />
    </Card>
  );
};

export default memo(CardComponent);
