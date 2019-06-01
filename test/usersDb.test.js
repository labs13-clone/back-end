const db = require('../data/dbConfig');
const dbApi = require('../api/usersDb');

describe('Users Model', () => {
    beforeEach(async () => {
        await db('users').del();
    });

    describe('add()', () => {
        it('should insert user', async () => {
            const userId = await dbApi.add({
                sub_id: 'auth0sub',
                role: 'user'
            });
            const user = await db('users').where({
                id: userId[0]
            }).first();
            expect(user.sub_id).toBe('auth0sub');
        });
    });
});