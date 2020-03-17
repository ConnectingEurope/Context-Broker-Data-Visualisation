import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-config-dashboard',
  templateUrl: './config-dashboard.component.html',
  styleUrls: ['./config-dashboard.component.scss'],
})
export class ConfigDashboardComponent {

  protected contextBrokers: any[] = [];
  private defaultContextName: string = 'Madrid Air';
  private defaultUrl: string = 'https://streams.lab.fiware.org';

  protected onAddContextBroker(): void {
    this.contextBrokers.unshift({
      header: this.defaultContextName + ' - ' + this.defaultUrl,
      form: new FormGroup({
        name: new FormControl(this.defaultContextName),
        url: new FormControl('https://streams.lab.fiware.org'),
        port: new FormControl(''),
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
