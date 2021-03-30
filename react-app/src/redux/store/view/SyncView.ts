/*
 Sync view state
 Primarily for top level views which don't have an async load operation.
*/

export enum SyncViewStatus {
    NONE = 'NONE',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR'
}

export interface SyncViewNone {
    status: SyncViewStatus.NONE;
}

export interface SyncViewError<E> {
    status: SyncViewStatus.ERROR;
    error: E;
}

export interface SyncViewSuccess<S> {
    status: SyncViewStatus.SUCCESS;
    state: S;
}
export type SyncView<S, E> = SyncViewNone | SyncViewSuccess<S> | SyncViewError<E>;