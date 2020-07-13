/**
 * @jest-environment node
 */
import User from '@models/User';
import Mongoose from 'mongoose';
import Bcrypt from 'bcryptjs';
import config from '@server/config'

describe('The User model', () => {

    beforeAll(async () => {
        await Mongoose.connect(config.databaseUrl[config.environment], { useNewUrlParser: true, useUnifiedTopology: true });
    });

    it('should hash password before saving to the database', async () => {
        const user = {
            name: 'Test',
            email: 'test@test.com',
            password: 'test1234',
        };

        const createdUser = await User.create(user);

        expect(Bcrypt.compareSync(user.password, createdUser.password)).toBe(true);
    });

    it('should set the email confirm code for the user before saving to the database', async () => {
        const user = {
            name: 'Test',
            email: 'test@test.com',
            password: 'test1234',
        };

        const createdUser = await User.create(user);

        expect(createdUser.emailConfirmCode).toEqual(expect.any(String));
    });

    afterAll(async () => {
        await Mongoose.connection.close();
    });
});
