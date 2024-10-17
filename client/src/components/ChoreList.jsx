import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useChores } from './ChoreContext.jsx';

const API_URL = 'http://localhost:8000';

function ChoreList() {
    const { chores, setChores } = useChores();
    const [user, setUser] = useState(null);
    const [choreIds, setChoreIds] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const renderIdRef = useRef(0);

    useEffect(() => {
        renderIdRef.current += 1;
        fetchUser();
        fetchChores();
    }, [location]);

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
        }
    };

    const fetchChores = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/chores`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const newChores = response.data;
            const newChoreIds = {...choreIds};
            newChores.forEach(chore => {
                if (!newChoreIds[chore._id]) {
                    newChoreIds[chore._id] = Math.random().toString(36).substr(2, 9);
                }
            });
            
            setChores(prevChores => {
                const choreMap = new Map(prevChores.map(chore => [chore._id, chore]));
                newChores.forEach(newChore => {
                    const existingChore = choreMap.get(newChore._id);
                    if (existingChore) {
                        choreMap.set(newChore._id, { ...newChore, postedBy: existingChore.postedBy, assignedTo: existingChore.assignedTo });
                    } else {
                        choreMap.set(newChore._id, newChore);
                    }
                });
                return Array.from(choreMap.values());
            });
            
            setChoreIds(newChoreIds);
        } catch (error) {
            console.error('Error fetching chores:', error);
        }
    };    

    const handleAddChore = async (choreId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/api/chores/${choreId}/assign`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChores(prevChores => prevChores.map(chore => 
                chore._id === choreId ? { ...chore, assignedTo: user._id } : chore
            ));
        } catch (error) {
            console.error('Error adding chore:', error);
        }
    };

    const handleCompleteChore = async (choreId) => {
        try {
            await axios.delete(`${API_URL}/api/chores/${choreId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setChores(prevChores => prevChores.filter(chore => chore._id !== choreId));
        } catch (error) {
            console.error('Error completing chore:', error);
        }
    };

    const handleEditChore = (choreId) => {
        console.log('Editing chore with ID:', choreId);
        navigate(`/chores/${choreId}/edit`);
    };

    const handleCancelChore = async (choreId) => {
        try {
            await axios.delete(`${API_URL}/api/chores/${choreId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setChores(prevChores => prevChores.filter(chore => chore._id !== choreId));
        } catch (error) {
            console.error('Error canceling chore:', error);
        }
    };

    const handleViewChore = (choreId) => {
        navigate(`/chores/${choreId}`);
    };

    const allChores = chores.filter(chore => !chore.assignedTo);
    const myPostedChores = chores.filter(chore => chore.postedBy === user?._id);
    const myAssignedChores = chores.filter(chore => chore.assignedTo === user?._id);

    return (
        <div>
            <h1>Welcome, {user?.firstName || 'User'}!</h1>
            <Link to="/add-chore">Add a Chore</Link>
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
                            {[...allChores, ...myPostedChores].map((chore) => {
                                const uniqueKey = `${chore._id}-${choreIds[chore._id] || 'new'}`;
                                return (
                                    <tr key={uniqueKey}>
                                        <td>{chore.name}</td>
                                        <td>{chore.location}</td>
                                        <td>
                                            <button onClick={() => handleViewChore(chore._id)}>View</button>
                                            {chore.postedBy && chore.postedBy._id === user?._id && (
                                                <>
                                                    <button onClick={() => handleEditChore(chore._id)}>Edit</button>
                                                    <button onClick={() => handleCancelChore(chore._id)}>Cancel</button>
                                                </>
                                            )}
                                            {(!chore.postedBy || chore.postedBy._id !== user?._id) && !chore.assignedTo && (
                                                <button onClick={() => handleAddChore(chore._id)}>Add</button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
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
                            {myAssignedChores.map((chore) => (
                                <tr key={`${chore._id}-${choreIds[chore._id] || 'new'}-assigned`}>
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
        </div>
    );       
}

export default ChoreList;
