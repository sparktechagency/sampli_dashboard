import React, { useState } from "react";
import {
  Star,
  Eye,
  Heart,
  MessageCircle,
  DollarSign,
  TrendingUp,
  Calendar,
  User,
  Package,
  Video,
  Image,
} from "lucide-react";
import { useLocation } from "react-router-dom";

const SamplerReviewer = () => {
  const location = useLocation();
  const reviewData = location.state;

  const [isLoadingVideo, setIsLoadingVideo] = useState(true);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-4">
      <div className="responsive-width mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Earnings Details
            </h1>
            <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <DollarSign className="w-5 h-5" />
              <span className="font-semibold">{reviewData.amount}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Reviewer</p>
                <p className="font-semibold">{reviewData.reviewer.name}</p>
                <p className="text-xs text-gray-400">
                  @{reviewData.reviewer.username}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Product</p>
                <p className="font-semibold">{reviewData.product.name}</p>
                <p className="text-xs text-gray-400">
                  ${reviewData.product.price}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-semibold text-sm">
                  {formatDate(reviewData.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Base Amount
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ${reviewData.amount}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Commissions
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  ${reviewData.totalCommissions}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Referral Sales
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {reviewData.totalReferralSales}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-emerald-600">
                  ${reviewData.amount + reviewData.totalCommissions}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Performance Metrics
          </h2>

          <p className="text-gray-700  p-3 rounded-lg">
            {reviewData.description}
          </p>

          {reviewData?.video && (
            <div
              className="relative rounded-lg overflow-hidden bg-gray-100 mb-4"
              style={{ paddingTop: "56.25%" }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {isLoadingVideo && (
                  <div className="loader absolute">
                    <p className="text-gray-500">Loading video...</p>
                  </div>
                )}

                <video
                  src={reviewData?.video}
                  controls
                  controlsList="nodownload"
                  preload="metadata"
                  className="absolute inset-0 w-full h-full"
                  onLoadedData={() => setIsLoadingVideo(false)}
                ></video>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {reviewData.totalView}
              </p>
              <p className="text-sm text-gray-500">Total Views</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {reviewData.totalLikers}
              </p>
              <p className="text-sm text-gray-500">Total Likes</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {reviewData.totalComments}
              </p>
              <p className="text-sm text-gray-500">Comments</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16  rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="flex">{renderStars(reviewData.rating)}</div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {reviewData.rating}.0/5
              </p>
              <p className="text-sm text-gray-500">Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SamplerReviewer;
