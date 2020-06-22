import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
// import getConfig from 'next/config';

// const { publicRuntimeConfig } = getConfig();

console.log(process.env.gmaps_secret);

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
  apiKey: 'AIzaSyAfPjiiFC9t-ixMAHY9tqf2YJw19TZ0w0k',
})(LocationMap);

// export default GoogleApiWrapper({
//   apiKey: publicRuntimeConfig.gmaps_secret,
// })(LocationMap);

// export default GoogleApiWrapper({
//   apiKey: process.env.gmaps_secret,
// })(LocationMap);
