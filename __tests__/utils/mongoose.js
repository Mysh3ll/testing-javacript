import Mongoose from 'mongoose';
import config from '@server/config';

export const connect = () => Mongoose.connect(config.databaseUrl[config.environment], { useNewUrlParser: true, useUnifiedTopology: true });

export const disconnect = () => Mongoose.connection.close();
