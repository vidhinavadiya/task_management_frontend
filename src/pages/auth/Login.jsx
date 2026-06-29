import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import authService from '../../services/authService';

export default function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = async (formData) => {
        try {
            setError('');
            const result = await authService.login(formData);
            
            if (result.success || result.token) {
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError(err.message || "Invalid email or password");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-20 left-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl"></div>

            <div className="w-full max-w-lg relative z-10">
                <div className="text-center mb-10">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-violet-500/50">
                        <span className="text-4xl font-bold text-white tracking-tighter">AH</span>
                    </div>
                    {/* <h1 className="text-5xl font-bold text-white tracking-tighter">AdminHub</h1>
                    <p className="text-zinc-400 mt-3 text-lg">Enterprise Admin Portal</p> */}
                </div>

                <LoginForm onSubmit={handleLogin} error={error} />
            </div>
        </div>
    );
}