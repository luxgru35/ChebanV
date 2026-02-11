import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser, clearError, logoutUser } from '../../store/slices/authSlice';
import { removeToken, removeUser } from '../../utils/localStorage';
import styles from './RegisterPage.module.scss';

import { selectAuth } from '../../store/selectors';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const { isLoading, error, token } = useAppSelector(selectAuth);
    const navigate = useNavigate();

    // Если пользователь уже авторизован, перенаправляем на страницу мероприятий
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
        const result = await dispatch(registerUser({ name, email, password }));
        // После успешной регистрации очищаем токен и перенаправляем на страницу авторизации
        if (registerUser.fulfilled.match(result)) {
            // Очищаем токен и пользователя из localStorage
            removeToken();
            removeUser();
            dispatch(logoutUser());
            navigate('/login');
        }
    };

    return (
        <div className={styles.container}>
            <h2>Регистрация</h2>
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>Имя</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                        minLength={6}
                    />
                </div>
                <button type="submit" className={styles.button} disabled={isLoading}>
                    {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
                </button>
            </form>
            <p>
                Уже есть аккаунт? <Link to="/login">Войдите здесь</Link>
            </p>
        </div>
    );
};

export default RegisterPage;
