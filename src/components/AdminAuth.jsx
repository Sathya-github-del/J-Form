import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Importing the useNavigate hook

const AdminAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  // Initializing the navigate function

  const onFinish = async (values) => {
    setLoading(true);
    const { username, password } = values;

    try {
      // Send login request to the backend
      const response = await axios.post('http://localhost:5000/admin/login', {
        username,
        password,
      });

      // On success, save the JWT token to localStorage
      localStorage.setItem('adminToken', response.data.token);

      notification.success({
        message: 'Login Successful',
        description: 'You have successfully logged in as admin!',
      });

      // Use navigate to redirect to the admin dashboard
      navigate('/adminform');  // Use navigate instead of window.location.href
    } catch (error) {
      notification.error({
        message: 'Login Failed',
        description: error.response ? error.response.data.message : 'An error occurred!',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '50px 0' }}>
      <h2 style={{ fontFamily: 'Montserrat, sans-serif' }}>Admin Login</h2>
      <Form name="admin_login" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminAuth;
