import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:8000';

function AddChore() {
    const [chore, setChore] = useState({ name: '', description: '', location: '' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setChore({ ...chore, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/chores`, chore);
            navigate('/chores', { state: { newChore: response.data } });
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Error adding chore:', error);
            }
        }
    };

    return (
        <div>
            <nav>
                <div>
                    <Link to="/chores">Home</Link>
                    <h2>Add New Chore</h2>
                </div>
            </nav>
            <div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            name="name"
                            value={chore.name}
                            onChange={handleInputChange}
                            placeholder="Chore Name"
                            required
                        />
                        {errors.name && <p>{errors.name.message}</p>}
                    </div>
                    <div>
                        <textarea
                            name="description"
                            value={chore.description}
                            onChange={handleInputChange}
                            placeholder="Description"
                            required
                        />
                        {errors.description && <p>{errors.description.message}</p>}
                    </div>
                    <div>
                        <input
                            name="location"
                            value={chore.location}
                            onChange={handleInputChange}
                            placeholder="Location"
                            required
                        />
                        {errors.location && <p>{errors.location.message}</p>}
                    </div>
                    <div>
                        <button type="submit">Add Chore</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddChore;
