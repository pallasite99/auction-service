const schema = {
    properties: {
        body: {
            type: 'string',
            minLength: 1,
            pattern: '\=$',
        }
    }
};

export default schema;