/**
 * @jest-environment node
 */
import User from '@models/User';
import Mongoose from 'mongoose';
import config from '@server/config'
import jwt from 'jsonwebtoken';
import authMiddleware from '@middleware/auth';

class Response {
    status(status) {
        this.status = status;

        return this;
    }

    json(data) {
        return data;
    }
}

describe('The auth middleware', () => {
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

    it('should call the next function if authentication is successful', async () => {
        const access_token = createdUser.generateToken();

        const req = {
            body: {
                access_token
            }
        };

        const res = new Response();

        const next = jest.fn();

        await authMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should return a 401 if authentication fails', async () => {
        const req = {
            body: {}
        };

        const res = new Response();

        const statusSpy = jest.spyOn(res, 'status');
        const jsonSpy = jest.spyOn(res, 'json');

        const next =jest.fn();

        await authMiddleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(0);
        expect(statusSpy).toHaveBeenCalledWith(401);
        expect(jsonSpy).toHaveBeenCalledWith({
            message: 'Unauthenticated.'
        });
    });

    afterAll(async () => {
        await Mongoose.connection.close();
    });
});
