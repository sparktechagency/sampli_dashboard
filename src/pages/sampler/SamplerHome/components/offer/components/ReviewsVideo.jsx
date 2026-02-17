import React, { useState } from "react";
import { FiMessageCircle, FiMoreHorizontal, FiShare2 } from "react-icons/fi";
import { CiHeart } from "react-icons/ci";
import { useGetAllReviewQuery } from "../../../../../../Redux/sampler/reviewApis";
import Loader from "../../../../../loader/Loader";
import { renderImage } from "../../../../samplerFeed/renderImage";

const ReviewsVideo = ({ showModal, product, status }) => {
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  const { data: reviewList, isLoading: reviewLoading } = useGetAllReviewQuery({
    product,
  });

  if (reviewLoading)
    return (
      <div className="h-screen">
        <Loader />
      </div>
    );
  const reviewListProduct = reviewList?.data?.data?.result;

  return (
    <>
      <div className=" mx-auto bg-white rounded-lg my-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Uploaded reviews</h2>
          {/* <button
            className={`bg-blue-500 !text-white hover:bg-blue-400 px-4 py-2 rounded-lg text-sm font-medium ${
              status !== "Processing"
                ? "cursor-not-allowed "
                : "cursor-pointer "
            }`}
            onClick={showModal}
            disabled={status !== "Processing"}
          >
            Upload New reviewss
          </button> */}
        </div>
      </div>

      {reviewListProduct && reviewListProduct?.length > 0 ? (
        reviewListProduct?.map((review) => (
          <div className=" mx-auto bg-white rounded-lg border border-gray-200 p-4">
            <div className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                    <img
                      src={review?.reviewer?.profile_image}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">
                        {review?.reviewer?.name} origi
                      </span>
                      <span className="text-gray-500 text-sm">
                        @{review?.reviewer?.username}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            style={{
                              color: i < review?.rating ? "#FFB400" : "#d3d3d3",
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-600 text-sm">
                        {review?.product?.name}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 text-sm font-medium">
                        {review?.category?.name}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-green-500 text-sm">
                        ${review?.amount}
                      </span>
                    </div>
                  </div>
                </div>
                {/* <button className="text-gray-400">
                  <FiMoreHorizontal size={16} />
                </button> */}
              </div>

              <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-3">
                {review?.video ? (
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
                        src={review?.video}
                        controls
                        controlsList="nodownload"
                        preload="metadata"
                        className="absolute inset-0 w-full h-full"
                        onLoadedData={() => setIsLoadingVideo(false)}
                      ></video>
                    </div>
                  </div>
                ) : (
                  renderImage(review?.images)
                )}
              </div>

              <div className="flex items-center gap-4 mt-2">
                <button className="flex items-center gap-1 text-gray-500">
                  <CiHeart size={16} />
                  <span>{review?.totalLikers}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500">
                  <FiMessageCircle size={16} />
                  <span>{review?.totalComments}</span>
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>
          <div className="text-gray-500 text-xl mx-auto flex items-center justify-center">
            No reviews found.
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewsVideo;
