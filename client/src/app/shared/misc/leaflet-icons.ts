import * as L from 'leaflet';

export class LeafletIcons {

    public static iconSize: number = 40;

    public static readonly icons: { [key: string]: L.Icon } = {

        environment: L.icon({
            iconUrl: '../../assets/icons/Environment.png',
            iconSize: [LeafletIcons.iconSize, LeafletIcons.iconSize],
            iconAnchor: [LeafletIcons.iconSize / 2, LeafletIcons.iconSize],
        }),

        generic: L.icon({
            iconUrl: '../../assets/icons/Generic.png',
            iconSize: [LeafletIcons.iconSize, LeafletIcons.iconSize],
            iconAnchor: [LeafletIcons.iconSize / 2, LeafletIcons.iconSize],
        }),

    };

}
