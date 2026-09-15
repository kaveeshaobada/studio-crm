import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
    const [form, setForm] = useState({ name: '', email: '', password: '', organizationName: '' });
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup(form.name, form.email, form.password, form.organizationName);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        }
    };

    return (
        <div>
            <h1>Create your studio account</h1>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
                <input name="organizationName" placeholder="Studio name" value={form.organizationName} onChange={handleChange} required />
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Sign up</button>
            </form>
            <Link to="/login">Already have an account? Log in</Link>
        </div>
    );
}