/* istanbul ignore file */

import {ACL} from "../../lib/ViewModel/ViewModel";
import {SAMPLE_ACLS} from "./sampleService";

export const FETCH_USER_PROFILE_FOO_RESULT = {
    username: 'foo',
    realname: 'Foo',
    gravatarHash: 'x',
    gravatarDefault: 'x',
    avatarOption: 'x'
}

export const FETCH_ACL_RESULT_EMPTY: ACL = {
    admin: [],
    write: [],
    read: []
}

export const FETCH_ACL_RESULT: ACL = {
    admin: [{
        username: 'bar',
        realname: 'Bar',
        gravatarHash: 'x',
        gravatarDefault: 'x',
        avatarOption: 'x'
    }, {
        username: 'baz',
        realname: 'Baz',
        gravatarHash: 'x',
        gravatarDefault: 'x',
        avatarOption: 'x'
    }],
    write: [{
        username: 'ping',
        realname: 'Ping',
        gravatarHash: 'x',
        gravatarDefault: 'x',
        avatarOption: 'x'
    }, {
        username: 'pong',
        realname: 'Pong',
        gravatarHash: 'x',
        gravatarDefault: 'x',
        avatarOption: 'x'
    }],
    read: [{
        username: 'yin',
        realname: 'Yin',
        gravatarHash: 'x',
        gravatarDefault: 'x',
        avatarOption: 'x'
    }, {
        username: 'yang',
        realname: 'Yang',
        gravatarHash: 'x',
        gravatarDefault: 'x',
        avatarOption: 'x'
    }]
}

export async function mock_fetch_acl(body: any, request: Request) {
    const {id} = body.params[0];
    const acls = SAMPLE_ACLS[id];
    return {
        body: JSON.stringify({
            version: '1.1',
            id: 'abc',
            result: [
                acls
            ]
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };
}