export enum AsyncViewStatus {
    NONE,
    PROCESSING,
    SUCCESS,
    ERROR
}

export interface AsyncViewNone {
    status: AsyncViewStatus.NONE;
}

export interface AsyncViewProcessing {
    status: AsyncViewStatus.PROCESSING;
}

export interface AsyncViewError<E> {
    status: AsyncViewStatus.ERROR;
    error: E;
}

export interface AsyncViewSuccess<S> {
    status: AsyncViewStatus.SUCCESS;
    state: S;
}

export type AsyncView<S, E> = AsyncViewNone | AsyncViewProcessing | AsyncViewSuccess<S> | AsyncViewError<E>;