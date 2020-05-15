import React from 'react';
import {
    Sample, SampleNode, UserMetadata, ControlledMetadata, MetadataValue
} from '../../lib/comm/dynamicServices/SampleServiceClient';
import {
    Row, Col, Tabs, Collapse, Radio, Alert, Table
} from 'antd';
import './style.css';
import DataLinks from '../DataLinks';
// import GoogleMapReact from 'google-map-react';
import { RadioChangeEvent } from 'antd/lib/radio';
// import Pin from './Pin';
// import 'leaflet/dist/leaflet.css';
import { Map as LeafletMap, Marker, Popup, TileLayer } from 'react-leaflet';

import L from 'leaflet';
import { PushpinFilled } from '@ant-design/icons';
import ReactDOMServer from 'react-dom/server';


// delete L.Icon.Default.prototype.;

// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//     iconUrl: require('leaflet/dist/images/marker-icon.png'),
//     shadowUrl: require('leaflet/dist/images/marker-shadow.png')
// });

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

const spreadsheetView = [
    'Sample Name',
    'IGSN',
    'Parent IGSN',
    'Release date',
    'Material',
    'Field name(informal classification)',
    'Location Description',
    'Locality Description',
    'Collection method',
    'Purpose',
    'Latitude',
    'Longitude',
    'Coordinate Precision?',
    'Elevation start',
    'Elevation unit',
    'Navigation type',
    'Primary physiographic feature',
    'Name of physiographic feature',
    'Field program/cruise',
    'Collector/Chief Scientist',
    'Collection date',
    'Collection date precision',
    'Current archive',
    'Current archive contact',
    'Related Identifiers',
    'Relation Type'
];

export interface TemplateDataSource {
    order: number;
    key: string;
    type: string | null;
    value: string | number | boolean | null;
    units: string | null;
}

export interface WrappedMetadataValue {
    type: string,
    field: MetadataValue;
}

const schema: Schema = {
    groups: {
        description: {
            title: 'Description',
            layout: ['Purpose', 'Material']
        },
        collection: {
            title: 'Collection',
            layout: ['Collection date', 'Collector/Chief Scientist', 'Collection method']
        },
        curation: {
            title: 'Curation',
            layout: ['Current archive', 'Current archive contact']
        },
        geolocation: {
            title: 'Geolocation',
            layout: ['Coordinate precision', 'Latitude', 'Longitude', 'Navigation type',
                'Locality Description', 'Location Description', 'Name of physiographic feature',
                'Primary physiographic feature']
        }
    },
    fields: {
        'Purpose': {
            key: 'Purpose',
            type: 'string',
            group: 'description'
        },
        'Material': {
            key: 'Material',
            type: 'string',
            group: 'description'
        },
        'Collection date': {
            key: 'Collection date',
            type: 'date',
            description: 'Date upon which the sample was collected',
            group: 'collection'
        },
        'Collector/Chief Scientist': {
            key: 'Collector/Chief Scientist',
            type: 'string',
            group: 'collection'
        },
        'Collection method': {
            key: 'Collection method',
            type: 'string',
            group: 'collection'
        },
        'Current archive': {
            key: 'Current archive',
            type: 'string',
            group: 'curation'
        },
        'Current archive contact': {
            key: 'Current archive contact',
            type: 'string',
            group: 'curation'
        },
        'Coordinate precision': {
            key: 'Coordinate precision',
            type: 'integer',
            group: 'geolocation'
        },
        'Latitude': {
            key: 'Latitude',
            type: 'float',
            units: ['degrees'],
            format: {
                precision: 5
            },
            group: 'geolocation'
        },
        'Longitude': {
            key: 'Longitude',
            type: 'float',
            format: {
                precision: 5
            },
            group: 'geolocation'
        },
        'Navigation type': {
            key: 'Navigation type',
            type: 'string',
            group: 'geolocation'
        },
        'Locality Description': {
            key: 'Locality Description',
            type: 'string',
            group: 'geolocation'
        },
        'Location Description': {
            key: 'Location Description',
            type: 'string',
            group: 'geolocation'
        },
        'Name of physiographic feature': {
            key: 'Name of physiographic feature',
            type: 'string',
            group: 'geolocation'
        },
        'Primary physiographic feature': {
            key: 'Primary physiographic feature',
            type: 'string',
            group: 'geolocation'
        }
    }
};

const groupLayout: GroupLayout = [
    {
        key: 'description',
        label: 'Description',
        description: 'Fields which describe the overall sample event',
        fields: {
            'Purpose': {
                key: 'Purpose',
                type: 'string'
            },
            'Material': {
                key: 'Material',
                type: 'string'
            }
        },
        layout: ['Purpose', 'Material']
    },
    {
        key: 'collection',
        label: 'Collection',
        description: 'Fields which describe the collection',
        fields: {
            'Collection date': {
                key: 'Collection date',
                type: 'date',
                description: 'Date upon which the sample was collected'
            },
            'Collector/Chief Scientist': {
                key: 'Collector/Chief Scientist',
                type: 'string'
            },
            'Collection method': {
                key: 'Collection method',
                type: 'string'
            }
        },
        layout: ['Collection date', 'Collector/Chief Scientist', 'Collection method']
    },
    {
        key: 'curation',
        label: 'Curation',
        description: 'Fields which describe the curation of the sample',
        fields: {
            'Current archive': {
                key: 'Current archive',
                type: 'string'
            },
            'Current archive contact': {
                key: 'Current archive contact',
                type: 'string'
            }
        },
        layout: ['Current archive', 'Current archive contact']
    },
    {
        key: 'geolocation',
        label: 'Geolocation',
        description: 'Fields which describe the sample collection location',
        fields: {
            'Coordinate precision': {
                key: 'Coordinate precision',
                type: 'integer'
            },
            'Latitude': {
                key: 'Latitude',
                type: 'float',
                units: ['degrees'],
                format: {
                    precision: 5
                }
            },
            'Longitude': {
                key: 'Longitude',
                type: 'float',
                format: {
                    precision: 5
                }
            },
            'Navigation type': {
                key: 'Navigation type',
                type: 'string'
            },
            'Locality Description': {
                key: 'Locality Description',
                type: 'string'
            },
            'Location Description': {
                key: 'Location Description',
                type: 'string'
            },
            'Name of physiographic feature': {
                key: 'Name of physiographic feature',
                type: 'string'
            },
            'Primary physiographic feature': {
                key: 'Primary physiographic feature',
                type: 'string'
            }
        },
        layout: ['Coordinate precision', 'Latitude', 'Longitude', 'Navigation type',
            'Locality Description', 'Location Description', 'Name of physiographic feature',
            'Primary physiographic feature']
    }
];

export interface SampleViewerProps {
    sample: Sample;
    setTitle: (title: string) => void;
}

interface SampleViewerState {
    selectedSampleNode: SampleNode | null;
    view: 'alpha' | 'grouped' | 'template';
}

export default class SampleViewer extends React.Component<SampleViewerProps, SampleViewerState> {
    constructor(props: SampleViewerProps) {
        super(props);
        this.state = {
            selectedSampleNode: props.sample.node_tree[0],
            view: 'template'
        };
    }

    componentDidMount() {
        const title = `Sample View for "${this.props.sample.name}"`;
        this.props.setTitle(title);
    }

    renderOverview() {
        const { id, user, name, save_date, version } = this.props.sample;

        return <div className="Grouper">
            <Row>
                <Col span={12}>
                    <div className="InfoTable">
                        <div>
                            <div>
                                ID
                        </div>
                            <div>
                                {id}
                            </div>
                        </div>
                        <div>
                            <div>
                                Version
                        </div>
                            <div>
                                {version}
                            </div>
                        </div>
                        <div>
                            <div>
                                Created
                            </div>
                            <div>
                                {Intl.DateTimeFormat('en-US', {
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    second: 'numeric',
                                    timeZoneName: 'short'
                                }).format(save_date)}
                            </div>
                        </div>


                    </div>
                </Col>
                <Col span={12}>
                    <div className="InfoTable">
                        <div>
                            <div>
                                Name
                            </div>
                            <div>
                                {name}
                            </div>
                        </div>
                        <div>
                            <div>
                                Owner
                            </div>
                            <div>
                                {user}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>;
    }

    renderUserMetadataAlpha(sample: SampleNode) {
        const metadata = Object.entries(sample.meta_user);
        if (metadata.length === 0) {
            return <div style={{ fontStyle: 'italic' }}>Sorry, no user metadata</div>;
        }
        const rows = Array.from(metadata)
            .sort(([akey,], [bkey,]) => {
                return akey.localeCompare(bkey);
            })
            .map(([key, value]) => {
                return <div key={key}>
                    <div>{key}</div>
                    <div>{value.value} <i>{value.units}</i></div>
                </div>;
            });
        return <div className="InfoTable -bordered UserMetadata">
            {rows}
        </div>;
    }

    renderUserMetadataGroupExtras(data: UserMetadata, group: LayoutGroup) {
        switch (group.key) {
            case 'geolocation':
                const { Latitude, Longitude } = data;
                if (typeof Latitude === 'undefined' || typeof Longitude === 'undefined') {
                    return <Alert type="warning" message="Both latitude and longitude must be present to display a map location" />;
                }
                const lat = Latitude.value as number;
                const lng = Longitude.value as number;
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
    }

    // renderField(field: LayoutField, value: any) {
    //     switch (field.type) {
    //         case 'string':
    //             return field.
    //     }
    // }

    renderUserMetadataGrouped(sample: SampleNode) {
        const metadata = sample.meta_user;

        const groupKeys = groupLayout.map((group) => {
            return group.key;
        });

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
                        <div>{field.key}</div>
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
                content = <div className="InfoTable  -bordered ControlledMetadata">
                    {fields}
                </div>;
            } else {
                content = <div style={{ fontStyle: 'italic' }}>No data</div>;
            }
            return <Collapse.Panel header={group.label} key={group.key} showArrow={false}>
                {content}
                <div style={{ marginTop: '10px' }}>
                    {this.renderControlledMetadataGroupExtras(metadata, group)}
                </div>
            </Collapse.Panel>;
        });

        return <Collapse defaultActiveKey={groupKeys}
            bordered={true}
        >
            {rows}
        </Collapse>;
    }

    renderUserMetadata() {
        if (!this.state.selectedSampleNode) {
            return;
        }
        switch (this.state.view) {
            case 'alpha':
                return this.renderUserMetadataAlpha(this.state.selectedSampleNode);
            case 'grouped':
                return this.renderUserMetadataGrouped(this.state.selectedSampleNode);
        }
    }

    renderControlledMetadataGroupExtras(data: ControlledMetadata, group: LayoutGroup) {
        switch (group.key) {
            case 'geolocation':
                const { Latitude, Longitude } = data;
                if (typeof Latitude === 'undefined' || typeof Longitude === 'undefined') {
                    if (typeof Latitude === 'undefined' && typeof Longitude === 'undefined') {
                        return;
                    }
                    return <Alert type="warning" message="Both latitude and longitude must be present to display a map location" />;
                }
                const lat = Latitude.value as number;
                const lng = Longitude.value as number;
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
    }

    renderControlledMetadataAlpha(sample: SampleNode) {
        const metadata = Object.entries(sample.meta_controlled);
        if (metadata.length === 0) {
            return <div style={{ fontStyle: 'italic' }}>Sorry, no user metadata</div>;
        }
        const rows = Array.from(metadata)
            .sort(([akey,], [bkey,]) => {
                return akey.localeCompare(bkey);
            })
            .map(([key, value]) => {
                return <div key={key}>
                    <div>{key}</div>
                    <div>{value.value} <i>{value.units}</i></div>
                </div>;
            });
        return <div className="InfoTable -bordered ControlledMetadata">
            {rows}
        </div>;
    }

    renderControlledMetadataGrouped(sample: SampleNode) {
        // const metadata = Object.entries(sample.meta_user);
        // if (metadata.length === 0) {
        //     return <div style={{ fontStyle: 'italic' }}>Sorry, no user metadata</div>;
        // }
        const metadata = sample.meta_controlled;

        const groupKeys = groupLayout.map((group) => {
            return group.key;
        });

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
                        <div>{field.key}</div>
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
            return <Collapse.Panel header={group.label} key={group.key} showArrow={false}>
                {content}
                <div style={{ marginTop: '10px' }}>
                    {this.renderControlledMetadataGroupExtras(metadata, group)}
                </div>
            </Collapse.Panel>;
        });

        return <Collapse defaultActiveKey={groupKeys}
            bordered={true}

        // style={{ backgroundColor: "transparent" }}
        >
            {rows}
        </Collapse>;
    }

    renderControlledMetadata() {
        if (!this.state.selectedSampleNode) {
            return;
        }
        switch (this.state.view) {
            case 'alpha':
                return this.renderControlledMetadataAlpha(this.state.selectedSampleNode);
            case 'grouped':
                return this.renderControlledMetadataGrouped(this.state.selectedSampleNode);
        }
    }

    onViewChange(change: RadioChangeEvent) {
        const changedView = change.target.value;
        let view: 'alpha' | 'grouped' | 'template';
        switch (changedView) {
            case 'template':
                view = 'template';
                break;
            case 'alpha':
                view = 'alpha';
                break;
            case 'grouped':
                view = 'grouped';
                break;
            default:
                return;
        }

        this.setState({
            view
        });
    }

    renderViewLabel() {
        switch (this.state.view) {
            case 'template':
                return 'Fields ordered as per the upload template';
            case 'alpha':
                return 'Fields ordered in alphabetic order';
            case 'grouped':
                return 'Fields grouped';
        }
    }

    renderNoCellData() {
        return <div style={{
            fontStyle: 'italic',
            color: 'silver'
        }}>-</div>;
    }

    renderTemplateMetadata() {
        if (!this.state.selectedSampleNode) {
            return;
        }
        const sample = this.state.selectedSampleNode;
        const controlledMetadata = Object.entries(sample.meta_controlled).map(([k, v]) => {
            const x: [string, WrappedMetadataValue] = [k, {
                type: 'Controlled',
                field: v
            }];
            return x;
        });

        const userMetadata = Object.entries(sample.meta_user).map(([k, v]) => {
            const x: [string, WrappedMetadataValue] = [k, {
                type: 'User',
                field: v
            }];
            return x;
        });

        const metadata = controlledMetadata.concat(userMetadata);
        const metaDb = new Map<string, WrappedMetadataValue>(metadata);

        const dataSource: Array<TemplateDataSource> = [];
        spreadsheetView.forEach((key, order) => {
            const field = metaDb.get(key);
            if (!field) {
                dataSource.push({
                    order,
                    key,
                    type: null,
                    value: null,
                    units: null
                });
                return;
            }

            dataSource.push({
                order,
                key,
                type: field.type,
                value: field.field.value,
                units: field.field.units
            });
        });

        return <Table<TemplateDataSource>
            dataSource={dataSource}
            rowKey="key"
            className="AntTable-FullHeight"
            size="small"
            scroll={{ y: '100%' }}
            pagination={false}
        >
            <Table.Column dataIndex="order"
                key="order"
                title="Order"
                width="5em"
                sorter={(a: TemplateDataSource, b: TemplateDataSource) => {
                    return a.order - b.order;
                }}
            />
            <Table.Column dataIndex="key"
                key="key"
                title="Field"
                width="20em"
                sorter={(a: TemplateDataSource, b: TemplateDataSource) => {
                    return a.key.localeCompare(b.key);
                }}
            />
            <Table.Column
                dataIndex="type"
                key="type"
                title="Type"
                width="5em"
                sorter={(a: TemplateDataSource, b: TemplateDataSource) => {
                    if (a.type === null) {
                        return -1;
                    }
                    if (b.type === null) {
                        return 1;
                    }
                    return a.type.localeCompare(b.type);
                }}
                render={(type: string | null, row: TemplateDataSource) => {
                    if (type === null) {
                        return this.renderNoCellData();
                    }
                    return type;
                }}
            />
            <Table.Column
                dataIndex="value"
                key="value"
                title="Value"
                render={(value: string | number | null, row: TemplateDataSource) => {
                    if (value === null) {
                        return this.renderNoCellData();
                    }
                    return value;
                }}
            />
            <Table.Column
                dataIndex="units"
                key="units"
                title="Units"
                width="5em"
                render={(units: string | null, row: TemplateDataSource) => {
                    if (!units) {
                        return this.renderNoCellData();
                    }
                    return units;
                }}
            />
        </Table>;
    }

    renderMetadata() {
        switch (this.state.view) {
            case 'template':
                return this.renderTemplateMetadata();
            default:
                return <Collapse
                    defaultActiveKey={['1', '2']}
                    bordered={true}>

                    <Collapse.Panel header="Controlled Metadata" key='1' showArrow={false}>
                        {this.renderControlledMetadata()}
                    </Collapse.Panel>
                    <Collapse.Panel header="User Metadata" key='2' showArrow={false}>
                        {this.renderUserMetadata()}
                    </Collapse.Panel>
                </Collapse>;
        }

    }

    renderSample() {
        if (!this.state.selectedSampleNode) {
            return;
        }
        const sampleNode = this.state.selectedSampleNode;
        return <>
            <Row style={{ flex: '0 0 auto' }}>
                <Col span={12}>
                    <div className="InfoTable">
                        <div>
                            <div>
                                ID
                            </div>
                            <div>
                                {sampleNode.id}
                            </div>
                        </div>
                        <div>
                            <div>
                                Type
                            </div>
                            <div>
                                {sampleNode.type}
                            </div>
                        </div>
                    </div>
                </Col>
                <Col span={12}>
                    View: <Radio.Group value={this.state.view} onChange={this.onViewChange.bind(this)}>
                        <Radio.Button value="template">
                            template
                        </Radio.Button>
                        <Radio.Button value="alpha">
                            alpha
                        </Radio.Button>
                        <Radio.Button value="grouped">
                            grouped
                        </Radio.Button>
                    </Radio.Group>
                    <div style={{ fontStyle: 'italic', marginLeft: '3em' }}>
                        {this.renderViewLabel()}
                    </div>
                </Col>
            </Row>
            <div className="col -full-height -scrollable">

                {this.renderMetadata()}

            </div>
        </>;
    }

    clickNavItem(sampleNode: SampleNode) {
        this.setState({
            selectedSampleNode: sampleNode
        });
    }

    renderSampleNodeNav(sampleNode: SampleNode) {
        return <div className="Nav-item" onClick={() => { this.clickNavItem(sampleNode); }}>
            {sampleNode.id}
        </div>;
    }

    render() {
        return <div className='Sample'>
            {this.renderOverview()}
            <Tabs type="card" className="FullHeight-tabs">
                <Tabs.TabPane tab="Sample" key="sample" >
                    {this.renderSample()}
                </Tabs.TabPane>
                <Tabs.TabPane tab="Linked Data" key="linkeddata">
                    <DataLinks sampleId={this.props.sample.id} version={this.props.sample.version} />
                </Tabs.TabPane>
            </Tabs>
        </div>;
    }
}
