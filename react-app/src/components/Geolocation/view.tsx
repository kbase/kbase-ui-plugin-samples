import React, {useEffect, useState} from 'react';
import {
    Alert, Col, Row, Button
} from 'antd';
import Leaflet from 'leaflet';
import {
    MapContainer as LeafletMap, Tooltip as LeafletTooltip, TileLayer, LayersControl,
    CircleMarker, ScaleControl, useMapEvents
} from 'react-leaflet';
// import {useLeafletContext} from '@react-leaflet/core';
import 'leaflet/dist/leaflet.css';
import MetadataFieldView from '../MetadataField/view';

import {MetadataField, Sample} from "../../lib/ViewModel/ViewModel";
import {InfoTable, Section} from "@kbase/ui-components";
import {Span} from 'lib/instrumentation/core';
import {FieldGroup} from "../../lib/client/SampleServiceClient";
import {FaMap, FaGlobe, FaPlus, FaMinus} from 'react-icons/fa';

import './style.less';

const MAP_LAYERS = [{
    name: 'EsriWorldImagery',
    title: 'Esri.WorldImagery',
    urlTemplate: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    options: {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    },
    maxZoom: 18,
    checked: true
}, {
    name: 'OpenStreetMap',
    title: 'Open Street Map',
    urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
    },
    maxZoom: 19,
    checked: false
}, {
    name: 'OpenTopoMap',
    title: 'Open Topo Map',
    urlTemplate: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    options: {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    },
    maxZoom: 17,
    checked: false
}];


// Advised as the max zoom supported by most tiles:
// https://leafletjs.com/examples/zoom-levels/
export const DEFAULT_ZOOM = 18;
export const MIN_ZOOM = 0;
export const ZOOM_SNAP_WORLD = 2;

export interface GeolocationViewerProps {
    sample: Sample;
    group: FieldGroup;
}

// interface GeolocationViewerState {
// }

export default function GeolocationViewer(props: GeolocationViewerProps) {
    const span = new Span({name: 'Components.GeoLocation'}).begin();
    const maxZoom = MAP_LAYERS.reduce<number>((minMaxZoom, {maxZoom}) => {
        return Math.min(minMaxZoom, maxZoom);
    }, MAP_LAYERS[0].maxZoom);

    const latitude = getMetadataValue(props.sample, 'latitude');
    const longitude = getMetadataValue(props.sample, 'longitude');

    const [mapState, setMapState] = useState<null | Leaflet.Map>(null);
    const [mapZoomState, setMapZoomState] = useState<null | number>(null);

    useEffect(() => {
        return () => {
            span.end();
        }
    });

    // Tiny component, just to sync the zoom.
    const Eventer = () => {
        const map = useMapEvents(({
            zoomend: () => {
                setMapZoomState(map.getZoom());
            }
        }));

        return <div/>;
    }

    function renderTooltip(sample: Sample) {
        const {latitude, longitude} = props.sample.controlled;
        return <div className="MapPopUp">
            <div style={{whiteSpace: 'nowrap'}}>
                <table>
                    <tbody>
                    <tr key="latitude">
                        <th>Lat</th>
                        <td>
                            <MetadataFieldView field={latitude} sample={sample}/>
                        </td>
                    </tr>
                    <tr key="latitude">
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

    function renderMapToolbar() {
        function zoomInToSample() {
            if (mapState === null || latitude === null || longitude === null) {
                return;
            }
            // mapState.setZoom(maxZoom)

            mapState.fitBounds([[latitude, longitude]], {
                padding: [50, 50]
            });
        }

        function zoomOutToWorld() {
            if (mapState === null) {
                return;
            }
            mapState.setZoom(ZOOM_SNAP_WORLD);
        }

        function zoomIn() {
            if (mapState === null) {
                return;
            }
            mapState.zoomIn(1);
        }

        function zoomOut() {
            if (mapState === null) {
                return;
            }
            mapState.zoomOut(1);
        }

        return <div className="Geolocation-map-toolbar">
            <div style={{fontWeight: 'bold', color: 'rgba(150, 150, 150, 1)'}}>
                Zoom Level:
            </div>
            <div style={{width: '2em', fontSize: '150%', marginLeft: '0.5em'}}>
                {mapState !== null ? mapZoomState : 'n/a'}
            </div>
            <div>
                <Button type="default"
                        shape="circle"
                        onClick={zoomIn}
                        title="Zoom in"
                        style={{margin: '4px'}}
                        disabled={mapState === null || mapState.getZoom() === maxZoom}
                        icon={<FaPlus size="100%"/>}/>
            </div>
            <div>
                <Button type="default"
                        shape="circle"
                        onClick={zoomOut}
                        title="Zoom out"
                        style={{margin: '4px'}}
                        disabled={mapState === null || mapState.getZoom() === MIN_ZOOM}
                        icon={<FaMinus size="100%"/>}/>
            </div>
            <div>
                <Button type="default"
                        shape="circle"
                        onClick={zoomInToSample}
                        title="Zoom in to sample"
                        style={{margin: '4px'}}
                        icon={<FaMap size="100%"/>}/>
            </div>
            <div>
                <Button type="default"
                        shape="circle"
                        onClick={zoomOutToWorld}
                        title="Zoom out to world"
                        style={{margin: '4px'}}
                        disabled={mapState === null || mapState.getZoom() === ZOOM_SNAP_WORLD}
                        icon={<FaGlobe size="100%"/>}/>
            </div>
        </div>
    }

    function setMap(map: Leaflet.Map) {
        setMapState(map);
        setMapZoomState(map.getZoom());
    }

    function getMetadataValue(sample: Sample, key: string): number | null {
        // We don't know if they exist...
        // if (typeof latitude === 'undefined' || typeof longitude === 'undefined') {
        //     return <Alert type="warning"
        //                   message="Both latitude and longitude must be present to display a map location"/>;
        // }
        if (!(key in sample.controlled)) {
            return null;
        }

        const field = sample.controlled[key];

        // Trap "impossible" conditions, which should never appear in real usage if samples adhere
        // to the schema... but we need to do this runtime introspection due to the generic nature
        // of sample metadata.

        // And we don't know if they are the proper type of field...
        if (field.field.type !== 'number') {
            throw new Error(`"${key}" must be numeric field`);
        }

        return field.field.numberValue;
    }

    function renderMap() {
        // const {latitude, longitude} = props.sample.controlled;
        //
        //
        // // We don't know if they exist...
        // if (typeof latitude === 'undefined' || typeof longitude === 'undefined') {
        //     return <Alert type="warning"
        //                   message="Both latitude and longitude must be present to display a map location"/>;
        // }
        //
        // // Trap "impossible" conditions, which should never appear in real usage if samples adhere
        // // to the schema... but we need to do this runtime introspection due to the generic nature
        // // of sample metadata.
        //
        // // And we don't know if they are the proper type of field...
        // if (latitude.field.type !== 'number') {
        //     return <Alert type="error" message="latitude must be numeric field"/>;
        // }
        //
        // if (longitude.field.type !== 'number') {
        //     return <Alert type="error" message="longitude must be numeric field"/>;
        // }
        //
        // if (latitude.field.numberValue === null || longitude.field.numberValue === null) {
        //     return <Alert type="warning"
        //                   message="Both latitude and longitude must be present to display a map location"/>;
        // }
        //
        // const lat = latitude.field.numberValue;
        // const lng = longitude.field.numberValue

        if (latitude === null || longitude === null) {
            return <Alert type="warning"
                          message="Both latitude and longitude must be present to display a map location"/>;
        }

        const layersControls = MAP_LAYERS.map((layer) => {
            return <LayersControl.BaseLayer name={layer.name} checked={layer.checked}>
                <TileLayer
                    key={layer.name}
                    attribution={layer.options.attribution}
                    url={layer.urlTemplate}
                    noWrap={true}
                />
            </LayersControl.BaseLayer>
        });


        return <div className="Geolocation-map">
            {renderMapToolbar()}
            <LeafletMap
                center={[latitude, longitude]}
                zoom={maxZoom}
                maxZoom={maxZoom}
                minZoom={MIN_ZOOM}
                preferCanvas={true}
                whenCreated={(map: Leaflet.Map) => {
                    setMap(map);
                }}
                zoomControl={false}
                style={{flex: '1 1 0px'}}>
                <Eventer/>
                <ScaleControl position="topleft"/>
                <LayersControl position="topright" sortLayers={true}>
                    {layersControls}
                </LayersControl>
                <CircleMarker center={[latitude, longitude]} radius={20} color="blue" fillOpacity={0.4} weight={5}>
                    <LeafletTooltip>
                        {renderTooltip(props.sample)}
                    </LeafletTooltip>
                </CircleMarker>
            </LeafletMap>
        </div>;
    }

    function renderFields() {
        const sample = props.sample;

        const metadata = sample.metadata.reduce((metadata, field) => {
            metadata[field.key] = field;
            return metadata;
        }, {} as { [key: string]: MetadataField })

        const fields = props.group.fields.map((fieldName) => {
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
                        return <MetadataFieldView key={field.key} field={field} sample={props.sample}/>;
                    }
                };
            });

        return <InfoTable table={table}/>;
    }

    return <div className="Geolocation" data-testid="geolocation-view">
        <div className="Geolocation-body">
            <Row gutter={10} style={{flex: '1 1 0'}}>
                <Col span={16} flex="1 1 0px" style={{display: 'flex', flexDirection: 'column'}}>
                    <Section title="Map">
                        {renderMap()}
                    </Section>
                </Col>
                <Col span={8} style={{display: 'flex'}}>
                    <Section title="Fields">
                        {renderFields()}
                    </Section>
                </Col>
            </Row>
        </div>
    </div>;
}
