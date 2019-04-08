'use strict'

module.exports = {
    OK: {
        code: 0
    },
    FAILED: {
        code: -1,
        message: 'operation faile.'
    },
    PARAM_IS_EMPTY: {
        code: 4,
        message: "Parameter is empty"
    },
    SERVICE_EXCEPTION: {
        code: 8,
        message: "service exception"
    },
    EXIST: {
        code: 3,
        message: 'meter is exist'
    }

}