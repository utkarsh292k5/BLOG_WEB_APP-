import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  message,
  Spin,
  Empty,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { blogService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const { Title, Text } = Typography;
const { TextArea } = Input;

const AuthorDashboard = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogService.getMyBlogs();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      message.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = () => {
    setEditingBlog(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    form.setFieldsValue({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      featuredImage: blog.featuredImage,
      tags: blog.tags,
    });
    setModalVisible(true);
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      await blogService.deleteBlog(blogId);
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
      message.success("Blog deleted successfully!");
    } catch (error) {
      message.error(error.response?.data || "Failed to delete blog");
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingBlog) {
        const updatedBlog = await blogService.updateBlog(
          editingBlog.id,
          values
        );
        setBlogs(
          blogs.map((blog) => (blog.id === editingBlog.id ? updatedBlog : blog))
        );
        message.success("Blog updated successfully!");
      } else {
        const newBlog = await blogService.createBlog(values);
        setBlogs([newBlog, ...blogs]);
        message.success("Blog created successfully!");
      }
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data || "Failed to save blog");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "green";
      case "PENDING":
        return "orange";
      case "REJECTED":
        return "red";
      case "DRAFT":
        return "default";
      default:
        return "default";
    }
  };

  const columns = [
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
            {record.excerpt || record.content.substring(0, 100) + "..."}
          </Text>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Rating",
      dataIndex: "averageRating",
      key: "averageRating",
      render: (rating, record) => (
        <div>
          <Text>{rating.toFixed(1)}</Text>
          <Text type="secondary" className="text-sm ml-1">
            ({record.reviewCount} reviews)
          </Text>
        </div>
      ),
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
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditBlog(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this blog?"
            onConfirm={() => handleDeleteBlog(record.id)}
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
            Author Dashboard
          </Title>
          <Text className="text-gray-600">
            Welcome back, {user?.username}! Manage your blogs and track their
            performance.
          </Text>
        </div>

        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Title level={3} className="mb-0">
              My Blogs
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateBlog}
            >
              Create New Blog
            </Button>
          </div>

          {blogs.length === 0 ? (
            <Empty
              description="You haven't created any blogs yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={handleCreateBlog}>
                Create Your First Blog
              </Button>
            </Empty>
          ) : (
            <Table
              columns={columns}
              dataSource={blogs}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} blogs`,
              }}
            />
          )}
        </Card>

        <Modal
          title={editingBlog ? "Edit Blog" : "Create New Blog"}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[
                { required: true, message: "Please enter a title!" },
                {
                  max: 200,
                  message: "Title must be less than 200 characters!",
                },
              ]}
            >
              <Input placeholder="Enter blog title" />
            </Form.Item>

            <Form.Item
              name="excerpt"
              label="Excerpt"
              rules={[
                {
                  max: 500,
                  message: "Excerpt must be less than 500 characters!",
                },
              ]}
            >
              <TextArea
                rows={3}
                placeholder="Brief description of your blog..."
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Form.Item
              name="content"
              label="Content"
              rules={[
                { required: true, message: "Please enter blog content!" },
              ]}
            >
              <TextArea
                rows={10}
                placeholder="Write your blog content here..."
              />
            </Form.Item>

            <Form.Item name="featuredImage" label="Featured Image URL">
              <Input placeholder="https://example.com/image.jpg" />
            </Form.Item>

            <Form.Item name="tags" label="Tags">
              <Input placeholder="tag1, tag2, tag3" />
            </Form.Item>

            <Form.Item className="mb-0">
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingBlog ? "Update Blog" : "Create Blog"}
                </Button>
                <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default AuthorDashboard;
