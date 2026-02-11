import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUserEvents, deleteEvent } from '../../store/slices/eventsSlice';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ProfilePage.module.scss';
import { logoutUser } from '../../store/slices/authSlice';

import { selectUser, selectEventsState } from '../../store/selectors';

const ProfilePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(selectUser);
    const { userEvents, status, error } = useAppSelector(selectEventsState);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchUserEvents());
    }, [dispatch]);

    const handleDelete = async (id: number) => {
        await dispatch(deleteEvent(id));
        dispatch(fetchUserEvents());
        setDeleteConfirmId(null);
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    if (!user) return <div>Пожалуйста, войдите в систему</div>;

    return (
        <div className={styles.container}>
            <div className={styles.profileHeader}>
                <h1>Профиль</h1>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    Выйти
                </button>
            </div>
            <div className={styles.userInfo}>
                <p><strong>Имя:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>

            <div className={styles.eventsSection}>
                <div className={styles.header}>
                    <h2>Мои мероприятия</h2>
                    <Link to="/events/create" className={styles.createButton}>Создать мероприятие</Link>
                </div>

                {status === 'loading' && <p>Загрузка мероприятий...</p>}
                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.grid}>
                    {userEvents.map(event => (
                        <div key={event.id} className={styles.card}>
                            <h3>{event.title}</h3>
                            <p>{new Date(event.date).toLocaleDateString('ru-RU')}</p>
                            {event.description && <p>{event.description}</p>}
                            <div className={styles.actions}>
                                <Link to={`/events/edit/${event.id}`} className={styles.editButton}>Редактировать</Link>
                                {deleteConfirmId === event.id ? (
                                    <div className={styles.deleteConfirm}>
                                        <span>Удалить?</span>
                                        <button onClick={() => handleDelete(event.id)} className={styles.confirmButton}>Да</button>
                                        <button onClick={() => setDeleteConfirmId(null)} className={styles.cancelButton}>Нет</button>
                                    </div>
                                ) : (
                                    <button onClick={() => setDeleteConfirmId(event.id)} className={styles.deleteButton}>Удалить</button>
                                )}
                            </div>
                        </div>
                    ))}
                    {userEvents.length === 0 && status === 'succeeded' && <p>Мероприятия еще не созданы.</p>}
                </div>
            </div>
            <Link to="/events">Вернуться ко всем мероприятиям</Link>
        </div>
    );
};

export default ProfilePage;
