import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
    cases: {
        rgb: "rgb(204,16,52)",
        multiplier: 8000,
    },
    recovered: {
        rgb: "rgb(125,215,29)",
        multiplier: 12000,
    },
    deaths: {
        rgb: "rgb(251,68,67)",
        multiplier: 20000,
    }
}

export const prettyPrintStat = (stat) => stat ? `+${numeral(stat).format("0a")}` : `+ 0`
export const prettyPrintStatTotal = (stat) => stat ? `${numeral(stat).format("0a")}` : `0`

export const sortData = (data) => {
    // console.log("sortdata===")
    // console.log(data)
    // // const sortedData = [...data];
    // return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
    // return data.sort((a, b) => (a.cases > b.cases ? -1 : 1));
    return data.sort((a, b) => (a.todayCases > b.todayCases ? -1 : 1));
}

export const showDataOnMap = (data, casesType) => {
    return data.map(country => (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            pathOptions={{
                color: casesTypeColors[casesType].rgb,
                fillColor: casesTypeColors[casesType].rgb
            }}
            radius={Math.sqrt(country[casesType] * casesTypeColors[casesType].multiplier)}
        >
            <Popup>
                <div className="info-container">
                    <div
                        className="info-flag"
                        style={{ backgroundImage: `url(${country.countryInfo.flag})` }}></div>
                    <div className="info-name">{country.country}</div>
                    <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                    <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                    <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                </div>
            </Popup>
        </Circle>
    ))
}