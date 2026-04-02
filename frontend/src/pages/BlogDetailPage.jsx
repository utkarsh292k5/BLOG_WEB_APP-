import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  Typography,
  Tag,
  Rate,
  Button,
  Modal,
  Form,
  Input,
  message,
  Spin,
  Empty,
  Space,
  Divider,
  Avatar,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  StarOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { blogService, reviewService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const BlogDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewForm] = Form.useForm();

  useEffect(() => {
    if (id) {
      fetchBlogAndReviews();
    }
  }, [id]);

  const fetchBlogAndReviews = async () => {
    try {
      setLoading(true);
      const [blogData, reviewsData] = await Promise.all([
        blogService.getBlogById(Number(id)),
        reviewService.getReviewsByBlog(Number(id)),
      ]);
      setBlog(blogData);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching blog:", error);
      message.error("Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (values) => {
    try {
      const newReview = await reviewService.createReview(Number(id), values);
      setReviews([...reviews, newReview]);
      setReviewModalVisible(false);
      reviewForm.resetFields();
      message.success("Review submitted successfully!");

      // Refresh blog to update average rating
      const updatedBlog = await blogService.getBlogById(Number(id));
      setBlog(updatedBlog);
    } catch (error) {
      message.error(error.response?.data || "Failed to submit review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId);
      setReviews(reviews.filter((review) => review.id !== reviewId));
      message.success("Review deleted successfully!");

      // Refresh blog to update average rating
      const updatedBlog = await blogService.getBlogById(Number(id));
      setBlog(updatedBlog);
    } catch (error) {
      message.error("Failed to delete review");
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

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Empty description="Blog not found" />
      </div>
    );
  }

  const canEditBlog =
    user &&
    (user.role === "ADMIN" ||
      (user.role === "AUTHOR" && blog.authorId === user.id));
  const hasUserReviewed =
    user && reviews.some((review) => review.userId === user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Tag color={getStatusColor(blog.status)} className="mb-2">
                {blog.status}
              </Tag>
              {canEditBlog && (
                <Space>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => {
                      /* Navigate to edit page */
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      /* Handle delete */
                    }}
                  >
                    Delete
                  </Button>
                </Space>
              )}
            </div>

            <Title level={1} className="text-4xl font-bold mb-4">
              {blog.title}
            </Title>

            <div className="flex items-center space-x-6 text-gray-600 mb-4">
              <div className="flex items-center">
                <UserOutlined className="mr-2" />
                <Text>{blog.authorUsername}</Text>
              </div>
              <div className="flex items-center">
                <CalendarOutlined className="mr-2" />
                <Text>{formatDate(blog.publishedAt || blog.createdAt)}</Text>
              </div>
              <div className="flex items-center">
                <StarOutlined className="mr-2" />
                <Rate disabled value={blog.averageRating} />
                <Text className="ml-2">({blog.reviewCount} reviews)</Text>
              </div>
            </div>

            {blog.tags && (
              <div className="mb-6">
                {blog.tags.split(",").map((tag, index) => (
                  <Tag key={index} className="mb-2">
                    {tag.trim()}
                  </Tag>
                ))}
              </div>
            )}
          </div>

          {blog.featuredImage && (
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          <div className="prose max-w-none">
            <Paragraph className="text-lg leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </Paragraph>
          </div>
        </Card>

        <Card title="Reviews" className="mb-6">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <Title level={4} className="mb-0">
                Reviews ({reviews.length})
              </Title>
              {user && !hasUserReviewed && (
                <Button
                  type="primary"
                  onClick={() => setReviewModalVisible(true)}
                >
                  Write a Review
                </Button>
              )}
            </div>
          </div>

          {reviews.length === 0 ? (
            <Empty description="No reviews yet. Be the first to review!" />
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} size="small">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center mb-2">
                      <Avatar icon={<UserOutlined />} className="mr-3" />
                      <div>
                        <Text strong>{review.userUsername}</Text>
                        <div className="flex items-center">
                          <Rate
                            disabled
                            value={review.rating}
                            className="text-sm"
                          />
                          <Text className="text-gray-500 text-sm ml-2">
                            {formatDate(review.createdAt)}
                          </Text>
                        </div>
                      </div>
                    </div>
                    {user && review.userId === user.id && (
                      <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                  <Paragraph className="mt-2 mb-0">{review.content}</Paragraph>
                </Card>
              ))}
            </div>
          )}
        </Card>

        <div className="text-center">
          <Link to="/">
            <Button>← Back to Home</Button>
          </Link>
        </div>
      </div>

      <Modal
        title="Write a Review"
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={null}
      >
        <Form form={reviewForm} onFinish={handleReviewSubmit} layout="vertical">
          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: "Please select a rating!" }]}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            name="content"
            label="Review"
            rules={[
              { required: true, message: "Please write a review!" },
              {
                max: 1000,
                message: "Review must be less than 1000 characters!",
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Share your thoughts about this blog..."
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space>
              <Button type="primary" htmlType="submit">
                Submit Review
              </Button>
              <Button onClick={() => setReviewModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogDetailPage;
