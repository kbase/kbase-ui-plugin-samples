import React from 'react';
import {render, waitFor} from '@testing-library/react';
import Versions, {VersionsProps} from 'components/Versions'
import {Sample} from 'lib/ViewModel/ViewModel';

import sampleData from '../../../data/vm-samples/sample-geolocation.json';
import sampleVersion1of4Data from '../../../data/vm-samples/sample-versions-1-of-4.json';
import sampleVersion2of4Data from '../../../data/vm-samples/sample-versions-2-of-4.json';
import sampleVersion3of4Data from '../../../data/vm-samples/sample-versions-3-of-4.json';
import sampleVersion4of4Data from '../../../data/vm-samples/sample-versions-4-of-4.json';

const singleVersionSample = (sampleData as unknown) as Sample;
const sampleVersion1of4 = (sampleVersion1of4Data as unknown) as Sample;
const sampleVersion2of4 = (sampleVersion2of4Data as unknown) as Sample;
const sampleVersion3of4 = (sampleVersion3of4Data as unknown) as Sample;
const sampleVersion4of4 = (sampleVersion4of4Data as unknown) as Sample;


const TIMEOUT = 10000;

describe('The Versions Component', () => {
    test('renders a sample with just one version', async () => {
        const props: VersionsProps = {
            sample: singleVersionSample,
            onChangeVersion: (_version: string) => {
            }
        };
        const {getByText} = render(<Versions {...props} />);
        await waitFor(() => {
            const usernameElement = getByText('First');
            // console.log(usernameElement);
            expect(usernameElement).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });
    });

    test('renders a sample with multiple versions 1 of 4 versions', async () => {
        const props: VersionsProps = {
            sample: sampleVersion1of4,
            onChangeVersion: (_version: string) => {
            }
        };
        const {getByText} = render(<Versions {...props} />);
        await waitFor(() => {
            const firstVersionElement = getByText('First');
            expect(firstVersionElement).toBeInTheDocument();
            const nextVersionElement = getByText('Next');
            expect(nextVersionElement).toBeInTheDocument();
            const latestVersionElement = getByText('Latest');
            expect(latestVersionElement).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });
    });

    test('renders a sample with multiple versions 2 of 4 versions', async () => {
        const props: VersionsProps = {
            sample: sampleVersion2of4,
            onChangeVersion: (_version: string) => {
            }
        };
        const {getByText} = render(<Versions {...props} />);
        await waitFor(() => {
            const firstVersionElement = getByText('First');
            expect(firstVersionElement).toBeInTheDocument();
            const thisSampleElement = getByText('This Sample');
            expect(thisSampleElement).toBeInTheDocument();
            const nextVersionElement = getByText('Next');
            expect(nextVersionElement).toBeInTheDocument();
            const latestVersionElement = getByText('Latest');
            expect(latestVersionElement).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });
    });

    test('renders a sample with multiple versions 3 of 4 versions', async () => {
        const props: VersionsProps = {
            sample: sampleVersion3of4,
            onChangeVersion: (_version: string) => {
            }
        };
        const {getByText} = render(<Versions {...props} />);
        await waitFor(() => {
            const firstVersionElement = getByText('First');
            expect(firstVersionElement).toBeInTheDocument();
            const previousVersionElement = getByText('Previous');
            expect(previousVersionElement).toBeInTheDocument();
            const thisSampleElement = getByText('This Sample');
            expect(thisSampleElement).toBeInTheDocument();
            const latestVersionElement = getByText('Latest');
            expect(latestVersionElement).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });
    });

    test('renders a sample with multiple versions 4 of 4 versions', async () => {
        const props: VersionsProps = {
            sample: sampleVersion4of4,
            onChangeVersion: (_version: string) => {
            }
        };
        const {getByText} = render(<Versions {...props} />);
        await waitFor(() => {
            const firstVersionElement = getByText('First');
            expect(firstVersionElement).toBeInTheDocument();
            const nextVersionElement = getByText('Previous');
            expect(nextVersionElement).toBeInTheDocument();
            const latestVersionElement = getByText('Latest');
            expect(latestVersionElement).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });
    });
})
