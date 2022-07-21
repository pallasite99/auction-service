const schema = {
    type: 'object',
    properties: {
        queryStringParameters: {
            properties: {
                status: {
                    type: 'string',
                    enum: ['open', 'closed'],
                    default: 'open',
                },
            },
        },
    },
    required:[
        'queryStringParameters',
    ],
};

export default schema;
