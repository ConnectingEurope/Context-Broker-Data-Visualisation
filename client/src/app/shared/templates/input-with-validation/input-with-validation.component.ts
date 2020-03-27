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

  constructor(protected configDashboardService: ConfigDashboardService) { }

  public ngOnInit(): void {
    this.fControl = this.group.get(this.controlName);
  }

  protected shouldErrorBeDisplayed(): boolean {
    return this.fControl.dirty && this.fControl.errors !== null;
  }

  protected getErrorMessage(): string {
    if (this.fControl.hasError('required')) { return this.requiredError; }
    return '-';
  }

  protected onChange(event: any): void {
    this.changeText.emit(event);
  }

  protected onClick(event: any): void {
    this.buttonClick.emit(event);
  }

}
