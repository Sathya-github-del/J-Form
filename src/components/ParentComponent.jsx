import React, { useState } from 'react';
import FormSub from './Formsub'; // The form where users apply
import AdminForm from './Adminform'; // The admin panel where applications are listed

const ParentComponent = () => {
    const [applications, setApplications] = useState([]);

    // Function to fetch applications from the backend
    const fetchApplications = async () => {
        try {
            const response = await fetch('http://localhost:5000/admin/get-applications', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            const data = await response.json();
            if (data.success) {
                setApplications(data.applications); // Set the applications data
            } else {
                console.error('Failed to fetch applications!');
            }
        } catch (error) {
            console.error('Error fetching applications!', error);
        }
    };

    // Callback to refresh admin applications list after a new form submission
    const handleNewSubmission = () => {
        fetchApplications();
    };

    return (
        <div>
            <h1>Job Application</h1>
            <FormSub onSubmit={handleNewSubmission} />
            <AdminForm applications={applications} fetchApplications={fetchApplications} />
        </div>
    );
};

export default ParentComponent;
