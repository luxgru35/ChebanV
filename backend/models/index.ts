import User from './User';
import Event from './Event';
import EventParticipant from './EventParticipant';
import LoginHistory from './LoginHistory';

// One-to-Many: User -> Events (Creator)
User.hasMany(Event, { foreignKey: 'createdBy', as: 'events' });
Event.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Many-to-Many: User <-> Events (Participation)
User.belongsToMany(Event, { through: EventParticipant, as: 'participatedEvents', foreignKey: 'userId' });
Event.belongsToMany(User, { through: EventParticipant, as: 'participants', foreignKey: 'eventId' });

// One-to-Many: User -> LoginHistory
User.hasMany(LoginHistory, { foreignKey: 'userId', as: 'loginHistory' });
LoginHistory.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export {
    User,
    Event,
    EventParticipant,
    LoginHistory
};
