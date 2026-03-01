import { Button, Form, Image, Input, Upload } from "antd";
import React, { memo, useState } from "react";
import toast from "react-hot-toast";
import image1 from "/public/randomImage/118.png";
import image2 from "/public/randomImage/120.png";
import image3 from "/public/randomImage/121.png";
import image4 from "/public/randomImage/123.png";
import image5 from "/public/randomImage/125.png";
import { useUpdateProfileApisMutation } from "../../../../Redux/sampler/profileApis";
import { useNavigate } from "react-router-dom";

const images = [image1, image2, image3, image4, image5];

const AddProfileDetails = ({ prev, next }) => {
  const [fileList, setFileList] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [uploading, setUploading] = useState(false);
  const Navigate = useNavigate();

  const [updateProfile, { isLoading }] = useUpdateProfileApisMutation();

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const beforeUpload = (file) => {
    const isLt500KB = file.size / 1024 < 500;
    if (!isLt500KB) {
      toast.error("Avatar image must be under 500KB");
      return false;
    }

    if (isLt500KB) {
      setSelectedImageIndex(null);
    }
    return false;
  };

  const onChange = ({ fileList: newFileList }) => {
    if (newFileList.length > 0) {
      setSelectedImageIndex(null);
    }
    setFileList(newFileList);
  };

  const selectDefaultImage = (index) => {
    setFileList([]);
    setSelectedImageIndex(index);
  };
  const uploadImageFile = async (file) => {
    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      setUploading(true);

      const response = await updateProfile(formData).unwrap();

      // toast.success("Image uploaded successfully!");
      return response;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Convert default image to File object for FormData
  const getDefaultImageAsFile = async (imageIndex) => {
    try {
      const response = await fetch(images[imageIndex]);
      const blob = await response.blob();
      const filename = `default-avatar-${imageIndex + 1}.png`;
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      console.error("Error converting default image:", error);
      throw error;
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      setUploading(true);
      let uploadResult = null;
      let avatarData = null;

      if (selectedImageIndex !== null) {
        const defaultImageFile = await getDefaultImageAsFile(
          selectedImageIndex
        );
        uploadResult = await uploadImageFile(defaultImageFile);
        avatarData = {
          type: "default",
          imageIndex: selectedImageIndex,
          imagePath: images[selectedImageIndex],
          uploadedUrl: uploadResult?.url || uploadResult?.data?.url || null,
        };
      } else if (fileList.length > 0) {
        const customFile = fileList[0].originFileObj || fileList[0];
        uploadResult = await uploadImageFile(customFile);
        avatarData = {
          type: "custom",
          fileName: customFile.name,
          fileSize: customFile.size,
          uploadedUrl: uploadResult?.url || uploadResult?.data?.url || null,
        };
      }

      const profileFormData = new FormData();
      profileFormData.append("bio", values.bio);

      if (avatarData) {
        profileFormData.append("avatarData", JSON.stringify(avatarData));
        if (avatarData.uploadedUrl) {
          profileFormData.append("avatarUrl", avatarData.uploadedUrl);
        }
        // Also append the image type for backend processing
        profileFormData.append("avatarType", avatarData.type);
        if (avatarData.type === "default") {
          profileFormData.append(
            "defaultImageIndex",
            avatarData.imageIndex.toString()
          );
        }
      }


      // Send the complete profile data
      try {
        const finalResult = await updateProfile(profileFormData).unwrap();
        toast.success("Profile updated successfully!");
        Navigate("/sampler/campaign");
      } catch (profileError) {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update profile");
    } finally {
      setUploading(false);
    }
  };

  const customUpload = async ({ onSuccess, onError }) => {
    try {
      onSuccess("ok");
    } catch (error) {
      onError(error);
    }
  };

  const isProcessing = uploading || isLoading;

  return (
    <Form
      layout="vertical"
      className="p-6"
      onFinish={handleFormSubmit}
      requiredMark={true}
    >
      <div className="flex flex-col justify-between h-[500px]">
        <div>
          <p className="pb-5 text-2xl text-center font-semibold">
            Add profile details
          </p>
          <div className="flex justify-center items-center gap-2">
            <div className="flex justify-center space-x-3">
              {images.map((imgSrc, index) => (
                <div
                  key={index}
                  onClick={() => !isProcessing && selectDefaultImage(index)}
                  className={`w-24 h-24 rounded-full overflow-hidden border cursor-pointer transition-all ${selectedImageIndex === index
                    ? "border-blue-500 border-4 scale-105"
                    : "border-gray-300"
                    } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <img
                    src={imgSrc}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              ))}
            </div>
            <Upload
              customRequest={customUpload}
              listType="picture"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              beforeUpload={beforeUpload}
              showUploadList={false}
              className="relative group"
              disabled={isProcessing}
            >
              <div className="w-24 h-24 rounded-full overflow-hidden relative group transition-all duration-300 transform hover:scale-105">
                {fileList.length > 0 ? (
                  <div className="relative w-full h-full">
                    <img
                      src={
                        fileList[0].url ||
                        URL.createObjectURL(fileList[0].originFileObj)
                      }
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                    {!isProcessing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                        <div className="text-white text-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mx-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                          <span className="text-xs mt-1 block">Edit</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute -top-1 -right-1 bg-blue-500 h-6 w-6 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-dashed border-blue-300 flex flex-col items-center justify-center p-1 transition-all duration-300 group-hover:border-blue-500">
                    {isProcessing ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-blue-500 mb-1 group-hover:text-blue-600 transition-colors duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-xs text-blue-600 font-medium">
                          Upload
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </Upload>
          </div>
          <p className="text-center text-red-500 mt-2">
            Avatar image must be under 500KB
          </p>
          <Form.Item
            name="bio"
            label="Add a bio"
            rules={[{ required: false, message: "Please enter your bio" }]}
          >
            <Input.TextArea
              maxLength={120}
              style={{ minHeight: '150px' }}
              showCount
              placeholder="Write about yourself..."
              disabled={isProcessing}
            />
          </Form.Item>
        </div>
        <div className="flex justify-between text-[16px]">
          <Button
            onClick={prev}
            className="cursor-pointer hover:!text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            type="default"
            size="large"
            disabled={isProcessing}
          >
            Back
          </Button>
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            className="cursor-pointer hover:!text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isProcessing}
            loading={isProcessing}
          >
            {isProcessing ? "Processing..." : "Next"}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default memo(AddProfileDetails);
