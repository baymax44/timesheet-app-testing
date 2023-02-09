exports.sendError = ( req, res, statusCode, message, err) => {
    if ( req.app.get('env') === 'development'){
        res.status(statusCode || 500).json({
            message: message || err.message,
            error: err || {}
        });
    } else {
        res.status(statusCode || 500).json({
            message: message || err.message,
            error: {}
        });
    }
}
