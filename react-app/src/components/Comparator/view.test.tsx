
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Comparator, { ComparatorProps } from './view';

const TIMEOUT = 10000;

const propsEmpty: ComparatorProps = {
    diffStatus: [],
    comparison: {
        fields: [],
        compare1: null,
        compare2: null
    }
};

const propsSimple: ComparatorProps = {
    diffStatus: ['diff', 'nodiff'],
    comparison: {
        fields: [{
            key: 'foo',
            label: 'Foo',
            type: 'string'

        }, {
            key: 'bar',
            label: 'Bar',
            type: 'string'

        }],
        compare1: {
            foo: 'fooey',
            bar: 'barry'
        },
        compare2: {
            foo: 'fooey',
            bar: 'barrish'
        }
    }
};

const propsJustDiff: ComparatorProps = {
    diffStatus: ['diff'],
    comparison: {
        fields: [{
            key: 'foo',
            label: 'Foo',
            type: 'string'

        }, {
            key: 'bar',
            label: 'Bar',
            type: 'string'

        }],
        compare1: {
            foo: 'fooey',
            bar: 'barry'
        },
        compare2: {
            foo: 'fooey',
            bar: 'barrish'
        }
    }
};

const propsJustNodiff: ComparatorProps = {
    diffStatus: ['nodiff'],
    comparison: {
        fields: [{
            key: 'foo',
            label: 'Foo',
            type: 'string'

        }, {
            key: 'bar',
            label: 'Bar',
            type: 'string'

        }],
        compare1: {
            foo: 'fooey',
            bar: 'barry'
        },
        compare2: {
            foo: 'fooey',
            bar: 'barrish'
        }
    }
};

const propsMissingFieldCompare1: ComparatorProps = {
    diffStatus: ['diff', 'nodiff'],
    comparison: {
        fields: [{
            key: 'foo',
            label: 'Foo',
            type: 'string'

        }, {
            key: 'bar',
            label: 'Bar',
            type: 'string'

        }],
        compare1: {
            foo: 'fooey'
        },
        compare2: {
            foo: 'fooey',
            bar: 'barrish'
        }
    }
};

const propsMissingFieldCompare2: ComparatorProps = {
    diffStatus: ['diff', 'nodiff'],
    comparison: {
        fields: [{
            key: 'foo',
            label: 'Foo',
            type: 'string'

        }, {
            key: 'bar',
            label: 'Bar',
            type: 'string'

        }],
        compare1: {
            foo: 'fooey',
            bar: 'barry'
        },
        compare2: {
            foo: 'fooey'
        }
    }
};

const propsMissingCompare1: ComparatorProps = {
    diffStatus: ['diff', 'nodiff'],
    comparison: {
        fields: [{
            key: 'foo',
            label: 'Foo',
            type: 'string'

        }, {
            key: 'bar',
            label: 'Bar',
            type: 'string'

        }],
        compare1: null,
        compare2: {
            foo: 'fooey',
            bar: 'barrish'
        }
    }
};

const propsMissingCompare2: ComparatorProps = {
    diffStatus: ['diff', 'nodiff'],
    comparison: {
        fields: [{
            key: 'foo',
            label: 'Foo',
            type: 'string'

        }, {
            key: 'bar',
            label: 'Bar',
            type: 'string'

        }],
        compare1: {
            foo: 'fooey',
            bar: 'barry'
        },
        compare2: null
    }
};

const propsMissingCompare1Compare2: ComparatorProps = {
    diffStatus: ['diff', 'nodiff'],
    comparison: {
        fields: [{
            key: 'foo',
            label: 'Foo',
            type: 'string'

        }, {
            key: 'bar',
            label: 'Bar',
            type: 'string'

        }],
        compare1: null,
        compare2: null
    }
};

const propsMissingCompare1Compare2DiffOnly: ComparatorProps = {
    diffStatus: ['diff'],
    comparison: {
        fields: [{
            key: 'foo',
            label: 'Foo',
            type: 'string'

        }, {
            key: 'bar',
            label: 'Bar',
            type: 'string'

        }],
        compare1: null,
        compare2: null
    }
};

test('renders the view, but does nothing special.', async () => {
    const { getByText } = render(<Comparator {...propsEmpty} />);

    await waitFor(() => {
        // These are column labels

        const diffTitle = getByText('Field');
        expect(diffTitle).toBeInTheDocument();

        const historyTitle = getByText('Diff');
        expect(historyTitle).toBeInTheDocument();

        const firstSample = getByText('First Sample');
        expect(firstSample).toBeInTheDocument();

        const secondSample = getByText('Second Sample');
        expect(secondSample).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});

test('renders diffing correctly for simple data', async () => {
    const { getByText } = render(<Comparator {...propsSimple} />);

    await waitFor(() => {
        // These are column labels

        const diffTitle = getByText('Field');
        expect(diffTitle).toBeInTheDocument();

        const historyTitle = getByText('Diff');
        expect(historyTitle).toBeInTheDocument();

        const firstSample = getByText('First Sample');
        expect(firstSample).toBeInTheDocument();

        const secondSample = getByText('Second Sample');
        expect(secondSample).toBeInTheDocument();

        // Now the rows ... not sure yet now to assert that they are a given row
        // in the table...
        const fooFieldLabel = getByText('Foo');
        expect(fooFieldLabel).toBeInTheDocument();

        const barFieldLabel = getByText('Bar');
        expect(barFieldLabel).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});

test('renders diffing correctly for simple data with missing fields in compare 1', async () => {
    const { getByText } = render(<Comparator {...propsMissingFieldCompare1} />);

    await waitFor(() => {
        // These are column labels

        const diffTitle = getByText('Field');
        expect(diffTitle).toBeInTheDocument();

        const historyTitle = getByText('Diff');
        expect(historyTitle).toBeInTheDocument();

        const firstSample = getByText('First Sample');
        expect(firstSample).toBeInTheDocument();

        const secondSample = getByText('Second Sample');
        expect(secondSample).toBeInTheDocument();

        // Now the rows ... not sure yet now to assert that they are a given row
        // in the table...
        const fooFieldLabel = getByText('Foo');
        expect(fooFieldLabel).toBeInTheDocument();

        const barFieldLabel = getByText('Bar');
        expect(barFieldLabel).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});

test('renders diffing correctly for simple data with missing fields in compare 2', async () => {
    const { getByText } = render(<Comparator {...propsMissingFieldCompare2} />);

    await waitFor(() => {
        // These are column labels

        const diffTitle = getByText('Field');
        expect(diffTitle).toBeInTheDocument();

        const historyTitle = getByText('Diff');
        expect(historyTitle).toBeInTheDocument();

        const firstSample = getByText('First Sample');
        expect(firstSample).toBeInTheDocument();

        const secondSample = getByText('Second Sample');
        expect(secondSample).toBeInTheDocument();

        // Now the rows ... not sure yet now to assert that they are a given row
        // in the table...
        const fooFieldLabel = getByText('Foo');
        expect(fooFieldLabel).toBeInTheDocument();

        const barFieldLabel = getByText('Bar');
        expect(barFieldLabel).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});

test('renders diffing correctly for simple data with missing compare 1', async () => {
    const { getByText } = render(<Comparator {...propsMissingCompare1} />);

    await waitFor(() => {
        // These are column labels

        const diffTitle = getByText('Field');
        expect(diffTitle).toBeInTheDocument();

        const historyTitle = getByText('Diff');
        expect(historyTitle).toBeInTheDocument();

        const firstSample = getByText('First Sample');
        expect(firstSample).toBeInTheDocument();

        const secondSample = getByText('Second Sample');
        expect(secondSample).toBeInTheDocument();

        // Now the rows ... not sure yet now to assert that they are a given row
        // in the table...
        const fooFieldLabel = getByText('Foo');
        expect(fooFieldLabel).toBeInTheDocument();

        const barFieldLabel = getByText('Bar');
        expect(barFieldLabel).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});

test('renders diffing correctly for simple data with missing compare 2', async () => {
    const { getByText } = render(<Comparator {...propsMissingCompare2} />);

    await waitFor(() => {
        // These are column labels

        const diffTitle = getByText('Field');
        expect(diffTitle).toBeInTheDocument();

        const historyTitle = getByText('Diff');
        expect(historyTitle).toBeInTheDocument();

        const firstSample = getByText('First Sample');
        expect(firstSample).toBeInTheDocument();

        const secondSample = getByText('Second Sample');
        expect(secondSample).toBeInTheDocument();

        // Now the rows ... not sure yet now to assert that they are a given row
        // in the table...
        const fooFieldLabel = getByText('Foo');
        expect(fooFieldLabel).toBeInTheDocument();

        const barFieldLabel = getByText('Bar');
        expect(barFieldLabel).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});

test('renders diffing correctly for simple data with missing compare1 and compare 2', async () => {
    const { queryByText } = render(<Comparator {...propsMissingCompare1Compare2} />);

    await waitFor(() => {
        // These are column labels

        const diffTitle = queryByText('Field');
        expect(diffTitle).toBeInTheDocument();

        const historyTitle = queryByText('Diff');
        expect(historyTitle).toBeInTheDocument();

        const firstSample = queryByText('First Sample');
        expect(firstSample).toBeInTheDocument();

        const secondSample = queryByText('Second Sample');
        expect(secondSample).toBeInTheDocument();

        // Now the rows ... not sure yet now to assert that they are a given row
        // in the table...
        const fooFieldLabel = queryByText('Foo');
        expect(fooFieldLabel).toBeInTheDocument();

        const barFieldLabel = queryByText('Bar');
        expect(barFieldLabel).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});

test('renders no diffing for simple data with missing compare1 and compare 2 and only diff', async () => {
    const { queryByText } = render(<Comparator {...propsMissingCompare1Compare2DiffOnly} />);

    await waitFor(() => {
        // These are column labels

        const diffTitle = queryByText('Field');
        expect(diffTitle).toBeInTheDocument();

        const historyTitle = queryByText('Diff');
        expect(historyTitle).toBeInTheDocument();

        const firstSample = queryByText('First Sample');
        expect(firstSample).toBeInTheDocument();

        const secondSample = queryByText('Second Sample');
        expect(secondSample).toBeInTheDocument();

        // Now the rows ... not sure yet now to assert that they are a given row
        // in the table...
        const fooFieldLabel = queryByText('Foo');
        expect(fooFieldLabel).toBeNull();

        const barFieldLabel = queryByText('Bar');
        expect(barFieldLabel).toBeNull();
    }, {
        timeout: TIMEOUT
    });
});

test('shows correct rows when diff only selected', async () => {
    const { getByText, queryByText } = render(<Comparator {...propsJustDiff} />);

    await waitFor(() => {
        // These are column labels

        const diffTitle = getByText('Field');
        expect(diffTitle).toBeInTheDocument();

        const historyTitle = getByText('Diff');
        expect(historyTitle).toBeInTheDocument();

        const firstSample = getByText('First Sample');
        expect(firstSample).toBeInTheDocument();

        const secondSample = getByText('Second Sample');
        expect(secondSample).toBeInTheDocument();

        // Foo should not show...
        const fooFieldLabel = queryByText('Foo');
        expect(fooFieldLabel).toBeNull();

        // ...but Bar should.
        const barFieldLabel = getByText('Bar');
        expect(barFieldLabel).toBeInTheDocument();
    }, {
        timeout: TIMEOUT
    });
});

test('shows correct rows when nodiff only selected', async () => {
    const { getByText, queryByText } = render(<Comparator {...propsJustNodiff} />);

    await waitFor(() => {
        // These are column labels

        const diffTitle = getByText('Field');
        expect(diffTitle).toBeInTheDocument();

        const historyTitle = getByText('Diff');
        expect(historyTitle).toBeInTheDocument();

        const firstSample = getByText('First Sample');
        expect(firstSample).toBeInTheDocument();

        const secondSample = getByText('Second Sample');
        expect(secondSample).toBeInTheDocument();

        // Now the rows ... not sure yet now to assert that they are a given row
        // in the table...

        // Foo should show...
        const fooFieldLabel = queryByText('Foo');
        expect(fooFieldLabel).toBeInTheDocument();

        // ...but not Bar.
        const barFieldLabel = queryByText('Bar');
        expect(barFieldLabel).toBeNull();
    }, {
        timeout: TIMEOUT
    });
});
