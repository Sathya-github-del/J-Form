import { useState, useEffect } from 'react';
import { Button, Table, message } from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const AdminForm = () => {
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();

    // Fetching all the applications
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            message.error('You must be logged in as an admin to view applications');
            navigate('/adminauth');  // Redirect to login page if not authenticated
        } else {
            fetchApplications();  // Fetch applications when token is available
        }
    }, []);

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem('adminToken');  // Retrieve the token from localStorage
            if (!token) {
                message.error('You must be logged in as an admin to view applications');
                navigate('/adminauth');  // Redirect to login if no token is found
                return;
            }

            const response = await fetch('http://localhost:5000/admin/get-applications', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Corrected template literal syntax
                },
            });

            const data = await response.json();
            if (data.success) {
                setApplications(data.applications); // Set the applications data
            } else {
                message.error('Failed to fetch applications!');
            }
        } catch (error) {
            message.error('Error fetching applications!');
        }
    };
    const handleLogout = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            message.error('You must be logged in as an admin to logout');
            navigate('/adminauth');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/admin/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to logout!');
            }

            const data = await response.json();
            if (data.redirect) {
                message.success(data.message);
                localStorage.removeItem('adminToken');
                navigate(data.redirect);
            } else {
                message.error('Failed to logout!');
            }
        } catch (error) {
            message.error('Error logging out!');
        }
    }

    const handleDownloadResume = (resumeUrl) => {
        if (!resumeUrl) return;
        const fullUrl = `http://localhost:5000${resumeUrl}`;
        const link = document.createElement('a');
        link.href = fullUrl;
        link.download = 'resume';
        link.click();
    };
    const handleDownloadVideo = (videoUrl) => {
        if (!videoUrl) return;
        const fullUrl = `http://localhost:5000${videoUrl}`;
        const link = document.createElement('a');
        link.href = fullUrl;
        link.download = 'video';
        link.click();
    };
    const handleDownloadImage = (imageUrl) => {
        if (!imageUrl) return;
        const fullUrl = `http://localhost:5000${imageUrl}`;
        const link = document.createElement('a');
        link.href = fullUrl;
        link.download = 'image';
        link.click();
    };
    // Delete User/Job Application Handler
    const handleDelete = async (id) => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            message.error('You must be logged in as an admin to delete an application');
            navigate('/adminauth');  // Redirect to login if no token is found
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/admin/delete-application/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Corrected template literal syntax
                },
            });

            const data = await response.json();
            if (data.success) {
                message.success('Application deleted successfully');
                setApplications(applications.filter((app) => app.id !== id));  // Remove the deleted application from the state
            } else {
                message.error('Failed to delete application!');
            }
        } catch (error) {
            message.error('Error deleting application!');
        }
    };

    const columns = [
        {
            title: 'Full Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'E-mail',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Position',
            dataIndex: 'job_position',
            key: 'job_position',
        },
        {
            title: 'Previous Job CTC',
            dataIndex: 'previousJobCTC',
            key: 'previousJobCTC',
        },
        {
            title: 'Expected CTC',
            dataIndex: 'expectedCTC',
            key: 'expectedCTC',
        },
        {
            title: 'Resume',
            key: 'resume',
            render: (_, record) => (
                <Button
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownloadResume(record.resume_url)}  // Ensure resume_url is correctly passed
                >
                    Download Resume
                </Button>
            ),
        },
        {
            title: 'Self Introduction Video',
            key: 'video',
            render: (_, record) => (
                <Button
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownloadVideo(record.video_url)}  // Ensure video_url is correctly passed
                >
                    Download Video
                </Button>
            ),
        },
        {
            title: 'Image',
            key: 'image',
            render: (_, record) => (
                <Button
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownloadImage(record.image_url)}  // Ensure image_url is correctly passed
                >
                    Download Image
                </Button>
            ),
        },
        {
            title: 'Portfolio',
            dataIndex: 'portfolio',
            key: 'portfolio',
        },
        {
            title: 'Skills',
            dataIndex: 'skills',
            key: 'skills',
        },
        {
            title: 'Experience',
            dataIndex: 'experience',
            key: 'experience',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(record.id)}  // Handle delete on click
                >
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h2>Admin Panel</h2>
            <Table
                columns={columns}
                dataSource={applications}
                rowKey="id"  // Assuming each application has a unique 'id'
                pagination={false}
            />
            <Button onClick={handleLogout}>
                Logout
            </Button>
        </div>
    );
};

export default AdminForm;
