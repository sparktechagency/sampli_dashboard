import React from "react";
import { Button, Divider, Typography } from "antd";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuthSectionSignupMutation } from "../../../Redux/sampler/authSectionApis";
import FormWrapper from "../../../components/ui/FormWrapper";
import InputField from "../../../components/ui/InputField";
import Logo from "../../../components/ui/Logo";
import GoogleAuthButton from "../../../googleAuthButton/GoogleAuthButton";

const { Title } = Typography;

const Signup = () => {
  const navigate = useNavigate();
  const [createSampler, { isLoading }] = useAuthSectionSignupMutation();

  const onFinish = async (values) => {
    try {
      const payload = {
        name: values.firstName + " " + values.lastName,
        lastName: values.lastName,
        username: values.username,
        email: values.email,
        password: values.password,
      };

      const res = await createSampler(payload).unwrap();

      if (res.success) {
        toast.success(
          res.message || "Signup successful! Check your email for verification."
        );

        navigate("/sign-up-otp", { state: { email: values.email } });
      } else {
        toast.error(res.message || "Signup failed. Try again.");
      }
    } catch (err) {
      toast.error(
        err?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 gradient-container">
      <div className="gradient-ellipse"></div>
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg text-start">
        <Title level={3} className="text-blue-500">
          <Logo />
        </Title>
        <div className="flex mb-6 flex-col items-start">
          <Title level={2}>Sign Up </Title>
          <h1 className="text-[var(--body-text)]">
            Create an account to access all features on Sampli
          </h1>
        </div>

        <FormWrapper onFinish={onFinish}>
          <div className="flex gap-2 justify-between">
            <InputField
              label="First Name"
              name="firstName"
              rules={[
                { required: true, message: "Please enter your first name!" },
              ]}
              placeholder="John"
              type="text"
              className="w-full"
            />
            <InputField
              label="Last Name"
              name="lastName"
              rules={[
                { required: true, message: "Please enter your last name!" },
              ]}
              placeholder="Doe"
              type="text"
              className="w-full"
            />
          </div>
          <InputField
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
            placeholder="john_doe"
            type="text"
          />
          <InputField
            label="Email address"
            name="email"
            size="large"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Enter a valid email address!" },
            ]}
            placeholder="john.doe@example.com"
            type="email"
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
            placeholder="Enter your password"
          />

          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            shape="round"
            size="large"
            style={{ marginTop: 10 }}
            loading={isLoading}
          >
            Continue with Email
          </Button>
        </FormWrapper>

        <Divider className="!text-xs !text-gray-500">Or Signup with</Divider>
        <GoogleAuthButton role={"reviewer"} />
        {/* <div>
          <div className="flex items-center justify-between gap-1 text-sm py-2 rounded-md cursor-pointer">
            <div className="border hover:bg-[#F0F5FE] flex px-3 py-2 rounded-4xl w-full border-gray-200 items-center justify-center gap-1">
              <img src={apple} alt="" className="w-5 h-5" />{" "}
              <span className="text-gray-600">Continue with Apple</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1   text-sm py-2 rounded-md cursor-pointer">
            <div className="border hover:bg-[#F0F5FE] flex px-3 py-2 rounded-4xl w-full border-gray-200 items-center justify-center gap-1">
              <img src={fb} alt="" className="w-5 h-5" />{" "}
              <span className="text-gray-600">Continue with Facebook</span>
            </div>
          </div>
        </div> */}
        <div className="mt-4 text-gray-500 text-[14px]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:underline text-[14px] transition-all"
          >
            Login
          </Link>
        </div>

        {/* <div className="mt-10 text-gray-500 text-center flex items-center justify-center gap-5">
          <Link to="/" className="text-blue-500 hover:underline transition-all">
            Help
          </Link>
          <Link to="/" className="text-blue-500 hover:underline transition-all">
            Privacy
          </Link>
          <Link to="/" className="text-blue-500 hover:underline transition-all">
            Terms
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default Signup;
