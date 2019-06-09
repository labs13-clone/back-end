const request = require('supertest');
const server = require('../../../config/server');

describe('users', () => {
    it('Set environment to testing', () => {
        expect(process.env.NODE_ENV).toBe('testing');
    });

    it('TEST_TOKEN Environment variable should exist', () => {
        expect(process.env.TEST_TOKEN).not.toBe(undefined);
    });

    it('TEST_TOKEN Environment variable should not be empty', () => {
        expect(process.env.TEST_TOKEN).not.toBe('');
    });

    it('TEST_TOKEN Environment variable should start with "Bearer "', () => {
        expect(process.env.TEST_TOKEN).toMatch(/^Bearer /);
    });

    it('GET /api/users', done => {
        return request(server)
            .get('/api/users')
            .set('authorization', process.env.TEST_TOKEN)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
});