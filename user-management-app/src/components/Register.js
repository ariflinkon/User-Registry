import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', { name, email, password });
      navigate('/login');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
<div className="container mt-5" style={{ maxWidth: '400px' }}>
  <h2 className="text-center mb-4">Register</h2>
  <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
    <div className="mb-3">
      <label htmlFor="name" className="form-label">Name</label>
      <input 
        type="text" 
        className="form-control" 
        id="name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
      />
    </div>
    <div className="mb-3">
      <label htmlFor="email" className="form-label">Email</label>
      <input 
        type="email" 
        className="form-control" 
        id="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
    </div>
    <div className="mb-3">
      <label htmlFor="password" className="form-label">Password</label>
      <input 
        type="password" 
        className="form-control" 
        id="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
    </div>
    <button type="submit" className="btn btn-primary w-100">Register</button>
  </form>
</div>
  );
}

export default Register;
