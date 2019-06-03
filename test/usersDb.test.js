const db = require('../data/dbConfig');
const dbApi = require('../api/usersDb');

describe('Users Model', () => {
    beforeEach(async () => {
        await db('users').del();
    });

    describe('insert()', () => {
        it('should insert user', async () => {
            const userId = await dbApi.insert({
                sub_id: 'auth0sub'
            });
            const user = await db('users').where({
                id: userId.id
            }).first();
            expect(user.sub_id).toBe('auth0sub');
        });
    });
});