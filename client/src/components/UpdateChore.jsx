import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateChore() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [completed, setCompleted] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/chores/${id}`)
            .then(response => response.json())
            .then(data => {
                setName(data.name);
                setDescription(data.description);
                setCompleted(data.completed);
            });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`/api/chores/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description, completed }),
        })
        .then(() => navigate('/chores'));
    };

    return (
        <div>
            <h2>Update Chore</h2>
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
