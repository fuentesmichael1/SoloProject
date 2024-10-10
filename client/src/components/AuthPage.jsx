import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AuthPage() {
    const [registerUser, setRegisterUser] = useState({ email: '', password: '', confirmPassword: '' });
    const [loginUser, setLoginUser] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleRegisterChange = (e) => {
        setRegisterUser({ ...registerUser, [e.target.name]: e.target.value });
    };

    const handleLoginChange = (e) => {
        setLoginUser({ ...loginUser, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/register', registerUser);
            console.log('Registration successful:', response.data);
            navigate('/login');
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Login attempt with:', loginUser); // Added logging
        try {
            const response = await axios.post('http://localhost:8000/api/login', loginUser);
            console.log('Login response:', response.data); // Added logging
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error.response?.data); // Enhanced error logging
            setErrors(error.response?.data || { login: 'An error occurred' });
        }
    };

    return (
        <div>
            <h1>Welcome To Chore Tracker</h1>
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <h2>Register</h2>
                    <form onSubmit={handleRegister}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={registerUser.email}
                            onChange={handleRegisterChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={registerUser.password}
                            onChange={handleRegisterChange}
                            required
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={registerUser.confirmPassword}
                            onChange={handleRegisterChange}
                            required
                        />
                        <button type="submit">Register</button>
                    </form>
                    {errors.register && <p style={{ color: 'red' }}>{errors.register}</p>}
                </div>
                <div style={{ flex: 1 }}>
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={loginUser.email}
                            onChange={handleLoginChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginUser.password}
                            onChange={handleLoginChange}
                            required
                        />
                        <button type="submit">Login</button>
                    </form>
                    {errors.login && <p style={{ color: 'red' }}>{errors.login}</p>}
                </div>
            </div>
        </div>
    );
}

export default AuthPage;