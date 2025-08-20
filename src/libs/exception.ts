interface IBaseError {
    message?: string;
    code?: string | number;
    data?: any;
}
export class ValidationError extends Error {
    code: string | number;
    data: any;
    statusCode: number;
    constructor({ message="Error occured during validation", code="ERR", data }: IBaseError) {
        super(message)
        this.name = 'ValidationError'
        this.code = code
        this.data = data
        this.statusCode = 400
        Error.captureStackTrace(this, ValidationError)
    }
}

export class ItemNotFoundError extends Error {
    code: string | number;
    data: any;
    statusCode: number;

    constructor({ message="Item not found", code="ERR", data }: IBaseError) {
        super(message);
        this.name = 'ItemNotFoundError';
        this.code = code;
        this.data = data;
        this.statusCode = 400; // Suggested 404 status code for "Not Found" errors
        Error.captureStackTrace(this, ItemNotFoundError);
    }
}

export class PermissionError extends Error {
    code: string | number;
    data: any;
    statusCode: number;

    constructor({ message='You are not authorized to perform this action.', code="ERR", data=null }: IBaseError) {
        super(message)
        this.name = 'PermissionError'
        this.code = code
        this.data = data
        this.statusCode = 400
        Error.captureStackTrace(this, PermissionError)
    }
}

export class ItemAlreadyExists extends Error {
    code: string | number;
    data: any;
    statusCode: number;

    constructor({ message='Item already exists', code="ERR", data=null }: IBaseError) {
        super(message)
        this.name = 'PermissionError'
        this.code = code
        this.data = data
        this.statusCode = 400
        Error.captureStackTrace(this, PermissionError)
    }
}