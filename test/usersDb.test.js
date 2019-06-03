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

    describe('getBySubId()', () => {
        it('should get a user by their sub_id', async () => {
            const userId = await dbApi.insert({
                sub_id: 'auth0sub'
            });
            const user = await dbApi.getBySubId(userId.sub_id);

            expect(user.sub_id).toBe('auth0sub');
        });
    });

    describe('getAll()', () => {
        it('should get all users', async () => {
            await dbApi.insert([{
                sub_id: 'auth0sub1'
            }, {
                sub_id: 'auth0sub2'
            }, {
                sub_id: 'auth0sub3'
            }]);
            const users = await dbApi.getAll()
            expect(users).toHaveLength(3);
        });
    });
});