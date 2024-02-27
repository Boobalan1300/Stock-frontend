
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function SignUpForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [adminId, setAdminId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://stock-backend-zht5.onrender.com/api/adminSignup', { email, password, adminId });
            console.log('Response:', response.data);
            setSuccessMessage('User signed up successfully');
            setErrorMessage(''); 
            setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
                resetForm();
            }, 5000);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.error);
            } else {
                console.error('Error signing up:', error);
            }
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setAdminId('');
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <form className="my-5 bg-secondary p-5 rounded-3 vw-75" onSubmit={handleSubmit}>
                <p className="text-center text-white fs-3">Admin Sign Up</p>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label text-white">Email</label>
                    <input type="email" id="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label text-white">Password</label>
                    <input type="password" id="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="adminId" className="form-label text-white">Admin ID (4 digits)</label>
                    <input type="text" id="adminId" className="form-control" value={adminId} onChange={(e) => setAdminId(e.target.value)} required />
                </div>

                <button type="submit" className="btn btn-primary">Sign Up</button>

                {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
                {successMessage && <p className="text-success bg-light fs-4 mt-3">{successMessage}</p>}

                <p className='text-white mt-3'>Already have an account? <Link to="/login" className='text-dark'>Login</Link></p>
            </form>
        </div>
    );
}

export default SignUpForm;
