import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: 'testuser', password: 'user123', email: '' });
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const userData = await login(formData.username, formData.password);
        if (userData.role === 'ADMIN') {
          navigate('/admin');
        } else if (userData.role === 'DRIVER') {
          navigate('/driver');
        } else {
          navigate('/');
        }
      } else {
        await register(formData);
        alert('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      alert('Authentication failed');
    }
  };

  return (
    <div className="container animate-fade" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-morphism" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary)' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
              <input 
                type="email" 
                className="glass-morphism" 
                style={{ width: '100%', padding: '12px' }}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          )}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Username</label>
            <input 
              type="text" 
              className="glass-morphism" 
              style={{ width: '100%', padding: '12px' }}
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Password</label>
            <input 
              type="password" 
              className="glass-morphism" 
              style={{ width: '100%', padding: '12px' }}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '50px' }}>
            {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />} {isLogin ? 'LOGIN' : 'REGISTER'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-light)' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"} 
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: 'var(--primary)', cursor: 'pointer', marginLeft: '5px', fontWeight: '600' }}
          >
            {isLogin ? 'Register Now' : 'Login Now'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
