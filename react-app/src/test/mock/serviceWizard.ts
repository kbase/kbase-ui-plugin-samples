/* istanbul ignore file */

import {serviceURL} from "./common";
import {GetServiceStatusResult} from "@kbase/ui-lib/lib/comm/coreServices/ServiceWizard";

export async function mock_get_service_status(body: any, request: Request) {
    const moduleName = body.params[0]['module_name'];
    const serviceStatusResult: GetServiceStatusResult = {
        url: serviceURL(moduleName),
        status: 'OK',
        git_commit_hash: 'hash here',
        version: '1.2.3',
        hash: 'full hash here',
        health: 'healthy',
        up: 1,
        module_name: moduleName,
        release_tags: ['dev']
    }
    return {
        body: JSON.stringify({
            version: '1.1',
            id: 'abc',
            result: [
                serviceStatusResult
            ]
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };
}
