import React from 'react';
import { DataLink } from '../../lib/comm/dynamicServices/SampleServiceClient';
import { Table } from 'antd';
import { DataLink2 } from './data';

export interface DataLinksProps {
    dataLinks: Array<DataLink2>;
    baseURL: string;
}

interface DataLinksState {

}

function countedTerm(count: number, singular: string, plural?: string) {
    if (count === 1) {
        return singular;
    } else if (plural) {
        return plural;
    } else {
        return `${singular}s`;
    }
}

function noData() {
    return <span style={{ color: 'gray' }}>-</span>;
}

export default class DataLinks extends React.Component<DataLinksProps, DataLinksState> {

    renderDataLinks() {
        return this.props.dataLinks.map((link) => {
            return <Table<DataLink2>
                dataSource={this.props.dataLinks}
                rowKey="upa"
                key="upa"
            >
                <Table.Column
                    title='Object Ref'
                    key="upa"
                    dataIndex="upa"
                    render={(upa: string, row: DataLink2) => {
                        return <a href={`/#dataview/${upa}`} target="_parent">
                            {upa}
                        </a>;
                    }} />
                <Table.Column
                    title='Sub-object'
                    dataIndex="dataid"
                    render={(dataId: string) => {
                        if (dataId) {
                            return dataId;
                        }
                        return noData();
                    }}
                />
                <Table.Column
                    title="Linked"
                    dataIndex="created"
                    render={(created: number) => {
                        return Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            timeZoneName: 'short'
                        }).format(created);
                    }}
                    sorter={true}
                />
                <Table.Column
                    title="Expired"
                    dataIndex="expired"
                    render={(created: number) => {
                        if (!created) {
                            return noData();
                        }
                        return Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            timeZoneName: 'short'
                        }).format(created);
                    }}
                />
                <Table.Column
                    title="Expired By"
                    dataIndex="expiredby"
                    render={(expiredBy: string) => {
                        if (!expiredBy) {
                            return noData();
                        }
                        return expiredBy;
                    }}
                />
            </Table>;
        });
    }

    render() {
        const count = this.props.dataLinks.length;

        return <div className="DataLinks">
            <div>
                There {countedTerm(count, 'is', 'are')} {count} {countedTerm(count, 'data link')}.
            </div>
            {this.renderDataLinks()}
        </div>;
    }
}