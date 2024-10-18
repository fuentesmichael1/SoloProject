import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useChores } from './ChoreContext.jsx';

const API_URL = 'http://localhost:8000';

function ChoreDetails() {
    const [chore, setChore] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const { chores, updateChore } = useChores();

    useEffect(() => {
        const fetchChoreData = async () => {
            if (!chore) {
                try {
                    const response = await axios.get(`${API_URL}/api/chores/${id}`);
                    setChore(response.data);
                    updateChore(response.data);
                } catch (error) {
                    console.error('Error fetching chore:', error);
                }
            }
        };
        fetchChoreData();
    }, [id, chore, updateChore]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    if (!chore) return <div className="min-h-screen w-screen max-w-full bg-gray-100 p-8 text-black flex justify-center items-center">Loading...</div>;

    return (
        <div className="min-h-screen w-screen max-w-full bg-gray-100 p-8 text-black">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 pb-2 border-b border-gray-200">Chore Details</h2>
                <div className="mb-4 space-y-2">
                    <p><strong className="font-semibold">Name:</strong> {chore.name}</p>
                    <p><strong className="font-semibold">Description:</strong> {chore.description}</p>
                    <p><strong className="font-semibold">Location:</strong> {chore.location}</p>
                    <p><strong className="font-semibold">Status:</strong> {chore.completed ? 'Completed' : 'Pending'}</p>
                    <p><strong className="font-semibold">Created by:</strong> {chore.postedBy ? `${chore.postedBy.firstName} ${chore.postedBy.lastName}` : 'Unknown'}</p>
                    <p><strong className="font-semibold">Posted on:</strong> {new Date(chore.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex space-x-4">
                    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300">Logout</button>
                    <button onClick={handleBack} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Back to Dashboard</button>
                </div>
            </div>
        </div>
    );
}

export default ChoreDetails;
