/**
 * @jest-environment node
 */
import User from '@models/User';
import { connect, disconnect } from "@tests/utils/mongoose";
import Response from '@tests/utils/response';
import authMiddleware from '@middleware/auth';

describe('The auth middleware', () => {
    const user = {
        name: 'Test',
        email: 'test@test.com',
        password: 'test1234',
    };

    let createdUser;

    beforeAll(async () => {
        await connect();

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
        await disconnect();
    });
});
