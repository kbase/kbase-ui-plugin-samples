import {AsyncProcess, AsyncProcessStatus} from "../../redux/store/processing";

export interface CacheState {
    url: string;
    fetchedAt: number;
}

export interface CacheError {
    message: string;
}

export class URLCacher {
    fetcher: () => Promise<string>;
    timeout: number;
    ttl: number;
    state: AsyncProcess<CacheState, CacheError>

    constructor(fetcher: () => Promise<string>, timeout: number, ttl: number) {
        this.fetcher = fetcher;
        this.timeout = timeout;
        this.ttl = ttl;
        this.state = {
            status: AsyncProcessStatus.NONE
        }
    }

    async tryWait(): Promise<string> {
        const started = Date.now();
        return new Promise((resolve, reject) => {
            const waiter = () => {
                const elapsed = Date.now() - started;
                switch (this.state.status) {
                    case AsyncProcessStatus.SUCCESS:
                        resolve(this.state.state.url);
                        return;
                    case AsyncProcessStatus.ERROR:
                        reject(this.state.error.message);
                        return;
                    case AsyncProcessStatus.REPROCESSING:
                    case AsyncProcessStatus.PROCESSING:
                        if (elapsed > this.timeout) {
                            this.state = {
                                status: AsyncProcessStatus.ERROR,
                                error: {
                                    message: `Timeout after ${elapsed}ms`
                                }
                            }
                            reject(new Error(`Timeout after ${elapsed}ms`))
                        }
                        window.setTimeout(() => {
                            waiter();
                        }, 100)
                }
            }
            waiter();
        });
    }

    async fetch(): Promise<string> {
        switch (this.state.status) {
            case AsyncProcessStatus.NONE:
                this.state = {
                    status: AsyncProcessStatus.PROCESSING
                }
                try {
                    const url = await this.fetcher();
                    this.state = {
                        status: AsyncProcessStatus.SUCCESS,
                        state: {
                            url,
                            fetchedAt: Date.now()
                        }
                    };
                    return url;
                } catch (ex) {
                    this.state = {
                        status: AsyncProcessStatus.ERROR,
                        error: {
                            message: ex.message
                        }
                    }
                    throw ex;
                }
            case AsyncProcessStatus.SUCCESS:
                return this.state.state.url;
            case AsyncProcessStatus.ERROR:
                throw new Error(this.state.error.message);
            case AsyncProcessStatus.REPROCESSING:
            case AsyncProcessStatus.PROCESSING:
                return await this.tryWait();
        }
    }
}
