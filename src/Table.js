import React from 'react'
import numeral from 'numeral';
import './Table.css';

const casesType = "todayCases"

function Table({ countries }) {

    return (
        <div className="table">
            {countries.map(({ country, todayCases }) => (
                <tr>
                    <td>{country}</td>
                    <td><strong>{numeral(todayCases).format('0,0')}</strong></td>
                </tr>
            ))}
        </div>
    )
}

export default Table
