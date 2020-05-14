import * as _getObjectSafely from 'lodash.get';
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

    public static truncateString(str: string, maxChar: number): string {
        return (str.length > maxChar ? str.substring(0, maxChar) + '...' : str);
    }

    public static getListObjectsSafely(property: string, ...elements: any[]): boolean {
        let hasProperty: boolean = true;
        elements.forEach(element => {
            if (!_getObjectSafely(element, property)) {
                hasProperty = false;
            }
        });
        return hasProperty;
    }


}
