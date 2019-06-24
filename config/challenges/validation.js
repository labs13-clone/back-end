const post = [{
        name: 'title',
        required: true,
        type: 'body',
        dataType: 'string',
        dbUnique: true,
        dbTable: 'challenges'
    },
    {
        name: 'description',
        required: true,
        type: 'body',
        dataType: 'string'
    },
    {
        name: 'tests',
        required: true,
        type: 'body',
        dataType: 'json'
    },
    {
        name: 'skeleton_function',
        required: true,
        type: 'body',
        dataType: 'string'
    },
    {
        name: 'solution',
        required: true,
        type: 'body',
        dataType: 'string'
    },
    {
        name: 'difficulty',
        required: true,
        type: 'body',
        dataType: 'number',
        range: [1, 100]
    },
    {
        name: 'created_by',
        required: false,
        type: 'body',
        dataType: 'id',
        dbTable: 'users',
        evals: [
            'req.body.created_by = req.headers.user.id;'
        ]

    },
    {
        name: 'approved',
        required: false,
        type: 'body',
        evals: [
            'req.body.approved = false;'
        ]

    }
];

const get = [{
        name: 'difficulty',
        required: false,
        type: 'query',
        dataType: 'range'
    },
    {
        name: 'id',
        required: false,
        type: 'query',
        dataType: 'id',
        dbTable: 'challenges'
    },
    {
        name: 'category_name',
        required: false,
        type: 'query',
        dataType: 'string'
    },
    {
        name: 'category_id',
        required: false,
        type: 'query',
        dataType: 'id',
        dbTable: 'categories'
    },
    {
        name: 'approved',
        required: false,
        type: 'query',
        dataType: 'boolean',
        evals: [
            "if (req.query.approved !== undefined && req.query.approved === false && req.headers.user.role === 'user') req.query.created_by = req.headers.user.id;",
            "if (req.query.approved === undefined) req.query.approved = true;"
        ]
    },
    {
        name: 'created',
        required: false,
        type: 'query',
        evals: [
            'if (req.query.created !== undefined) req.query.created_by = req.headers.user.id; delete req.query.created;'
        ]
    },
    {
        name: 'completed',
        required: false,
        type: 'query',
        evals: [
            'if (req.query.completed !== undefined) req.query.completed_by = req.headers.user.id; delete req.query.completed;'
        ]
    },
    {
        name: 'started',
        required: false,
        type: 'query',
        evals: [
            'if (req.query.started !== undefined) req.query.started_by = req.headers.user.id; delete req.query.started;'
        ]
    }
];

const put = [{
        name: 'id',
        required: true,
        type: 'body',
        dataType: 'id',
        dbTable: 'challenges'
    }, {
        name: 'approved',
        required: true,
        type: 'body',
        dataType: 'boolean',
        evals: [
            "if (req.headers.user.role !== 'admin') error = { errorType: 'unauthorized' }"
        ]
    }
]

module.exports = {
    post,
    get,
    put
}