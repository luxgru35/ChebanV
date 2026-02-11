import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px', padding: '40px' }}>
            <h1 style={{ fontSize: '4em', color: '#667eea', marginBottom: '20px' }}>404</h1>
            <p style={{ fontSize: '1.2em', color: '#718096', marginBottom: '30px' }}>Страница, которую вы ищете, не существует.</p>
            <Link to="/" style={{ 
                display: 'inline-block',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600'
            }}>Вернуться на главную</Link>
        </div>
    );
};

export default NotFoundPage;
