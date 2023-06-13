import React, { useEffect } from "react";
import tw from "tailwind-styled-components";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import socketIO from "socket.io-client";

const socket = socketIO.connect("http://localhost:4000");

function Map(props) {
  console.log(props)
  mapboxgl.accessToken =
    "pk.eyJ1IjoibmFqd2EyMDAxIiwiYSI6ImNsaGZ2d3c4dDFhc3YzbW52OXYwc3dpbDMifQ.h-g-GFjscHLCdp9IvtwQMQ";

  useEffect(() => {
    //Initialising the marker
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v9",
      center: [75.922096, 10.914627],
      zoom: 8,
    });
    //add marker to pickup cordinate
    if (props.pickupCoordinates) {
      addToMap(map, props.pickupCoordinates);
    }
    //add marker to the dropoff coordinate
    if (props.dropoffCoordinates) {
      addToMap(map, props.dropoffCoordinates);
    }
    //auto zoom to zoom into the markers
    if (props.pickupCoordinates && props.dropoffCoordinates) {
      map.fitBounds([props.dropoffCoordinates, props.pickupCoordinates], {
        padding: 60,
      });
    }

    socket.on("liveLocationUpdate", (data) => {
      addToMap(map, data);
    });
    return () => {
      socket.off("liveLocationUpdate");
    };
  }, [props.pickupCoordinates, props.dropoffCoordinates]);

  //Marker
  const addToMap = (map, coordinates) => {
    //console.log(coordinates);
    const marker1 = new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
  };

  return <Wrapper id="map"></Wrapper>;
}

export default Map;

const Wrapper = tw.div`
bg-green-200 flex-1 `;
