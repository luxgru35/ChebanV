import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated, getUser } from '../../utils/localStorage';
import styles from './MainPage.module.scss';


const MainPage: React.FC = () => {
    const isAuth = isAuthenticated();
    const user = getUser();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logo}>MyEvents</div>
                <div className={styles.nav}>
                    {!isAuth ? (
                        <>
                            <Link to="/login" className={styles.button}>Login</Link>
                            <Link to="/register" className={styles.button}>Register</Link>
                        </>
                    ) : (
                        <span className={styles.userInfo}>Welcome, {user?.name}</span>
                    )}
                    <Link to="/events" className={styles.button}>Events</Link>
                </div>
            </header>
            <main className={styles.main}>
                <h1>Welcome to MyEvents</h1>
                <p>Manage and discover events easily.</p>
            </main>
        </div>
    );
};

export default MainPage;
