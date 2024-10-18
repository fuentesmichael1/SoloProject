import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
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
        console.log('Login attempt with:', loginData);
        try {
            const response = await axios.post('http://localhost:8000/users/login', loginData);
            console.log('Login response:', response.data);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            setErrors({ login: error.response?.data?.message || 'Login failed' });
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
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration error:', error.response?.data);
            setErrors({ register: error.response?.data?.register || 'Registration failed' });
        }
    };    

    return (
        <div className="min-h-screen w-screen max-w-full bg-gray-100 p-8 text-black flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl flex justify-between">
                <div className="w-1/2 pr-4">
                    <h2 className="text-3xl font-semibold mb-6 pb-2 border-b border-gray-200">Login</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded text-white bg-gray-700"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded text-white bg-gray-700"
                        />
                        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Login</button>
                    </form>
                    {errors.login && <p className="text-red-500 mt-2">{errors.login}</p>}
                </div>
                <div className="w-1/2 pl-4">
                    <h2 className="text-3xl font-semibold mb-6 pb-2 border-b border-gray-200">Register</h2>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={registerData.firstName}
                            onChange={handleRegisterChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded text-white bg-gray-700"
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={registerData.lastName}
                            onChange={handleRegisterChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded text-white bg-gray-700"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={registerData.email}
                            onChange={handleRegisterChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded text-white bg-gray-700"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={registerData.password}
                            onChange={handleRegisterChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded text-white bg-gray-700"
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={registerData.confirmPassword}
                            onChange={handleRegisterChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded text-white bg-gray-700"
                        />
                        <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">Register</button>
                    </form>
                    {errors.register && <p className="text-red-500 mt-2">{errors.register}</p>}
                </div>
            </div>
        </div>
    );
}

export default Login;