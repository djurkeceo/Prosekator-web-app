function jsonBody(req) {
    if (req.body && typeof req.body === 'object') {
        return req.body;
    }

    if (typeof req.body === 'string') {
        try {
            return JSON.parse(req.body);
        } catch (err) {
            return {};
        }
    }

    return {};
}

module.exports = { jsonBody };
