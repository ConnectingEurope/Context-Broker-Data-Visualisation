import * as L from 'leaflet';

export class LeafletIcons {

    public static iconSize: number = 40;

    public static readonly icons: { [key: string]: L.Icon } = {

        alerts: LeafletIcons.getIcon('../../assets/icons/Alerts.png'),
        smartEnvironment: LeafletIcons.getIcon('../../assets/icons/SmartEnvironment.png'),
        environment: LeafletIcons.getIcon('../../assets/icons/Environment.png'),
        pointOfInterest: LeafletIcons.getIcon('../../assets/icons/PointOfInterest.png'),
        civicIssuesTracking: LeafletIcons.getIcon('../../assets/icons/CivicIssueTracking.png'),
        streetLighting: LeafletIcons.getIcon('../../assets/icons/StreetLightning.png'),
        device: LeafletIcons.getIcon('../../assets/icons/Devices.png'),
        transport: LeafletIcons.getIcon('../../assets/icons/Transportation.png'),
        indicators: LeafletIcons.getIcon('../../assets/icons/Indicators.png'),
        wasteManagement: LeafletIcons.getIcon('../../assets/icons/WasteManagement.png'),
        parking: LeafletIcons.getIcon('../../assets/icons/Parking.png'),
        weather: LeafletIcons.getIcon('../../assets/icons/Weather.png'),
        generic: LeafletIcons.getIcon('../../assets/icons/Generic.png'),

    };

    public static getIcon(url: string): L.Icon {
        return L.icon({
            iconUrl: url,
            iconSize: [LeafletIcons.iconSize, LeafletIcons.iconSize],
            iconAnchor: [LeafletIcons.iconSize / 2, LeafletIcons.iconSize],
            popupAnchor: [0, -LeafletIcons.iconSize],
            tooltipAnchor: [0, -LeafletIcons.iconSize],
        });
    }

}
