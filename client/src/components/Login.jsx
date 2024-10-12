import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log('Login attempt with:', loginData); // Add this line to log the data
            const response = await axios.post('http://localhost:8000/users/login', loginData);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error.response?.data); // Log the error response
            setErrors({ login: error.response?.data?.login || 'Login failed' });
        }
    };
    
    const handleRegister = async (e) => {
        e.preventDefault();
        if (registerData.password !== registerData.confirmPassword) {
            setErrors({ register: "Passwords don't match" });
            return;
        }
        try {
            const response = await axios.post('http://localhost:8000/users/register', registerData);
            console.log('Registration successful:', response.data);
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error.response?.data);
            setErrors({ register: error.response?.data?.register || 'Registration failed' });
        }
    };    

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                {errors.login && <p style={{ color: 'red' }}>{errors.login}</p>}
            </div>
            <div>
                <h2>Register</h2>
                <form onSubmit={handleRegister}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        required
                    />
                    <button type="submit">Register</button>
                </form>
                {errors.register && <p style={{ color: 'red' }}>{errors.register}</p>}
            </div>
        </div>
    );
}

export default Login;
