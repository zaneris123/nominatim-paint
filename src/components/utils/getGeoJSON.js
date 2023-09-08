import { Typography } from '@mui/material';
import axios from 'axios';

export default function getPolygonGeoJSON(lat, long, zoom = 10){
    return axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=geojson&polygon_geojson=1&zoom=${zoom}`)
        .then(res => {
            return !(res.data.error) ? res.data : null;
        })
}

export const jsonZoomMarks = [
    {
      value: 0,
      label: <Typography color={'grey'}>Continent / Sea</Typography>,
    },
    {
      value: 3,
      label: <Typography color={'grey'}>Country</Typography>,
    },
    {
      value: 5,
      label: <Typography color={'grey'}>State</Typography>,
    },
    {
      value: 6,
      label: <Typography color={'grey'}>Region</Typography>,
    },
    {
      value: 8,
      label: <Typography color={'grey'}>County</Typography>,
    },
    {
      value: 10,
      label: <Typography color={'grey'}>City</Typography>,
    },
    {
      value: 12,
      label: <Typography color={'grey'}>Town / Borough</Typography>,
    },
    {
      value: 13,
      label: <Typography color={'grey'}>Village / Suburb</Typography>,
    },
    {
      value: 14,
      label: <Typography color={'grey'}>Neighborhood</Typography>,
    },
    {
      value: 15,
      label: <Typography color={'grey'}>Locality</Typography>,
    },
    {
      value: 16,
      label: <Typography color={'grey'}>Major Street</Typography>,
    },
    {
      value: 17,
      label: <Typography color={'grey'}>Minor Street</Typography>,
    },
    {
      value: 18,
      label: <Typography color={'grey'}>Building</Typography>,
    },
  ];