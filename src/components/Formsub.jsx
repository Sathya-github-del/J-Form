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

const FormSub = () => {
    const [form] = Form.useForm();
    const [uploadPercent, setUploadPercent] = useState(0);

    const handleVideoUpload = async (file) => {
        const formData = new FormData();
        formData.append('video', file);

        try {
            const response = await fetch('http://localhost:5000/upload-video', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });
            const data = await response.json();
            if (data.success) {
                message.success('Video uploaded successfully!');
                setUploadPercent(0);
            } else {
                message.error(data.message || 'Failed to upload video!');
                setUploadPercent(0);
            }
        } catch (error) {
            message.error('Failed to upload video!');
            setUploadPercent(0);
        }
        return false;
    };
    const handlePictureUpload = async (file) => {
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

    const handleResumeUpload = async (file) => {
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

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (!values.resume || !values.selfIntroductionVideo) {
                message.error('Please upload all required files!');
                return;
            }
            const data = {
                name: values.fullName,
                email: values.email,
                phone: values.phone,
                job_position: values.position,
                previousJobCTC: values.previousJobCTC,
                expectedCTC: values.expectedCTC,
                resume: values.resume,
                selfIntroductionVideo: values.selfIntroductionVideo,
                portfolio: values.portfolio,
                skills: values.skills,
                yearsOfExperience: values.yearsOfExperience,
                monthsOfExperience: values.monthsOfExperience,
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
            <Card title="Application Form" style={{ width: '100%', maxWidth: 800, borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', fontFamily: 'Montserrat' }}>
                <Form
                    {...formItemLayout}
                    form={form}
                    name="job-application"
                    onFinish={handleSubmit}
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
                                rules={[{ required: true, message: 'Please input your full name!' }]} >
                                <Input placeholder="Enter your full name" />
                            </Form.Item>
                        </Col>
                        <Col span={24} xs={24} sm={12}>
                            <Form.Item
                                name="email"
                                label="E-mail"
                                rules={[{ type: 'email', message: 'The input is not a valid E-mail!' }, { required: true, message: 'Please input your E-mail!' }]} >
                                <Input placeholder="Enter your email" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24} xs={24} sm={12}>
                            <Form.Item
                                name="phone"
                                label="Phone Number"
                                rules={[{ required: true, message: 'Please input your phone number!' }]} >
                                <Input placeholder='+91' />
                            </Form.Item>
                        </Col>
                        <Col span={24} xs={24} sm={12}>
                            <Form.Item
                                name="position"
                                label="Position"
                                rules={[{ required: true, message: 'Please input a position!' }]} >
                                <Input placeholder='Current Position' />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* CTC Section */}
                    <Row gutter={16}>
                        <Col span={24} xs={24} sm={15}>
                            <Form.Item
                                name="previousJobCTC"
                                label="Previous Job CTC"
                                rules={[{ required: false, message: 'Please input your previous job CTC!' }]} >
                                <InputNumber placeholder="5" addonAfter="LPA" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={24} xs={24} sm={12}>
                            <Form.Item
                                name="expectedCTC"
                                label="Expected CTC"
                                rules={[{ required: false, message: 'Please input your expected CTC!' }]} >
                                <InputNumber placeholder="5" addonAfter="LPA" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="profilePicture"
                                label="Upload Profile Picture"
                                valuePropName="fileList"
                                getValueFromEvent={({ fileList }) => fileList}
                                rules={[{ required: true, message: 'Please upload your profile picture!' }]} >
                                <Upload
                                    beforeUpload={handlePictureUpload}
                                    accept=".jpg,.jpeg,.png"
                                    listType="picture"
                                    maxCount={1}>
                                    <Button icon={<UploadOutlined />}>Click to Upload Profile Picture</Button>
                                </Upload>
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
                                rules={[{ required: true, message: 'Please upload your resume!' }]} >
                                <Upload
                                    beforeUpload={handleResumeUpload}
                                    accept=".pdf"
                                    listType="picture"
                                    maxCount={1}>
                                    <Button icon={<UploadOutlined />}>Click to Upload Resume</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Self Introduction Video Upload Section */}
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="selfIntroductionVideo"
                                label="Upload Self Introduction Video"
                                valuePropName="fileList"
                                getValueFromEvent={({ fileList }) => fileList}
                                rules={[{ required: true, message: 'Please upload your self-introduction video!' }]} >
                                <Upload
                                    beforeUpload={handleVideoUpload}
                                    accept="video/mp4,video/avi,video/mkv"
                                    listType="picture"
                                    maxCount={1}>
                                    <Button icon={<UploadOutlined />}>Click to Upload Video</Button>
                                </Upload>
                                {uploadPercent > 0 && (
                                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
                                        <Progress percent={uploadPercent} status="active" style={{ width: '80%' }} />
                                        <span style={{ marginLeft: '10px' }}>{uploadPercent}%</span>
                                    </div>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Portfolio Section */}
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="portfolio"
                                label="Portfolio/Website"
                                rules={[{ required: false }]} >
                                <Input placeholder="Enter your portfolio link" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Skills Section */}
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="skills"
                                label="Skills"
                                rules={[{ required: true, message: 'Please list your skills!' }]} >
                                <Select mode="multiple" allowClear>
                                    <Select.Option value="JavaScript">JavaScript</Select.Option>
                                    <Select.Option value="React">React</Select.Option>
                                    <Select.Option value="Node.js">Node.js</Select.Option>
                                    <Select.Option value="Python">Python</Select.Option>
                                    <Select.Option value="Java">Java</Select.Option>
                                    <Select.Option value="C++">C++</Select.Option>
                                    <Select.Option value="Ruby">Ruby</Select.Option>
                                    <Select.Option value="PHP">PHP</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Experience Section */}
                    <Row gutter={16}>
                        <Col span={15}>
                            <Form.Item
                                name="yearsOfExperience"
                                label="Years of Experience"
                                rules={[{ required: false }]} >
                                <Select>
                                    {Array.from({ length: 21 }, (_, i) => (
                                        <Select.Option key={i} value={i.toString()}>{i}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="monthsOfExperience"
                                label="Months"
                                rules={[{ required: false }]} >
                                <Select>
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <Select.Option key={i} value={i.toString()}>{i}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Submit Application
                        </Button>
                    </Form.Item>
                </Form>
                <div className='fresher' style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'Montserrat' }}>
                    <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Are you a fresher?</p>
                    <Button type="primary" style={{ width: '150px', height: '25px', fontSize: '16px' }}>
                        <a href='/formfresh' style={{ color: 'white', textDecoration: 'none' }}>Click here to apply</a>
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default FormSub;
