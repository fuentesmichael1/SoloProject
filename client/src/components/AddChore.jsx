import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddChore() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/api/chores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description, completed: false }),
        })
        .then(() => navigate('/chores'));
    };

    return (
        <div>
            <h2>Add New Chore</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Chore Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <button type="submit">Add Chore</button>
            </form>
        </div>
    );
}

export default AddChore;
