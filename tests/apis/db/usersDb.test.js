const db = require('../../../data/dbConfig');
const usersApi = require('../../../apis/db/users');

describe('Users Model', () => {
    beforeEach(async () => {
        await db('users').del();
    });

    describe('insert()', () => {
        it('should insert user', async () => {
            const userId = await usersApi.insert({
                sub_id: 'auth0sub'
            });
            const user = await db('users').where({
                id: userId.id
            }).first();
            expect(user.sub_id).toBe('auth0sub');
        });
    });

    describe('insert()', () => {
        it('should throw an error when the sub id is already taken', async () => {
            await usersApi.insert({
                sub_id: 'auth0sub'
            });

            try{
                await usersApi.insert({
                    sub_id: 'auth0sub'
                });
            } catch(err) {
                expect(err).not.toBe(undefined);
            }
        });
    });

    describe('getOne()', () => {
        it('should get a user by their sub_id', async () => {
            const userId = await usersApi.insert({
                sub_id: 'auth0sub'
            });
            const user = await usersApi.getOne({sub_id: userId.sub_id});

            expect(user.sub_id).toBe('auth0sub');
        });
    });

    describe('getMany()', () => {
        it('should get all users', async () => {
            await usersApi.insert([{
                sub_id: 'auth0sub1'
            }, {
                sub_id: 'auth0sub2'
            }, {
                sub_id: 'auth0sub3'
            }]);
            const users = await usersApi.getMany()
            expect(users).toHaveLength(3);
        });
    });
});