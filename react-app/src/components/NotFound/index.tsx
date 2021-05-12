import { FrownTwoTone } from '@ant-design/icons';
import { InfoTable } from '@kbase/ui-components';
import { Result } from 'antd';
import React from 'react';


export type NotFoundProps = {
    path: string;
};
export default class NotFound extends React.Component<NotFoundProps, {}> {
    render() {
        const extraTable = [{
            label: 'Path',
            value: this.props.path
        }];
        return <Result
            title="Not Found"
            icon={<FrownTwoTone twoToneColor="orange" />}
            subTitle="Sorry, this path does not exist."
        >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <InfoTable table={extraTable} />
            </div>
        </Result>;
    }
}

