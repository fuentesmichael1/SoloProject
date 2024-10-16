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

    const fetchUser = async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/users/${userId}`);
            console.log('User data received:', response.data);
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };    

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/api/chores/${id}`, 
                { name, description, location, completed },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            navigate('/dashboard');
        } catch (error) {
            console.error('Error updating chore:', error);
        }
    };
    
    if (!chore) return <div>Loading...</div>;

    return (
        <div>
            <h2>Update Chore</h2>
            <p>Posted by: {user ? `${user.firstName} ${user.lastName}` : 'Unknown'}</p>
            <p>Posted on: {new Date(chore.createdAt).toLocaleString()}</p>
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
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
                <label>
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
