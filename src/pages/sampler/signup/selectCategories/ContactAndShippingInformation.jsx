import { Button, Form, Input, Select } from "antd";
import { City, State } from "country-state-city";
import React from "react";
import { useAddShippingAddressReviewerMutation } from "../../../../Redux/sampler/authSectionApis";
import toast from "react-hot-toast";

const ContactAndShippingInformation = ({ prev, next }) => {
  const [addShipping, { isLoading }] = useAddShippingAddressReviewerMutation();

  const states = State.getStatesOfCountry("US");

  const [selectedState, setSelectedState] = React.useState(null);
  const [filteredCities, setFilteredCities] = React.useState([]);
  const handleFormSubmit = async (values) => {
    try {
      const res = await addShipping({
        company: values.company,
        name: values.name,
        street1: values.street,
        // street2: values.street2,
        country: "US",
        zip: values.zipCode,
        city: values.city,
        phone: values.phone,
        state: values.state,
        email: values.email,
        alternativePhoneNumber: values.altPhone,
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
        Contact & Shipping Information
      </p>

      <Form
        layout="vertical"
        className="p-6"
        onFinish={handleFormSubmit}
        requiredMark={true}
      >
        <div className="flex! flex-col! justify-between! h-auto">
          <div>
            <div className="flex w-full gap-5 items-center justify-between">
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
                className="w-full"
              >
                <Input size='large' placeholder="Enter your name" />
              </Form.Item>
              {/* <Form.Item
                label="Company name"
                name="company"
                rules={[
                  {
                    required: false,
                    message: "Please enter your company name",
                  },
                ]}
                className="w-full"
              >
                <Input size='large' placeholder="Enter your company name" />
              </Form.Item> */}
            </div>
            <div className="flex w-full gap-5 items-center justify-between">
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please enter your email" }]}
                className="w-full"
              >
                <Input size='large' placeholder="Enter your email" />
              </Form.Item>
            </div>

            <div className="flex w-full gap-5 items-center justify-between">
              <Form.Item
                label="Street"
                name="street"
                rules={[
                  { required: true, message: "Please enter your address" },
                ]}
                className="w-full"
              >
                <Input size='large' placeholder="Enter your address" />
              </Form.Item>
              {/* <Form.Item
                label="Street 2"
                name="street2"
                rules={[
                  { required: false, message: "Please enter your address" },
                ]}
                className="w-full"
              >
                <Input size='large' placeholder="Enter your address" />
              </Form.Item> */}
            </div>

            <div className="flex w-full gap-5 items-center justify-between">
              <Form.Item
                label="Country"
                name="country"
                initialValue="US" // default value
                rules={[{ required: true }]}
                className="flex-1"
              >
                <Select size='large' disabled>
                  <Select.Option value="US">United States</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="state"
                label="State"
                rules={[
                  { required: true, message: "Please select your state!" },
                ]}
                className="flex-1"
              >
                <Select size='large'
                  showSearch
                  placeholder={
                    <div className="flex items-start justify-start">
                      Select state
                    </div>
                  }
                  onChange={(value) => {
                    setSelectedState(value);
                    const cities = City.getCitiesOfState("US", value);
                    setFilteredCities(cities);
                  }}
                  className="flex items-start"
                >
                  {states.map((state) => (
                    <Select.Option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="flex w-full gap-5 items-center justify-between">
              <Form.Item
                name="city"
                label="City"
                rules={[
                  { required: false, message: "Please select your city!" },
                ]}
                className="flex-1"
              >
                <Select size='large'
                  showSearch
                  placeholder={
                    <div className="flex items-start justify-start">
                      {selectedState ? "Select city" : "Select state first"}
                    </div>
                  }
                  disabled={!selectedState}
                >
                  {filteredCities.map((city) => (
                    <Select.Option key={city.name} value={`${city.name}`}>
                      {city.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Zip Code"
                name="zipCode"
                rules={[
                  { required: true, message: "Please enter postal code" },
                ]}
                className="flex-1"
              >
                <Input size='large' placeholder="ZIP code" />
              </Form.Item>
            </div>

            <div className="flex w-full gap-5 items-center justify-between">
              <Form.Item
                label="Phone number"
                name="phone"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
                className="w-full"
              >
                <Input size='large' placeholder="Enter your phone number" />
              </Form.Item>
              {/* <Form.Item
                label="Alternate Phone number"
                name="altPhone"
                className="w-full"
              >
                <Input size='large' placeholder="Enter your alternate phone number" />
              </Form.Item> */}
            </div>
          </div>
          <div className="flex justify-between text-[16px]">
            <Button
              onClick={prev}
              type='default'
              size='large'
              className="cursor-pointer hover:text-blue-500!"
            >
              Back
            </Button>
            <Button
              type='primary'
              size='large'
              htmlType="submit"
              className="cursor-pointer hover:text-blue-500!"
              loading={isLoading}
            >
              {isLoading ? "Loading..." : "Next"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default React.memo(ContactAndShippingInformation);
