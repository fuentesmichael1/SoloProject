import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function ChoreDetails() {
    const [chore, setChore] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        // Fetch chore details from your API here
        // For now, we'll use dummy data
        setChore({ id: id, name: 'Sample Chore', description: 'This is a sample chore', completed: false });
    }, [id]);

    if (!chore) return <div>Loading...</div>;

    return (
        <div>
            <h2>Chore Details</h2>
            <p>Name: {chore.name}</p>
            <p>Description: {chore.description}</p>
            <p>Status: {chore.completed ? 'Completed' : 'Pending'}</p>
            <Link to={`/chores/${id}/edit`}>Edit</Link>
            <Link to="/chores">Back to List</Link>
        </div>
    );
}

export default ChoreDetails;
