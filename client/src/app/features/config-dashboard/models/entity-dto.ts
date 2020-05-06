export interface EntityDto {
    type: string;
    attrs: {
        [key: string]: {
            types: string[];
        };
    };
}
