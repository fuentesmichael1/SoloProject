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

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const allChores = chores.filter(chore => !chore.assignedTo);
    const myPostedChores = chores.filter(chore => chore.postedBy === user?._id);
    const myAssignedChores = chores.filter(chore => chore.assignedTo === user?._id);

    return (
        <div className="min-h-screen w-screen max-w-full bg-gray-100 p-8 text-black">
            <h1 className="text-4xl font-bold mb-8 text-center">Welcome, {user?.firstName || 'User'}!</h1>
            <div className="flex justify-center mb-8">
                <Link to="/add-chore" className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600 transition duration-300">Add a Chore</Link>
            </div>
            <div className="flex space-x-8">
                <div className="w-1/2 bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-3xl font-semibold mb-6 pb-2 border-b border-gray-200">Available Jobs</h2>
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left text-lg font-semibold">Job</th>
                                <th className="p-3 text-left text-lg font-semibold">Location</th>
                                <th className="p-3 text-left text-lg font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...allChores, ...myPostedChores].map((chore) => {
                                const uniqueKey = `${chore._id}-${choreIds[chore._id] || 'new'}`;
                                return (
                                    <tr key={uniqueKey} className="border-b">
                                        <td className="p-3">{chore.name}</td>
                                        <td className="p-3">{chore.location}</td>
                                        <td className="p-3">
                                            <button onClick={() => handleViewChore(chore._id)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">View</button>
                                            <button onClick={() => handleAddChore(chore._id)} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Add</button>
                                            {chore.postedBy && chore.postedBy._id === user?._id && (
                                                <>
                                                    <button onClick={() => handleEditChore(chore._id)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                                                    <button onClick={() => handleCancelChore(chore._id)} className="bg-red-500 text-white px-2 py-1 rounded">Cancel</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="w-1/2 bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-3xl font-semibold mb-6 pb-2 border-b border-gray-200">My Jobs</h2>
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left text-lg font-semibold">Job</th>
                                <th className="p-3 text-left text-lg font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myAssignedChores.map((chore) => (
                                <tr key={`${chore._id}-${choreIds[chore._id] || 'new'}-assigned`} className="border-b">
                                    <td className="p-3">{chore.name}</td>
                                    <td className="p-3">
                                        <button onClick={() => handleViewChore(chore._id)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">View</button>
                                        <button onClick={() => handleCompleteChore(chore._id)} className="bg-purple-500 text-white px-2 py-1 rounded">Done</button>
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
