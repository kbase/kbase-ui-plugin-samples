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
                department: 'x',
                state: 'x',
                affiliations: [],
                postalCode: '',
                researchInterests: [],
                researchInterestsOther: null,
                researchStatement: 'x',
                fundingSource: 'x'
            },
            metadata: {
                created: '',
                createdBy: ''
            },
            plugins: {},
            preferences: {}
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
                department: 'x',
                state: 'x',
                affiliations: [],
                postalCode: '',
                researchInterests: [],
                researchInterestsOther: null,
                researchStatement: 'x',
                fundingSource: 'x'
            },
            metadata: {
                created: '',
                createdBy: ''
            },
            plugins: {},
            preferences: {}
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
                department: 'x',
                state: 'x',
                affiliations: [],
                postalCode: '',
                researchInterests: [],
                researchInterestsOther: null,
                researchStatement: 'x',
                fundingSource: 'x'
            },
            metadata: {
                created: '',
                createdBy: ''
            },
            plugins: {},
            preferences: {}
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
                department: 'x',
                state: 'x',
                affiliations: [],
                postalCode: '',
                researchInterests: [],
                researchInterestsOther: null,
                researchStatement: 'x',
                fundingSource: 'x'
            },
            metadata: {
                created: '',
                createdBy: ''
            },
            plugins: {},
            preferences: {}
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
                department: 'x',
                state: 'x',
                affiliations: [],
                postalCode: '',
                researchInterests: [],
                researchInterestsOther: null,
                researchStatement: 'x',
                fundingSource: 'x'
            },
            metadata: {
                created: '',
                createdBy: ''
            },
            plugins: {},
            preferences: {}
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
                department: 'x',
                state: 'x',
                affiliations: [],
                postalCode: '',
                researchInterests: [],
                researchInterestsOther: null,
                researchStatement: 'x',
                fundingSource: 'x'
            },
            metadata: {
                created: '',
                createdBy: ''
            },
            plugins: {},
            preferences: {}
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
                department: 'x',
                state: 'x',
                affiliations: [],
                postalCode: '',
                researchInterests: [],
                researchInterestsOther: null,
                researchStatement: 'x',
                fundingSource: 'x'
            },
            metadata: {
                created: '',
                createdBy: ''
            },
            plugins: {},
            preferences: {}
        }
    },
    eapearson: {
        user: {
            username: 'eapearson',
            realname: 'Erik Pearson'
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
                department: 'x',
                state: 'x',
                affiliations: [],
                postalCode: '',
                researchInterests: [],
                researchInterestsOther: null,
                researchStatement: 'x',
                fundingSource: 'x'
            },
            metadata: {
                created: '',
                createdBy: ''
            },
            plugins: {},
            preferences: {}
        }
    },
    kbaseuitest: {
        "user": {
            "username": "kbaseuitest",
            "realname": "KBase UI Test User"
        },
        "profile": {
            "metadata": {
                "createdBy": "userprofile_ui_service",
                "created": "2020-01-06T21:48:12.352Z"
            },
            "preferences": {},
            "userdata": {
                "organization": "",
                "department": "",
                "affiliations": [
                    {
                        "title": "tester",
                        "organization": "kbase / lbnl",
                        "started": 2020,
                        "ended": 2020
                    }
                ],
                "city": "",
                "state": "California",
                "postalCode": "",
                "country": "",
                "researchStatement": "Test user account for ui integration tests.\n\nPlease don't modify the profile.\n\nThis **can** be markdown, but who would know?",
                "gravatarDefault": "monsterid",
                "avatarOption": "gravatar",
                "researchInterests": [
                    "Comparative Genomics",
                    "Genome Annotation",
                    "Metabolic Modeling",
                    "Read Processing",
                    "Sequence Analysis"
                ],
                "researchInterestsOther": null,
                "jobTitleOther": "My job",
                "jobTitle": "Other",
                "fundingSource": ""
            },
            "synced": {
                "gravatarHash": "b4d95f8595104614355e6ee9c4c03e3f"
            },
            "plugins": {
                "data-search": {
                    "settings": {
                        "history": {
                            "search": {
                                "history": [
                                    "orientalis",
                                    "sphaeroides",
                                    "abcde12345",
                                    "marinus",
                                    "Prochlorococcus marinus str. GP2",
                                    "coli",
                                    "query-compost_hq_bins_blastp_output.Seq",
                                    "SequenceSet",
                                    "compost_hq_bins_blastp_output",
                                    "query"
                                ],
                                "time": {
                                    "$numberLong": "1621870065420"
                                }
                            }
                        }
                    }
                },
                "jgi-search": {
                    "settings": {
                        "history": {
                            "search": {
                                "history": [
                                    "coli"
                                ],
                                "time": {
                                    "$numberLong": "1582608583358"
                                }
                            }
                        },
                        "jgiDataTerms": {
                            "agreed": true,
                            "time": {
                                "$numberLong": "1580251462454"
                            }
                        }
                    }
                },
                "public-search": {
                    "settings": {
                        "history": {
                            "history": [
                                "Acetobacter orientalis",
                                "orientalis",
                                "prochlorococcus marinus",
                                "AnnotatedGenomeAssembly",
                                "prochlorococcus marnius",
                                "Prochlorococcus marinus str. GP2",
                                "AnnotatedMetagenomeAssembly",
                                "coli",
                                "prochlorococcus unconfirmed",
                                "prochlorococcus"
                            ],
                            "time": {
                                "$numberLong": "1621870105498"
                            }
                        }
                    }
                }
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
