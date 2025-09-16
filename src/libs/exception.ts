interface IBaseError {
  message?: string;
  code?: string | number;
  data?: any;
}

export class AppError extends Error {
  code: string | number;
  data: any;
  statusCode: number;

  constructor(
    name: string,
    { message, code, data }: IBaseError,
    statusCode: number,
    defaultMessage: string,
    defaultCode: string
  ) {
    super(message ?? defaultMessage);
    this.name = name;
    this.code = code ?? defaultCode;
    this.data = data;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(params: IBaseError = {}) {
    super('ValidationError', params, 400, 'Error occurred during validation', 'E1000');
  }
}

export class KycRequiredError extends AppError {
  constructor(params: IBaseError = {}) {
    super('KycRequiredError', params, 403, 'KYC verification is required', 'E1001');
  }
}

export class ItemNotFoundError extends AppError {
  constructor(params: IBaseError = {}) {
    super('ItemNotFoundError', params, 404, 'Item not found', 'E2000');
  }
}

export class PermissionError extends AppError {
  constructor(params: IBaseError = {}) {
    super('PermissionError', params, 403, 'You are not authorized to perform this action.', 'E1002');
  }
}

export class ItemAlreadyExistsError extends AppError {
  constructor(params: IBaseError = {}) {
    super('ItemAlreadyExistsError', params, 409, 'Item already exists', 'E2001');
  }
}

export class BusinessRuleError extends AppError {
  constructor(params: IBaseError = {}) {
    super('BusinessRuleError', params, 422, 'Operation is not possible due to business logic', 'E1004');
  }
}
