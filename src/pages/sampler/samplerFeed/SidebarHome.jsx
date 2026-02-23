import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { icons } from './icons/index.icon';

const { Sider } = Layout;

const SidebarHome = () => {
  return (
    <Sider width={'100%'} className="p-0">
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item className='bg-white! hover:bg-white!' key="1" icon={<img className='w-8 h-8 bg-contain' src={icons.profile} alt="profile" />}>
          <Link className='text-gray-700! hover:text-blue-600! hover:underline!' to="/sampler/my-profile">My Profile</Link>
        </Menu.Item>
        <Menu.Item className='bg-white! hover:bg-white!' key="2" icon={<img className='w-8 h-8 bg-contain' src={icons.settings} alt="settings" />}>
          <Link className='text-gray-700! hover:text-blue-600! hover:underline!' to="/sampler/settings/basic-details-settings-sampler">Settings</Link>
        </Menu.Item>
        <Menu.Item className='bg-white! hover:bg-white!' key="3" icon={<img className='w-8 h-8 bg-contain' src={icons.shoppingBag} alt="shopping bag" />}>
          <Link className='text-gray-700! hover:text-blue-600! hover:underline!' to="/sampler/campaign/shipments/offer-shipments">My Orders</Link>
        </Menu.Item>
        <Menu.Item className='bg-white! hover:bg-white!' key="4" icon={<img className='w-8 h-8 bg-contain' src={icons.wishlist} alt="wishlist" />}>
          <Link className='text-gray-700! hover:text-blue-600! hover:underline!' to="/sampler/campaign/shipments/wishlist">Wishlist</Link>
        </Menu.Item>
        <Menu.Item className='bg-white! hover:bg-white!' key="5" icon={<img className='w-8 h-8 bg-contain' src={icons.review} alt="review" />}>
          <Link className='text-gray-700! hover:text-blue-600! hover:underline!' to="/sampler/my-profile">My Reviews</Link>
        </Menu.Item>
        <Menu.Item className='bg-white! hover:bg-white!' key="6" icon={<img className='w-8 h-8 bg-contain' src={icons.earnings} alt="earnings" />}>
          <Link className='text-gray-700! hover:text-blue-600! hover:underline!' to="/sampler/campaign/earnings">My Earnings</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SidebarHome;