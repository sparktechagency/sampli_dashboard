import { Card, Switch, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useNotificationSettingQuery,
  useUpdateNotificationSettingMutation,
} from "../../Redux/businessApis/business_notifications/notificationSettingApis";

const { Title } = Typography;

function Notification() {

  const [settings, setSettings] = useState({
    general: false,
    customerNotification: false,
    orderNotification: false,
  });


  const [loading, setLoading] = useState({
    general: false,
    customerNotification: false,
    orderNotification: false,
  });


  const { data: notificationSetting, isLoading: notificationLoading } =
    useNotificationSettingQuery();
  const [updateNotificationSetting] = useUpdateNotificationSettingMutation();


  useEffect(() => {
    if (notificationSetting?.data) {
      setSettings({
        general: notificationSetting.data.general,
        customerNotification: notificationSetting.data.customerNotification,
        orderNotification: notificationSetting.data.orderNotification,
      });
    }
  }, [notificationSetting]);


  const handleSwitchChange = useCallback(
    async (key, checked) => {
      try {
        setLoading((prev) => ({ ...prev, [key]: true }));

        const payload = { [key]: checked };
        const res = await updateNotificationSetting(payload).unwrap();

        if (res?.success) {
          setSettings((prev) => ({ ...prev, [key]: checked }));
          toast.dismiss()
          toast.success(res.message || "Notification updated successfully!");
        }
      } catch (error) {
        toast.dismiss()
        toast.error(error?.data?.message || error?.message || "Something went wrong!");
      } finally {
        setLoading((prev) => ({ ...prev, [key]: false }));
      }
    },
    [updateNotificationSetting]
  );


  const renderSwitchCard = (title, description, key) => (
    <Card
      loading={notificationLoading}
      className="shadow-sm"
      headStyle={{ borderBottom: "none" }}
    >
      <div className="flex-center-between">
        <div>
          <Title level={5}>{title}</Title>
          <span className="text-[#6d6d6d]">{description}</span>
        </div>
        <Switch
          loading={loading[key]}
          checked={settings[key]}
          onChange={(checked) => handleSwitchChange(key, checked)}
        />
      </div>
    </Card>
  );

  return (
    <div className="flex flex-col gap-4">
      <Title level={3} className="text-2xl">
        Notifications
      </Title>

      {renderSwitchCard("General", "Browser notifications", "general")}
      {renderSwitchCard(
        "Customer notifications",
        "Notify customers about their order events",
        "customerNotification"
      )}
      {renderSwitchCard("Order Notifications", "New Order", "orderNotification")}
    </div>
  );
}

export default Notification;
