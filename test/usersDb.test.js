const db = require('../data/dbConfig');
const dbApi = require('../api/usersDb');

describe('Users Model', () => {
    beforeEach(async () => {
        await db('users').truncate();
    });

    describe('add()', () => {
        it('should insert user', async () => {
            const userId = await dbApi.add({
                name: 'bob'
            });
            const user = await db('users').where({
                id: userId[0]
            }).first();
            expect(user.name).toBe('bob');
        });
    });
});