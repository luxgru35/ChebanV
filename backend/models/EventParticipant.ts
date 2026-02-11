import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../config/db';

interface EventParticipantAttributes {
    userId: number;
    eventId: number;
}

class EventParticipant extends Model<EventParticipantAttributes> implements EventParticipantAttributes {
    public userId!: number;
    public eventId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

EventParticipant.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        eventId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Events',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        tableName: 'EventParticipants',
    }
);

export default EventParticipant;
