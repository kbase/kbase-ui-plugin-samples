import React from 'react';
import { Table, Tooltip, Empty } from 'antd';
import { countedTerm } from '../../lib/utils';
import { NoData } from '@kbase/ui-components';
import './style.css';
import { DataLink2, LinkedData } from 'redux/store/linkedData';

export interface DataLinksProps {
    linkedData: LinkedData;
    baseURL: string;
}

interface DataLinksState {
}

export default class DataLinks extends React.Component<DataLinksProps, DataLinksState> {
    renderDataLinks() {
        if (this.props.linkedData.length === 0) {
            return;
        }
        return <Table<DataLink2>
            dataSource={this.props.linkedData}
            className="AntTable-FullHeight"
            rowKey="upa"
            size="small"
            scroll={{ y: '100%' }}
            pagination={false}
        >
            <Table.Column
                title='Object Ref'
                key="upa"
                dataIndex="upa"
                width="8em"
                ellipsis={true}
                render={(upa: string, row: DataLink2) => {
                    return <a href={`/#dataview/${upa}`} target="_blank" rel="noopener noreferrer">
                        {upa}
                    </a>;
                }} />
            <Table.Column
                title="Name"
                dataIndex="objectName"
                width="10em"
                ellipsis={true}
                sorter={(a: DataLink2, b: DataLink2) => {
                    return a.objectName.localeCompare(b.objectName);
                }}
                render={(objectName: string, row: DataLink2) => {
                    return <Tooltip title={objectName}>
                        <a href={`/#dataview/${row.upa}`} target="_blank" rel="noopener noreferrer">
                            {objectName}
                        </a>
                    </Tooltip>;
                }} />

            <Table.Column
                title="Type"
                dataIndex="objectType"
                width="10em"
                ellipsis={true}
                render={(objectType: string) => {
                    const [, typeName, ,] = objectType.split(/[.-]/);
                    return <Tooltip title={objectType}>
                        <a
                            href={`/#typeview/type/${objectType}`}
                            target="_blank" rel="noopener noreferrer">
                            {typeName}
                        </a>
                    </Tooltip>;
                }}
                sorter={(a: DataLink2, b: DataLink2) => {
                    const [, aTypeName, ,] = a.objectType.split(/[.-]/);
                    const [, bTypeName, ,] = b.objectType.split(/[.-]/);
                    return aTypeName.localeCompare(bTypeName);
                }}
            />
            <Table.Column
                title='Sub-object'
                dataIndex="dataid"
                ellipsis={true}
                render={(dataId: string) => {
                    if (dataId) {
                        return dataId;
                    }
                    return <NoData />;
                }}

            />
            <Table.Column
                title="Linked"
                dataIndex="created"
                ellipsis={true}
                render={(created: number) => {
                    const timestamp = Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        timeZoneName: 'short'
                    }).format(created);
                    const date = Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric'
                    }).format(created);
                    return <Tooltip title={timestamp}>
                        <span>{date}</span>
                    </Tooltip>;
                }}
                sorter={(a: DataLink2, b: DataLink2) => {
                    return a.created - b.created;
                }}
            />
            <Table.Column
                title="Expired"
                dataIndex="expired"
                ellipsis={true}
                render={(expired: number) => {
                    if (!expired) {
                        return <NoData />;
                    }
                    const timestamp = Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        timeZoneName: 'short'
                    }).format(expired);
                    const date = Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric'
                    }).format(expired);
                    return <Tooltip title={timestamp}>
                        <span>{date}</span>
                    </Tooltip>;
                }}
            />
            <Table.Column
                title="Expired By"
                dataIndex="expiredby"
                ellipsis={true}
                render={(expiredBy: string) => {
                    if (!expiredBy) {
                        return <NoData />;
                    }
                    return expiredBy;
                }}
            />
        </Table>;
    }

    renderSummary() {
        const count = this.props.linkedData.length;
        if (count === 0) {
            return <Empty description="This sample is not linked to any data." />;
        }
        return <p className="-message">
            This sample is linked to {count} {countedTerm(count, 'data object')}.
        </p>;
    }

    render() {
        return <div className="DataLinks" data-testid="linkeddata">
            {this.renderSummary()}
            {this.renderDataLinks()}
        </div>;
    }
}
