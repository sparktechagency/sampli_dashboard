import { Button, Checkbox } from "antd";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAddCurrentlyShareReviewerMutation } from "../../../../Redux/sampler/authSectionApis";

const ReviewPlatforms = ({ prev, next }) => {
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [addCurrentlyShare, { isLoading }] =
    useAddCurrentlyShareReviewerMutation();

  const toggleSelect = (value) => {
    setSelectedReviews((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    if (selectedReviews.length === 0) {
      toast.error("Please select at least one platform before proceeding.");
      return;
    }
    try {
      const res = await addCurrentlyShare({
        currentlyShareReview: selectedReviews,
      }).unwrap();

      if (res.success) {
        toast.success(res.message);
        next();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(
        error?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  const platforms = ["Youtube", "TikTok", "Instagram", "Blog", "WhatsApp"];

  return (
    <div>
      <p className="pb-4 text-2xl text-center font-semibold">
        Where do you currently share reviews?
      </p>

      <div className="flex flex-col justify-between h-[425px]">
        <div className="grid grid-cols-2 gap-4">
          {platforms.map((platform) => (
            <div
              key={platform}
              onClick={() => toggleSelect(platform)}
              className={`p-5 border rounded-xl cursor-pointer
                ${selectedReviews.includes(platform)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
                }
              `}
            >
              <Checkbox
                value={platform}
                checked={selectedReviews.includes(platform)}
                onChange={() => toggleSelect(platform)}
                onClick={(e) => e.stopPropagation()}
              >
                {platform}
              </Checkbox>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <Button
            onClick={prev}
            className="cursor-pointer hover:text-blue-500!"
            size='large'
            type='default'
          >
            Back
          </Button>
          <Button
            htmlType="submit"
            type='primary'
            size='large'
            onClick={handleSubmit}
            className="cursor-pointer hover:text-blue-500!"
            loading={isLoading}
          >
            {isLoading ? "Loading..." : " Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ReviewPlatforms);
