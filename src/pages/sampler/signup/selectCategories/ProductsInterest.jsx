import { Button, Checkbox } from "antd";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useCategorySectionApisQuery } from "../../../../Redux/sampler/categoryApis";
import Loader from "../../../loader/Loader";
import { useAddInterestedCategoryReviewerMutation } from "../../../../Redux/sampler/authSectionApis";

const ProductsInterest = ({ prev, next }) => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const { data: getAllCategory, isLoading } = useCategorySectionApisQuery();
  const [addInterestedCategory, { isLoading: interestedLoading }] =
    useAddInterestedCategoryReviewerMutation();

  const toggleSelect = (id) => {
    setSelectedInterests((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selectedInterests.length === 0) {
      toast.error("Please select at least one interest before proceeding.");
      return;
    }
    try {
      const res = await addInterestedCategory({
        interestedCategory: selectedInterests,
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

  return (
    <div>
      <p className="pb-5 text-2xl text-center font-semibold">
        What products interest you?
      </p>
      <div className="flex flex-col justify-between  h-[425px]">
        <div>{isLoading && <Loader />}</div>
        <div className="grid grid-cols-2 gap-4 -mt-20">
          {getAllCategory?.data?.map((item) => (
            <div
              key={item?._id}
              onClick={() => toggleSelect(item?._id)}
              className={`p-5 border rounded-xl ${selectedInterests.includes(item?._id)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
                } cursor-pointer`}
            >
              <Checkbox
                value={item?._id}
                checked={selectedInterests.includes(item?._id)}
                onChange={(e) => toggleSelect(item?._id)}
                onClick={(e) => e.stopPropagation()} // prevent double trigger
              >
                {item?.name}
              </Checkbox>
            </div>

          ))}
        </div>
        <div className="flex justify-between">
          <Button
            onClick={prev}
            size="large"
            className=" flex justify-end  cursor-pointer hover:text-blue-500!"
          >
            Back
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={interestedLoading}
            size="large"
            className=" flex justify-end cursor-pointer hover:text-blue-500!"
          >
            {interestedLoading ? "Loading..." : " Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductsInterest);
