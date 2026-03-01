import React, { useCallback, useEffect, useState } from "react";
import { Avatar, Button, Segmented, Modal, Empty, Card } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import followingInactiveLogo from "../../../assets/feedLogo/following.svg";
import followingActiveLogo from "../../../assets/feedLogo/followingActive.svg";
import newLogo from "../../../assets/feedLogo/new.svg";
import newActiveLogo from "../../../assets/feedLogo/newActive.svg";
import popularActiveLogo from "../../../assets/feedLogo/popularActive.svg";
import popularInActiveLogo from "../../../assets/feedLogo/popularInactive.svg";
import {
  useGetAllReviewQuery,
  useGetReviewerLikersQuery,
  usePostCommentRepliesMutation,
} from "../../../Redux/sampler/reviewApis";
import { useGetProfileApisQuery } from "../../../Redux/sampler/profileApis";
import { usePostFollowUnfollowMutation } from "../../../Redux/sampler/followUnfollowApis";
import toast from "react-hot-toast";
import { CustomSkeleton } from "./CustomSkeleton";
import ReviewPost from "./ReviewPost";
import { frontendUrl } from "../../../Redux/main/server";
import logo from "../../../assets/logo/logo.svg";
import FeedCategorySection from "./FeedCategorySection";
import SidebarHome from "./SidebarHome";
import "./Empty.css";
import EmptyData from "./EmptyData";
const SamplerFeed = () => {
  const [activeCategory, setActiveCategory] = useState("");

  const [changeFollowUnfollow, { isLoading: isFollowing }] =
    usePostFollowUnfollowMutation();

  const { data: getMyProfile, isLoading } = useGetProfileApisQuery();

  const profileData = getMyProfile?.data;

  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  const [reviewId, setReviewId] = useState("");
  const [replyText, setReplyText] = useState("");
  const [comments, setComments] = useState(false);
  const { data: getReviewerLikers, isLoading: likersLoading } =
    useGetReviewerLikersQuery({
      id: reviewId,
    });

  const [postReplyChat] = usePostCommentRepliesMutation();
  const users = getReviewerLikers?.data?.result;
  const [activeTab, setActiveTab] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [reviewLimit, setReviewLimit] = useState(3);

  const {
    data: reviewList,
    isLoading: reviewLoading,
    isFetching,
  } = useGetAllReviewQuery({
    category: activeCategory,
    following: activeTab == "following" ? true : undefined,
    sortBy: activeTab != "popular" ? undefined : "totalView",
    sortOrder: activeTab != "popular" ? undefined : "desc",
    limit: reviewLimit,
  });

  const posts = reviewList?.data?.data?.result;
  const [loading, setLoading] = useState(false);

  const handleFollow = async (id) => {
    try {
      const res = await changeFollowUnfollow(id).unwrap();
      if (!res.success) {
        throw new Error(res.message);
      }
      toast.success(res?.message);
    } catch (error) {
      toast.error(
        error?.data?.message || error?.message || "Something went wrong",
      );
    }
  };

  const handleScroll = useCallback(() => {
    if (loading || isFetching) return;
    if (reviewList?.data?.data?.meta?.total <= reviewLimit) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= fullHeight - 200) {
      setLoading(true);
      setReviewLimit((prev) => prev + 8);
    }
  }, [loading, isFetching]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!isFetching) {
      setLoading(false);
    }
  }, [isFetching]);

  const [isModalOpenLike, setIsModalOpenLike] = useState(false);
  const handleOkLike = () => {
    setIsModalOpenLike(false);
  };
  const handleCancelLike = () => {
    setIsModalOpenLike(false);
  };

  const handleAllComments = (id) => {
    setComments((prev) => !prev);
    setReviewId(id);
  };

  const handleClickRepliesChat = (commentId) => {
    if (showRepliesForComment === commentId) {
      setShowRepliesForComment(null);
    } else {
      setShowRepliesForComment(commentId);
    }
  };

  const handleReply = async (commentId) => {
    try {
      await postReplyChat({ data: { text: replyText, parent: commentId } });
      setReplyText("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleShare = (post) => {
    // console.log(post)
    if (navigator.share) {
      navigator.share({
        title: post?.product?.name || "Event",
        text: "Check this out!",
        url: `${frontendUrl}/sampler/shop/category/${encodeURIComponent(post?.product?.name || "")}/${post?.product?._id}`,
      });
    } else {
      alert("Share not supported on this device");
    }
  };

  if (reviewLoading) {
    return (
      <div className="w-full h-screen bg-white animate-pulse flex items-center justify-center">
        <img
          className="w-16 h-16 object-contain animate-spin animation: 2s linear infinite"
          src={logo}
          alt="sampli-logo"
        />
      </div>
    );
  }
  return (
    <div className="container h-[calc(100vh-16rem)] overflow-hidden mx-auto mt-2! mb-20! ">
      <div className="bg-white flex justify-between items-start gap-10 max-lg:flex-col">
        <div className="grid  grid-cols-8 gap-4">
          {/* left side */}
          <div className="h-[calc(100vh-16rem)] relative bg-[#F5F5F5]/20 border border-gray-200 overflow-hidden rounded-2xl w-full min-w-1/3 p-0! col-span-2 hidden lg:block max-lg:w-full">
            <div className="flex flex-col gap-4">
              {/* Profile Image */}
              <div className="flex items-center gap-4 p-4">
                <div className="flex w-24 h-24 rounded-2xl border border-gray-200 justify-center">
                  <img
                    className="w-full h-full mx-auto border-2 border-gray-200 rounded-full"
                    src={profileData?.profile_image}
                    alt={profileData?.name}
                  />
                </div>

                {/* Name and Username */}
                <div className="text-center">
                  <div className="font-bold text-lg">
                    {profileData?.name || "Your Name"}
                  </div>
                  <div className="text-gray-500">
                    @{profileData?.username || "username"}
                  </div>
                </div>
              </div>
              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Stats */}
              <div className="flex justify-around text-center">
                <div>
                  <div className="font-semibold">
                    {profileData?.totalFollowers || "0"}
                  </div>
                  <div className="text-gray-500 text-sm">Followers</div>
                </div>
                <div>
                  <div className="font-semibold">
                    {profileData?.totalFollowing || "0"}
                  </div>
                  <div className="text-gray-500 text-sm">Following</div>
                </div>
                <div>
                  <div className="font-semibold">
                    ${profileData?.totalReferralSales || "0"}
                  </div>
                  <div className="text-gray-500 text-sm">Sales</div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Edit Profile Button */}
              <div className="flex justify-center absolute bottom-0 left-0 w-full! ">
                <Link
                  className="w-full!"
                  to="/sampler/settings/basic-details-settings-sampler"
                >
                  <Button
                    size="large"
                    type="primary"
                    className="w-full! rounded-none!"
                  >
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          {/* middle  */}
          <div className="w-full h-[calc(100vh-16rem)] scrollbar-none overflow-y-auto col-span-12! lg:col-span-4!">
            {/* Feed Segmented */}
            <div className="mt-5!">
              <Segmented
                value={activeTab || "new"}
                onChange={(value) => setActiveTab(value === "new" ? "" : value)}
                className="w-full border border-gray-200 rounded-lg p-2"
                size="large"
                options={[
                  {
                    label: (
                      <div className="flex gap-2 items-center">
                        {activeTab === "" ? (
                          <img src={newActiveLogo} alt="new active" />
                        ) : (
                          <img src={newLogo} alt="new inactive" />
                        )}
                        <span>New</span>
                      </div>
                    ),
                    value: "new",
                  },
                  {
                    label: (
                      <div className="flex gap-2 items-center">
                        {activeTab === "following" ? (
                          <img
                            src={followingActiveLogo}
                            alt="following active"
                          />
                        ) : (
                          <img
                            src={followingInactiveLogo}
                            alt="following inactive"
                          />
                        )}
                        <span>Following</span>
                      </div>
                    ),
                    value: "following",
                  },
                  {
                    label: (
                      <div className="flex gap-2 items-center">
                        {activeTab === "popular" ? (
                          <img src={popularActiveLogo} alt="popular active" />
                        ) : (
                          <img
                            src={popularInActiveLogo}
                            alt="popular inactive"
                          />
                        )}
                        <span>Popular</span>
                      </div>
                    ),
                    value: "popular",
                  },
                ]}
              />
            </div>
            {/* Category Pills */}
            <FeedCategorySection
              setActiveCategory={setActiveCategory}
              activeCategory={activeCategory}
            />
            {/* Skeleton */}
            {reviewLoading && <CustomSkeleton />}

            <div>
              {posts?.length == 0 && (
                <div className="min-h-32 flex items-center justify-center">
                  {/* <div className="outer">
                    <div className="dot"></div>
                    <div className="card">
                      <div className="ray"></div>
                      <div className="text">750k</div>
                      <div>Views</div>
                      <div className="line topl"></div>
                      <div className="line leftl"></div>
                      <div className="line bottoml"></div>
                      <div className="line rightl"></div>
                    </div>
                  </div> */}
                  <EmptyData message="No reviews found" />
                </div>
              )}
            </div>
            {/* Feed Posts */}
            <div className="space-y-4! relative! w-full!">
              {posts?.map((post) => (
                <ReviewPost
                  post={post}
                  key={post?._id}
                  isFetching={isFetching}
                  setIsLoadingVideo={setIsLoadingVideo}
                  isLoadingVideo={isLoadingVideo}
                  handleReply={handleReply}
                  onShare={handleShare}
                  handleClickRepliesChat={handleClickRepliesChat}
                  onFollow={handleFollow}
                  isFollowing={isFollowing}
                />
              ))}
              {(isFetching ||
                loading ||
                reviewList?.data?.data?.meta?.total > reviewLimit) && (
                  <CustomSkeleton isHeight={false} />
                )}
            </div>
          </div>
          {/* Right side */}
          <div
            style={{
              position: "sticky",
              top: "70px",
              alignSelf: "flex-start",
              maxHeight: "calc(100vh - 40px)",
              overflowY: "auto",
            }}
            className="col-span-2! divide-y! bg-[#F5F5F5]/20 border border-gray-200 overflow-hidden rounded-2xl h-full hidden! lg:block!"
          >
            <SidebarHome />
          </div>
        </div>

        {/* Share Modal */}
        <Modal
          title="Share Post"
          open={showShareModal}
          onCancel={() => setShowShareModal(false)}
          footer={null}
          centered
        >
          <div className="!space-y-4">
            <Button block icon={<ShareAltOutlined />}>
              Share to Feed
            </Button>
            <Button block>Copy Link</Button>
            <Button block>Share via Message</Button>
          </div>
        </Modal>

        {/* like modal */}
        {!likersLoading && (
          <Modal
            title={`Liked (${users?.length})`}
            open={isModalOpenLike}
            onOk={handleOkLike}
            onCancel={handleCancelLike}
            okButtonProps={{ style: { display: "none" } }}
            cancelButtonProps={{ style: { display: "none" } }}
            centered
          >
            <div className="flex flex-col space-y-4 text-gray-500 scroll-y-auto overflow-auto h-[50vh] ">
              {users?.map((user) => (
                <div
                  key={user?.id}
                  className="flex justify-between items-center space-x-4"
                >
                  <div className="flex items-center space-x-3!">
                    <Avatar
                      src={user?.profile_image}
                      size={50}
                      className="border-2 border-white"
                    />
                    <div>
                      <div className="text-sm font-medium grow">
                        {user?.name}
                      </div>
                      <div className="flex gap-3 justify-center items-center">
                        <div className="text-sm font-medium grow">
                          @{user?.username}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="text-sm font-medium border border-blue-200 px-4 py-1 rounded-full text-blue-600 cursor-pointer"
                    onClick={() => handleFollow(user?._id)}
                  >
                    Follow
                  </div>
                </div>
              ))}
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default SamplerFeed;
