import React from 'react';
import {Row, Col} from 'antd';
import Gravatar, {GravatarProps} from '../Gravatar/Gravatar';
import {User} from 'lib/ViewModel/ViewModel';

export interface UserCardProps {
    user: User;
}

interface UserCardState {
}

export default class UserCard extends React.Component<UserCardProps, UserCardState> {
    renderGravatar(user: User) {
        const props: GravatarProps = {
            username: user.username,
            realname: user.realname,
            size: 30
        }
        if ('gravatarHash' in user) {
            props.gravatarHash = user.gravatarHash;
        }
        if ('gravatarDefault' in user) {
            props.gravatarDefault = user.gravatarDefault;
        }
        if ('avatarOption' in user) {
            props.avatarOption = user.avatarOption;
        }
        return <Gravatar {...props} />
    }

    render() {
        const {user} = this.props;
        return <div className="UserCard" key={user.username}>
            <Row gutter={10}>
                <Col flex="30px" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    {this.renderGravatar(user)}
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
