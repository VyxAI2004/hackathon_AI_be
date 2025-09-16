import { useLogin } from "@refinedev/core";
import { authProvider } from "../../providers/auth";
import { Form, Input, Button, Card, Typography,notification } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import './LoginPage.css';
import naverLogo from '../../../../public/naver-logo.svg';
import hackathonGraphic from '../../../../public/hackathon-graphic.svg';
import { useState } from 'react';

const { Title, Text } = Typography;

export const LoginPage = () => {
  const { mutate: login } = useLogin();
  const [isLogin, setIsLogin] = useState(true);

  // Lấy remembered credentials từ localStorage
  const [initialValues, setInitialValues] = useState(() => {
    const stored = localStorage.getItem('rememberedCredentials');
    return stored ? JSON.parse(stored) : { email: '', password: '' };
  });

  const onFinish = async (values: any) => {
    if (isLogin) {
      login(
        { email: values.email, password: values.password },
        {
          onSuccess: () => {
            if (values.remember) {
              localStorage.setItem('rememberedCredentials', JSON.stringify({
                email: values.email,
                password: values.password,
              }));
              setInitialValues({ email: values.email, password: values.password });
            } else {
              localStorage.removeItem('rememberedCredentials');
              setInitialValues({ email: '', password: '' });
            }
          },
          onError: (error) => {
            notification.error({
              message: 'Login Failed',
              description: error.message || 'Invalid email or password',
            });
          },
        }
      );
    } else {
      try {
        const response = await authProvider.register?.({
          username: values.username || values.email.split('@')[0],
          email: values.email,
          password: values.password,
        });

        if (response?.success) {
          notification.success({
            message: 'Account Created',
            description: 'Your account has been created successfully!',
          });

          // Login ngay sau khi đăng ký
          login(
            { email: values.email, password: values.password },
            {
              onSuccess: () => {
                if (values.remember) {
                  localStorage.setItem('rememberedCredentials', JSON.stringify({
                    email: values.email,
                    password: values.password,
                  }));
                  setInitialValues({ email: values.email, password: values.password });
                } else {
                  localStorage.removeItem('rememberedCredentials');
                  setInitialValues({ email: '', password: '' });
                }
              },
              onError: (error) => {
                notification.error({
                  message: 'Login Failed',
                  description: error.message || 'Invalid email or password',
                });
              },
            }
          );
        }
      } catch (error: any) {
        notification.error({
          message: 'Registration Failed',
          description: error.message || 'Failed to create account',
        });
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-column graphic-column">
        <img className="graphic" src={hackathonGraphic} alt="" />
      </div>
      <div className="login-column title-column">
        <div className="login-left-content">
          <img src={naverLogo} alt="NAVER Vietnam AI Hackathon" className="logo" />
          <div className="greeting">
            <p className="hello">Xin chào! 안녕하세요!</p>
            <p className="subtitle">HACKATHON TO DO APP</p>
          </div>
        </div>
      </div>
      <div className="login-column login-right">
        <Card className="login-card">
          <Title level={3} className="login-card-title">
            {isLogin ? 'Welcome Back!' : 'Create New Account'}
          </Title>
          <Form
            name="login_form"
            initialValues={isLogin ? initialValues : {}}
            onFinish={onFinish}
            layout="vertical"
            className="login-form"
          >
            {!isLogin && (
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Please input your Name!' }]}
              >
                <Input
                  prefix={<UserOutlined className="input-icon" />}
                  placeholder="Name"
                  size="large"
                  className="login-input"
                />
              </Form.Item>
            )}
            <h3>Email</h3>
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your Email!' }]}
            >
              <Input
                prefix={<UserOutlined className="input-icon" />}
                placeholder="Email"
                size="large"
                className="login-input"
              />
            </Form.Item>
            <h3>Password</h3>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input
                prefix={<LockOutlined className="input-icon" />}
                type="password"
                placeholder="Password"
                size="large"
                className="login-input"
              />
            </Form.Item>
            {!isLogin && (
              <Form.Item
                name="confirmPassword"
                rules={[
                  { required: true, message: 'Please confirm your Password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input
                  prefix={<LockOutlined className="input-icon" />}
                  type="password"
                  placeholder="Confirm Password"
                  size="large"
                  className="login-input"
                />
              </Form.Item>
            )}
            {isLogin ? (
              <Form.Item>
                <Text
                  strong
                  style={{  cursor: 'pointer' }}
                  onClick={() => setIsLogin(false)}
                >
                  Create Account
                </Text>
              </Form.Item>
            ) : (
              <Form.Item>
                <Text
                  strong
                  style={{ cursor: 'pointer' }}
                  onClick={() => setIsLogin(true)}
                >
                  Back to Login
                </Text>
              </Form.Item>
            )}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="login-button"
                block
              >
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};
