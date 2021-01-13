import React from 'react';
import {
    Alert, Button, Tooltip
} from 'antd';
import {
    MapContainer as LeafletMap, Tooltip as LeafletTooltip, TileLayer, LayersControl,
    CircleMarker, ScaleControl
} from 'react-leaflet';
import { Sample } from '../Main/types';
import {
    Metadata
} from '../../lib/Model';
import MetadataField from '../MetadataField/view';
// import { Format } from 'lib/client/SampleServiceClient';

import './style.less';
import { FieldGroup } from 'lib/client/samples/Samples';

export interface MetadataViewerProps {
    sample: Sample;
    fieldGroups: Array<FieldGroup>;
    // format: Format;
    // template: Template;
    // layout: GroupingLayout;
    // fields: FieldDefinitionsMap;
}

interface MetadataViewerState {
    omitEmpty: boolean;
}

export default class MetadataViewer extends React.Component<MetadataViewerProps, MetadataViewerState> {
    constructor(props: MetadataViewerProps) {
        super(props);
        this.state = {
            omitEmpty: true
        };
    }
    renderGeolocation(data: Metadata) {
        const { latitude, longitude } = data;
        if (typeof latitude === 'undefined' || typeof longitude === 'undefined') {
            return <Alert type="warning" message="Both latitude and longitude must be present to display a map location" />;
        }
        if (latitude.field.value === null || longitude.field.value === null) {
            return <Alert type="warning" message="Both latitude and longitude must be present to display a map location" />;
        }
        const lat = latitude.field.value as number;
        const lng = longitude.field.value as number;
        return <div style={{ height: '400px' }}>
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

    /*
    */
    renderControlledMetadataGroupExtras(data: Metadata, group: FieldGroup) {
        switch (group.name) {
            case 'geolocation':
                return this.renderGeolocation(data);
        }
    }

    renderControlledMetadataGrouped() {
        const sample = this.props.sample;
        const metadata = sample.metadata;
        const rows = Array.from(this.props.fieldGroups.entries()).map(([name, group]) => {
            const fields = group.fields.map((fieldName) => {
                const field = this.props.sample.metadata[fieldName];
                if (!field) {
                    console.warn('Field not found in grouped: ' + fieldName, group);
                    return null;
                }
                // <div><MetadataField value={field.value} fieldKey={field.key} unit={field.units} fields={this.props.sample.metadata} /></div>
                return <div key={field.key}>
                    <div><Tooltip title={`key: ${field.key}`}><span>{field.label}</span></Tooltip></div>
                    <div><MetadataField field={field} sample={this.props.sample} /></div>
                </div>;

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

    renderGrouped() {
        const sample = this.props.sample;
        const metadata = sample.metadata;
        return this.props.fieldGroups.map((group) => {
            const fields = group.fields
                .map((fieldName) => {
                    return this.props.sample.metadata[fieldName];
                })
                .filter((field) => {
                    if (!field) {
                        return false;
                    }
                    if (field.field.value === null && this.state.omitEmpty) {
                        return false;
                    }
                    return true;
                })
                .map((field) => {
                    return <div key={field.key}>
                        <div><Tooltip title={`key: ${field.key}`}><span>{field.label}</span></Tooltip></div>
                        <div><MetadataField field={field} sample={sample} /></div>
                    </div>;

                });

            let content;
            if (fields.length) {
                content = <div className="InfoTable -bordered ControlledMetadata">
                    {fields}
                </div>;
            } else {
                content = <div style={{ fontStyle: 'italic' }}>No data</div>;
            }
            return <div className="DataGroup" key={group.name}>
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
    }

    // onChangeHideEmpty(ev: CheckboxChangeEvent) {
    //     const omitEmpty = ev.target.checked;
    //     this.setState({
    //         omitEmpty
    //     });
    // }
    // renderToolbar2() {
    //     return <div className="Metadata-toolbar">
    //         <Checkbox onChange={this.onChangeHideEmpty.bind(this)} checked={this.state.omitEmpty}>Hide Empty Fields</Checkbox>
    //     </div>;
    // }

    onToggleHideEmpty() {
        this.setState({
            omitEmpty: !this.state.omitEmpty
        });
    }

    renderToolbar() {
        const label = (() => {
            if (this.state.omitEmpty) {
                return 'Show Empty Fields';
            } else {
                return 'Hide Empty Fields';
            }
        })();
        return <div className="Metadata-toolbar">
            <Button onClick={this.onToggleHideEmpty.bind(this)}>{label}</Button>
        </div>;
    }



    render() {
        return <div className="Metadata" data-testid="metadataviewer" >
            {this.renderToolbar()}
            <div className="Metadata-body">
                <div className="Metadata-content-wrapper">
                    {this.renderGrouped()}
                </div>
            </div>
        </div>;
    }
}
