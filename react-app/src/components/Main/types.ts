import { SampleId, EpochTimeMS, Username, FieldDefinition } from "../../lib/comm/dynamicServices/SampleServiceClient";

export interface MetadataField {
    value: string | number | boolean;
    units?: string;
    label: string;
    description?: string;
    isControlled: boolean;
    definition: FieldDefinition;
}

export interface UserMetadataField {
    value: string;
}

export interface Metadata {
    [key: string]: MetadataField;
}

export interface UserMetadata {
    [key: string]: UserMetadataField;
}

export interface User {
    username: Username;
    realname: string;
    gravatarHash: string;
    avatarOption?: string;
    gravatarDefault?: string;
}

export interface ACL {
    admin: Array<User>;
    write: Array<User>;
    read: Array<User>;
}


export type SampleType = 'BioReplicate' | 'TechReplicate' | 'SubSample';

export interface Sample {
    id: SampleId;
    name: string;
    created: {
        at: EpochTimeMS;
        by: User;
    };
    currentVersion: {
        at: EpochTimeMS;
        by: User;
        version: number;
    };
    latestVersion: {
        at: EpochTimeMS;
        by: User;
        version: number;
    };
    source: string;
    sourceId: string;
    sourceParentId: string | null;
    type: SampleType;
    metadata: Metadata;
    userMetadata: UserMetadata;
}