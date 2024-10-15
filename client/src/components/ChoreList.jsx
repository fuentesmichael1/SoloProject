import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ChoreList() {
    const [chores, setChores] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const userData = await fetchUser();
            console.log('User data:', userData);
            setUser(userData);
        };
        fetchData();
        fetchChores();
    }, []);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token);
            const response = await axios.get('http://localhost:8000/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Full user response:', response);
            console.log('User data:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    };    

    const fetchChores = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/chores');
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
            {user && (user.firstName || user.email) && (
                <h1>Welcome, {user.firstName || user.email.split('@')[0]}!</h1>
            )}
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
