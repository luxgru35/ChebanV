import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createEvent, updateEvent } from '../../store/slices/eventsSlice';
import styles from './EventFormPage.module.scss';

interface FormInputs {
    title: string;
    description: string;
    date: string;
}

import { selectUserEvents } from '../../store/selectors';

const EventFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormInputs>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const userEvents = useAppSelector(selectUserEvents);

    useEffect(() => {
        if (isEditMode) {
            const event = userEvents.find(e => e.id === Number(id));
            if (event) {
                setValue('title', event.title);
                setValue('description', event.description || '');
                // Format date for input type="datetime-local" (YYYY-MM-DDTHH:mm)
                const dateStr = new Date(event.date).toISOString().slice(0, 16);
                setValue('date', dateStr);
            }
        }
    }, [isEditMode, id, userEvents, setValue]);

    const onSubmit = async (data: FormInputs) => {
        try {
            if (isEditMode) {
                await dispatch(updateEvent({ id: Number(id), data })).unwrap();
            } else {
                await dispatch(createEvent(data)).unwrap();
            }
            navigate('/profile');
        } catch (err) {
            console.error('Failed to save event', err);
            // Handle error logic
        }
    };

    return (
        <div className={styles.container}>
            <h1>{isEditMode ? 'Редактировать мероприятие' : 'Создать мероприятие'}</h1>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>Название</label>
                    <input
                        {...register('title', { required: 'Название обязательно', minLength: { value: 3, message: 'Минимальная длина 3 символа' } })}
                    />
                    {errors.title && <span className={styles.error}>{errors.title.message}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label>Описание</label>
                    <textarea
                        {...register('description')}
                        rows={5}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Дата и время</label>
                    <input
                        type="datetime-local"
                        min={new Date().toISOString().slice(0, 16)}
                        {...register('date', { 
                            required: 'Дата обязательна',
                            validate: (value) => {
                                const selectedDate = new Date(value);
                                const now = new Date();
                                if (selectedDate < now) {
                                    return 'Дата не может быть раньше текущей';
                                }
                                return true;
                            }
                        })}
                    />
                    {errors.date && <span className={styles.error}>{errors.date.message}</span>}
                </div>

                <button type="submit" className={styles.submitButton}>
                    {isEditMode ? 'Обновить мероприятие' : 'Создать мероприятие'}
                </button>
            </form>
        </div>
    );
};

export default EventFormPage;
