import { Button, Form, Input } from "antd";
import React from "react";
import toast from "react-hot-toast";
import {
  AiFillInstagram,
  AiFillTwitterCircle,
  AiFillYoutube,
} from "react-icons/ai";
import { FaTiktok } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUpdateProfileApisMutation } from "../../../../Redux/sampler/profileApis";

const AddYourSocials = ({ prev, next }) => {
  const [form] = Form.useForm();
  const Navigate = useNavigate();

  const [updateProfile, { isLoading }] = useUpdateProfileApisMutation();

  const handleFormSubmit = async (values) => {
    console.log(values?.instagram)
    if (!values?.instagram && !values?.twitter && !values?.tiktok && !values?.youtube) {
      next();
      return;
    }
    const hasAtLeastOneSocial = Object.values(values).some((val) =>
      val?.trim(),
    );
    if (!hasAtLeastOneSocial) {
      toast.error("Please add at least one social media username.");
      return;
    }
    try {
      await updateProfile(values).unwrap();
      toast.success("Socials have been uploaded successfully!");
      next();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to update your socials");
      return;
    }

    // Navigate to campaign after successful submit
    // Navigate("/sampler/campaign");
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFormSubmit}
      className="p-6"
      requiredMark={true}
    >
      <div className="flex justify-between flex-col h-[500px]">
        <div>
          <div className="flex  w-full mb-8">
            <div className=" text-2xl text-center font-bold w-2/3 flex items-end  justify-end">
              <div> Add your socials (OPTIONAL)</div>
            </div>

            <div className="flex items-end justify-end  w-1/3 text-blue-600 cursor-pointer hover:text-blue-400 text-[17px]">
              <div>
                <button
                  type="button"
                  onClick={next}
                  className="cursor-pointer hover:!text-blue-500"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Form.Item name="instagram" className="w-full">
              <div className="flex items-center space-x-3">
                <AiFillInstagram size={48} className="text-pink-600" />
                <Input size="large" placeholder="Instagram username" />
              </div>
            </Form.Item>

            <Form.Item name="twitter" className="w-full">
              <div className="flex items-center space-x-3">
                <AiFillTwitterCircle size={48} className="text-blue-400" />
                <Input size="large" placeholder="Twitter username" />
              </div>
            </Form.Item>

            <Form.Item name="youtube" className="w-full">
              <div className="flex items-center space-x-3">
                <AiFillYoutube size={48} className="text-red-600" />
                <Input size="large" placeholder="YouTube Channel" />
              </div>
            </Form.Item>

            <Form.Item name="tiktok" className="w-full">
              <div className="flex items-center space-x-3">
                <FaTiktok size={48} className="text-black" />
                <Input size="large" placeholder="TikTok Username" />
              </div>
            </Form.Item>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between text-[16px]">
          <Button
            type="default"
            size='large'
            onClick={prev}
            className="cursor-pointer hover:text-blue-500!"
          >
            Back
          </Button>

          <Button type="primary" size='large' htmlType='submit'  >
            {isLoading ? "Uploading..." : "Next"}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default React.memo(AddYourSocials);
