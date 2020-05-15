import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Utils } from '../../misc/utils';

@Component({
    selector: 'app-input-with-validation',
    templateUrl: './input-with-validation.component.html',
    styleUrls: ['./input-with-validation.component.scss'],
})
export class InputWithValidationComponent implements OnInit {

    @Input() public label: string;
    @Input() public controlName: string;
    @Input() public group: FormGroup;
    @Input() public required: boolean;
    @Input() public hasButton: boolean;
    @Input() public buttonIcon: string;
    @Input() public tooltipText: string;
    @Output() public changeText: EventEmitter<any> = new EventEmitter<any>();
    @Output() public buttonClick: EventEmitter<any> = new EventEmitter<any>();

    public fControl: AbstractControl;

    private infoRequested: boolean;
    private warningRequested: boolean;

    private requiredError: string = 'This field is mandatory';
    private emptySpacePatternError: string = this.requiredError;
    private pathPatternError: string = 'The path must start with "/"';

    public ngOnInit(): void {
        this.fControl = this.group.get(this.controlName);
    }

    public showInfo(): void {
        this.warningRequested = false;
        this.infoRequested = true;
    }

    public showWarning(): void {
        this.infoRequested = false;
        this.warningRequested = true;
    }

    public shouldErrorBeDisplayed(): boolean {
        return this.fControl.dirty && this.fControl.errors !== null;
    }

    public shouldInfoBeDisplayed(): boolean {
        return this.infoRequested;
    }

    public shouldWarningBeDisplayed(): boolean {
        return this.warningRequested;
    }

    public getErrorMessage(): string {
        if (this.fControl.hasError('required')) { return this.requiredError; }
        if (this.checkWhteSpacePattern()) { return this.emptySpacePatternError; }
        if (this.checkPathPattern()) { return this.pathPatternError; }
        return '-';
    }

    public getInfoMessage(): string {
        return 'Connection succeded';
    }

    public getWarningMessage(): string {
        return 'Connection failed';
    }

    public onChange(event: any): void {
        this.infoRequested = false;
        this.warningRequested = false;
        this.changeText.emit(event);
    }

    public onClick(event: any): void {
        this.buttonClick.emit(event);
    }

    private checkWhteSpacePattern(): boolean {
        return this.checkPattern(Utils.whiteSpaceExp);
    }

    private checkPathPattern(): boolean {
        return this.checkPattern(Utils.pathExp);
    }

    private checkPattern(pattern: RegExp): boolean {
        return this.fControl.hasError('pattern') &&
            this.fControl.getError('pattern').requiredPattern === pattern.toString();
    }

}
