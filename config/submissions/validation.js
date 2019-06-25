const get = (req,res,next) => {

};

const oldGet = [{
        name: 'challenge_id',
        required: false,
        type: 'query',
        dataType: 'id',
        dbTable: 'user_submissions',
        dbProtected: true,
        evals: [
            'req.query.created_by = req.headers.user.id;',
        ]
    },
    {
        name: 'completed',
        required: false,
        type: 'query',
        dataType: 'boolean',
        evals: [
            'req.query.created_by = req.headers.user.id;',
        ]
    }
]


const post = (req,res,next) => {

};

const oldPost = [{
        name: 'created_by',
        required: false,
        type: 'body',
        dataType: 'id',
        dbTable: 'user_submissions',
        dbUniqueWhere: {
            created_by: 'req.headers.user.id',
            challenge_id: 'req.body.challenge_id'
        },
        evals: [
            'req.body.created_by = req.headers.user.id;'
        ]
    },
    {
        name: 'challenge_id',
        required: true,
        type: 'body',
        dataType: 'id',
        dbTable: 'challenges',
        dbHooks: {
            solution: 'item.skeleton_function;'
        }
    }
]

const putExec = (req,res,next) => {

};

const oldPutExec = [{
        name: 'id',
        required: true,
        type: 'body',
        dataType: 'id',
        dbTable: 'user_submissions',
        dbProtected: true,
        dbUniqueWhere: {
            id: 'req.body.id',
            completed: 'true'
        },
        dbHooks: {
            code_execs: 'item.code_execs + 1;',
            total_code_execs: 'item.total_code_execs + 1;',
        }
    },
    {
        name: 'solution',
        required: false,
        type: 'body',
        dataType: 'string'
    }
]

const putTest = (req,res,next) => {

};

const oldPutTest = [{
        name: 'id',
        required: true,
        type: 'body',
        dataType: 'id',
        dbTable: 'user_submissions',
        dbProtected: true,
        dbUniqueWhere: {
            id: 'req.body.id',
            completed: 'true'
        },
        dbHooks: {
            test_execs: 'item.test_execs + 1;',
            total_test_execs: 'item.total_test_execs + 1;',
        }
    },
    {
        name: 'solution',
        required: false,
        type: 'body',
        dataType: 'string'
    }
]

const putAttempt = (req,res,next) => {

};

const oldPutAttempt = [{
        name: 'id',
        required: true,
        type: 'body',
        dataType: 'id',
        dbTable: 'user_submissions',
        dbProtected: true,
        dbUniqueWhere: {
            id: 'req.body.id',
            completed: 'true'
        },
        dbHooks: {
            attempts: 'item.attempts + 1;',
            total_attempts: 'item.total_attempts + 1;',
        }
    },
    {
        name: 'solution',
        required: true,
        type: 'body',
        dataType: 'string'
    }
]

const putReset = (req,res,next) => {

};

const oldPutReset = [{
        name: 'id',
        required: true,
        type: 'body',
        dataType: 'id',
        dbTable: 'user_submissions',
        dbProtected: true,
        dbHooks: {
            solution: {
                table: 'challenges',
                where: {
                    id: 'item.challenge_id'
                },
                eval: 'hookItem.skeleton_function;'
            }
        },
        evals: [
            'req.body.attempts = 0;',
            'req.body.code_execs = 0;',
            'req.body.test_execs = 0;',
            'req.body.completed = false;'
        ]
    },
    {
        name: 'solution',
        required: true,
        type: 'body',
        dataType: 'string'
    }
]

module.exports = {
    get,
    post,
    putExec,
    putTest,
    putAttempt,
    putReset
}