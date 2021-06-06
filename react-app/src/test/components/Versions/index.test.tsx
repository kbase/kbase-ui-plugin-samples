import React from 'react';
import {render, waitFor} from '@testing-library/react';
import Versions, {VersionsProps} from 'components/Versions'
import {Sample} from 'lib/ViewModel/ViewModel';

import singleVersionSampleData from './storyData/sample-geolocation.json';
import multiVersionSampleData from './storyData/sample-versions-1-of-4.json';

const singleVersionSample = (singleVersionSampleData as unknown) as Sample;
const multiVersionSample = (multiVersionSampleData as unknown) as Sample;


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

    test('renders a sample with multiple versions', async () => {
        const props: VersionsProps = {
            sample: multiVersionSample,
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

})


