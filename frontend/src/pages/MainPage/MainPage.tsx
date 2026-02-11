import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import styles from './MainPage.module.scss';

import { selectAuth } from '../../store/selectors';

const MainPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user, token } = useAppSelector(selectAuth);
    const isAuth = !!token;

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logo}>MyEvents</div>
                <div className={styles.nav}>
                    {!isAuth ? (
                        <>
                            <Link to="/login" className={styles.button}>Войти</Link>
                            <Link to="/register" className={styles.button}>Регистрация</Link>
                        </>
                    ) : (
                        <>
                            <span className={styles.userInfo}>Добро пожаловать, {user?.name}</span>
                            <Link to="/profile" className={styles.link}>Профиль</Link>
                            <button onClick={handleLogout} className={styles.logoutButton}>Выйти</button>
                        </>
                    )}
                    <Link to="/events" className={styles.button}>Мероприятия</Link>
                </div>
            </header>
            <main className={styles.main}>
                <h1>Добро пожаловать в MyEvents</h1>
                <p>Управляйте и открывайте для себя мероприятия легко.</p>
            </main>
        </div>
    );
};

export default MainPage;
