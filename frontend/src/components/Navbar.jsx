import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Avatar,
  Space,
  Typography,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => navigate("/profile"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  const getNavItems = () => {
    const items = [
      {
        key: "home",
        label: <Link to="/">Home</Link>,
      },
    ];

    if (user) {
      if (user.role === "AUTHOR" || user.role === "ADMIN") {
        items.push({
          key: "author-dashboard",
          label: <Link to="/author-dashboard">Author Dashboard</Link>,
        });
      }

      if (user.role === "ADMIN") {
        items.push({
          key: "admin-dashboard",
          label: <Link to="/admin-dashboard">Admin Dashboard</Link>,
        });
      }
    }

    return items;
  };

  return (
    <Header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BookOutlined className="text-2xl text-blue-600 mr-2" />
              <Text strong className="text-xl text-gray-800">
                BlogApp
              </Text>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Menu
              mode="horizontal"
              items={getNavItems()}
              className="border-none bg-transparent"
            />

            {user ? (
              <Space>
                <Text className="text-gray-600">Welcome, {user.username}</Text>
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  arrow
                >
                  <Avatar
                    icon={<UserOutlined />}
                    className="cursor-pointer hover:bg-blue-100"
                  />
                </Dropdown>
              </Space>
            ) : (
              <Space>
                <Button type="text" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button type="primary" onClick={() => navigate("/register")}>
                  Register
                </Button>
              </Space>
            )}
          </div>
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
