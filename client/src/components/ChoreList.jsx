import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:8000';

function ChoreList() {
    const [chores, setChores] = useState([]);

    useEffect(() => {
        fetchChores();
    }, []);

    const fetchChores = () => {
        fetch(`${API_URL}/api/chores`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setChores(data))
            .catch(error => console.log('Fetch error:', error));
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
