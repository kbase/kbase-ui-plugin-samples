import * as React from 'react';
import noUserPic from './nouserpic.png';
import { Avatar } from 'antd';

export interface GravatarProps {
    username: string;
    realname: string;
    size: number;
    avatarOption?: string;
    gravatarHash?: string;
    gravatarDefault?: string;
}

interface GravatarState {

}

export class Gravatar extends React.Component<GravatarProps, GravatarState> {
    getAvatarUrl() {
        switch (this.props.avatarOption || 'gravatar') {
            case 'gravatar':
                const gravatarDefault = this.props.gravatarDefault || 'identicon';
                const { gravatarHash, size } = this.props;
                if (gravatarHash) {
                    return `https://www.gravatar.com/avatar/${gravatarHash}?s=${size}&amp;r=pg&d=${gravatarDefault}`;
                } else {
                    return noUserPic;
                }
            case 'silhouette':
            case 'mysteryman':
            default:
                return noUserPic;
        }
    }

    render() {
        const avatarUrl = this.getAvatarUrl();
        return (
            <Avatar
                src={avatarUrl}
                style={{ width: this.props.size }}
                alt={`Avatar for ${this.props.username} aka ${this.props.realname}`}
            />
        );
    }

}

export default Gravatar;