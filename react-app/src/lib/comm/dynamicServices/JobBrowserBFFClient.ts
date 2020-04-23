import { DynamicServiceClient, DynamicServiceClientParams } from '../JSONRPC20/DynamicServiceClient';
// import { JobStatus } from '../redux/store';
// import { JobState } from './MetricsServiceClient';

// Metrics client --
// TODO: move
// TODO: use a more dynamic dynamic service client??

interface JobBrowserBFFParams extends DynamicServiceClientParams { }


// export interface JobState {
//     app_id: string;
//     client_groups: Array<string>;
//     user?: string;

//     complete: boolean;
//     error: boolean;
//     status: string;
//     state: string;

//     creation_time: number;
//     exec_start_time?: number;
//     modification_time?: number;
//     finish_time?: number;

//     job_id: string;
//     method: string;

//     wsid: string;
//     narrative_objNo: number;

//     narrative_name: string;
//     workspace_name: string;
// }


// interface GetAppMetricsParam {
//     epoch_range: [number, number];
//     user_ids: Array<string>;
// }
// interface GetAppMetricsResult {
//     job_states: Array<JobState>;
// }

// interface GetJobsParam {
//     epoch_range: [number, number];
//     user_ids: Array<string>;
// }
// interface GetJobsResult {
//     job_states: Array<JobState>;
//     total_count: number;
// }

// interface GetJobParam {
//     job_id: string;
// }
// interface GetJobResult {
//     job_state: JobState;
// }

export interface IsAdminResult {
    is_admin: boolean;
}

export type SortKey = 'created';

export type SortDirection = 'ascending' | 'descending';

export interface SortSpec {
    key: SortKey;
    direction: SortDirection;
}

export interface SearchSpec {
    terms: Array<string>;
}

export interface FilterSpec {
    workspace_id?: Array<number>;
    status?: Array<string>;
    username?: Array<string>;
    // client_group?: Array<string>;
    app_id?: Array<string>;
    job_id?: Array<string>;
    error_code?: Array<number>;
    terminated_code?: Array<number>;
}

export interface TimeSpanSpec {
    from: number;
    to: number;
}


export interface User {
    username: string;
    realname: string;
}

/* 
Job State
*/

export type JobStatus =
    'create' | 'queue' | 'run' | 'complete' | 'error' | 'terminate';

export type ClientGroup = string;

export interface JobStateBase {
    status: JobStatus;
    client_group: ClientGroup;
}

export interface JobStateCreate extends JobStateBase {
    status: 'create';
    create_at: number;
}

export interface JobStateQueue extends JobStateBase {
    status: 'queue';
    create_at: number;
    queue_at: number;
}

export interface JobStateRun extends JobStateBase {
    status: 'run';
    create_at: number;
    queue_at: number;
    run_at: number;
}

export interface JobStateComplete extends JobStateBase {
    status: 'complete';
    create_at: number;
    queue_at: number;
    run_at: number;
    finish_at: number;
}

export interface JSONRPC2Error {
    code: number;
    message: string;
    data: object | null;
}

export interface JSONRPC11Error {
    code: number;
    message: string;
    error: object | string | null;
}

export type JSONRPCError = JSONRPC2Error | JSONRPC11Error;

export type JobErrorReasonCode = 0 | 1 | 2 | 3 | 4 | 5;

export interface JobErrorReason {
    code: JobErrorReasonCode;
    message: string;
    jsonrpc_error: JSONRPCError;
}

export interface JobStateError extends JobStateBase {
    status: 'error';
    create_at: number;
    queue_at: number;
    run_at: number;
    finish_at: number;
    error: JobErrorReason;
}

export type TerminationReasonCode = 0 | 1 | 2;

export interface TerminationReason {
    code: TerminationReasonCode;
    message?: string;
}

export interface JobStateTerminate extends JobStateBase {
    status: 'terminate';
    create_at: number;
    queue_at: number;
    run_at: number;
    finish_at: number;
    reason: TerminationReason;
}

export type JobState =
    JobStateCreate |
    JobStateQueue |
    JobStateRun |
    JobStateComplete |
    JobStateError |
    JobStateTerminate;

export interface AppInfo {
    id: string;
    module_name: string;
    function_name: string;
    title: string;
    client_groups: Array<ClientGroup>;
}

export interface Context {

}

export interface JobContextBase {
    type: 'narrative' | 'workspace' | 'export' | 'unknown';
}

export interface JobContextNarrative extends JobContextBase {
    type: 'narrative';
    workspace: {
        id: number;
        is_accessible: boolean;
        is_deleted: boolean;
        name: string;
    },
    narrative: {
        title: string | null;
        is_temporary: boolean;
    };
}

export interface JobContextWorkspace extends JobContextBase {
    type: 'workspace';
    workspace: {
        id: number;
        is_accessible: boolean;
        is_deleted: boolean;
        name: string;
    };
}

export interface JobContextExport extends JobContextBase {
    type: 'export';
}

export interface JobContextUnknown extends JobContextBase {
    type: 'unknown';
}

export type NodeClass = string;

export type JobContext =
    JobContextNarrative |
    JobContextWorkspace |
    JobContextExport |
    JobContextUnknown;

export interface JobInfoBase {
    job_id: string;
    type: string;
    owner: User;
    state: JobState;
    app: AppInfo | null;
    context: JobContext;
    node_class: NodeClass;
}

export interface JobInfoCreate extends JobInfoBase {
    state: JobStateCreate;
}

export interface JobInfoQueue extends JobInfoBase {
    state: JobStateQueue;
}

export interface JobInfoRun extends JobInfoBase {
    state: JobStateRun;
}

export interface JobInfoComplete extends JobInfoBase {
    state: JobStateComplete;
}

export interface JobInfoError extends JobInfoBase {
    state: JobStateError;
}

export interface JobInfoTerminate extends JobInfoBase {
    state: JobStateTerminate;
}

export type JobInfo =
    JobInfoCreate |
    JobInfoQueue |
    JobInfoRun |
    JobInfoComplete |
    JobInfoError |
    JobInfoTerminate;

// METHOD PARAMS AND RESULT TYPES

type JobID = string;

interface ParamsBase {
    timeout: number;
    admin?: number;
}

interface ParamsCollectionBase {
    offset: number;
    limit: number;
}

// query_jobs

export interface QueryJobsParams extends ParamsBase, ParamsCollectionBase {
    time_span: TimeSpanSpec;
    sort?: Array<SortSpec>;
    search?: SearchSpec;
    filter?: FilterSpec;
}

export interface QueryJobsResult {
    jobs: Array<JobInfo>;
    found_count: number;
    total_count: number;
}

// get_jobs

export interface GetJobsParams extends ParamsBase {
    job_ids: Array<JobID>;
}

export interface GetJobsResult {
    jobs: Array<JobInfo>;
}

// get_job_log

// TODO: stricter typing 
export interface GetJobLogParams extends ParamsBase, ParamsCollectionBase {
    job_id: JobID;
    search?: Array<string>;
    level?: Array<string>;
}

export type LogLevel = 'normal' | 'error';

interface JobLogEntry {
    row: number;
    logged_at: number;
    message: string;
    level: LogLevel;
}

export interface GetJobLogResult {
    job: JobInfo;
    log: Array<JobLogEntry>;
}

export interface CancelJobParams {
    job_id: string;
    timeout: number;
    admin: boolean;
}

export interface CancelJobResult {
    canceled: boolean;
}

export default class JobBrowserBFFClient extends DynamicServiceClient {
    static module: string = 'JobBrowserBFF';

    async is_admin(): Promise<IsAdminResult> {
        const result = await this.callFunc<[], [IsAdminResult]>('is_admin', []);
        return result[0];
    }

    async query_jobs(params: QueryJobsParams): Promise<QueryJobsResult> {
        const result = await this.callFunc<[QueryJobsParams], [QueryJobsResult]>('query_jobs', [
            params
        ]);
        return result[0];
    }

    async get_jobs(params: GetJobsParams): Promise<GetJobsResult> {
        const result = await this.callFunc<[GetJobsParams], [GetJobsResult]>('get_jobs', [
            params
        ]);
        return result[0];
    }

    async get_job_log(params: GetJobLogParams): Promise<GetJobLogResult> {
        const result = await this.callFunc<[GetJobLogParams], [GetJobLogResult]>('get_job_log', [
            params
        ]);
        return result[0];
    }

    async cancel_job(params: CancelJobParams): Promise<CancelJobResult> {
        const result = await this.callFunc<[CancelJobParams], [CancelJobResult]>('cancel_job', [
            params
        ]);
        return result[0];
    }

    // async getJobs({ epoch_range, user_ids }: GetJobsParam): Promise<GetJobsResult> {
    //     const result = await this.callFunc<[GetJobsParam], [GetJobsResult]>('get_jobs', [
    //         {
    //             epoch_range,
    //             user_ids
    //         }
    //     ]);
    //     return result[0];
    // }

    // async getJob({ job_id }: GetJobParam): Promise<GetJobResult> {
    //     const result = await this.callFunc<[GetJobParam], [GetJobResult]>('get_job', [
    //         {
    //             job_id
    //         }
    //     ]);
    //     return result[0];
    // }

    // async getAppMetrics({ epoch_range, user_ids }: GetAppMetricsParam): Promise<GetAppMetricsResult> {
    //     const result = await this.callFunc<[GetAppMetricsParam], [GetAppMetricsResult]>('get_job', [
    //         {
    //             epoch_range,
    //             user_ids
    //         }
    //     ]);
    //     return result[0];
    // }
}
