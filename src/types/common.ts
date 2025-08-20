export type BooleanNumber = 0 | 1;
export type ResponseCode = "SUC" | "ERR";

export function isPromise<T>(value: any): value is Promise<T> {
    return value && typeof value.then === 'function';
}