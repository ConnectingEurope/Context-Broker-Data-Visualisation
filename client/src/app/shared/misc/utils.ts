export class Utils {

    public static mathItUp: any = {
        '<': (x: number, y: number): boolean => x < y,
        '<=': (x: number, y: number): boolean => x <= y,
        '=': (x: number, y: number): boolean => x === y,
        '>=': (x: number, y: number): boolean => x >= y,
        '>': (x: number, y: number): boolean => x > y,
    };

    public static whiteSpaceExp: RegExp = /[^\s]/;
    public static pathExp: RegExp = /^\//;

}
