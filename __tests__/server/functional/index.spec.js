/**
 * @jest-environment node
 */
import server from '@server/app'
import User from '@models/User'
import supertest from 'supertest'

const app = () => supertest(server)

describe('The server', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    })

    it('should run correctly', async () => {
        const user = {
            password: 'password',
            name: 'test user',
            email: 'test@user.com'
        }
        const response = await app()
            .post('/api/v1/auth/register')
            .send(user)

        expect(response.body.data.token).toBeDefined()
        expect(response.body.data.user.email).toEqual(user.email)
    })
})
