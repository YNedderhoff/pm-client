import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Request from 'superagent';
import _ from 'lodash';
import JsonTable from 'react-json-table';

class App extends Component {

  constructor() {
      super();
      this.state = {
          row: false,
          cell: false,
          sort: false
      };
  }

  componentWillMount(){
    var url = "https://feinstaubdb-de92.restdb.io/rest/pm-and-weather-data?h={\"$orderby\":{\"values_retrieved_at\":-1}}&format=.json&apikey=5895ac0e64c380c04d1ed70b";
    Request.get(url).then((response) => {
      this.setState({
        sensors: response.body
      })
    })
  }

  getSettings(){
      var me = this;
      // We will add some classes to the selected rows and cells
      return {
        keyField: 'name',
        cellClass( current, key, item){
          if( me.state.cell == key && me.state.row == item.name )
            return current + ' cellSelected';
          return current;
        },
        headerClass( current, key ){
            if( me.state.sort == key )
              return current + ' headerSelected';
            return current;
        },
        rowClass( current, item ){
          if( me.state.row == item.name )
            return current + ' rowSelected';
          return current;
        }
      };
  }

  onClickCell( e, column, item ){
    this.setState( {cell: column} );
  }

  onClickHeader( e, column ){
    this.setState( {sort: column} );
  }

  onClickRow( e, item ){
    this.setState( {row: item.name} );
  }

  render() {

    var sensor_values = []

    _.map(this.state.sensors, (s) => {
      var sensor = {
        name: s.sensor,
        temperature: s.temperature + " °C",
        humidity:s.humidity,
        values_measured_at:s.values_retrieved_at
      }
      sensor_values.push(sensor);
    });

    var me = this;

    if( this.state.sort ){
        sensor_values.sort( function( a, b ){
           return a[ me.state.sort ] > b[ me.state.sort ] ? 1 : -1;
        });
      }

    return (
      <div>
          <button onClick={ (e) => {this.setState({sort: "name"})}}>SortByName</button>
          <button onClick={ (e) => {this.setState({sort: "temperature"})}}>SortByTemperature</button>
          <button onClick={ (e) => {this.setState({sort: "humidity"})}}>SortByHumidity</button>
          <button onClick={ (e) => {this.setState({sort: "values_measured_at"})}}>SortByDate</button>
          <JsonTable
          rows={sensor_values}
          settings={ this.getSettings() }
          onClickCell={ this.onClickCell }
          onClickHeader={ this.onClickHeader }
          onClickRow={ this.onClickRow } />
          </div>
    );
  }
}

export default App;
