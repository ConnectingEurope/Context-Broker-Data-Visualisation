export class FwiUtils {

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

    public static readonly entityName: { [key: string]: string } = {

        AirQualityObserved: 'Air Quality Observer',

    };

}
