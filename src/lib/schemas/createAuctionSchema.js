const schema = {
    properties: {
        type: 'object',
        body: {
            properties: {
                title: {
                    type: 'string',
                },
            },
            required: ['title'],
        },
    },
    required: ['body'],
};

export default schema;