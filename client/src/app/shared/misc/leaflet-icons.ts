import * as L from 'leaflet';

export class LeafletIcons {

    public static readonly icons: { [key: string]: L.Icon } = {

        OffStreetParking: L.icon({
            iconUrl: '../../assets/parking-icon.png',
            iconSize: [30, 30],
        }),

        AirQualityObserved: L.icon({
            iconUrl: '../../assets/air-quality-icon.png',
            iconSize: [30, 30],
        }),

    };

}
