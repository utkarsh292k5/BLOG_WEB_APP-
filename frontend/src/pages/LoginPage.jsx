import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/api";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await authService.login(values);
      login(response.token, {
        id: response.id,
        username: response.username,
        email: response.email,
        role: response.role,
        authorRequestPending: response.authorRequestPending,
        createdAt: "",
        updatedAt: "",
      });

      message.success("Login successful!");

      // Redirect based on user role
      if (response.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (response.role === "AUTHOR") {
        navigate("/author-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      message.error(error.response?.data || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Title level={2} className="text-3xl font-bold text-gray-900">
            Sign in to your account
          </Title>
          <Text className="text-gray-600">
            Or{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </Text>
        </div>

        <Card className="shadow-lg">
          <Form name="login" onFinish={onFinish} layout="vertical" size="large">
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Enter your username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter your password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-12 text-lg"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-4">
            <Space direction="vertical" size="small">
              <Text className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Sign up here
                </Link>
              </Text>
              <Link to="/" className="text-blue-600 hover:text-blue-500">
                ← Back to Home
              </Link>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
