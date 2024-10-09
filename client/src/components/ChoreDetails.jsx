import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_URL = 'http://localhost:8000';

function ChoreDetails() {
    const [chore, setChore] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetch(`${API_URL}/api/chores/${id}`)
            .then(response => response.json())
            .then(data => setChore(data));
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
            <Link to="/chores">Back to List</Link>
        </div>
    );
}

export default ChoreDetails;
