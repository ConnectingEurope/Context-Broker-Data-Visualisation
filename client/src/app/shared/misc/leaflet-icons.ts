import * as L from 'leaflet';

export class LeafletIcons {

    public static readonly icons: { [key: string]: L.Icon } = {

        offStreetParking: L.icon({
            iconUrl: '../../assets/parking-icon.png',
            iconSize: [30, 30],
        }),

        airQualityObserved: L.icon({
            iconUrl: '../../assets/air-quality-icon.png',
            iconSize: [30, 30],
        }),

    };

}
