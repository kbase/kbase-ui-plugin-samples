import React from 'react';
import {
    Alert, Col, Row
} from 'antd';
import {
    MapContainer as LeafletMap, Tooltip as LeafletTooltip, TileLayer, LayersControl,
    CircleMarker, ScaleControl
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MetadataFieldView from '../MetadataField/view';

import {MetadataField, Sample} from "../../lib/ViewModel/ViewModel";
import {InfoTable, Section} from "@kbase/ui-components";
import {Span} from 'lib/instrumentation/core';
import {FieldGroup} from "../../lib/client/SampleServiceClient";

import './style.less';

// Advised as the max zoom supported by most tiles:
// https://leafletjs.com/examples/zoom-levels/
export const DEFAULT_ZOOM = 18;

export interface GeolocationViewerProps {
    sample: Sample;
    group: FieldGroup;
}

interface GeolocationViewerState {
}

export default class GeolocationViewer extends React.Component<GeolocationViewerProps, GeolocationViewerState> {
    span: Span;

    constructor(props: GeolocationViewerProps) {
        super(props);
        this.span = new Span({name: 'Components.GeoLocation'}).begin();
    }

    componentWillUnmount() {
        this.span.end();
    }

    renderTooltip(sample: Sample) {
        const {latitude, longitude} = this.props.sample.controlled;
        return <div className="MapPopUp">
            <div style={{whiteSpace: 'nowrap'}}>
                <table>
                    <tbody>
                    <tr>
                        <th>Lat</th>
                        <td>
                            <MetadataFieldView field={latitude} sample={sample}/>
                        </td>
                    </tr>
                    <tr>
                        <th>Long</th>
                        <td>
                            <MetadataFieldView field={longitude} sample={sample}/>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    }

    renderMap() {
        const {latitude, longitude} = this.props.sample.controlled;

        // We don't know if they exist...
        if (typeof latitude === 'undefined' || typeof longitude === 'undefined') {
            return <Alert type="warning"
                          message="Both latitude and longitude must be present to display a map location"/>;
        }

        // Trap "impossible" conditions, which should never appear in real usage if samples adhere
        // to the schema... but we need to do this runtime introspection due to the generic nature
        // of sample metadata.

        // And we don't know if they are the proper type of field...
        if (latitude.field.type !== 'number') {
            return <Alert type="error" message="latitude must be numeric field"/>;
        }

        if (longitude.field.type !== 'number') {
            return <Alert type="error" message="longitude must be numeric field"/>;
        }

        if (latitude.field.numberValue === null || longitude.field.numberValue === null) {
            return <Alert type="warning"
                          message="Both latitude and longitude must be present to display a map location"/>;
        }

        const lat = latitude.field.numberValue;
        const lng = longitude.field.numberValue;

        return <div className="Geolocation-map">
            <LeafletMap
                center={[lat, lng]}
                zoom={DEFAULT_ZOOM}
                preferCanvas={true}
                style={{flex: '1 1 0px'}}>
                <ScaleControl position="topleft"/>
                <LayersControl position="topright">
                    <LayersControl.BaseLayer name="OpenStreetMap">
                        <TileLayer
                            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
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
                    <LeafletTooltip>
                        {this.renderTooltip(this.props.sample)}
                    </LeafletTooltip>
                </CircleMarker>
            </LeafletMap>
        </div>;
    }

    renderFields() {
        const sample = this.props.sample;

        const metadata = sample.metadata.reduce((metadata, field) => {
            metadata[field.key] = field;
            return metadata;
        }, {} as { [key: string]: MetadataField })

        const fields = this.props.group.fields.map((fieldName) => {
            return metadata[fieldName];
        })
            .filter((field) => {
                return !!field;
            })

        const table = fields
            .map((field) => {
                return {
                    label: field.label,
                    labelTooltip: `key: ${field.key}`,
                    render: () => {
                        return <MetadataFieldView field={field} sample={this.props.sample}/>;
                    }
                };
            });

        return <InfoTable table={table}/>;
    }

    render() {
        return <div className="Geolocation" data-testid="geolocation-view">
            <div className="Geolocation-body">
                <Row gutter={10} style={{flex: '1 1 0'}}>
                    <Col span={12} flex="1 1 0px" style={{display: 'flex', flexDirection: 'column'}}>
                        <Section title="Map">
                            {this.renderMap()}
                        </Section>
                    </Col>
                    <Col span={12} style={{display: 'flex'}}>
                        <Section title="Fields">
                            {this.renderFields()}
                        </Section>
                    </Col>
                </Row>
            </div>
        </div>;
    }
}
