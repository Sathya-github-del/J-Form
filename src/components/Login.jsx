import { useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { DashOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import leftimage from '../assets/3959384.jpg';
const Login = () => {
  const [loading, setLoading] = useState(false);  // To manage loading state
  const [form] = Form.useForm();  // To access form data programmatically
  const navigate = useNavigate(); // Initialize useNavigate hook

  const onFinish = async (values) => {
    console.log('Received values:', values);

    try {
      setLoading(true); // Start loading spinner
      // Send login data to backend via POST request
      const response = await axios.post('http://localhost:5000/login', values);

      // Handle success response
      if (response.status === 200) {
        message.success('Login successful!');
        form.resetFields(); // Reset form fields after successful login

        // Redirect to /formsub after successful login
        navigate('/formsub'); // Redirect to the formsub page
      }
    } catch (error) {
      // Handle error response
      console.error(error);
      message.error('Login failed! Please check your credentials.');
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const formStyle = {
    width: '25vw',
    height: '55vh',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: 'rgba(0,0,0,0.1)',
    position: 'relative',
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)',
    borderRadius: '5px',
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
    top: '15vh',  // Adjusted to accommodate larger size
    right: '8vw',
    width: '160px',  // Increased size of the circle
    height: '160px',
    borderRadius: '50%',
    backgroundColor: '#FFA500', // Orange color
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Soft shadow for the circle
  };

  const circleStylePurple = {
    position: 'absolute',
    bottom: '15vh', // Adjusted to accommodate larger size
    left: '8vw',
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
          name="login"
          onFinish={onFinish}
          initialValues={{
            remember: true,
          }}
          className="ant-form"
          style={formStyle}
        >
          <h2 className="form-title" style={titleStyle}>Login</h2>

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
              prefix={<DashOutlined />}
              placeholder="Email"
              size="large"
              type="text"
              bordered={false}
              style={{ borderBottom: '1px solid #333', padding: '10px 0', border: 'none', outline: 'none', background: 'none' }}
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
              prefix={<DashOutlined />}
              placeholder="Password"
              size="large"
              type="text"
              bordered={false}
              style={{ borderBottom: '1px solid #333', padding: '10px 0' }}
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={buttonStyle}
            >
              Login
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              block
              size="large"
              style={{ ...buttonStyle, backgroundColor: '#4285F4', borderColor: '#4285F4', color: '#fff' }}
              onClick={() => {
                window.location.href = 'http://localhost:5000/auth/google';
              }}
            >
              <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" style={{ width: '20px', marginRight: '10px' }} />
              Login with Gmail
            </Button>
          </Form.Item>
          <Form.Item>
            <Typography.Text>
              Don&apos;t have an account?
              <a href="/" style={{ color: '#4CAF50' }}>
                Sign up
              </a>
            </Typography.Text>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default Login;