import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

const ChoreList = () => {
    const [chores, setChores] = useState([]);
    const [userChores, setUserChores] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
        fetchChores();
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchUserChores();
        }
    }, [currentUser]);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/user', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCurrentUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        }
    };
    
    const fetchChores = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/chores', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setChores(response.data);
        } catch (error) {
            console.error('Error fetching chores:', error);
        }
    };
    

    const fetchUserChores = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/chores/user/${currentUser._id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUserChores(response.data);
        } catch (error) {
            console.error('Error fetching user chores:', error);
        }
    };

    const handleViewChore = (id) => {
        navigate(`/chores/${id}`);
    };

    const handleAddChore = async (choreId) => {
        try {
            await axios.post(`http://localhost:8000/api/chores/${choreId}/assign`, { userId: currentUser._id }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchUserChores();
        } catch (error) {
            console.error('Error adding chore:', error);
        }
    };

    const handleEditChore = (id) => {
        navigate(`/chores/${id}/edit`);
    };

    const handleCancelChore = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/chores/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchChores();
            fetchUserChores();
        } catch (error) {
            console.error('Error cancelling chore:', error);
        }
    };

    const handleCompleteChore = async (id) => {
        try {
            await axios.put(`http://localhost:8000/api/chores/${id}`, { status: 'completed' }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchUserChores();
        } catch (error) {
            console.error('Error completing chore:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/api/logout');
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Chore List</h1>
                <div>
                    <button onClick={handleLogout} style={{ marginRight: '10px' }}>Logout</button>
                    <span>{currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : ''}</span>
                </div>
            </div>
            <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                <Link to="/chores/new">Add New Chore</Link>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '60%' }}>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                            <tr>
                                <th style={{ width: '25%', textAlign: 'left', padding: '8px' }}>Name</th>
                                <th style={{ width: '35%', textAlign: 'left', padding: '8px' }}>Description</th>
                                <th style={{ width: '20%', textAlign: 'left', padding: '8px' }}>Published Date</th>
                                <th style={{ width: '20%', textAlign: 'left', padding: '8px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chores.map((chore) => (
                                <tr key={chore._id}>
                                    <td style={{ padding: '8px' }}>{chore.name}</td>
                                    <td style={{ padding: '8px' }}>{chore.description}</td>
                                    <td style={{ padding: '8px' }}>{new Date(chore.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '8px' }}>
                                        <button onClick={() => handleViewChore(chore._id)}>View</button>
                                        <button onClick={() => handleAddChore(chore._id)}>Add</button>
                                        {currentUser && chore.createdBy === currentUser._id && (
                                            <>
                                                <button onClick={() => handleEditChore(chore._id)}>Edit</button>
                                                <button onClick={() => handleCancelChore(chore._id)}>Cancel</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ width: '35%', marginLeft: '20px' }}>
                    <h2>My Jobs</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
                                <th style={{ textAlign: 'right', padding: '8px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userChores.map((chore) => (
                                <tr key={chore._id}>
                                    <td style={{ padding: '8px' }}>{chore.name}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>
                                        <button onClick={() => handleViewChore(chore._id)}>View</button>
                                        <button onClick={() => handleCompleteChore(chore._id)}>Done</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ChoreList;