import React, { useRef } from 'react';
import { useCategorySectionApisQuery } from '../../../Redux/sampler/categoryApis';
import { Avatar, Skeleton } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

function FeedCategorySection({ setActiveCategory, activeCategory }) {
  const { data: categoryList, isLoading } = useCategorySectionApisQuery();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const scrollAmount = 200; // px per click
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (isLoading) {
    return (
      <div className="mb-3 flex gap-2 py-4 flex-col ">
        <div className="flex justify-end">
          <Skeleton.Button shape='circle' />
          <Skeleton.Button shape='circle' />
        </div>
        <div className="flex gap-2  overflow-x-auto scrollbar-hide touch-pan-x select-none">
          {
            Array.from({ length: 5 }).map((_, index) => (
              <Skeleton.Input key={index} style={{ width: '100%' }} />
            ))
          }
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-3 mt-12">
      {/* Scroll buttons */}
      <div className="absolute -top-6 right-0 z-10 flex gap-1">
        <button
          onClick={() => scroll('left')}
          className="bg-white cursor-pointer shadow rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100"
        >
          <LeftOutlined />
        </button>
        <button
          onClick={() => scroll('right')}
          className="bg-white cursor-pointer shadow rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100"
        >
          <RightOutlined />
        </button>
      </div>

      {/* Category list */}
      <div
        ref={scrollRef}
        className="flex gap-2 py-4 overflow-x-auto scrollbar-hide touch-pan-x select-none"
      >
        {categoryList?.data?.map((category) => (
          <div
            key={category?._id}
            onClick={() => setActiveCategory(category?._id)}
            className={`flex gap-2 rounded-full flex-nowrap items-center ${activeCategory === category?._id
              ? 'border border-[#1677FF]/20 bg-[#1677FF]/10'
              : 'bg-gray-100'
              } pl-1 pr-3 py-1 cursor-pointer hover:bg-gray-200`}
          >
            <Avatar
              src={category?.category_image}
              draggable={false}
              size={32}
              shape="circle"
              alt={category?.name}
              className="object-contain!"
            />
            <span className="text-nowrap">
              {category?.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeedCategorySection;
