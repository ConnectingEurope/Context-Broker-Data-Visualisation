/**
 * Application utilities.
 */
export class Utilities {

    /* tslint:disable */
    public static mathItUp: any = {
        '<': function (x: number, y: number): boolean { return x < y; },
        '<=': function (x: number, y: number): boolean { return x <= y; },
        '=': function (x: number, y: number): boolean { return x == y; },
        '>=': function (x: number, y: number): boolean { return x >= y; },
        '>': function (x: number, y: number): boolean { return x > y; },
    }​​​​​​​;

    /**
     * Determines whether a string is empty
     * @str
     */
    public static isEmpty(str: string): boolean {
        return (!str || str.length === 0 || str.trim().length === 0);
    }

}
