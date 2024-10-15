import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ChoreDetails() {
    const [chore, setChore] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChore = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/chores/${id}`);
                setChore(response.data);
                console.log('Fetched chore:', response.data);
            } catch (error) {
                console.error('Error fetching chore details:', error);
            }
        };
        fetchChore();
    }, [id]);

    if (!chore) return <div>Loading...</div>;

    return (
        <div>
            <h2>Chore Details</h2>
            <p><strong>Name:</strong> {chore.name || 'N/A'}</p>
            <p><strong>Description:</strong> {chore.description || 'N/A'}</p>
            <p><strong>Location:</strong> {chore.location || 'N/A'}</p>
            <p><strong>Status:</strong> {chore.completed ? 'Completed' : 'Pending'}</p>
            <Link to={`/chores/${id}/edit`}>Edit</Link>
            <Link to="/dashboard">Back to Dashboard</Link>
        </div>
    );
}

export default ChoreDetails;
