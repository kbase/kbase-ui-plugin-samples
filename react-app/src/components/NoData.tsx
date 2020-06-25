import React from 'react';

export class NoData extends React.Component<{}, {}> {
    render() {
        return <span style={{ color: 'gray' }}>-</span>;
    }
}