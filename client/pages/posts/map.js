import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '100%',
};

export class LocationMap extends Component {
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={8}
        style={mapStyles}
        initialCenter={{ lat: 49.266316, lng: -123.242467 }}
      >
        <Marker />
      </Map>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: process.env.GMAPS_KEY,
})(LocationMap);
