import * as L from 'leaflet';

export class LeafletIcons {

    public static parkingIcon = L.icon({
        iconUrl: '../../assets/parking-icon.png',
        iconSize: [30, 30],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28]
    });

    public static stationBikeIcon = L.icon({
        iconUrl: '../../assets/station-bike-icon.png',
        iconSize: [150, 40],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28]
    });

    public static busIcon = L.icon({
        iconUrl: '../../assets/bus-icon.png',
        iconSize: [40, 40],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28]
    });

}