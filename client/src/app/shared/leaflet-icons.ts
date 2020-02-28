import * as L from 'leaflet';

export class LeafletIcons {

    public static parkingIcon = L.icon({
        iconUrl: '../../assets/parking-icon.png',
        iconSize: [30, 30]
    });

    public static airQualityIcon = L.icon({
        iconUrl: '../../assets/air-quality-icon.png',
        iconSize: [30, 30]
    });

    public static bikeStationIcon = L.icon({
        iconUrl: '../../assets/bike-station-icon.png',
        iconSize: [150, 40],
        iconAnchor: [75, 39],
        popupAnchor: [0, -19]
    });

    public static busIcon = L.icon({
        iconUrl: '../../assets/bus-icon.png',
        iconSize: [40, 40]
    });

}
