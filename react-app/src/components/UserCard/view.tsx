import React from 'react';
import { Row, Col } from 'antd';
import Gravatar from '../Gravatar/Gravatar';
import { User } from '../sample/data';

export interface UserCardProps {
    user: User;
}

interface UserCardState {

}

export default class UserCard extends React.Component<UserCardProps, UserCardState> {
    render() {
        const { user } = this.props;
        return <div className="UserCard" key={user.username}>
            <Row gutter={10}>
                <Col flex="30px" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Gravatar username={user.username} realname={user.realname} size={30}
                        gravatarHash={user.gravatarHash} gravatarDefault={user.gravatarDefault}
                        avatarOption={user.avatarOption}
                    />
                </Col>
                <Col flex="auto">
                    <div>
                        <a href={`/#people/${user.username}`}
                            target="_blank"
                            rel="noopener noreferrer">
                            {user.realname}
                        </a>
                    </div>
                    <div>
                        <i>{user.username}</i>
                    </div>

                </Col>
            </Row>
        </div>;
    }
}