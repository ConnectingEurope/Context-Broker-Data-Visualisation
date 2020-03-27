import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ConfigDashboardService } from 'src/app/features/config-dashboard/services/config-dashboard-service/config-dashboard.service';

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
  @Output() public changeText: EventEmitter<any> = new EventEmitter<any>();
  @Output() public buttonClick: EventEmitter<any> = new EventEmitter<any>();

  private fControl: AbstractControl;

  private requiredError: string = 'This field is mandatory';
  private emptySpacePatternError: string = this.requiredError;
  private httpPatternError: string = 'The URL must start with "http://" or "https://"';
  private pathPatternError: string = 'The path must start with "/"';

  constructor(protected configDashboardService: ConfigDashboardService) { }

  public ngOnInit(): void {
    this.fControl = this.group.get(this.controlName);
  }

  protected shouldErrorBeDisplayed(): boolean {
    return this.fControl.dirty && this.fControl.errors !== null;
  }

  protected getErrorMessage(): string {
    if (this.fControl.hasError('required')) { return this.requiredError; }
    if (this.checkWhteSpacePattern()) { return this.requiredError; }
    if (this.checkHttpPattern()) { return this.httpPatternError; }
    if (this.checkPathPattern()) { return this.pathPatternError; }
    return '-';
  }

  protected onChange(event: any): void {
    this.changeText.emit(event);
  }

  protected onClick(event: any): void {
    this.buttonClick.emit(event);
  }

  private checkWhteSpacePattern(): boolean {
    return this.checkPattern(this.configDashboardService.whiteSpaceExp);
  }

  private checkHttpPattern(): boolean {
    return this.checkPattern(this.configDashboardService.httpExp);
  }

  private checkPathPattern(): boolean {
    return this.checkPattern(this.configDashboardService.pathExp);
  }

  private checkPattern(pattern: RegExp): boolean {
    return this.fControl.hasError('pattern') &&
      this.fControl.getError('pattern').requiredPattern === pattern.toString();
  }

}
