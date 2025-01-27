import { useState } from 'react';
import {
    Button,
    Col,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Upload,
    message,
    Progress,
    Card,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 8 },
    },
};

const FormFresh = () => {
    const [form] = Form.useForm();
    const [uploadPercent, setUploadPercent] = useState(0);

    const handleImageUpload = async (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG or PNG files!');
            return false;
        }
        const isLt5M = file.size / 1024 / 1024 < 20;
        if (!isLt5M) {
            message.error('Profile picture must be smaller than 20MB!');
            return false;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://localhost:5000/upload-image', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                message.success('Profile picture uploaded successfully!');
                return data.imageUrl;
            } else {
                message.error(data.message || 'Failed to upload profile picture!');
            }
        } catch (error) {
            message.error('Failed to upload profile picture!');
        }
        return false;
    };

    const handleDocumentUpload = async (file) => {
        const isPdf = file.type === 'application/pdf';
        if (!isPdf) {
            message.error('You can only upload PDF files!');
            return false;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Resume must be smaller than 5MB!');
            return false;
        }

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const response = await fetch('http://localhost:5000/uploadResume', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                message.success('Resume uploaded successfully!');
            } else {
                message.error(data.message || 'Failed to upload resume!');
            }
        } catch (error) {
            message.error('Failed to upload resume!');
        }
        return false;
    };

    const handleSubmitForm = async () => {
        try {
            const values = await form.validateFields();
            if (!values.resume) {
                message.error('Please upload all required files!');
                return;
            }
            const data = {
                name: values.fullName,
                email: values.email,
                phone: values.phone,
                resume: values.resume,
                skills: values.skills,
                education: values.education,
                projects: values.projects,
                linkedin: values.linkedin,
                naukri: values.naukri,
            };

            const response = await fetch('http://localhost:5000/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (result.success) {
                message.success('Application submitted successfully!');
                form.resetFields();
            } else {
                message.error(result.message || 'Failed to submit application!');
            }
        } catch (error) {
            message.error('Failed to submit application!');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px', backgroundColor: '#f0f2f5' }}>
            <Card title="Job Application Form" style={{ width: '100%', maxWidth: 800, borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
                <Form
                    {...formItemLayout}
                    form={form}
                    name="job-application-form"
                    onFinish={handleSubmitForm}
                    style={{
                        maxWidth: 800,
                        width: '100%',
                    }}
                    scrollToFirstError
                >
                    {/* Personal Information Section */}
                    <Row gutter={16}>
                        <Col span={24} xs={24} sm={12}>
                            <Form.Item
                                name="fullName"
                                label="Full Name"
                                rules={[{ required: true, message: 'Please input your full name!' }]}
                            >
                                <Input placeholder="Enter your full name" />
                            </Form.Item>
                        </Col>
                        <Col span={24} xs={24} sm={12}>
                            <Form.Item
                                name="email"
                                label="E-mail"
                                rules={[{ type: 'email', message: 'The input is not a valid E-mail!' }, { required: true, message: 'Please input your E-mail!' }]}
                            >
                                <Input placeholder="Enter your email" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24} xs={24} sm={12}>
                            <Form.Item
                                name="phone"
                                label="Phone Number"
                                rules={[{ required: true, message: 'Please input your phone number!' }]}
                            >
                                <Input placeholder='+91' />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Resume Upload Section */}
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="resume"
                                label="Upload Resume"
                                valuePropName="fileList"
                                getValueFromEvent={({ fileList }) => fileList}
                                rules={[{ required: true, message: 'Please upload your resume!' }]}
                            >
                                <Upload
                                    beforeUpload={handleDocumentUpload}
                                    accept=".pdf"
                                    listType="picture"
                                    maxCount={1}
                                >
                                    <Button icon={<UploadOutlined />}>Click to Upload Resume</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Skills Section */}
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="skills"
                                label="Skills"
                                rules={[{ required: true, message: 'Please input your skills!' }]}
                            >
                                <Input placeholder="Enter your skills" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name="education"
                        label="Education"
                        rules={[{ required: true, message: 'Please input your education!' }]}
                    >
                        <Input placeholder="Enter your education (e.g., B.Tech in Computer Science, MCA, etc.)" />
                    </Form.Item>

                    {/* Projects Section */}
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="projects"
                                label="Projects"
                                rules={[{ required: true, message: 'Please input your projects!' }]}
                            >
                                <Input placeholder="Enter your projects" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* LinkedIn Profile */}
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="linkedin"
                                label="LinkedIn Profile"
                                rules={[{ required: true, message: 'Please input your LinkedIn profile!' }]}
                            >
                                <Input placeholder="Enter your LinkedIn profile" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Naukri Profile */}
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="naukri"
                                label="Naukri Profile"
                                rules={[{ required: false, message: 'Please input your Naukri profile!' }]}
                            >
                                <Input placeholder="Enter your Naukri profile" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Submit Button */}
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
export default FormFresh;