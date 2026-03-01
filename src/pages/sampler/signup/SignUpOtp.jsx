import React, { useState, useRef, useEffect, memo } from "react";
import { Typography, Input, Button } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../../components/ui/Logo";
import {
  useAuthSectionVerifyCodeMutation,
  useResendVerifyCodeMutation,
} from "../../../Redux/sampler/authSectionApis";
import toast from "react-hot-toast";

const { Title, Text } = Typography;

const SignUpOtp = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const [verifyEmail, { isLoading }] = useAuthSectionVerifyCodeMutation();
  const [resendCode, { isLoading: resendLoading }] =
    useResendVerifyCodeMutation();
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 4) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleResend = async () => {
    try {
      const res = await resendCode({
        email: location?.state?.email,
      }).unwrap();

      if (res.success) {
        toast.success(res.message);
        setTimeLeft(30);
      }

    } catch (error) {
      toast.error(
        error?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  const handleContinue = async () => {
    try {
      const res = await verifyEmail({
        email: location?.state?.email,
        verifyCode: Number(otp.join("")),
      }).unwrap();

      if (res.success) {
        toast.success(res.message);
        localStorage.setItem("token", res?.data?.accessToken);
        navigate("/sign-up-more-info", {
          state: { email: location?.state?.email },
        });
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 gradient-container">
      <div className="gradient-ellipse"></div>
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg text-center">
        <Title level={3} className="text-blue-500">
          <Logo />
        </Title>
        <div className="flex items-start flex-col text-start">
          <Title level={2} className="mb-2">
            Verify email
          </Title>
          <h1 className="text-base text-[14px] text-justify text-gray-500">
            <div>
              Just one last step, we sent an otp to
              <strong className="text-[#111]">
                {" "}
                {location?.state?.email}
              </strong>{" "}
              please input the One Time Password below
            </div>
          </h1>
        </div>

        <div className="flex justify-center gap-2 my-4">
          {otp.map((value, index) => (
            <Input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="text-center text-xl w-8 h-12 border-2 border-blue-400"
            />
          ))}
        </div>

        <Button
          type="primary"
          className="w-full"
          disabled={otp.includes("")}
          onClick={handleContinue}
        >
          {isLoading ? "Loading..." : " Continue"}
        </Button>

        <div className="mt-3">
          {timeLeft > 10 ? (
            <Text>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</Text>
          ) : (
            <h1
              className="text-blue-500 cursor-pointer text-[14px] hover:text-blue-800"
              onClick={handleResend}
            >
              {resendLoading ? "Loading..." : "  Resend One Time Password"}
            </h1>
          )}
        </div>

        <div className="mt-10 text-gray-500 text-center flex items-center justify-center gap-5 ">
          <Link to="/" className="text-blue-500 hover:underline transition-all">
            Help
          </Link>
          <Link to="/" className="text-blue-500 hover:underline transition-all">
            Privacy
          </Link>
          <Link to="/" className="text-blue-500 hover:underline transition-all">
            Terms
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(SignUpOtp);
