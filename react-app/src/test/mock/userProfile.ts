/* istanbul ignore file */

import {
    GetUserProfileParams, GetUserProfileResult, UserProfile
} from "@kbase/ui-lib/lib/comm/coreServices/UserProfile";

export const TEST_USER_PROFILES: { [username: string]: UserProfile } = {
    foo: {
        user: {
            username: 'foo',
            realname: 'Foo'
        },
        profile: {
            synced: {
                gravatarHash: 'x'
            },
            userdata: {
                gravatarDefault: 'x',
                avatarOption: 'x',
                city: 'x',
                country: 'x',
                jobTitle: 'x',
                jobTitleOther: 'x',
                organization: 'x',
                state: 'x'
            },
            metadata: {
                created: '',
                createdBy: ''
            }
        }
    },
    bar: {
        user: {
            username: 'bar',
            realname: 'Bar'
        },
        profile: {
            synced: {
                gravatarHash: 'x'
            },
            userdata: {
                gravatarDefault: 'x',
                avatarOption: 'x',
                city: 'x',
                country: 'x',
                jobTitle: 'x',
                jobTitleOther: 'x',
                organization: 'x',
                state: 'x'
            },
            metadata: {
                created: '',
                createdBy: ''
            }
        }
    },
    baz: {
        user: {
            username: 'baz',
            realname: 'Baz'
        },
        profile: {
            synced: {
                gravatarHash: 'x'
            },
            userdata: {
                gravatarDefault: 'x',
                avatarOption: 'x',
                city: 'x',
                country: 'x',
                jobTitle: 'x',
                jobTitleOther: 'x',
                organization: 'x',
                state: 'x'
            },
            metadata: {
                created: '',
                createdBy: ''
            }
        }
    },
    ping: {
        user: {
            username: 'ping',
            realname: 'Ping'
        },
        profile: {
            synced: {
                gravatarHash: 'x'
            },
            userdata: {
                gravatarDefault: 'x',
                avatarOption: 'x',
                city: 'x',
                country: 'x',
                jobTitle: 'x',
                jobTitleOther: 'x',
                organization: 'x',
                state: 'x'
            },
            metadata: {
                created: '',
                createdBy: ''
            }
        }
    },
    pong: {
        user: {
            username: 'pong',
            realname: 'Pong'
        },
        profile: {
            synced: {
                gravatarHash: 'x'
            },
            userdata: {
                gravatarDefault: 'x',
                avatarOption: 'x',
                city: 'x',
                country: 'x',
                jobTitle: 'x',
                jobTitleOther: 'x',
                organization: 'x',
                state: 'x'
            },
            metadata: {
                created: '',
                createdBy: ''
            }
        }
    },
    yin: {
        user: {
            username: 'yin',
            realname: 'Yin'
        },
        profile: {
            synced: {
                gravatarHash: 'x'
            },
            userdata: {
                gravatarDefault: 'x',
                avatarOption: 'x',
                city: 'x',
                country: 'x',
                jobTitle: 'x',
                jobTitleOther: 'x',
                organization: 'x',
                state: 'x'
            },
            metadata: {
                created: '',
                createdBy: ''
            }
        }
    },
    yang: {
        user: {
            username: 'yang',
            realname: 'Yang'
        },
        profile: {
            synced: {
                gravatarHash: 'x'
            },
            userdata: {
                gravatarDefault: 'x',
                avatarOption: 'x',
                city: 'x',
                country: 'x',
                jobTitle: 'x',
                jobTitleOther: 'x',
                organization: 'x',
                state: 'x'
            },
            metadata: {
                created: '',
                createdBy: ''
            }
        }
    }
};

export const FETCH_USER_PROFILE_FOO_RESULT = {
    username: 'foo',
    realname: 'Foo',
    gravatarHash: 'x',
    gravatarDefault: 'x',
    avatarOption: 'x'
}

export async function mock_get_user_profile(body: any, request: Request) {
    const usernames: GetUserProfileParams = body['params'][0];
    const result: GetUserProfileResult = Object.entries(TEST_USER_PROFILES)
        .filter(([username,]) => {
            return usernames.includes(username);
        })
        .map(([, profile]) => {
            return profile;
        });
    return {
        body: JSON.stringify({
            version: '1.1',
            id: 'abc',
            result: [
                result
            ]
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };
}
