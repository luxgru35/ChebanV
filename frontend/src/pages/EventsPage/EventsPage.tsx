import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchEvents, toggleParticipation } from '../../store/slices/eventsSlice';
import { logoutUser } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './EventsPage.module.scss';
import classNames from 'classnames';

import { selectEventsState, selectUser, selectAuth } from '../../store/selectors';

const EventsPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { list: events, status, error } = useAppSelector(selectEventsState);
    const user = useAppSelector(selectUser);
    const { user: authUser } = useAppSelector(selectAuth);
    const [includeDeleted, setIncludeDeleted] = useState(false);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalParticipants, setModalParticipants] = useState<{ id: number, name: string }[]>([]);

    useEffect(() => {
        dispatch(fetchEvents(includeDeleted));
    }, [dispatch, includeDeleted]);

    const handleToggleDeleted = () => {
        setIncludeDeleted(!includeDeleted);
    };

    const handleParticipate = (eventId: number) => {
        if (user) {
            dispatch(toggleParticipation({ eventId, userId: user.id, user: { id: user.id, name: user.name, email: user.email } }));
        }
    };

    const openParticipantsModal = (participants: { id: number, name: string }[] | undefined) => {
        if (participants && participants.length > 0) {
            setModalParticipants(participants);
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setModalParticipants([]);
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    return (
        <div className={styles.container}>
            <div className={styles.topBar}>
                <div className={styles.nav}>
                    <Link to="/" className={styles.navLink}>Главная</Link>
                    {authUser && (
                        <>
                            <span className={styles.userInfo}>Добро пожаловать, {authUser.name}</span>
                            <Link to="/profile" className={styles.navLink}>Профиль</Link>
                            <button onClick={handleLogout} className={styles.logoutButton}>Выйти</button>
                        </>
                    )}
                </div>
            </div>
            <div className={styles.header}>
                <h1>Мероприятия</h1>
                <div className={styles.controls}>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={includeDeleted}
                            onChange={handleToggleDeleted}
                        />
                        <span className={styles.slider}></span>
                    </label>
                    <span className={styles.switchLabel}>Показать удаленные</span>
                </div>
            </div>

            {status === 'loading' && <p>Загрузка мероприятий...</p>}
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.grid}>
                {events.map((event) => {
                    const isOwner = user?.id === event.createdBy;
                    const isParticipating = event.participants?.some(p => p.id === user?.id);
                    const participantsCount = event.participants?.length || 0;

                    return (
                        <div key={event.id} className={classNames(styles.card, { [styles.deleted]: event.deletedAt })}>
                            <h2>{event.title}</h2>
                            <p className={styles.date}>{new Date(event.date).toLocaleDateString('ru-RU')}</p>
                            {event.description && <p>{event.description}</p>}
                            {event.deletedAt && (
                                <p className={styles.deletedDate}>
                                    Удалено: {new Date(event.deletedAt).toLocaleDateString('ru-RU')}
                                </p>
                            )}

                            <div className={styles.footer}>
                                <div className={styles.participants} onClick={() => {
                                    const participantsList = event.participants?.map(p => ({ id: p.id, name: p.name })) || [];
                                    openParticipantsModal(participantsList);
                                }}>
                                    Участников: <strong>{participantsCount}</strong>
                                </div>

                                {!isOwner && user && !event.deletedAt && (
                                    <button
                                        className={classNames(styles.participateButton, { [styles.participating]: isParticipating })}
                                        onClick={() => handleParticipate(event.id)}
                                    >
                                        {isParticipating ? 'Отменить участие' : 'Участвовать'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeModal}>&times;</button>
                        <h3>Участники</h3>
                        <ul>
                            {modalParticipants.map(p => (
                                <li key={p.id}>{p.name}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsPage;
