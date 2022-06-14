import React from 'react'
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import './Map.css';
import { showDataOnMap } from './util';


function map({ countries, casesType, center, zoom }) {

    function ChangeMapView({ coords, zoom }) {
        const map = useMap();
        map.setView(coords, zoom);
        return null;
    }

    return (
        <div className="map">
            <MapContainer center={center} zoom={zoom}>
                <TileLayer
                    url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <ChangeMapView coords={center} zoom={zoom} />
                {showDataOnMap(countries, casesType)}
            </MapContainer>
        </div>
    )
}



export default map
