import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ChoreList() {
    const [chores, setChores] = useState([]);

    useEffect(() => {
        fetchChores();
    }, []);

    const fetchChores = () => {
        fetch('/api/chores')
            .then(response => response.json())
            .then(data => setChores(data));
    };

    return (
        <div>
            <h2>Chore List</h2>
            <Link to="/add-chore">Add New Chore</Link>
            <ul>
                {chores.map(chore => (
                    <li key={chore._id}>
                        {chore.name} - {chore.completed ? 'Completed' : 'Pending'}
                        <Link to={`/chores/${chore._id}/details`}>Details</Link>
                        <Link to={`/chores/${chore._id}/edit`}>Edit</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChoreList;
