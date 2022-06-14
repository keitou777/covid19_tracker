import React, { useState, useEffect } from 'react';
import './App.css';
import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core'
import InfoBox from './InfoBox';
import Map from './map';
import Table from './Table';
import { sortData } from './util';
import LineGraph from './LineGraph';
import numeral from 'numeral';
import "leaflet/dist/leaflet.css";
import { prettyPrintStat } from './util';
import { prettyPrintStatTotal } from './util';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([36, 38]);
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then((data) => {
        setCountryInfo(data);
      })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2
          }));

          const sortedData = sortData(data);
          setCountries(countries);
          setTableData(sortedData);
          setMapCountries(data);
        })
    }
    getCountriesData();
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    // console.log(countryCode);
    setCountry(countryCode)

    const url = countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4);
      })
  }

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>Covid 19 Tracker</h1>
          <FormControl className="app_dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">worldwide</MenuItem>
              {countries.map(country => (<MenuItem value={country.value}>{country.name}</MenuItem>))}
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="New Cases"
            total={prettyPrintStatTotal(countryInfo.cases)}
            cases={prettyPrintStat(countryInfo.todayCases)} />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            total={prettyPrintStatTotal(countryInfo.recovered)}
            cases={prettyPrintStat(countryInfo.todayRecovered)} />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            total={prettyPrintStatTotal(countryInfo.deaths)}
            cases={prettyPrintStat(countryInfo.todayDeaths)} />
        </div>
        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>New Cases By Country</h3>
          <Table countries={tableData} />
          <h3>Last 120days Worldwide {casesType}</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
