export interface LayerGroupRegistry {
    parkings?: L.LayerGroup;
    bikeStations?: L.LayerGroup;
    buses?: L.LayerGroup;
}

export class Layer {

    // Transport layer
    static readonly PARKING = new Layer('parking', 'Parkings');
    static readonly BIKE_STATION = new Layer('bikeStation', 'Bike stations');
    static readonly BUS = new Layer('bus', 'Buses');
    static readonly TRANSPORT = new Layer('transport', 'Transport', [
        Layer.PARKING,
        Layer.BIKE_STATION,
        Layer.BUS
    ]);

    private constructor(
        public readonly key: string,
        public readonly value: string,
        public readonly subLayers?: Layer[]
    ) {
    }

}
