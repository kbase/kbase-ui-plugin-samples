import React from 'react';
import {
    Tabs, Collapse, Radio, Alert, Tooltip
} from 'antd';
import './style.css';
import DataLinks from '../DataLinks';
import { RadioChangeEvent } from 'antd/lib/radio';
import { Map as LeafletMap, Marker, Popup, TileLayer } from 'react-leaflet';

import L from 'leaflet';
import { PushpinFilled } from '@ant-design/icons';
import ReactDOMServer from 'react-dom/server';
import Overview from './Overview';
import TemplateMetadata from './TemplateMetadata';
import { MetadataValue, Sample, Metadata } from './data';

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
    field: MetadataValue;
}

// const schema: Schema = {
//     groups: {
//         description: {
//             title: 'Description',
//             layout: ['Purpose', 'Material']
//         },
//         collection: {
//             title: 'Collection',
//             layout: ['Collection date', 'Collector/Chief Scientist', 'Collection method']
//         },
//         curation: {
//             title: 'Curation',
//             layout: ['Current archive', 'Current archive contact']
//         },
//         geolocation: {
//             title: 'Geolocation',
//             layout: ['Coordinate precision', 'Latitude', 'Longitude', 'Navigation type',
//                 'Locality Description', 'Location Description', 'Name of physiographic feature',
//                 'Primary physiographic feature']
//         }
//     },
//     fields: {
//         'Purpose': {
//             key: 'Purpose',
//             type: 'string',
//             group: 'description'
//         },
//         'Material': {
//             key: 'Material',
//             type: 'string',
//             group: 'description'
//         },
//         'Collection date': {
//             key: 'Collection date',
//             type: 'date',
//             description: 'Date upon which the sample was collected',
//             group: 'collection'
//         },
//         'Collector/Chief Scientist': {
//             key: 'Collector/Chief Scientist',
//             type: 'string',
//             group: 'collection'
//         },
//         'Collection method': {
//             key: 'Collection method',
//             type: 'string',
//             group: 'collection'
//         },
//         'Current archive': {
//             key: 'Current archive',
//             type: 'string',
//             group: 'curation'
//         },
//         'Current archive contact': {
//             key: 'Current archive contact',
//             type: 'string',
//             group: 'curation'
//         },
//         'Coordinate precision': {
//             key: 'Coordinate precision',
//             type: 'integer',
//             group: 'geolocation'
//         },
//         'Latitude': {
//             key: 'Latitude',
//             type: 'float',
//             units: ['degrees'],
//             format: {
//                 precision: 5
//             },
//             group: 'geolocation'
//         },
//         'Longitude': {
//             key: 'Longitude',
//             type: 'float',
//             format: {
//                 precision: 5
//             },
//             group: 'geolocation'
//         },
//         'Navigation type': {
//             key: 'Navigation type',
//             type: 'string',
//             group: 'geolocation'
//         },
//         'Locality Description': {
//             key: 'Locality Description',
//             type: 'string',
//             group: 'geolocation'
//         },
//         'Location Description': {
//             key: 'Location Description',
//             type: 'string',
//             group: 'geolocation'
//         },
//         'Name of physiographic feature': {
//             key: 'Name of physiographic feature',
//             type: 'string',
//             group: 'geolocation'
//         },
//         'Primary physiographic feature': {
//             key: 'Primary physiographic feature',
//             type: 'string',
//             group: 'geolocation'
//         }
//     }
// };

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
    setTitle: (title: string) => void;
}

interface SampleViewerState {
    // selectedSample: Sample | null;
    view: 'alpha' | 'grouped' | 'template';
}

export default class SampleViewer extends React.Component<SampleViewerProps, SampleViewerState> {
    constructor(props: SampleViewerProps) {
        super(props);
        this.state = {
            // selectedSampleNode: props.sample.node_tree[0],
            view: 'template'
        };
    }

    componentDidMount() {
        const title = `Sample View for "${this.props.sample.name}"`;
        this.props.setTitle(title);
    }



    renderUserMetadataAlpha() {
        const sample = this.props.sample;
        const metadata = Object.entries(sample.userMetadata);
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
                    <div>{value.value} <i>{value}</i></div>
                </div>;
            });
        return <div className="InfoTable -bordered UserMetadata">
            {rows}
        </div>;
    }

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

    // renderUserMetadataGroupExtras(data: Metadata, group: LayoutGroup) {
    //     switch (group.key) {
    //         case 'geolocation':
    //             return this.renderGeolocation(data, group);
    //     }
    // }

    // renderField(field: LayoutField, value: any) {
    //     switch (field.type) {
    //         case 'string':
    //             return field.
    //     }
    // }

    // renderUserMetadataGrouped() {
    //     const sample = this.props.sample;
    //     const metadata = sample.userMetadata;

    //     const groupKeys = groupLayout.map((group) => {
    //         return group.key;
    //     });

    //     const rows = groupLayout.map((group) => {
    //         const fields = group.layout.map((fieldName) => {
    //             const field = group.fields[fieldName];
    //             if (!field) {
    //                 console.warn('Field not found: ' + fieldName);
    //                 return null;
    //             }
    //             if (field.key in metadata) {
    //                 const value = metadata[field.key];
    //                 return <div key={field.key}>
    //                     <div>{value.label}</div>
    //                     <div>{field.key}</div>
    //                     <div>{value.value} <i>{value.units}</i></div>
    //                 </div>;
    //             } else {
    //                 return null;
    //             }
    //         })
    //             .filter((row) => {
    //                 return row ? true : false;
    //             });

    //         let content;
    //         if (fields.length) {
    //             content = <div className="InfoTable  -bordered ControlledMetadata">
    //                 {fields}
    //             </div>;
    //         } else {
    //             content = <div style={{ fontStyle: 'italic' }}>No data</div>;
    //         }
    //         return <Collapse.Panel header={group.label} key={group.key} showArrow={false}>
    //             {content}
    //             <div style={{ marginTop: '10px' }}>
    //                 {this.renderUserMetadataGroupExtras(metadata, group)}
    //             </div>
    //         </Collapse.Panel>;
    //     });

    //     return <Collapse defaultActiveKey={groupKeys}
    //         bordered={true}
    //     >
    //         {rows}
    //     </Collapse>;
    // }

    renderUserMetadata() {
        // if (!this.state.selectedSampleNode) {
        //     return;
        // }
        switch (this.state.view) {
            case 'alpha':
                return this.renderUserMetadataAlpha();
            case 'grouped':
                return <p>
                    No grouped view for user metadata
                </p>;
        }
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
        // const metadata = Object.entries(sample.meta_user);
        // if (metadata.length === 0) {
        //     return <div style={{ fontStyle: 'italic' }}>Sorry, no user metadata</div>;
        // }
        const sample = this.props.sample;
        const metadata = sample.metadata;

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
        switch (this.state.view) {
            case 'alpha':
                return this.renderControlledMetadataAlpha();
            case 'grouped':
                return this.renderControlledMetadataGrouped();
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
        return <TemplateMetadata sample={this.props.sample} />;
    }

    renderMetadata() {
        switch (this.state.view) {
            case 'template':
                return this.renderTemplateMetadata();
            default:
                return <div className="Col -stretch -autoscroll">
                    <Collapse
                        defaultActiveKey={['1', '2']}
                        bordered={true}>
                        <Collapse.Panel header="Metadata" key='1' showArrow={true}>
                            {this.renderControlledMetadata()}
                        </Collapse.Panel>
                        <Collapse.Panel header="User Metadata" key='2' showArrow={true}>
                            {this.renderUserMetadata()}
                        </Collapse.Panel>
                    </Collapse>
                </div >;
        }

    }

    renderSample() {
        /*
         <Radio.Button value="alpha">
                            alpha
                        </Radio.Button>
        */
        return <div className="Col -stretch">
            <div className="Row" style={{ marginBottom: '10px', alignItems: 'center' }}>
                <div>
                    View: <Radio.Group value={this.state.view} onChange={this.onViewChange.bind(this)}>
                        <Radio.Button value="template">
                            template
                        </Radio.Button>

                        <Radio.Button value="grouped">
                            grouped
                        </Radio.Button>
                    </Radio.Group>

                </div>
                <div style={{ fontStyle: 'italic', marginLeft: '1em' }}>
                    {this.renderViewLabel()}
                </div>
            </div>
            <div className="Col -stretch">
                {this.renderMetadata()}
            </div>
        </div>;
    }

    render() {
        return <div className='Sample'>
            <Overview sample={this.props.sample} />
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
