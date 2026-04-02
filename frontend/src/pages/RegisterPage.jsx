import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Checkbox,
  Space,
} from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/api";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await authService.register(values);
      login(response.token, {
        id: response.id,
        username: response.username,
        email: response.email,
        role: response.role,
        authorRequestPending: response.authorRequestPending,
        createdAt: "",
        updatedAt: "",
      });

      if (response.authorRequestPending) {
        message.success(
          "Registration successful! Your author request is pending admin approval."
        );
      } else {
        message.success("Registration successful!");
      }

      navigate("/");
    } catch (error) {
      message.error(
        error.response?.data || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Title level={2} className="text-3xl font-bold text-gray-900">
            Create your account
          </Title>
          <Text className="text-gray-600">
            Or{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </Text>
        </div>

        <Card className="shadow-lg">
          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: "Please input your username!" },
                { min: 3, message: "Username must be at least 3 characters!" },
                {
                  max: 50,
                  message: "Username must be less than 50 characters!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Choose a username"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Enter your email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Create a password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Confirm your password"
              />
            </Form.Item>

            <Form.Item name="requestAuthorAccess" valuePropName="checked">
              <Checkbox>
                Request Author Access
                <Text className="text-gray-500 text-sm ml-2">
                  (Requires admin approval)
                </Text>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-12 text-lg"
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-4">
            <Space direction="vertical" size="small">
              <Text className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-500">
                  Sign in here
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

export default RegisterPage;
