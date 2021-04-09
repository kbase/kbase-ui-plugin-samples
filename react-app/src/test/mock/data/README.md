This directory contains a full set of data objects for all lower level api tests.

In other words, this data forms a small system of kbase data which may be used as the basis for all api tests through
mocking.

Since this data is for "mocking", it represents the output of service apis, not the internal data structures of said
systems.

SampleService:

- sample
- sample acl
- sample linked objects

UserProfiles

- user profile

## Getting Data

All data is based on real objects. Some variants may be generated from those real objects, or the core object may be
manipulated within a test to generate different conditions.

Ideally we have a script to populate the test directory, but this may not be necessary since this will seldom need to be
done once the data is populated.

We should have support scripts to verify the data, and to ensure that the data covers enough (all?) data cases. E.g. we
should be able to test each sample field type, links to different data types, viewing a sample as a user with each
role (owner, admin, editor, viewer, no access), etc.

## Sample Service

These are the heart of the system. All other mock data derives from the root of a sample. The samples are derived from
actual data

### Samples

We need

## TODO:

scripts to:
fetch N samples fetch acls for N samples fetch gather all users in samples and fetch profiles for them