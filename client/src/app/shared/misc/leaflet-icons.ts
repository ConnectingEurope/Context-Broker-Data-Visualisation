import * as L from 'leaflet';

export class LeafletIcons {

    public static iconSize: number = 40;

    public static readonly icons: { [key: string]: L.Icon } = {

        alerts: L.icon({
            iconUrl: '../../assets/icons/Alerts.png',
            iconSize: [LeafletIcons.iconSize, LeafletIcons.iconSize],
            iconAnchor: [LeafletIcons.iconSize / 2, LeafletIcons.iconSize],
        }),

        smartEnvironment: L.icon({
            iconUrl: '../../assets/icons/SmartEnvironment.png',
            iconSize: [LeafletIcons.iconSize, LeafletIcons.iconSize],
            iconAnchor: [LeafletIcons.iconSize / 2, LeafletIcons.iconSize],
        }),

        environment: L.icon({
            iconUrl: '../../assets/icons/Environment.png',
            iconSize: [LeafletIcons.iconSize, LeafletIcons.iconSize],
            iconAnchor: [LeafletIcons.iconSize / 2, LeafletIcons.iconSize],
        }),

        pointOfInterest: L.icon({
            iconUrl: '../../assets/icons/PointOfInterest.png',
            iconSize: [LeafletIcons.iconSize, LeafletIcons.iconSize],
            iconAnchor: [LeafletIcons.iconSize / 2, LeafletIcons.iconSize],
        }),

        civicIssuesTracking: L.icon({
            iconUrl: '../../assets/icons/CivicIssueTracking.png',
            iconSize: [LeafletIcons.iconSize, LeafletIcons.iconSize],
            iconAnchor: [LeafletIcons.iconSize / 2, LeafletIcons.iconSize],
        }),

        streetLighting: L.icon({
            iconUrl: '../../assets/icons/StreetLightning.png',
            iconSize: [LeafletIcons.iconSize, LeafletIcons.iconSize],
            iconAnchor: [LeafletIcons.iconSize / 2, LeafletIcons.iconSize],
        }),

        device: L.icon({
            iconUrl: '../../assets/icons/Devices.png',
            iconSize: [LeafletIcons.iconSize, LeafletIcons.iconSize],
            iconAnchor: [LeafletIcons.iconSize / 2, LeafletIcons.iconSize],
        }),

        transport: L.icon({
            iconUrl: '../../assets/icons/Generic.png',
            iconSize: [LeafletIcons.iconSize, LeafletIcons.iconSize],
            iconAnchor: [LeafletIcons.iconSize / 2, LeafletIcons.iconSize],
        }),

        indicators: L.icon({
            iconUrl: '../../assets/icons/Transportation.png',
            iconSize: [LeafletIcons.iconSize, LeafletIcons.iconSize],
            iconAnchor: [LeafletIcons.iconSize / 2, LeafletIcons.iconSize],
        }),

        wasteManagement: L.icon({
            iconUrl: '../../assets/icons/WasteManagement.png',
            iconSize: [LeafletIcons.iconSize, LeafletIcons.iconSize],
            iconAnchor: [LeafletIcons.iconSize / 2, LeafletIcons.iconSize],
        }),

        parking: L.icon({
            iconUrl: '../../assets/icons/Parking.png',
            iconSize: [LeafletIcons.iconSize, LeafletIcons.iconSize],
            iconAnchor: [LeafletIcons.iconSize / 2, LeafletIcons.iconSize],
        }),

        weather: L.icon({
            iconUrl: '../../assets/icons/Weather.png',
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
