import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, clearError } from '../../store/slices/authSlice';
import styles from './LoginPage.module.scss';

import { selectAuth } from '../../store/selectors';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const { isLoading, error, token } = useAppSelector(selectAuth);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate('/events');
        }
    }, [token, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        }
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className={styles.container}>
            <h2>Вход</h2>
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Пароль</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className={styles.button} disabled={isLoading}>
                    {isLoading ? 'Загрузка...' : 'Войти'}
                </button>
            </form>
            <p>
                Нет аккаунта? <Link to="/register">Зарегистрируйтесь здесь</Link>
            </p>
        </div>
    );
};

export default LoginPage;
