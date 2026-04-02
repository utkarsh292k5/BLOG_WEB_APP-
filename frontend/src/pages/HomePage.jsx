import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Rate,
  Spin,
  Empty,
  Pagination,
} from "antd";
import { CalendarOutlined, UserOutlined, EyeOutlined } from "@ant-design/icons";
import { blogService } from "../services/api";

const { Title, Text, Paragraph } = Typography;

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogService.getAllBlogs(currentPage - 1, pageSize);
      setBlogs(data);
      // Note: In a real app, you'd get total count from the API
      setTotalPages(Math.ceil(data.length / pageSize));
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "green";
      case "PENDING":
        return "orange";
      case "REJECTED":
        return "red";
      default:
        return "default";
    }
  };

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
        <div className="text-center mb-8">
          <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to BlogApp
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing stories, insights, and knowledge from our community
            of writers. Read, learn, and share your thoughts with the world.
          </Paragraph>
        </div>

        {blogs.length === 0 ? (
          <Empty
            description="No blogs available at the moment"
            className="mt-16"
          />
        ) : (
          <>
            <Row gutter={[24, 24]}>
              {blogs.map((blog) => (
                <Col xs={24} sm={12} lg={8} key={blog.id}>
                  <Card
                    hoverable
                    className="h-full"
                    cover={
                      blog.featuredImage ? (
                        <img
                          alt={blog.title}
                          src={blog.featuredImage}
                          className="h-48 object-cover"
                        />
                      ) : (
                        <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                          <Text className="text-white text-lg font-semibold">
                            {blog.title.charAt(0).toUpperCase()}
                          </Text>
                        </div>
                      )
                    }
                    actions={[
                      <Link to={`/blog/${blog.id}`} key="read">
                        <EyeOutlined /> Read More
                      </Link>,
                    ]}
                  >
                    <div className="mb-3">
                      <Tag color={getStatusColor(blog.status)} className="mb-2">
                        {blog.status}
                      </Tag>
                      <Title level={4} className="mb-2 line-clamp-2">
                        {blog.title}
                      </Title>
                    </div>

                    <Paragraph
                      ellipsis={{ rows: 3 }}
                      className="text-gray-600 mb-4"
                    >
                      {blog.excerpt || blog.content.substring(0, 150) + "..."}
                    </Paragraph>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <UserOutlined className="mr-1" />
                        <Text>{blog.authorUsername}</Text>
                      </div>
                      <div className="flex items-center">
                        <CalendarOutlined className="mr-1" />
                        <Text>
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </Text>
                      </div>
                    </div>

                    {blog.tags && (
                      <div className="mb-3">
                        {blog.tags.split(",").map((tag, index) => (
                          <Tag key={index} className="mb-1">
                            {tag.trim()}
                          </Tag>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Rate
                        disabled
                        value={blog.averageRating}
                        className="text-sm"
                      />
                      <Text className="text-sm text-gray-500">
                        {blog.reviewCount} reviews
                      </Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            <div className="text-center mt-8">
              <Pagination
                current={currentPage}
                total={totalPages * pageSize}
                pageSize={pageSize}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
