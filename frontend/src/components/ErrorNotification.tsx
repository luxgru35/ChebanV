import React from 'react';
import styles from './ErrorNotification.module.scss';

interface ErrorNotificationProps {
    message: string;
    code?: number;
    onClose?: () => void;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message, code, onClose }) => {
    return (
        <div className={styles.errorNotification}>
            <div className={styles.content}>
                {code && <span className={styles.code}>Ошибка {code}:</span>}
                <span className={styles.message}>{message}</span>
                {onClose && (
                    <button className={styles.closeButton} onClick={onClose}>
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorNotification;
