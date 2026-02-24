import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, DrawingManager, Polygon } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 17.385044,
  lng: 78.486671,
};

export default function ZoneMap({ isLoaded, onPolygonComplete, initialCoordinates, center }) {
  const [polygonPath, setPolygonPath] = useState(initialCoordinates || []);
  const [mapCenter, setMapCenter] = useState(center || defaultCenter);

  useEffect(() => {
    if (center) {
      setMapCenter(center);
    }
  }, [center]);

  useEffect(() => {
    setPolygonPath(initialCoordinates || []);
  }, [initialCoordinates]);

  const onPolygonCompleteCallback = useCallback(
    (polygon) => {
      const path = polygon.getPath().getArray();
      const coordinates = path.map((point) => ({
        lat: point.lat(),
        lng: point.lng(),
      }));

      setPolygonPath(coordinates);
      if (onPolygonComplete) onPolygonComplete(coordinates);
      polygon.setMap(null);
    },
    [onPolygonComplete]
  );

  if (!isLoaded) return ;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={12}>
      <DrawingManager
        onPolygonComplete={onPolygonCompleteCallback}
        options={{
          drawingControl: true,
          drawingControlOptions: {
            drawingModes: ["polygon"],
          },
          polygonOptions: {
            fillColor: "#00FF00",
            fillOpacity: 0.4,
            strokeColor: "#008000",
            strokeWeight: 2,
            clickable: true,
            editable: true,
            draggable: false,
          },
        }}
      />

      {polygonPath.length > 0 && (
        <Polygon
          path={polygonPath}
          options={{
            fillColor: "#00FF00",
            fillOpacity: 0.4,
            strokeColor: "#008000",
            strokeWeight: 2,
            editable: true,
          }}
        />
      )}
    </GoogleMap>
  );
}