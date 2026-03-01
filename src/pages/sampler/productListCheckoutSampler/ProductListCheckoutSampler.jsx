import React, { useState, useEffect } from "react";

import {
  Table,
  Button,
  InputNumber,
  Space,
  Empty,
  Typography,
  Divider,
  Modal,
} from "antd";

import {
  DeleteOutlined,
  ShoppingOutlined,
  SaveOutlined,
} from "@ant-design/icons";

import toast from "react-hot-toast";

import { Link } from "react-router-dom";

import productImage from "/public/product_image.svg";

import {
  useGetAllCartItemsQuery,
  useRemoveCartMutation,
  useUpdateCartItemMutation,
} from "../../../Redux/sampler/cartApis";

import { useGetShippingAddressQuery } from "../../../Redux/sampler/shippingAddressApis";

import {
  useCreateOrderMutation,
  usePostShippingRatesMutation,
} from "../../../Redux/sampler/shippoApis";
import { icons } from '../samplerFeed/icons/index.icon';

const { Title, Text } = Typography;

const SoloStoveCart = () => {
  const { data: shippingAddresses, isLoading: shippingAddressesLoading } =
    useGetShippingAddressQuery();
  const { data: cartItems, isLoading, refetch } = useGetAllCartItemsQuery();
  const [shippingRates, { isLoading: shippingRatesLoading }] =
    usePostShippingRatesMutation();
  const [createOrder, { isLoading: createOrderLoading }] =
    useCreateOrderMutation();
  const [updateCart, { isLoading: updateCartLoading }] =
    useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartMutation();
  const [providerList, setProviderList] = useState([]);
  const [shippingAddressId, setShippingAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedRateId, setSelectedRateId] = useState("");
  const [shipmentId, setShipment] = useState("");

  // State to track modified quantities
  const [modifiedQuantities, setModifiedQuantities] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  const cart = cartItems?.data;
  const cartData = cartItems?.data?.items;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenProvider, setIsModalOpenProvider] = useState(false);

  // Initialize quantities when cart data loads
  useEffect(() => {
    if (cartData) {
      const initialQuantities = {};
      cartData.forEach((item) => {
        const key = `${item.product._id}-${item?.variant?._id || "no-variant"}`;
        initialQuantities[key] = item.quantity;
      });
      setModifiedQuantities(initialQuantities);
    }
  }, [cartData]);

  const showModalProvider = async () => {
    setIsModalOpenProvider(true);
  };
  const handleOkProvider = async () => {
    try {
      const data = {
        shippingAddress: shippingAddressId,
        paymentMethod: "Stripe",
        selectedRateId: selectedRateId,
        shipmentId: shipmentId,
      };
      const res = await createOrder({ data });
      window.open(res?.data?.data?.url, "_blank");
      setIsModalOpenProvider(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancelProvider = () => {
    setIsModalOpenProvider(false);
  };
  const showModal = async () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    if (!shippingAddressId) return;
    try {
      const data = {
        shippingAddressId: shippingAddressId,
      };
      const res = await shippingRates({ data });
      setProviderList(res?.data?.data);
      setIsModalOpen(false);
      showModalProvider();
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleQuantityChange = (productId, variantId, newQuantity) => {
    const key = `${productId}-${variantId || "no-variant"}`;
    setModifiedQuantities((prev) => ({
      ...prev,
      [key]: newQuantity,
    }));
    setHasChanges(true);
  };

  const increaseQuantity = (productId, variantId) => {
    const key = `${productId}-${variantId || "no-variant"}`;
    const currentQuantity = modifiedQuantities[key] || 1;
    handleQuantityChange(productId, variantId, currentQuantity + 1);
  };

  const decreaseQuantity = (productId, variantId) => {
    const key = `${productId}-${variantId || "no-variant"}`;
    const currentQuantity = modifiedQuantities[key] || 1;
    if (currentQuantity > 1) {
      handleQuantityChange(productId, variantId, currentQuantity - 1);
    }
  };

  const saveAllChanges = async () => {
    try {
      // Find items that have changed
      const changedItems = cartData.filter((item) => {
        const key = `${item.product._id}-${item?.variant?._id || "no-variant"}`;
        return modifiedQuantities[key] !== item.quantity;
      });

      if (changedItems.length === 0) {
        toast.info("No changes to save");
        return;
      }

      // Update all changed items
      for (const item of changedItems) {
        const key = `${item.product._id}-${item?.variant?._id || "no-variant"}`;
        const newQuantity = modifiedQuantities[key];

        const data = {
          productId: item.product._id,
          variantId: item?.variant?._id,
          quantity: newQuantity,
        };

        await updateCart({ data });
      }

      await refetch();
      setHasChanges(false);
      toast.success("Cart updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update cart");
    }
  };

  const removeItem = async (itemId, variantId = null) => {
    try {
      const data = {
        productId: itemId,
        variantId,
      };
      const res = await removeCartItem({
        data,
      });
      if (res?.data?.success) {
        refetch();
        toast.success("Item removed from cart!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove item");
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Calculate updated totals based on modified quantities
  const calculateUpdatedTotals = () => {
    if (!cartData) return { subTotal: 0, totalPrice: 0 };

    let subTotal = 0;
    cartData.forEach((item) => {
      const key = `${item.product._id}-${item?.variant?._id || "no-variant"}`;
      const currentQuantity = modifiedQuantities[key] || item.quantity;
      subTotal += (item.price || 0) * currentQuantity;
    });

    return {
      subTotal: subTotal,
      totalPrice: subTotal, // Add delivery fee here if needed
    };
  };

  const updatedTotals = calculateUpdatedTotals();

  const columns = [
    {
      title: "Item",
      dataIndex: "product",
      key: "item",
      width: 300,
      render: (product, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={product?.images?.[0] || productImage}
            alt={product?.name || "Product"}
            style={{
              width: 64,
              height: 64,
              marginRight: 16,
              objectFit: "contain",
            }}
          />
          <Text strong>{product?.name || "Unknown Product"}</Text>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 120,
      align: "center",
      render: (price) => `${price?.toFixed(2) || "0.00"}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 150,
      align: "center",
      render: (quantity, record) => {
        const key = `${record.product._id}-${record?.variant?._id || "no-variant"
          }`;
        const currentQuantity = modifiedQuantities[key] || quantity;

        return (
          <Space>
            <Button
              onClick={() =>
                decreaseQuantity(record.product._id, record?.variant?._id)
              }
              disabled={currentQuantity <= 1}
            >
              -
            </Button>
            <InputNumber
              min={1}
              value={currentQuantity}
              onChange={(value) =>
                handleQuantityChange(
                  record.product._id,
                  record?.variant?._id,
                  value
                )
              }
              style={{ width: 50, textAlign: "center" }}
            />
            <Button
              onClick={() =>
                increaseQuantity(record.product._id, record?.variant?._id)
              }
            >
              +
            </Button>
          </Space>
        );
      },
    },
    {
      title: "Total",
      key: "total",
      width: 120,
      align: "right",
      render: (record) => {
        const key = `${record.product._id}-${record?.variant?._id || "no-variant"
          }`;
        const currentQuantity = modifiedQuantities[key] || record.quantity;

        return (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <span style={{ marginRight: 8 }}>
              ${((record.price || 0) * currentQuantity).toFixed(2)}
            </span>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() =>
                removeItem(record.product._id, record?.variant?._id)
              }
              danger
            />
          </div>
        );
      },
    },
  ];

  const handleSetAddressId = (addressId) => {
    setShippingAddressId(addressId);
  };

  return (
    <div className="responsive-width min-h-[calc(100vh-240px)]">
      <div
        className=" mx-auto "
        style={{ margin: "20px 0 128px", overflow: "auto" }}
      >
        <Title level={2} style={{ marginBottom: 20 }}>
          Cart Items
        </Title>

        {cart?.items?.length > 0 ? (
          <>
            <Table
              columns={columns}
              dataSource={cartData}
              rowKey="_id"
              bordered
              pagination={false}
              scroll={{ x: 700 }}
              summary={() => (
                <Table.Summary>
                  {/* Row 1 - Subtotal */}
                  {/* <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3}>
                      <Text strong style={{ fontSize: 16 }}>
                        Sub Total:
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <Text strong style={{ fontSize: 20 }}>
                        ${updatedTotals.subTotal.toFixed(2)}
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row> */}

                  {/* Row 2 - Grand Total */}
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3}>
                      <Text strong style={{ fontSize: 18 }}>
                        Grand Total:
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <Text strong style={{ fontSize: 22, color: "green" }}>
                        ${updatedTotals.totalPrice.toFixed(2)}
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />


            <div className='w-full mt-4'>
              <div className="w-full flex gap-2 mb-3 items-center justify-end">
                {hasChanges && (
                  <div>
                    <Button
                      type="default"
                      size="large"
                      onClick={saveAllChanges}
                      loading={updateCartLoading}
                      icon={<SaveOutlined />}
                      className="bg-green-700! text-white! hover:bg-green-600!"
                      style={{ height: 50 }}
                    >
                      Save Changes
                    </Button>
                  </div>
                )}

                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={() => showModal()}
                  style={{ height: 50, width: "fit-content" }}
                >
                  Check out
                </Button>
              </div>
              <Link to="/sampler/shop">
                <h1 className='text-sm underline float-end uppercase'>Continue Shopping</h1>
              </Link>
            </div>
          </>
        ) : (
          <div
            className='flex items-center justify-center'
          >
            <Empty
              image={<ShoppingOutlined style={{ fontSize: 64 }} />}
              description={
                <div style={{ textAlign: "center" }}>
                  <Title level={3}>Your cart is empty</Title>
                  <Divider
                    style={{
                      width: 64,
                      minWidth: 64,
                      backgroundColor: "#f5a623",
                      margin: "0px auto 10px auto",
                    }}
                  />
                  <Text type="secondary">
                    Looks like you haven&apos;t added any items to your cart
                    yet.
                  </Text>
                </div>
              }
            >
              <Link to="/sampler/shop">
                <Button type="primary" size="large">
                  Start Shopping
                </Button>
              </Link>
            </Empty>
          </div>
        )}
      </div>

      <Modal
        title={
          shippingAddresses?.data?.length !== 0
            ? "Which address do you want to use?"
            : "Need address"
        }
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        footer={shippingAddresses?.data?.length === 0 ? null : undefined}
        okButtonProps={
          shippingAddresses?.data?.length === 0 ? { disabled: true } : {}
        }
        confirmLoading={shippingRatesLoading}
        onCancel={handleCancel}
        centered
      >
        <div>
          <div>
            {shippingAddresses?.data && shippingAddresses.data.length > 0 ? (
              <div className="space-y-4">
                {shippingAddresses.data.map((address, index) => (
                  <div
                    key={address._id}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-gray-800">
                        Address {index + 1}
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          type="link"
                          onClick={() => setShippingAddressId(address._id)}
                          className="text-blue-600 p-0"
                        >
                          {shippingAddressId === address._id ? (
                            <span className="bg-blue-500 text-white px-2 rounded-md">
                              Selected Address
                            </span>
                          ) : (
                            <Button
                              type="link"
                              onClick={() => handleSetAddressId(address._id)}
                              className="text-blue-600 p-0"
                            >
                              Select this address
                            </Button>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Street: </span>
                        <span className="text-gray-800">{address.street1}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">City: </span>
                        <span className="text-gray-800">{address.city}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">State: </span>
                        <span className="text-gray-800">{address.state}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Country: </span>
                        <span className="text-gray-800">{address.country}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">ZIP Code: </span>
                        <span className="text-gray-800">{address.zip}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone: </span>
                        <span className="text-gray-800">{address.phone}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email: </span>
                        <span className="text-gray-800">{address.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <img src={icons.noAddress} alt="No address" className="w-32 h-32 object-cover aspect-square mx-auto" />
                <Title level={5}>No shipping addresses found.</Title>
                <div className="flex items-center justify-center">
                  <Link
                    to="/sampler/settings/basic-details-settings-sampler"
                    className="text-blue-600 px-10 py-2 border border-gray-200 rounded-3xl mx-auto flex items-center gap-2"
                  >
                    Go to shipping address
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        title="Please select a shipping provider"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpenProvider}
        onOk={handleOkProvider}
        confirmLoading={createOrderLoading}
        onCancel={handleCancelProvider}
        centered
      >
        <div>
          <div>
            {providerList?.length > 0 ? (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">
                  Shipping Options:
                </h3>
                <div className="space-y-3">
                  {providerList.map((provider) => (
                    <div
                      key={provider.objectId}
                      className={`flex items-center p-3 cursor-pointer  rounded-md hover:shadow ${selectedRateId === provider?.objectId
                        ? "border-2 border-blue-700 text-black"
                        : "border-2 border-gray-300"
                        }`}
                      onClick={() => {
                        setSelectedRateId(provider?.objectId);
                        setShipment(provider?.shipment);
                      }}
                    >
                      <img
                        src={provider.providerImage200}
                        alt={provider.provider}
                        className="w-12 h-12 mr-4 object-cover object-center rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium">
                          {provider.servicelevel.name}
                        </p>
                        <p className="font-medium text-gray-600">
                          Estimated Delivery: {provider.estimatedDays} days
                        </p>
                        <p className="text-sm text-gray-500">
                          {provider.durationTerms}
                        </p>
                        {provider.attributes.length > 0 && (
                          <p className="text-xs text-blue-600">
                            {provider.attributes.join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="font-semibold">
                        {provider.currency} {provider.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-2">Provider List:</h3>
                <p className="text-sm text-gray-500">
                  No provider is available for this address. Please check your
                  address.
                </p>
                <div className="flex items-center justify-center">
                  <Link
                    to="/sampler/settings/basic-details-settings-sampler"
                    className="text-blue-600 px-10 py-2 border border-gray-200 rounded-3xl mx-auto "
                  >
                    Go to shipping address
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SoloStoveCart;
