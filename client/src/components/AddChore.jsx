import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000';

function AddChore() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        let tempErrors = {};
        if (name.length < 2) tempErrors.name = "Name must be at least 2 characters long";
        if (name.length > 40) tempErrors.name = "Name cannot exceed 40 characters";
        if (description.length < 4) tempErrors.description = "Description must be at least 4 characters long";
        if (!location) tempErrors.location = "Location is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            fetch(`${API_URL}/api/chores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description, location, completed: false }),
            })
            .then(() => navigate('/chores'))
            .catch(err => console.log(err));
        }
    };

    return (
        <div>
            <h2>Add New Chore</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Chore Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <p style={{color: 'red'}}>{errors.name}</p>}
                </div>
                <div>
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors.description && <p style={{color: 'red'}}>{errors.description}</p>}
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    {errors.location && <p style={{color: 'red'}}>{errors.location}</p>}
                </div>
                <button type="submit">Add Chore</button>
            </form>
        </div>
    );
}

export default AddChore;
