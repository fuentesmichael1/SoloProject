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
                const response = await axios.get(`/api/chores/${id}`);
                setChore(response.data);
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
            <p><strong>Name:</strong> {chore.name}</p>
            <p><strong>Description:</strong> {chore.description}</p>
            <p><strong>Location:</strong> {chore.location}</p>
            <p><strong>Status:</strong> {chore.completed ? 'Completed' : 'Pending'}</p>
            <Link to={`/chores/${id}/edit`}>Edit</Link>
            <Link to="/dashboard">Back to Dashboard</Link>
        </div>
    );
}

export default ChoreDetails;
