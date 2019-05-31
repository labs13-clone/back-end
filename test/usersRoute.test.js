const request = require('supertest');
const server = require('../server');

describe('users', () => {
    it('Set environment to testing', () => {
        expect(process.env.NODE_ENV).toBe('testing');
    });

    it('GET /', () => {
        return request(server).get('/').expect(200);
    });
});