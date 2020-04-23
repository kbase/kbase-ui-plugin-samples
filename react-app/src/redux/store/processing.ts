export enum AsyncProcessStatus {
    NONE,
    PROCESSING,
    SUCCESS,
    ERROR
}

export interface AsyncProcessNone<> {
    status: AsyncProcessStatus.NONE;
}

export interface AsyncProcessProcessing<> {
    status: AsyncProcessStatus.PROCESSING;
}

export interface AsyncProcessError<E> {
    status: AsyncProcessStatus.ERROR;
    error: E;
}

export interface AsyncProcessSuccess<S> {
    status: AsyncProcessStatus.SUCCESS;
    state: S;
}

export type AsyncProcess<S, E> = AsyncProcessNone | AsyncProcessProcessing | AsyncProcessError<E> | AsyncProcessSuccess<S>;
