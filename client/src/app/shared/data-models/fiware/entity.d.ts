export interface Entity {
    id?: string;
    type?: string;
    source?: string;
    dataProvider?: string;
    description?: string;
    location?: {
        coordinates?: number[];
    };
}