import React from 'react';
import UserCard from '../UserCard/view';
import './style.css';
import Section from '../Section';
import { ACL, User } from "../../lib/ViewModel/ViewModel";

export interface AccessListProps {
    acl: ACL;
    owner: User;
}

interface AccessListState {
}

export default class DataLinks extends React.Component<AccessListProps, AccessListState> {
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
                    <Section title="Owner">
                        <div className="Col -stretch -autoscroll">
                            <UserCard user={this.props.owner} key="owner" />
                        </div>
                    </Section>
                </div>
                <div className="Col -stretch" style={{ marginRight: '10px' }}>
                    <Section title="Admin Access">
                        <div className="Col -stretch -autoscroll">
                            {this.renderACL(this.props.acl.admin)}
                        </div>
                    </Section>
                </div>
                <div className="Col -stretch" style={{ marginLeft: '5px', marginRight: '5px' }}>
                    <Section title="Write Access">
                        <div className="Col -stretch -autoscroll">
                            {this.renderACL(this.props.acl.write)}
                        </div>
                    </Section>
                </div>
                <div className="Col -stretch" style={{ marginLeft: '10px' }}>
                    <Section title="Read-Only Access">
                        <div className="Col -stretch -autoscroll">
                            {this.renderACL(this.props.acl.read)}
                        </div>
                    </Section>
                </div>
            </div>
        </div>;
    }
}
