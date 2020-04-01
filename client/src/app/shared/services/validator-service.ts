import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ValidatorService {

    public whiteSpaceExp: RegExp = /[^\s]/;
    public httpExp: RegExp = /^(http:\/\/|https:\/\/)/;
    public pathExp: RegExp = /^\//;

}
