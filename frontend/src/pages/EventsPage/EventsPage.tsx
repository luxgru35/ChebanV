import React, { useEffect, useState } from 'react';
import { getEvents } from '../../api/eventService';
import type { Event } from '../../types';
import { getUser, removeToken, removeUser } from '../../utils/localStorage';
import { useNavigate } from 'react-router-dom';
import styles from './EventsPage.module.scss';

const EventsPage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [includeDeleted, setIncludeDeleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const user = getUser();

    useEffect(() => {
        fetchEvents();
    }, [includeDeleted]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const data = await getEvents(includeDeleted);
            setEvents(data);
        } catch (err) {
            setError('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        removeToken();
        removeUser();
        navigate('/login');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.userInfo}>
                    Logged in as: <strong>{user?.name}</strong>
                </div>
                <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </header>

            <div className={styles.controls}>
                <h1>Events</h1>
                {/* Variant 20: Switch for Deleted Events */}
                <label className={styles.switch}>
                    <input
                        type="checkbox"
                        checked={includeDeleted}
                        onChange={(e) => setIncludeDeleted(e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                    Show Deleted Events
                </label>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.grid}>
                {events.map(event => (
                    <div key={event.id} className={`${styles.card} ${event.deletedAt ? styles.deleted : ''}`}>
                        <h3>{event.title}</h3>
                        <p>{event.description}</p>
                        <p className={styles.date}>Date: {new Date(event.date).toLocaleDateString()}</p>
                        <p className={styles.author}>By: {event.creator?.name}</p>

                        {/* Variant 20: Show deleted date */}
                        {event.deletedAt && (
                            <div className={styles.deletedInfo}>
                                Deleted at: {new Date(event.deletedAt).toLocaleString()}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventsPage;
