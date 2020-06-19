import React from 'react';
import { Table } from 'antd';
import './style.css';
import { Username } from '../../lib/comm/dynamicServices/SampleServiceClient';
import UserCard from '../UserCard/view';
import { ACL, User } from '../sample/data';

export interface AccessListProps {
    acl: ACL;
}

interface AccessListState {

}

export default class DataLinks extends React.Component<AccessListProps, AccessListState> {
    renderACLx(aclPart: Array<User>) {
        return <Table<User>
            dataSource={aclPart}
            rowKey="username"
            size="small"
            // scroll={{ y: '10em' }}
            pagination={false}>
            <Table.Column
                title="Username"
                key="username"
                dataIndex="username"
                width="8em"
                render={(username: Username, user: User) => {
                    return <a href={`/#people/${username}`} target="_blank" rel="noopener noreferrer">
                        {username}
                    </a>;
                }} />
        </Table>;
    }

    renderACL(aclPart: Array<User>) {
        if (aclPart.length === 0) {
            return <p style={{ fontStyle: 'italic' }}>
                No users with this access level
            </p>;
        }
        return aclPart
            .sort((a: User, b: User) => {
                return a.username.localeCompare(b.username);
            })
            .map((user) => {
                return <UserCard user={user} key={user.username} />;
            });
    }

    render() {
        return <div className="AccessList" data-testid="accesslist">
            <div className="Row -stretch">
                <div className="Col -stretch" style={{ marginRight: '10px' }}>
                    <h3>Admin Access</h3>
                    <div className="Col -stretch -autoscroll">
                        {this.renderACL(this.props.acl.admin)}
                    </div>
                </div>
                <div className="Col -stretch" style={{ marginLeft: '5px', marginRight: '5px' }}>
                    <h3>Write Access</h3>
                    <div className="Col -stretch -autoscroll">
                        {this.renderACL(this.props.acl.write)}
                    </div>
                </div>
                <div className="Col -stretch" style={{ marginLeft: '10px' }}>
                    <h3>Read-Only Access</h3>
                    <div className="Col -stretch -autoscroll">
                        {this.renderACL(this.props.acl.read)}
                    </div>
                </div>
            </div>
        </div>;
    }
}