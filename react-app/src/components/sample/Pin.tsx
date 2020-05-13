import React from 'react';
import { PushpinOutlined } from '@ant-design/icons';

export interface PinProps {
    lat: number;
    lng: number;
    text: string;
}

interface PinState {

}

export default class Pin extends React.Component<PinProps, PinState> {
    render() {
        return <PushpinOutlined style={{ color: 'red' }} />;
    }
}