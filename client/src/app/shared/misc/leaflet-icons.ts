import * as L from 'leaflet';

export class LeafletIcons {

    public static readonly icons: { [key: string]: L.Icon } = {

        OffStreetParking: L.icon({
            iconUrl: '../../assets/icons/parking-icon.png',
            iconSize: [30, 30],
        }),

        AirQualityObserved: L.icon({
            iconUrl: '../../assets/icons/air-quality-icon.png',
            iconSize: [30, 30],
        }),

    };

}
