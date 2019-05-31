const db = require('../data/dbConfig');
const dbApi = require('../api/usersDb');

describe('Users Model', () => {
    beforeEach(async () => {
        await db('users').del();
    });

    describe('add()', () => {
        it('should insert user', async () => {
            const userId = await dbApi.add({
                sub: 'auth0sub'
            });
            const user = await db('users').where({
                id: userId[0]
            }).first();
            expect(user.sub).toBe('auth0sub');
        });
    });
});