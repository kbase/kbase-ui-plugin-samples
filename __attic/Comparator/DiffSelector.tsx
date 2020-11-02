import React from 'react';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { Checkbox } from 'antd';

export type DiffState = 'diff' | 'nodiff';
export interface DiffSelectorProps {
    diffStatus: Array<DiffState>;
    changeDiffStatus: (diffStatus: Array<DiffState>) => void;
}

interface DiffSelectorState {
    // diffStatus: Array<DiffState>;
}

export default class DiffSelector extends React.Component<DiffSelectorProps, DiffSelectorState> {
    onDiffChange(values: Array<CheckboxValueType>) {
        // this.setState({
        //     diffStatus: values as Array<DiffState>
        // });
        this.props.changeDiffStatus(values as Array<DiffState>);
    }

    render() {
        return <div className="DiffSelector">

            <Checkbox.Group
                options={[{
                    label: 'different',
                    value: 'diff'
                }, {
                    label: 'same',
                    value: 'nodiff'
                }]}

                value={this.props.diffStatus}
                onChange={this.onDiffChange.bind(this)}>

            </Checkbox.Group>
        </div>;
    }
}