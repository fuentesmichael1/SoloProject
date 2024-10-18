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
        <div>
            <h2>Add New Chore</h2>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleBack}>Back to Dashboard</button>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Chore Name"
                    required
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    required
                />
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                    required
                />
                <button type="submit">Add Chore</button>
            </form>
        </div>
    );
}

export default AddChore;
