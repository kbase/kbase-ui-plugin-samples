import React from 'react';
import { Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { View } from '.';

export interface ViewSelectorProps {
    view: View;
    changeView: (view: View) => void;
}

interface ViewSelectorState {
}

export default class ViewSelector extends React.Component<ViewSelectorProps, ViewSelectorState> {
    onViewChange(e: RadioChangeEvent) {
        this.props.changeView(e.target.value);
    }
    render() {
        return <div className="ViewSelector">
            <Radio.Group
                value={this.props.view}
                onChange={this.onViewChange.bind(this)}>
                <Radio.Button value="sample">
                    Sample Info
                </Radio.Button>

                <Radio.Button value="metadata">
                    Metadata
                </Radio.Button>

                <Radio.Button value="user_metadata">
                    User Metadata
                </Radio.Button>
            </Radio.Group>
        </div>;
    }
}