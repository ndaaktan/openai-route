import Head from "next/head";
import styles from "./index.module.css";
import React, { useEffect, useState, useRef } from "react";
import mapboxgl from '!mapbox-gl'; 
mapboxgl.accessToken = "YOUR_API_KEY";


export default function Home() {
  const [routeStartInput, setRouteStartInput] = useState("");
  const [routeEndInput, setRouteEndInput] = useState("");

  const [result, setResult] = useState();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ routeStart: routeStartInput, routeEnd: routeEndInput}),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setRouteStartInput("");
      setRouteEndInput("");
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }
      useEffect(() => {
      if (map.current) return; // initialize map only once
      map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
      });
      });
  return (
    <div>
      <Head>
        <title>OpenAI Route</title>
      </Head>
      <main className={styles.main}>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="route"
            placeholder="Enter start point"
            value={routeStartInput}
            onChange={(e) => setRouteStartInput(e.target.value)}
          />
            <input
            type="text"
            name="route"
            placeholder="Enter end point"
            value={routeEndInput}
            onChange={(e) => setRouteEndInput(e.target.value)}
          />
          <input type="submit" value="Generate route" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
      <div>
  <div ref={mapContainer} className="map-container" />
  </div>
    </div>
  );
}
