import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

function ChoreList() {
    const [availableChores, setAvailableChores] = useState([]);
    const [myChores, setMyChores] = useState([]);
    const [user, setUser] = useState(null);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [isChoresLoading, setIsChoresLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
        fetchChores();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${API_URL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
            navigate('/login');
        } finally {
            setIsUserLoading(false);
        }
    };

    const fetchChores = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/chores`);
            const allChores = response.data;
            localStorage.setItem('allChores', JSON.stringify(allChores));
            if (user) {
                setAvailableChores(allChores.filter(chore => !chore.assignedTo || chore.assignedTo !== user._id));
                setMyChores(allChores.filter(chore => chore.assignedTo === user._id));
            } else {
                setAvailableChores(allChores);
                setMyChores([]);
            }
        } catch (error) {
            console.error('Error fetching chores:', error);
        } finally {
            setIsChoresLoading(false);
        }
    };

    const handleAddChore = async (choreId) => {
        try {
            const response = await axios.put(`${API_URL}/api/chores/${choreId}/assign`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMyChores(prevChores => [...prevChores, response.data]);
            setAvailableChores(prevChores => prevChores.filter(chore => chore._id !== choreId));
        } catch (error) {
            console.error('Error adding chore:', error);
        }
    };

    const handleCompleteChore = async (choreId) => {
        try {
            await axios.delete(`${API_URL}/api/chores/${choreId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMyChores(prevChores => prevChores.filter(chore => chore._id !== choreId));
        } catch (error) {
            console.error('Error completing chore:', error);
        }
    };

    const handleViewChore = (choreId) => {
        navigate(`/chores/${choreId}`);
    };

    if (isUserLoading) {
        return <div>Loading user data...</div>;
    }

    return (
        <div>
            <h1>Welcome, {user?.firstName || 'User'}!</h1>
            <Link to="/add-chore">Add a Chore</Link>
            {isChoresLoading ? (
                <div>Loading chores...</div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '48%' }}>
                        <h2>Available Jobs</h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th>Job</th>
                                    <th>Location</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {availableChores.map((chore) => (
                                    <tr key={chore._id}>
                                        <td>{chore.name}</td>
                                        <td>{chore.location}</td>
                                        <td>
                                            <button onClick={() => handleViewChore(chore._id)}>View</button>
                                            <button onClick={() => handleAddChore(chore._id)}>Add</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ width: '48%' }}>
                        <h2>My Jobs</h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th>Job</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myChores.map((chore) => (
                                    <tr key={chore._id}>
                                        <td>{chore.name}</td>
                                        <td>
                                            <button onClick={() => handleViewChore(chore._id)}>View</button>
                                            <button onClick={() => handleCompleteChore(chore._id)}>Done</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChoreList;
