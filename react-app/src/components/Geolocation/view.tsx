import React from 'react';
import {
    Alert, Button, Col, Row, Tooltip
} from 'antd';
import {
    MapContainer as LeafletMap, Tooltip as LeafletTooltip, TileLayer, LayersControl,
    CircleMarker, ScaleControl
} from 'react-leaflet';
import { Sample } from '../Main/types';
import MetadataField from '../MetadataField/view';

import './style.less';
import { FieldDefinitionsMap } from '../Main/data';
import { Section } from '../Section';

export interface GeolocationViewerProps {
    sample: Sample;
    fieldDefinitions: FieldDefinitionsMap;
}

interface GeolocationViewerState {
    omitEmpty: boolean;
}

export default class GeolocationViewer extends React.Component<GeolocationViewerProps, GeolocationViewerState> {
    constructor(props: GeolocationViewerProps) {
        super(props);
        this.state = {
            omitEmpty: true
        };
    }

    renderMap() {
        const data = this.props.sample.metadata;
        const { latitude, longitude } = data;
        if (typeof latitude === 'undefined' || typeof longitude === 'undefined') {
            return <Alert type="warning" message="Both latitude and longitude must be present to display a map location" />;
        }
        if (latitude.field.value === null || longitude.field.value === null) {
            return <Alert type="warning" message="Both latitude and longitude must be present to display a map location" />;
        }
        const lat = latitude.field.value as number;
        const lng = longitude.field.value as number;
        return <div className="Geolocation-map">
            <LeafletMap
                center={[lat, lng]}
                zoom={3}
                style={{ width: '100%', height: '100%' }}>
                <ScaleControl position="topleft" />
                <LayersControl position="topright" >
                    <LayersControl.BaseLayer name="OpenStreetMap">
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                            noWrap={true}
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="OpenTopoMap">
                        <TileLayer
                            attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
                            url='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
                            noWrap={true}
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="EsriWorldImagery" checked={true}>
                        <TileLayer
                            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                            url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                            noWrap={true}
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>
                <CircleMarker center={[lat, lng]} radius={10} color="red">
                    <LeafletTooltip >
                        <div>Location</div>
                        <div>Latitude: {lat}</div>
                        <div>Longitude: {lng}</div></LeafletTooltip>
                </CircleMarker>
            </LeafletMap>
        </div>;
    }

    onToggleHideEmpty() {
        this.setState({
            omitEmpty: !this.state.omitEmpty
        });
    }

    renderFields() {
        const sample = this.props.sample;
        const metadata = sample.metadata;
        const fields = Object.values(metadata)
            .filter((field) => {
                const def = this.props.fieldDefinitions[field.key];
                return def && def.categories && def.categories.includes('geolocation');
            })
            .filter((field) => {
                if (field.field.value === null && this.state.omitEmpty) {
                    return false;
                }
                return true;
            })
            .sort((a, b) => {
                return a.label.localeCompare(b.label);
            });

        const content = fields
            .map((field) => {
                return <div key={field.key}>
                    <div><Tooltip title={`key: ${field.key}`}><span>{field.label}</span></Tooltip></div>
                    <div><MetadataField field={field} sample={this.props.sample} /></div>
                </div>;
            });

        return <div className="InfoTable -bordered ControlledMetadata Geolocation-fields">
            {content}
        </div>;
    }

    renderToolbar() {
        const label = (() => {
            if (this.state.omitEmpty) {
                return 'Show Empty Fields';
            } else {
                return 'Hide Empty Fields';
            }
        })();
        return <div>
            <Button onClick={this.onToggleHideEmpty.bind(this)}
                type="text"
                size="small">{label}</Button>
        </div>;
    }

    renderToolbarx() {
        const label = (() => {
            if (this.state.omitEmpty) {
                return 'Show Empty Fields';
            } else {
                return 'Hide Empty Fields';
            }
        })();
        return <div className="Geolocation-toolbar">
            <Button onClick={this.onToggleHideEmpty.bind(this)}>{label}</Button>
        </div>;
    }

    render() {
        return <div className="Geolocation" data-testid="metadataviewer" >
            <div className="Geolocation-body">
                <Row gutter={10}>
                    <Col span={12} flex="1 1 0px" style={{ display: 'flex', flexDirection: 'column' }}>
                        <Section title="Map">
                            {this.renderMap()}
                        </Section>
                    </Col>
                    <Col span={12}>
                        <Section title="Fields" renderToolbar={this.renderToolbar.bind(this)}>
                            {/* {this.renderToolbar()} */}
                            {this.renderFields()}
                        </Section>
                    </Col>
                </Row>
            </div>
        </div>;
    }
}
