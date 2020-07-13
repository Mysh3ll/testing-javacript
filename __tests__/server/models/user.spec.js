/**
 * @jest-environment node
 */
import User from '@models/User';
import Mongoose from 'mongoose';
import Bcrypt from 'bcryptjs';
import config from '@server/config'
import jwt from 'jsonwebtoken';

describe('The User model', () => {
    const user = {
        name: 'Test',
        email: 'test@test.com',
        password: 'test1234',
    };

    let createdUser;

    beforeAll(async () => {
        await Mongoose.connect(config.databaseUrl[config.environment], { useNewUrlParser: true, useUnifiedTopology: true });

        createdUser = await User.create(user);
    });

    it('should hash password before saving to the database', async () => {
        expect(Bcrypt.compareSync(user.password, createdUser.password)).toBe(true);
    });

    it('should set the email confirm code for the user before saving to the database', async () => {
        expect(createdUser.emailConfirmCode).toEqual(expect.any(String));
    });

    describe('The generatedToken method', () => {

        it('should generate a valid jwt for a user', () => {
            const token = createdUser.generateToken();

            const { id } = jwt.verify(token, config.jwtSecret);

            expect(id).toEqual(JSON.parse(JSON.stringify(createdUser._id)));
        });
    });

    afterAll(async () => {
        await Mongoose.connection.close();
    });
});
