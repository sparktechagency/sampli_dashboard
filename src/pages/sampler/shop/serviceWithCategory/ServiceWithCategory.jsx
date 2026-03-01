import React, { useState, useRef, useCallback, useMemo, memo } from "react";
import { Input, Select, Card, Typography, Skeleton } from "antd";
import { HeartOutlined, HeartFilled, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Breadcrumbs from "../../../breadcrumbs/Breadcrumbs";
import { useCategorySectionApisQuery } from "../../../../Redux/sampler/categoryApis";
import { useBookmarkUpdateMutation, useGetProductApisQuery } from "../../../../Redux/sampler/productApis";

// ─── Constants ────────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: "-price", label: "Price: Low to High" },
  { value: "price", label: "Price: High to Low" },
  { value: "", label: "Newest" },
];

const SCROLL_AMOUNT = 250; // px per button click

// Strip HTML and truncate for safe plain-text previews
const truncateHtml = (html = "", max = 50) => {
  const text = html.replace(/<[^>]*>/g, "");
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

// ─── Sub-components (defined outside parent to avoid re-creation on render) ──

/** Left / Right scroll arrow buttons */
const ScrollControls = memo(({ onScroll }) => (
  <div className="absolute -top-10 right-0 z-10 flex gap-1">
    {["left", "right"].map((dir) => (
      <button
        key={dir}
        aria-label={`Scroll ${dir}`}
        onClick={() => onScroll(dir)}
        className="bg-white shadow rounded-full w-8 h-8 flex items-center justify-center
                   hover:bg-gray-100 transition-colors cursor-pointer"
      >
        {dir === "left" ? <LeftOutlined /> : <RightOutlined />}
      </button>
    ))}
  </div>
));

/** Single category pill */
const CategoryPill = memo(({ category, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-full shrink-0 cursor-pointer
      border transition-all duration-200
      ${isActive
        ? "bg-blue-100 border-blue-500 text-blue-700"
        : "bg-transparent border-transparent hover:bg-gray-100"}
    `}
  >
    <img
      src={category.category_image}
      alt={category.name}
      className="w-7 h-7 object-contain"
      loading="lazy"
      draggable={false}
    />
    <span className="text-sm whitespace-nowrap">{category.name}</span>
  </button>
));

/** Horizontally-scrollable category strip */
const CategoryStrip = memo(({ categories, isLoading, selectedId, onSelect }) => {
  const scrollRef = useRef(null);

  const scroll = useCallback((direction) => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: "smooth",
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex gap-3 py-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton.Button key={i} active shape="round" style={{ width: 110, height: 40 }} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative mt-12 mb-6">
      <ScrollControls onScroll={scroll} />
      <div
        ref={scrollRef}
        role="listbox"
        aria-label="Product categories"
        className="flex gap-3 overflow-x-auto scrollbar-hide touch-pan-x select-none
                   bg-blue-50/40 rounded-full px-3 py-2"
      >
        {categories.map((category) => (
          <CategoryPill
            key={category._id}
            category={category}
            isActive={selectedId === category._id}
            onClick={() => onSelect(category._id)}
          />
        ))}
      </div>
    </div>
  );
});

/** Bookmark heart icon — toggles filled/outline */
const BookmarkButton = memo(({ isBookmarked, onToggle }) => {
  const Icon = isBookmarked ? HeartFilled : HeartOutlined;
  return (
    <Icon
      role="button"
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      onClick={onToggle}
      className={`
        absolute top-2 right-2 text-3xl p-1 rounded-full cursor-pointer
        transition-colors duration-200
        ${isBookmarked ? "!text-red-500" : "!text-gray-400 hover:!text-red-400"}
      `}
    />
  );
});

/** Single product card */
const ProductCard = memo(({ product, onBookmark, onNavigate }) => (
  <Card
    className="border border-gray-200 rounded-xl overflow-hidden h-[400px]
               hover:shadow-md transition-shadow duration-200 w-full max-w-[250px]"
    cover={
      <div className="relative">
        <BookmarkButton
          isBookmarked={product.isBookmark}
          onToggle={() => onBookmark(product._id)}
        />
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-[220px] object-cover"
          loading="lazy"
        />
      </div>
    }
    onClick={() => onNavigate(product)}
    bodyStyle={{ padding: "12px" }}
  >
    <p className="font-semibold text-sm text-gray-800 truncate mb-1">{product.name}</p>
    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
      {truncateHtml(product.description, 80)}
    </p>
    <span className="text-lg font-bold text-gray-900">${product.price}</span>
  </Card>
));

/** Skeleton grid shown while products load */
const ProductSkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton key={i} active paragraph={{ rows: 3 }} />
    ))}
  </div>
);

// ─── Main Page Component ───────────────────────────────────────────────────────

const ServiceWithCategory = () => {
  const { id, name } = useParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(id);
  const [sortBy, setSortBy] = useState("");

  // ── Data fetching ──────────────────────────────────────────────────────────
  const { data: categoryData, isLoading: isCategoriesLoading } = useCategorySectionApisQuery();
  const [bookmarkUpdate] = useBookmarkUpdateMutation();
  const {
    data: productData,
    isLoading: isProductsLoading,
    refetch,
  } = useGetProductApisQuery({ selectedCategory, sortBy, searchTerm });

  const categories = categoryData?.data ?? [];
  const products = productData?.data?.result ?? [];

  // ── Handlers ───────────────────────────────────────────────────────────────

  // Inline debounce — replace with useDebounce hook if you prefer
  const searchTimerRef = useRef(null);
  const handleSearch = useCallback((e) => {
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setSearchTerm(e.target.value);
    }, 400);
  }, []);

  const handleCategorySelect = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleSortChange = useCallback((value) => {
    setSortBy(value);
  }, []);

  const handleBookmark = useCallback(async (productId) => {
    try {
      const res = await bookmarkUpdate({ id: productId }).unwrap();
      if (res.success) toast.success(res.message);
      refetch();
    } catch (err) {
      toast.error("Failed to update bookmark.");
      console.error(err);
    }
  }, [bookmarkUpdate, refetch]);

  const handleNavigate = useCallback((product) => {
    navigate(`/sampler/shop/category/${product.name}/${product._id}`);
  }, [navigate]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="responsive-width">
      <div className="h-screen mx-auto px-4 mt-5 overflow-y-auto scrollbar-none mb-20">

        <Breadcrumbs />

        <Typography.Title level={2} className="mb-6">{name}</Typography.Title>

        {/* Category strip */}
        <CategoryStrip
          categories={categories}
          isLoading={isCategoriesLoading}
          selectedId={selectedCategory}
          onSelect={handleCategorySelect}
        />

        {/* Search + Sort toolbar */}
        <div className="flex gap-4 mb-6 flex-wrap justify-between">
          <Input
            placeholder="Search products..."
            allowClear
            onChange={handleSearch}
            onPressEnter={handleSearch}
            className="flex-1! max-w-md! py-3! px-6! rounded-full!"
            style={{ border: "1px solid rgb(56,120,239,0.3)" }}
            size="large"
          />
          <Select
            size="large"
            defaultValue=""
            className="w-48 rounded-full"
            onChange={handleSortChange}
            options={SORT_OPTIONS}
          />
        </div>

        {/* Product grid */}
        {isProductsLoading ? (
          <ProductSkeletonGrid />
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-lg">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onBookmark={handleBookmark}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ServiceWithCategory;