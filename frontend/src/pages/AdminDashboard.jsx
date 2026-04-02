import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Tabs,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  message,
  Spin,
  Empty,
  Popconfirm,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  BookOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { adminService, blogService } from "../services/api";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [pendingAuthorRequests, setPendingAuthorRequests] = useState([]);
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAuthors: 0,
    totalBlogs: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [usersData, pendingRequests, pendingBlogsData] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getPendingAuthorRequests(),
        adminService.getPendingBlogs(),
      ]);

      setUsers(usersData);
      setPendingAuthorRequests(pendingRequests);
      setPendingBlogs(pendingBlogsData);

      // Calculate stats
      setStats({
        totalUsers: usersData.length,
        totalAuthors: usersData.filter((u) => u.role === "AUTHOR").length,
        totalBlogs: usersData.reduce(
          (acc, user) => acc + (user.blogs?.length || 0),
          0
        ),
        pendingApprovals: pendingRequests.length + pendingBlogsData.length,
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
      message.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAuthorRequest = async (userId) => {
    try {
      await adminService.approveAuthorRequest(userId);
      setPendingAuthorRequests(
        pendingAuthorRequests.filter((u) => u.id !== userId)
      );
      setStats((prev) => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals - 1,
      }));
      message.success("Author request approved!");
    } catch (error) {
      message.error(error.response?.data || "Failed to approve author request");
    }
  };

  const handleRejectAuthorRequest = async (userId) => {
    try {
      await adminService.rejectAuthorRequest(userId);
      setPendingAuthorRequests(
        pendingAuthorRequests.filter((u) => u.id !== userId)
      );
      setStats((prev) => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals - 1,
      }));
      message.success("Author request rejected!");
    } catch (error) {
      message.error(error.response?.data || "Failed to reject author request");
    }
  };

  const handleApproveBlog = async (blogId) => {
    try {
      await adminService.approveBlog(blogId);
      setPendingBlogs(pendingBlogs.filter((b) => b.id !== blogId));
      setStats((prev) => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals - 1,
      }));
      message.success("Blog approved!");
    } catch (error) {
      message.error(error.response?.data || "Failed to approve blog");
    }
  };

  const handleRejectBlog = async (blogId) => {
    try {
      await adminService.rejectBlog(blogId);
      setPendingBlogs(pendingBlogs.filter((b) => b.id !== blogId));
      setStats((prev) => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals - 1,
      }));
      message.success("Blog rejected!");
    } catch (error) {
      message.error(error.response?.data || "Failed to reject blog");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await adminService.deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
      message.success("User deleted successfully!");
    } catch (error) {
      message.error(error.response?.data || "Failed to delete user");
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const updatedUser = await adminService.updateUserRole(userId, newRole);
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
      message.success("User role updated successfully!");
    } catch (error) {
      message.error(error.response?.data || "Failed to update user role");
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "red";
      case "AUTHOR":
        return "blue";
      case "READER":
        return "green";
      default:
        return "default";
    }
  };

  const userColumns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role, record) => (
        <Space>
          <Tag color={getRoleColor(role)}>{role}</Tag>
          {record.authorRequestPending && (
            <Tag color="orange">Pending Author Request</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => window.open(`/blog/author/${record.id}`, "_blank")}
          >
            View Blogs
          </Button>
          <Button
            type="link"
            onClick={() => {
              const newRole = record.role === "AUTHOR" ? "READER" : "AUTHOR";
              handleUpdateUserRole(record.id, newRole);
            }}
          >
            {record.role === "AUTHOR"
              ? "Demote to Reader"
              : "Promote to Author"}
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const authorRequestColumns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Request Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApproveAuthorRequest(record.id)}
          >
            Approve
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => handleRejectAuthorRequest(record.id)}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  const blogColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div>
          <Text strong className="block">
            {text}
          </Text>
          <Text type="secondary" className="text-sm">
            by {record.authorUsername}
          </Text>
        </div>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => window.open(`/blog/${record.id}`, "_blank")}
          >
            View
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApproveBlog(record.id)}
          >
            Approve
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => handleRejectBlog(record.id)}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Title level={1} className="text-3xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </Title>
          <Text className="text-gray-600">
            Manage users, approve author requests, and moderate blog content.
          </Text>
        </div>

        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={stats.totalUsers}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Authors"
                value={stats.totalAuthors}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Blogs"
                value={stats.totalBlogs}
                prefix={<BookOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Pending Approvals"
                value={stats.pendingApprovals}
                prefix={<CheckOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <Tabs defaultActiveKey="users">
            <TabPane tab="All Users" key="users">
              <Table
                columns={userColumns}
                dataSource={users}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total} users`,
                }}
              />
            </TabPane>

            <TabPane tab="Author Requests" key="author-requests">
              {pendingAuthorRequests.length === 0 ? (
                <Empty description="No pending author requests" />
              ) : (
                <Table
                  columns={authorRequestColumns}
                  dataSource={pendingAuthorRequests}
                  rowKey="id"
                  pagination={false}
                />
              )}
            </TabPane>

            <TabPane tab="Pending Blogs" key="pending-blogs">
              {pendingBlogs.length === 0 ? (
                <Empty description="No pending blogs" />
              ) : (
                <Table
                  columns={blogColumns}
                  dataSource={pendingBlogs}
                  rowKey="id"
                  pagination={false}
                />
              )}
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
