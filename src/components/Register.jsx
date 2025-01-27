import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import leftimage from '../assets/3959384.jpg';
const Register = () => {
  const [loading, setLoading] = useState(false);  // To manage loading state
  const [form] = Form.useForm();  // To access form data programmatically
  const navigate = useNavigate(); // Initialize useNavigate hook

  const onFinish = async (values) => {
    console.log('Received values:', values);

    try {
      setLoading(true); // Start loading spinner
      // Send data to backend via POST request
      const response = await axios.post('http://localhost:5000/register', values);

      // Handle success response
      if (response.status === 200) {
        message.success('Registration successful!');
        form.resetFields(); // Reset form fields after successful registration

        // Redirect to login page after successful registration
        navigate('/login'); // You can change this path to your login route if necessary
      }
    } catch (error) {
      // Handle error response
      console.error(error);
      message.error('Registration failed! Please try again.');
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const formStyle = {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',  // For positioning the circles
    transition: 'all 0.3s ease-in-out',
    fontFamily: 'Montserrat'
  };

  const titleStyle = {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '20px',
    fontWeight: 'bold',
    color: '#333',
  };

  const buttonStyle = {
    borderRadius: '4px',
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  };

  const circleStyleOrange = {
    position: 'absolute',
    top: '10vh',  // Adjusted to accommodate larger size
    right: '9vw',
    width: '160px',  // Increased size of the circle
    height: '160px',
    borderRadius: '50%',
    backgroundColor: '#FFA500', // Orange color
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Soft shadow for the circle
  };

  const circleStylePurple = {
    position: 'absolute',
    bottom: '10vh', // Adjusted to accommodate larger size
    left: '9vw',
    width: '160px',  // Increased size of the circle
    height: '160px',
    borderRadius: '50%',
    backgroundColor: '#800080', // Purple color
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Soft shadow for the circle
  };
  const leftStyles = {
    width: '50%',
    height: '100vh',
    backgroundColor: '#333',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const RightStyles = {
    width: '50%',
    height: '100vh',
    backgroundColor: '#f4f6f9',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  const imageStyles = {
    objectFit: 'cover',
    width: '100%',
    height: '100vh'
  }
  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', alignItems: 'center', backgroundColor: '#f4f6f9' }}>
      <div className='left' style={leftStyles} >
        <img src={leftimage} style={imageStyles}></img>
      </div>
      <div className='right' style={RightStyles}>
        <div style={circleStyleOrange}></div> {/* Orange Circle at top-right corner */}
        <div style={circleStylePurple}></div> {/* Purple Circle at bottom-left corner */}

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            remember: true,
          }}
          className="ant-form"
          style={formStyle}
        >
          <h2 className="form-title" style={titleStyle}>Register</h2>

          {/* Name Field */}
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your name!',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>

          {/* Email Field */}
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
              {
                type: 'email',
                message: 'The input is not a valid E-mail!',
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                min: 6,
                message: 'Password must be at least 6 characters!',
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          {/* Confirm Password Field */}
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              size="large"
            />
          </Form.Item>

          {/* Terms and Conditions Checkbox */}
          <Form.Item name="terms" valuePropName="checked" rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('Should accept terms and conditions')),
            },
          ]}>
            <Checkbox>I have read and agree to the <a href="#">Terms and Conditions</a></Checkbox>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading} // Show loading spinner on button
              style={buttonStyle}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;

