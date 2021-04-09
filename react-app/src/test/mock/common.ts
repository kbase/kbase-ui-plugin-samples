/* istanbul ignore file */

export const TEST_FETCH_TIMEOUT = 1000;

export function serviceURL(moduleName: string) {
    return `https://fake.kbase.us/services/${moduleName}`;
}