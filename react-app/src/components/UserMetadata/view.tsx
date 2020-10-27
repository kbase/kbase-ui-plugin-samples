import React from 'react';
import {
    Tooltip
} from 'antd';

import { Sample } from '../Main/types';


import './style.less';

export interface UserMetadataViewerProps {
    sample: Sample;
}

interface UserMetadataViewerState {
}

export default class UserMetadataViewer extends React.Component<UserMetadataViewerProps, UserMetadataViewerState> {
    renderUserMetadataAlpha() {
        const sample = this.props.sample;
        const metadata = Object.entries(sample.userMetadata);
        if (metadata.length === 0) {
            return <div style={{ fontStyle: 'italic' }}>No user metadata in this sample</div>;
        }
        const rows = Array.from(metadata)
            .sort(([akey,], [bkey,]) => {
                return akey.localeCompare(bkey);
            })
            .map(([key, value]) => {
                return <div key={key}>
                    <div><Tooltip title={`key: ${key}`}><span>{key}</span></Tooltip></div>
                    <div>{value}</div>
                </div>;
            });
        return <div className="InfoTable -bordered ControlledMetadata">
            <div key="header" className="InfoTable-header">
                <div>Field</div>
                <div>Value</div>
            </div>
            {rows}
        </div>;
    }

    render() {
        return <div className="UserMetadata">
            <div className="UserMetadata-content">
                {this.renderUserMetadataAlpha()}
            </div>
        </div>;
    }
}
