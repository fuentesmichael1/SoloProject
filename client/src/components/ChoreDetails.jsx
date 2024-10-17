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

    if (!chore) return <div>Loading...</div>;

    return (
        <div>
            <h2>Chore Details</h2>
            <p><strong>Name:</strong> {chore.name}</p>
            <p><strong>Description:</strong> {chore.description}</p>
            <p><strong>Location:</strong> {chore.location}</p>
            <p><strong>Status:</strong> {chore.completed ? 'Completed' : 'Pending'}</p>
            <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
    );
}

export default ChoreDetails;
