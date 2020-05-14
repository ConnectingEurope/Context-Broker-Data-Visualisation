export interface TypeDto {
    type: string;
    attrs: {
        [key: string]: {
            types: string[];
        };
    };
}
