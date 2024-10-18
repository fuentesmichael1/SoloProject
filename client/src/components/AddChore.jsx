import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useChores } from './ChoreContext';

const API_URL = 'http://localhost:8000';

function AddChore() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setChores } = useChores();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const response = await axios.post(`${API_URL}/api/chores`, 
                { name, description, location },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('Chore added successfully:', response.data);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error adding chore:', error.response?.data || error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleBack = () => {
        navigate('/dashboard');
    };
    

    return (
        <div className="min-h-screen w-screen max-w-full bg-gray-100 p-8 text-black">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 pb-2 border-b border-gray-200">Add New Chore</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Chore Name"
                        required
                        className="w-full p-2 border border-gray-300 rounded text-white bg-gray-700"
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        required
                        className="w-full p-2 border border-gray-300 rounded text-white bg-gray-700"
                    />
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location"
                        required
                        className="w-full p-2 border border-gray-300 rounded text-white bg-gray-700"
                    />
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">Add Chore</button>
                </form>
                <div className="mt-4 flex space-x-4">
                    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300">Logout</button>
                    <button onClick={handleBack} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Back to Dashboard</button>
                </div>
            </div>
        </div>
    );
}

export default AddChore;