import React from 'react';
import {
    Alert, Tooltip
} from 'antd';

import { Map as LeafletMap, Marker, Popup, TileLayer } from 'react-leaflet';

import L from 'leaflet';
import { PushpinFilled } from '@ant-design/icons';
import ReactDOMServer from 'react-dom/server';
import { MetadataField, Sample, Metadata } from '../sample/data';

import './style.less';

export interface FieldFormatBase {

}

export interface FloatFieldFormat extends FieldFormatBase {
    precision?: number;
    showThousandsSeparator?: boolean;
}

export interface IntegerFieldFormat extends FieldFormatBase {
    showThousandsSeparator?: boolean;
}

export interface StringFieldFormat extends FieldFormatBase {
}

export interface DateFieldFormat extends FieldFormatBase {
}

export type FieldFormat = FloatFieldFormat | IntegerFieldFormat | StringFieldFormat | DateFieldFormat;

export type FieldType = 'integer' | 'float' | 'string' | 'date';

export interface LayoutFieldBase {
    type: FieldType;
    key: string;
    description?: string;
    units?: Array<string>;
}

export interface FloatField extends LayoutFieldBase {
    type: 'float';
    format?: FloatFieldFormat;
}

export interface IntegerField extends LayoutFieldBase {
    type: 'integer';
    format?: IntegerFieldFormat;
}

export interface StringField extends LayoutFieldBase {
    type: 'string';
    format?: StringFieldFormat;
}

export interface DateField extends LayoutFieldBase {
    type: 'date';
    format?: DateFieldFormat;
}

export type LayoutField = IntegerField | FloatField | StringField | DateField;

export interface LayoutGroup {
    key: string;
    label: string;
    description?: string;
    fields: { [key in string]: LayoutField };
    layout: Array<string>;

}

export type GroupLayout = Array<LayoutGroup>;

export interface GroupSchema {
    title: string;
    layout: Array<string>;
}

export interface GroupsSchema {
    description: GroupSchema;
    collection: GroupSchema;
    curation: GroupSchema;
    geolocation: GroupSchema;
}

// TODO: 
export type Unit = string;

export interface FieldSchema {
    key: string;
    type: string;
    group: string;
    description?: string;
    units?: Array<Unit>;
    format?: any;
}

export interface FieldsSchema {
    [k: string]: FieldSchema;
}

export interface Schema {
    groups: GroupsSchema,
    fields: FieldsSchema;
}

export interface WrappedMetadataValue {
    type: string,
    field: MetadataField;
}

const groupLayout: GroupLayout = [
    {
        key: 'description',
        label: 'Description',
        description: 'Fields which describe the overall sample event',
        fields: {
            'purpose': {
                key: 'purpose',
                type: 'string'
            },
            'material': {
                key: 'material',
                type: 'string'
            }
        },
        layout: ['purpose', 'material']
    },
    {
        key: 'collection',
        label: 'Collection',
        description: 'Fields which describe the collection',
        fields: {
            'collection_date': {
                key: 'collection_date',
                type: 'date',
                description: 'Date upon which the sample was collected'
            },
            'collector_chief_scientist': {
                key: 'collector_chief_scientist',
                type: 'string'
            },
            'collection_method': {
                key: 'collection_method',
                type: 'string'
            }
        },
        layout: ['collection_date', 'collector_chief_scientist', 'collection_method']
    },
    {
        key: 'curation',
        label: 'Curation',
        description: 'Fields which describe the curation of the sample',
        fields: {
            'current_archive': {
                key: 'current_archive',
                type: 'string'
            },
            'current_archive_contact': {
                key: 'current_archive_contact',
                type: 'string'
            }
        },
        layout: ['current_archive', 'current_archive_contact']
    },
    {
        key: 'geolocation',
        label: 'Geolocation',
        description: 'Fields which describe the sample collection location',
        fields: {
            'coordinate_precision?': {
                key: 'coordinate_precision?',
                type: 'integer'
            },
            'latitude': {
                key: 'latitude',
                type: 'float',
                units: ['degrees'],
                format: {
                    precision: 5
                }
            },
            'longitude': {
                key: 'longitude',
                type: 'float',
                format: {
                    precision: 5
                }
            },
            'navigation_type': {
                key: 'navigation_type',
                type: 'string'
            },
            'locality_description': {
                key: 'locality_description',
                type: 'string'
            },
            'location_description': {
                key: 'location_description',
                type: 'string'
            },
            'name_of_physiographic_feature': {
                key: 'name_of_physiographic_feature',
                type: 'string'
            },
            'primary_physiographic_feature': {
                key: 'primary_physiographic_feature',
                type: 'string'
            }
        },
        layout: ['coordinate_precision?', 'latitude', 'longitude', 'navigation_type',
            'locality_description', 'location_description', 'name_of_physiographic_feature',
            'primary_physiographic_feature']
    }
];

export interface SampleViewerProps {
    sample: Sample;
}

interface SampleViewerState {
}

export default class SampleViewer extends React.Component<SampleViewerProps, SampleViewerState> {
    renderGeolocation(data: Metadata, group: LayoutGroup) {
        const { latitude, longitude } = data;
        if (typeof latitude === 'undefined' || typeof longitude === 'undefined') {
            return <Alert type="warning" message="Both latitude and longitude must be present to display a map location" />;
        }
        const lat = latitude.value as number;
        const lng = longitude.value as number;
        const componentString = ReactDOMServer.renderToString(<PushpinFilled />);
        const icon = L.divIcon({
            html: componentString,
            className: 'map-marker',
            iconSize: L.point(20, 20),
            tooltipAnchor: L.point(0, 10)
        });
        // const OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        //     maxZoom: 17,
        //     attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        // });
        // const OpenStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //     maxZoom: 19,
        //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        // });
        return <div style={{ width: '400px', height: '400px' }}>
            <LeafletMap center={[lat, lng]} zoom={5} style={{ width: '100%', height: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <TileLayer
                    attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
                    url='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
                />
                <Marker position={[lat, lng]} icon={icon}>
                    <Popup>
                        <div>Location</div>
                        <div>Latitude: {lat}</div>
                        <div>Longitude: {lng}</div></Popup>
                </Marker>
            </LeafletMap>
        </div>;
    }

    renderControlledMetadataGroupExtras(data: Metadata, group: LayoutGroup) {
        switch (group.key) {
            case 'geolocation':
                return this.renderGeolocation(data, group);
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

        const rows = groupLayout.map((group) => {
            const fields = group.layout.map((fieldName) => {
                const field = group.fields[fieldName];
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

    renderNoCellData() {
        return <div style={{
            fontStyle: 'italic',
            color: 'silver'
        }}>-</div>;
    }

    render() {
        const sample = this.props.sample;
        const metadata = sample.metadata;

        const rows = groupLayout.map((group) => {
            const fields = group.layout.map((fieldName) => {
                const field = group.fields[fieldName];
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

        return <div className="Metadata">
            {rows}
        </div>;
    }
}
