export function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                error: 'Validation failed',
                details: result.error.flatten(),
            });
            return;
        }
        req.validatedBody = result.data;
        next();
    };
}
export function validateQuery(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            res.status(400).json({
                error: 'Validation failed',
                details: result.error.flatten(),
            });
            return;
        }
        req.validatedQuery = result.data;
        next();
    };
}
export function validateParams(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            res.status(400).json({
                error: 'Validation failed',
                details: result.error.flatten(),
            });
            return;
        }
        req.validatedParams = result.data;
        next();
    };
}
