import React, { memo, Suspense, useState } from "react";
import LogoSpinLoader from '../../../loader/LogoSpinLoader';

const AllCategories = React.lazy(() => import("./AllCategories"));
const ProductsInterest = React.lazy(() => import("./ProductsInterest"));
const ReviewPlatforms = React.lazy(() => import("./ReviewPlatforms"));
const ContactAndShippingInformation = React.lazy(() =>
  import("./ContactAndShippingInformation")
);
const AddYourSocials = React.lazy(() => import("./AddYourSocials"));
const AddProfileDetails = React.lazy(() => import("./AddProfileDetails"));

const SelectAllCategories = () => {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent((prev) => prev + 1);
  const prev = () => setCurrent((prev) => prev - 1);

  const steps = [
    {
      title: "All Categories",
      content: <Suspense fallback={<LogoSpinLoader />}>
        <AllCategories next={next} />
      </Suspense>,
    },
    {
      title: "Products Interest",
      content: <Suspense fallback={<LogoSpinLoader />}>
        <ProductsInterest prev={prev} next={next} />
      </Suspense>,
    },
    {
      title: "Review Platforms",
      content: <Suspense fallback={<LogoSpinLoader />}>
        <ReviewPlatforms prev={prev} next={next} />
      </Suspense>,
    },
    {
      title: "Information",
      content: <Suspense fallback={<LogoSpinLoader />}>
        <ContactAndShippingInformation prev={prev} next={next} />
      </Suspense>,
    },
    {
      title: "Add Your Socials",
      content: <Suspense fallback={<LogoSpinLoader />}><AddYourSocials prev={prev} next={next} /></Suspense>,
    },
    {
      title: "Add Profile Details",
      content: <Suspense fallback={<LogoSpinLoader />}><AddProfileDetails prev={prev} next={next} /></Suspense>,
    },
  ];

  return (
    <div className='gradient-container'>
      <div className="gradient-ellipse "></div>
      <div className="max-w-4xl mx-auto flex items-center justify-center h-screen">
        <div className="p-6 border border-gray-200 h-auto bg-white rounded-lg w-full flex flex-col">
          <div className="h-2 rounded-full relative w-full bg-gray-200 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[#FD8240] transition-all duration-300 ease-out"
              style={{ width: `${((current + 1) / steps.length) * 100}%` }}
            >
            </div>
          </div>

          <div className="grow mt-14 px-10">
            {current !== 4 && current !== steps.length - 1 && (
              <div
                className="text-end text-blue-600 -mb-6 cursor-pointer hover:text-blue-400"
                onClick={next}
              >
                Skip
              </div>
            )}

            {steps[current].content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SelectAllCategories);
