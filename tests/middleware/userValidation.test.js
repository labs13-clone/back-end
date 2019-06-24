const request = require('supertest');
const express = require('express');
const db = require('../../data/dbConfig');
const validateUserInput = require('../../middleware/validateUserInput');
const auth = require('../../middleware/auth');
const auth0Api = require('../../apis/external/auth0');

describe('userValidation Middleware Tests - Query Params', () => {

    beforeAll(() => {
        return auth0Api.getPubKey();
    });

    it('Required Query Param Included With Requests- Returns 200', done => {

        const testApp = express();
        testApp.use(auth);

        testApp.get('/', validateUserInput([{
            name: 'id',
            required: true,
            type: 'query',
            dataType: 'string'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .get('/')
            .query({
                id: 'test'
            })
            .set('authorization', process.env.TEST_TOKEN)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Required Query Param Not Included With The Request- Returns 422', done => {

        const testApp = express();
        testApp.use(auth);

        testApp.get('/', validateUserInput([{
            name: 'id',
            required: true,
            type: 'query',
            dataType: 'string'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .get('/')
            .set('authorization', process.env.TEST_TOKEN)
            .expect(422)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Optional Query Param Not Included With The Request- Returns 200', done => {

        const testApp = express();
        testApp.use(auth);

        testApp.get('/', validateUserInput([{
            name: 'id',
            required: false,
            type: 'query',
            dataType: 'string'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .get('/')
            .set('authorization', process.env.TEST_TOKEN)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Optional Query Param Included With The Request- Returns 200', done => {

        const testApp = express();
        testApp.use(auth);

        testApp.get('/', validateUserInput([{
            name: 'id',
            required: false,
            type: 'query',
            dataType: 'string'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .get('/')
            .query({
                id: 'test'
            })
            .set('authorization', process.env.TEST_TOKEN)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Optional Query Param Included With The Request Should Be Unique And Is NOT Unique- Returns 422', done => {

        const testApp = express();
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'sub_id',
            required: false,
            type: 'query',
            dataType: 'string',
            dbUnique: true,
            dbTable: 'users'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        db('users').insert({
                sub_id: 'test'
            })
            .then(_ => {
                request(testApp)
                    .post('/')
                    .query({
                        sub_id: 'test'
                    })
                    .set('authorization', process.env.TEST_TOKEN)
                    .set('Content-Type', 'application/json')
                    .expect(422)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });
    });

    it('Required Query Param Included With The Request Should Be Unique And Is NOT Unique- Returns 422', done => {

        const testApp = express();
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'sub_id',
            required: true,
            type: 'query',
            dataType: 'string',
            dbUnique: true,
            dbTable: 'users'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        db('users').insert({
                sub_id: 'not_dbUnique'
            })
            .then(_ => {
                request(testApp)
                    .post('/')
                    .query({
                        sub_id: 'not_dbUnique'
                    })
                    .set('authorization', process.env.TEST_TOKEN)
                    .set('Content-Type', 'application/json')
                    .expect(422)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });
    });

    it('Required Query Param Included With The Request Should Be Unique And IS Unique- Returns 200', done => {

        const testApp = express();
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'sub_id',
            required: true,
            type: 'query',
            dataType: 'string',
            dbUnique: true,
            dbTable: 'users'
        }]), (req, res) => {

            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .query({
                sub_id: 'jhfgjhfjhfg'
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Optional Query Param Included With The Request Should Be Unique And IS Unique- Returns 200', done => {

        const testApp = express();
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'sub_id',
            required: false,
            type: 'query',
            dataType: 'string',
            dbUnique: true,
            dbTable: 'users'
        }]), (req, res) => {

            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .query({
                sub_id: 'hjfjgfjhf'
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Query Param Range Is Within Limits- Returns 200', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'range',
            required: false,
            type: 'query',
            dataType: 'range',
            range: [48,51]
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .query({
                range: '49-50'
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Query Param Range Is Outside Limits- Returns 422', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'range',
            required: false,
            type: 'query',
            dataType: 'range',
            range: [48,51]
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .query({
                range: '1-100'
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(422)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
});

describe('userValidation Middleware Tests - Body', () => {

    beforeAll(async () => {
        await db('user_submissions').del();
        await db('challenges_categories').del();
        await db('challenges').del();
        await db('categories').del();
        await db('users').del();
        return auth0Api.getPubKey();
    });

    it('Required Body Property Included In The Request- Returns 200', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'string',
            required: true,
            type: 'body',
            dataType: 'string'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .send({
                string: 'test'
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });


    it('Required Body Property NOT Included In The Request- Returns 422', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'id',
            required: true,
            type: 'body',
            dataType: 'string'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .send({})
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(422)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Required Body Properties Are Of Proper Data Types- Returns 200', done => {

        const testApp = express();
        testApp.use(express.json());
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'string',
            required: true,
            type: 'body',
            dataType: 'string'
        }, {
            name: 'number',
            required: true,
            type: 'body',
            dataType: 'number'
        }, {
            name: 'boolean',
            required: true,
            type: 'body',
            dataType: 'boolean'
        }, {
            name: 'id',
            required: true,
            type: 'body',
            dataType: 'id',
            dbTable: 'users'
        }, {
            name: 'range',
            required: true,
            type: 'body',
            dataType: 'range'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        db('users')
            .insert({
                sub_id: 'gjkghkgh'
            })
            .returning('id')
            .then(users => {

                request(testApp)
                    .post('/')
                    .send({
                        string: 'haha',
                        number: 1,
                        boolean: true,
                        id: users[0],
                        range: '1-100'
                    })
                    .set('authorization', process.env.TEST_TOKEN)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

    });

    it('Optional Body Properties Are Of Proper Data Types- Returns 200', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'string',
            required: false,
            type: 'body',
            dataType: 'string'
        }, {
            name: 'number',
            required: false,
            type: 'body',
            dataType: 'number'
        }, {
            name: 'boolean',
            required: false,
            type: 'body',
            dataType: 'boolean'
        }, {
            name: 'id',
            required: false,
            type: 'body',
            dataType: 'id',
            dbTable: 'users'
        }, {
            name: 'range',
            required: false,
            type: 'body',
            dataType: 'range'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        db('users')
            .insert({
                sub_id: 'kghjkghl'
            })
            .returning('id')
            .then(users => {
                request(testApp)
                    .post('/')
                    .send({
                        string: 'haha',
                        number: 1,
                        boolean: true,
                        id: users[0],
                        range: '1-100'
                    })
                    .set('authorization', process.env.TEST_TOKEN)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });
    });

    it('Optional Body Properties Can Be Included- Returns 200', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'string',
            required: false,
            type: 'body',
            dataType: 'string'
        }, {
            name: 'number',
            required: false,
            type: 'body',
            dataType: 'number'
        }, {
            name: 'boolean',
            required: false,
            type: 'body',
            dataType: 'boolean'
        }, {
            name: 'id',
            required: false,
            type: 'body',
            dataType: 'id',
            dbTable: 'users'
        }, {
            name: 'range',
            required: false,
            type: 'body',
            dataType: 'range'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        db('users')
            .insert({
                sub_id: 'lkjhkljgg'
            })
            .returning('id')
            .then(users => {
                request(testApp)
                    .post('/')
                    .send({
                        string: 'haha',
                        number: 1,
                        boolean: true,
                        id: users[0],
                        range: '1-100'
                    })
                    .set('authorization', process.env.TEST_TOKEN)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });
    });

    it('Optional Body Properties Can Be Excluded- Returns 200', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'string',
            required: false,
            type: 'body',
            dataType: 'string'
        }, {
            name: 'number',
            required: false,
            type: 'body',
            dataType: 'number'
        }, {
            name: 'boolean',
            required: false,
            type: 'body',
            dataType: 'boolean'
        }, {
            name: 'id',
            required: false,
            type: 'body',
            dataType: 'id',
            dbTable: 'users'
        }, {
            name: 'range',
            required: false,
            type: 'body',
            dataType: 'range'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .send({})
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Optional And Required Body Properties Can Be Used (with required property and NO optional)- Returns 200', done => {

        const testApp = express();
        testApp.use(express.json());
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'string',
            required: false,
            type: 'body',
            dataType: 'string'
        }, {
            name: 'number',
            required: false,
            type: 'body',
            dataType: 'number'
        }, {
            name: 'boolean',
            required: false,
            type: 'body',
            dataType: 'boolean'
        }, {
            name: 'id',
            required: true,
            type: 'body',
            dataType: 'id',
            dbTable: 'users'
        }, {
            name: 'range',
            required: false,
            type: 'body',
            dataType: 'range'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        db('users')
            .insert({
                sub_id: 'kjhkjhklhg'
            })
            .returning('id')
            .then(users => {
                request(testApp)
                    .post('/')
                    .send({
                        id: users[0]
                    })
                    .set('authorization', process.env.TEST_TOKEN)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });
    });

    it('Optional And Required Body Properties Can Be Used (with required AND optional properties)- Returns 200', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'string',
            required: false,
            type: 'body',
            dataType: 'string'
        }, {
            name: 'number',
            required: false,
            type: 'body',
            dataType: 'number'
        }, {
            name: 'boolean',
            required: false,
            type: 'body',
            dataType: 'boolean'
        }, {
            name: 'id',
            required: true,
            type: 'body',
            dataType: 'id',
            dbTable: 'users'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        db('users')
            .insert({
                sub_id: 'hhjlkhlkhlkh'
            })
            .returning('id')
            .then(users => {
                request(testApp)
                    .post('/')
                    .send({
                        id: users[0],
                        boolean: false
                    })
                    .set('authorization', process.env.TEST_TOKEN)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });
    });

    it('Optional And Required Body Properties Can Be Used (without required property)- Returns 422', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'string',
            required: false,
            type: 'body',
            dataType: 'string'
        }, {
            name: 'number',
            required: false,
            type: 'body',
            dataType: 'number'
        }, {
            name: 'boolean',
            required: false,
            type: 'body',
            dataType: 'boolean'
        }, {
            name: 'id',
            required: false,
            type: 'body',
            dataType: 'id',
            dbTable: 'users'
        }, {
            name: 'json',
            required: true,
            type: 'body',
            dataType: 'json'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .send({})
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(422)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Body Property Supposed To Be A String But Sent A Number- Returns 422', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'string',
            required: false,
            type: 'body',
            dataType: 'string'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .send({
                string: 1
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(422)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Body Property Supposed To Be A String But Sent A Boolean- Returns 422', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'string',
            required: false,
            type: 'body',
            dataType: 'string'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .send({
                string: false
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(422)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Body Property Supposed To Be A Boolean But Sent A Non-Boolean Number- Returns 422', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'boolean',
            required: false,
            type: 'body',
            dataType: 'boolean'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .send({
                boolean: 94
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(422)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Body Property Supposed To Be A Boolean But Sent A Boolean In Number Format (1)- Returns 200', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'boolean',
            required: false,
            type: 'body',
            dataType: 'boolean'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .send({
                boolean: 1
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Body Property Supposed To Be A Boolean But Sent A Boolean In Number Format (0)- Returns 200', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'boolean',
            required: false,
            type: 'body',
            dataType: 'boolean'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .send({
                boolean: 0
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Body Property Supposed To Be A Boolean But Sent A Non-Boolean String- Returns 422', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'boolean',
            required: false,
            type: 'body',
            dataType: 'boolean'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .send({
                boolean: 'string'
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(422)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Body Property Supposed To Be A Boolean But Sent A Boolean In String Format (true - lowercase)- Returns 200', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'boolean',
            required: false,
            type: 'body',
            dataType: 'boolean'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .send({
                boolean: 'true'
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Body Property Supposed To Be A Boolean But Sent A Boolean In String Format (false - lowercase)- Returns 200', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'boolean',
            required: false,
            type: 'body',
            dataType: 'boolean'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .send({
                boolean: 'false'
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Body Property Supposed To Be A Boolean But Sent A Boolean In String Format (true - uppercase)- Returns 200', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'boolean',
            required: false,
            type: 'body',
            dataType: 'boolean'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .send({
                boolean: 'TRUE'
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Body Property Supposed To Be A Boolean But Sent A Boolean In String Format (false - uppercase)- Returns 200', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'boolean',
            required: false,
            type: 'body',
            dataType: 'boolean'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .send({
                boolean: 'FALSE'
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Body Property Supposed To Be A Number But Sent A String- Returns 422', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'number',
            required: false,
            type: 'body',
            dataType: 'number'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .send({
                number: 'string'
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(422)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Body Property Supposed To Be A Number But Sent A Boolean- Returns 422', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'number',
            required: false,
            type: 'body',
            dataType: 'number'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .send({
                number: false
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(422)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Body Property Supposed To Be A Range But Sent A Number- Returns 422', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'range',
            required: false,
            type: 'body',
            dataType: 'range'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .send({
                range: 1
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(422)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Body Property Supposed To Be A Range But Sent A String- Returns 422', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'range',
            required: false,
            type: 'body',
            dataType: 'range'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .send({
                range: 'lkfjs'
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(422)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Body Property Supposed To Be A Range But Sent A Boolean- Returns 422', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'range',
            required: false,
            type: 'body',
            dataType: 'range'
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .send({
                range: false
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(422)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Body Property Range Is Within Limits- Returns 200', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'range',
            required: false,
            type: 'body',
            dataType: 'range',
            range: [48,51]
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .send({
                range: '49-50'
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('Body Property Range Is Outside Limits- Returns 422', done => {

        const testApp = express();
        testApp.use(express.json())
        testApp.use(auth);

        testApp.post('/', validateUserInput([{
            name: 'range',
            required: false,
            type: 'body',
            dataType: 'range',
            range: [48,51]
        }]), (req, res) => {
            res.status(200).json({
                success: true
            });
        });

        request(testApp)
            .post('/')
            .send({
                range: '1-100'
            })
            .set('authorization', process.env.TEST_TOKEN)
            .set('Content-Type', 'application/json')
            .expect(422)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
});