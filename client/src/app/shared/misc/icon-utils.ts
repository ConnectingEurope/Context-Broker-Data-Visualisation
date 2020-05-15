import * as L from 'leaflet';

export class IconUtils {

    public static iconSize: number = 40;

    public static readonly icons: { [key: string]: string } = {

        alerts: 'fwi-alerts',
        environment: 'fwi-environment',
        smartEnvironment: 'fwi-smart-environment',
        pointOfInterest: 'fwi-point-of-interest',
        civicIssuesTracking: 'fwi-civic-issue-tracking',
        streetLighting: 'fwi-street-lightning',
        device: 'fwi-devices',
        transport: 'fwi-transportation',
        indicators: 'fwi-indicators',
        wasteManagement: 'fwi-waste-management',
        parking: 'fwi-parking',
        weather: 'fwi-weather',
        generic: 'fwi-generic',

    };

    public static readonly categoryName: { [key: string]: string } = {

        alerts: 'Alerts',
        environment: 'Environment',
        smartEnvironment: 'Smart Environment',
        pointOfInterest: 'Point of Interest',
        civicIssuesTracking: 'Civic Issues Tracking',
        streetLighting: 'Street Lightingg',
        device: 'Devices',
        transport: 'Transportation',
        indicators: 'Indicators',
        wasteManagement: 'Waste Management',
        parking: 'Parking',
        weather: 'Weather',
        generic: 'Generic',

    };

    public static readonly leafletIcons: { [key: string]: L.Icon } = {

        alerts: IconUtils.getIcon('../../assets/icons-png/Alerts.png'),
        smartEnvironment: IconUtils.getIcon('../../assets/icons-png/SmartEnvironment.png'),
        environment: IconUtils.getIcon('../../assets/icons-png/Environment.png'),
        pointOfInterest: IconUtils.getIcon('../../assets/icons-png/PointOfInterest.png'),
        civicIssuesTracking: IconUtils.getIcon('../../assets/icons-png/CivicIssueTracking.png'),
        streetLighting: IconUtils.getIcon('../../assets/icons-png/StreetLightning.png'),
        device: IconUtils.getIcon('../../assets/icons-png/Devices.png'),
        transport: IconUtils.getIcon('../../assets/icons-png/Transportation.png'),
        indicators: IconUtils.getIcon('../../assets/icons-png/Indicators.png'),
        wasteManagement: IconUtils.getIcon('../../assets/icons-png/WasteManagement.png'),
        parking: IconUtils.getIcon('../../assets/icons-png/Parking.png'),
        weather: IconUtils.getIcon('../../assets/icons-png/Weather.png'),
        generic: IconUtils.getIcon('../../assets/icons-png/Generic.png'),

    };

    public static getIcon(url: string): L.Icon {
        return L.icon({
            iconUrl: url,
            iconSize: [IconUtils.iconSize, IconUtils.iconSize],
            iconAnchor: [IconUtils.iconSize / 2, IconUtils.iconSize],
            popupAnchor: [0, -IconUtils.iconSize],
            tooltipAnchor: [0, -IconUtils.iconSize],
        });
    }

}
