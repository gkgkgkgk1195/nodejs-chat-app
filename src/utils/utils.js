let res = (status, statusCode, message, data) => {
    return { status: status, statusCode: statusCode, message: message, data: data }
}

module.exports = {
    sucRes: (statusCode, msg, data) => {
        return res('Success', statusCode || 200, msg, data)
    },
    errRes: (statusCode, msg, data) => {
        return res('Fail', statusCode, msg, data)
    },



}
