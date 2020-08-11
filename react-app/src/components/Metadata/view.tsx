import React from 'react';
import {
    Alert, Tooltip
} from 'antd';

import { Map as LeafletMap, Marker, Popup, TileLayer, LayersControl, FeatureGroup, Circle } from 'react-leaflet';

import Leaflet from 'leaflet';
import { PushpinFilled } from '@ant-design/icons';
import ReactDOMServer from 'react-dom/server';

import { Sample, Metadata } from '../Main/types';
import {
    Template, GroupingLayout, FieldDefinitionsMap, FieldLayout
} from '../../lib/Model';

import './style.less';

export interface MetadataViewerProps {
    sample: Sample;
    template: Template;
    layout: GroupingLayout;
    fields: FieldDefinitionsMap;
}

interface MetadataViewerState {
}

export default class MetadataViewer extends React.Component<MetadataViewerProps, MetadataViewerState> {
    renderGeolocation(data: Metadata) {
        const { latitude, longitude } = data;
        if (typeof latitude === 'undefined' || typeof longitude === 'undefined') {
            return <Alert type="warning" message="Both latitude and longitude must be present to display a map location" />;
        }
        const lat = latitude.value as number;
        const lng = longitude.value as number;
        const componentString = ReactDOMServer.renderToString(<PushpinFilled />);
        const icon = Leaflet.divIcon({
            html: componentString,
            className: 'map-marker',
            iconSize: Leaflet.point(20, 20),
            tooltipAnchor: Leaflet.point(0, 10)
        });
        return <div style={{ height: '400px' }}>
            <LeafletMap
                center={[lat, lng]}
                zoom={3}
                style={{ width: '100%', height: '100%' }}>
                <LayersControl position="topright" >
                    <LayersControl.BaseLayer name="OpenStreetMap">
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="OpenTopoMap">
                        <TileLayer
                            attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
                            url='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="EsriWorldImagery" checked={true}>
                        <TileLayer
                            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                            url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>
                <Marker position={[lat, lng]} icon={icon}>
                    <Popup>
                        <div>Location</div>
                        <div>Latitude: {lat}</div>
                        <div>Longitude: {lng}</div></Popup>
                </Marker>
            </LeafletMap>
        </div>;
    }

    renderControlledMetadataGroupExtras(data: Metadata, group: FieldLayout) {
        switch (group.key) {
            case 'geolocation':
                return this.renderGeolocation(data);
        }
    }

    renderControlledMetadataAlpha() {
        const sample = this.props.sample;
        const metadata = Object.entries(sample.metadata);
        if (metadata.length === 0) {
            return <div style={{ fontStyle: 'italic' }}>Sorry, no user metadata</div>;
        }
        const rows = Array.from(metadata)
            .sort(([akey,], [bkey,]) => {
                return akey.localeCompare(bkey);
            })
            .map(([key, value]) => {
                return <div key={key}>
                    <div><Tooltip title={`key: ${key}`}><span>{value.label}</span></Tooltip></div>
                    <div>{value.value} <i>{value.units}</i></div>
                </div>;
            });
        return <div className="InfoTable -bordered ControlledMetadata">
            {rows}
        </div>;
    }

    renderControlledMetadataGrouped() {
        const sample = this.props.sample;
        const metadata = sample.metadata;

        const rows = this.props.layout.layout.map((group) => {
            const fields = group.layout.map((fieldName) => {
                const field = this.props.fields[fieldName];
                if (!field) {
                    console.warn('Field not found: ' + fieldName);
                    return null;
                }
                if (field.key in metadata) {
                    const value = metadata[field.key];
                    return <div key={field.key}>
                        <div><Tooltip title={`key: ${field.key}`}><span>{value.label}</span></Tooltip></div>
                        <div>{value.value} <i>{value.units}</i></div>
                    </div>;
                } else {
                    return null;
                }
            })
                .filter((row) => {
                    return row ? true : false;
                });

            let content;
            if (fields.length) {
                content = <div className="InfoTable -bordered ControlledMetadata">
                    {fields}
                </div>;
            } else {
                content = <div style={{ fontStyle: 'italic' }}>No data</div>;
            }
            return <div className="DataGroup">
                <div className="-title">
                    {group.label}
                </div>
                <div className="-body">
                    {content}
                    <div className="-extras">
                        {this.renderControlledMetadataGroupExtras(metadata, group)}
                    </div>
                </div>
            </div>;
        });

        return <div>
            {rows}
        </div>;
    }

    render() {
        const sample = this.props.sample;
        const metadata = sample.metadata;

        const rows = this.props.layout.layout.map((group) => {
            const fields = group.layout.map((fieldName) => {
                const field = this.props.fields[fieldName];
                if (!field) {
                    console.warn('Field not found: ' + fieldName);
                    return null;
                }
                if (field.key in metadata) {
                    const value = metadata[field.key];
                    return <div key={field.key}>
                        <div><Tooltip title={`key: ${field.key}`}><span>{value.label}</span></Tooltip></div>
                        <div>{value.value} <i>{value.units}</i></div>
                    </div>;
                } else {
                    return null;
                }
            })
                .filter((row) => {
                    return row ? true : false;
                });

            let content;
            if (fields.length) {
                content = <div className="InfoTable -bordered ControlledMetadata">
                    {fields}
                </div>;
            } else {
                content = <div style={{ fontStyle: 'italic' }}>No data</div>;
            }
            return <div className="DataGroup" key={group.key}>
                <div className="-title">
                    {group.label}
                </div>
                <div className="-body">
                    {content}
                    <div className="-extras">
                        {this.renderControlledMetadataGroupExtras(metadata, group)}
                    </div>
                </div>
            </div>;
        });

        return <div className="Metadata" data-testid="metadataviewer">
            <div>
                {rows}
            </div>
        </div>;
    }
}