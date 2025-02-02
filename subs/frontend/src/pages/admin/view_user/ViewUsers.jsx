import React, { useEffect, useState } from 'react';
import { Alert, Button, Spinner, Table } from 'react-bootstrap';
import { delUserById, getActivityLogsApi, getUserData } from '../../../apis/api';
import AdminNav from '../../../components/AdminNav';
import FooterCard from '../../../components/FooterCard';

const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUserData();
                setUsers(response.data.data || []);
            } catch (error) {
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        const fetchActivityLogs = async () => {
            try {
                const response = await getActivityLogsApi();
                setActivityLogs(response.data.logs || []);
            } catch (error) {
                setError('Failed to fetch activity logs');
            }
        };

        fetchUsers();
        fetchActivityLogs();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await delUserById(userId);
                setUsers(users.filter(user => user._id !== userId));
            } catch (error) {
                setError('Failed to delete user');
            }
        }
    };

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <AdminNav />
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        <h2 className="my-4" style={{ color: 'black' }}>User Management</h2>

                        {loading ? (
                            <Spinner animation="border" variant="primary" />
                        ) : error ? (
                            <Alert variant="danger">{error}</Alert>
                        ) : (
                            <div className="table-responsive">
                                <Table bordered hover className="bg-white">
                                    <thead>
                                        <tr style={{ backgroundColor: '#8C52FF', color: 'white' }}>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Phone Number</th>
                                            <th>Age</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length > 0 ? (
                                            users.map((user) => (
                                                <tr key={user._id}>
                                                    <td style={{ color: 'black' }}>{user.fullname}</td>
                                                    <td style={{ color: 'black' }}>{user.email}</td>
                                                    <td style={{ color: 'black' }}>{user.phone}</td>
                                                    <td style={{ color: 'black' }}>{user.age}</td>
                                                    <td>
                                                        <Button
                                                            variant="primary"
                                                            onClick={() => handleDelete(user._id)}
                                                            style={{ backgroundColor: '#8C52FF', borderColor: '#8C52FF', color: 'white' }}
                                                        >
                                                            Delete User
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'center', color: 'black' }}>No users found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        )}

                        <h2 className="my-4" style={{ color: 'black' }}>Activity Logs</h2>
                        <div className="table-responsive">
                            <Table bordered hover className="bg-white">
                                <thead>
                                    <tr style={{ backgroundColor: '#8C52FF', color: 'white' }}>
                                        <th>User</th>
                                        <th>Action</th>
                                        <th>IP Address</th>
                                        <th>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activityLogs.length > 0 ? (
                                        activityLogs.map((log) => (
                                            <tr key={log._id}>
                                                <td style={{ color: 'black' }}>{log.userID?.email || "Unknown"}</td>
                                                <td style={{ color: 'black' }}>{log.action}</td>
                                                <td style={{ color: 'black' }}>{log.ipAddress}</td>
                                                <td style={{ color: 'black' }}>{new Date(log.timestamp).toLocaleString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', color: 'black' }}>No activity logs found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default ViewUsers;
