/**
 * @jest-environment node
 */
import User from '@models/User';
import Mongoose from 'mongoose';
import Bcrypt from 'bcryptjs';
import config from '@server/config'

describe('The User model', () => {

    it('should hash password before saving to the database', async () => {
        await Mongoose.connect(config.databaseUrl[config.environment], { useNewUrlParser: true, useUnifiedTopology: true });

        const user = {
            name: 'Test',
            email: 'test@test.com',
            password: 'test1234',
        };

        const createdUser = await User.create(user);

        expect(Bcrypt.compareSync(user.password, createdUser.password)).toBe(true);

        await Mongoose.connection.close();
    });
});
