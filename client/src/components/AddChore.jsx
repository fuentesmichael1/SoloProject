import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'name':
                setName(value);
                break;
            case 'description':
                setDescription(value);
                break;
            case 'location':
                setLocation(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await axios.post('http://localhost:8000/api/chores', { name, description, location, completed: false });
                navigate('/dashboard');
            } catch (err) {
                console.error(err);
            }
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
