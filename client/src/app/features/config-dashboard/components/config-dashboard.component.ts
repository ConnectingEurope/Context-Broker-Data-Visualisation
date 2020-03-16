import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-config-dashboard',
  templateUrl: './config-dashboard.component.html',
  styleUrls: ['./config-dashboard.component.scss'],
})
export class ConfigDashboardComponent {

  protected contextBrokers: any[] = [];
  private defaultContextName: string = 'New Context Broker';

  protected onAddContextBroker(): void {
    this.contextBrokers.unshift({
      header: this.defaultContextName,
      form: new FormGroup({
        name: new FormControl(this.defaultContextName),
        url: new FormControl('http://localhost'),
        port: new FormControl('1026'),
      }),
      services: [],
    });
  }

  protected onRemoveContextBroker(index: number): void {
    this.contextBrokers.splice(index, 1);
  }

  protected onApplyConfiguration(): void {
    alert('Submitted');
  }

}
