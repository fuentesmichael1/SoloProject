import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ChoreList() {
    const [chores, setChores] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchChores();
    }, []);

    const fetchChores = async () => {
        try {
            const response = await axios.get('/api/chores');
            setChores(response.data);
        } catch (error) {
            console.error('Error fetching chores:', error);
        }
    };

    const handleViewChore = (id) => {
        navigate(`/chores/${id}`);
    };

    const handleEditChore = (id) => {
        navigate(`/chores/${id}/edit`);
    };

    return (
        <div>
            <h2>Chore List</h2>
            <Link to="/add-chore">Add New Chore</Link>
            {Array.isArray(chores) && chores.length > 0 ? (
                chores.map((chore) => (
                    <div key={chore._id}>
                        <h2>{chore.name}</h2>
                        <p>{chore.description}</p>
                        <button onClick={() => handleViewChore(chore._id)}>View</button>
                        <button onClick={() => handleEditChore(chore._id)}>Edit</button>
                    </div>
                ))
            ) : (
                <p>No chores available</p>
            )}
        </div>
    );
}

export default ChoreList;
