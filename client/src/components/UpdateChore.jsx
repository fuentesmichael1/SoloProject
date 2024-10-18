import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

function UpdateChore() {
    const [chore, setChore] = useState(null);
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [completed, setCompleted] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChoreAndUser = async () => {
            try {
                const choreResponse = await axios.get(`${API_URL}/api/chores/${id}`);
                const choreData = choreResponse.data;
                console.log('Chore data received:', choreData);
                setChore(choreData);
                setName(choreData.name);
                setDescription(choreData.description);
                setLocation(choreData.location);
                setCompleted(choreData.completed);
                
                if (choreData.postedBy) {
                    setUser(choreData.postedBy);
                } else {
                    console.log('No postedBy data available');
                }
            } catch (error) {
                console.error('Error fetching chore:', error);
            }
        };
    
        fetchChoreAndUser();
    }, [id]);

    useEffect(() => {
        if (chore) {
            setName(chore.name);
            setDescription(chore.description);
            setLocation(chore.location);
            setCompleted(chore.completed);
        }
    }, [chore]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${API_URL}/api/chores/${id}`, 
                { name, description, location, completed },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            
            if (response.data) {
                console.log('Chore updated successfully:', response.data);
                setChore(response.data);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error updating chore:', error);
        }
    };

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
                <h2 className="text-3xl font-semibold mb-6 pb-2 border-b border-gray-200">Update Chore</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded text-white bg-gray-700"
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded text-white bg-gray-700"
                    />
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded text-white bg-gray-700"
                    />
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">Update Chore</button>
                </form>
                <div className="mt-4 flex space-x-4">
                    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300">Logout</button>
                    <button onClick={handleBack} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Back to Dashboard</button>
                </div>
            </div>
        </div>
    );
}

export default UpdateChore;