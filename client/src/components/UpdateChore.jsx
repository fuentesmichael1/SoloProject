import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { set } from 'mongoose';

const API_URL = 'http://localhost:8000';

function UpdateChore() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [completed, setCompleted] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_URL}/api/chores/${id}`)
            .then(response => response.json())
            .then(data => {
                setName(data.name);
                setDescription(data.description);
                setLocation(data.location);
                setCompleted(data.completed);
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/api/chores/${id}`, { name, description, location, completed });
            navigate('/dashboard');
        } catch (error) {
            console.error('Error updating chore:', error);
        }
    };

    return (
        <div>
            <h2>Update Chore</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
                    <input
                        type="checkbox"
                        checked={completed}
                        onChange={(e) => setCompleted(e.target.checked)}
                    />
                    Completed
                </label>
                <button type="submit">Update Chore</button>
            </form>
        </div>
    );
}

export default UpdateChore;
