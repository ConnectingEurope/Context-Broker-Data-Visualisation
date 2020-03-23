import { Component, Input } from '@angular/core';
import { ConfigDashboardService } from '../../services/config-dashboard-service/config-dashboard.service';
import { MessageService } from 'primeng/api';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/misc/base.component';

@Component({
  selector: 'app-historical-configuration',
  templateUrl: './historical-configuration.component.html',
  styleUrls: ['./historical-configuration.component.scss'],
})
export class HistoricalConfigurationComponent extends BaseComponent {

  @Input() public cb: any;

  constructor(
    private configDashboardService: ConfigDashboardService,
    private messageService: MessageService,
  ) {
    super();
  }

  protected onCheckCygnus(): void {
    const url: string = this.cb.form.value.cygnus;

    this.configDashboardService.checkCygnusHealth(url).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res && res.statusCode === 200 && res.body && res.body.orion) {
        this.onCheckCygnusSuccess();
      } else {
        this.onCheckCygnusSuccess();
      }
    }, err => {
      this.onCheckCygnusFail();
    });
  }

  protected onCheckComet(): void {
    const url: string = this.cb.form.value.comet;

    this.configDashboardService.checkCometHealth(url).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res && res.statusCode === 200 && res.body && res.body.orion) {
        this.onCheckCometSuccess();
      } else {
        this.onCheckCometSuccess();
      }
    }, err => {
      this.onCheckCometFail();
    });
  }

  private onCheckCygnusSuccess(): void {
    this.messageService.clear();
    this.messageService.add({ severity: 'success', summary: 'Cygnus is live!' });
  }

  private onCheckCygnusFail(): void {
    this.messageService.clear();
    this.messageService.add({ severity: 'error', summary: 'Cannot find the Cygnus' });
  }

  private onCheckCometSuccess(): void {
    this.messageService.clear();
    this.messageService.add({ severity: 'success', summary: 'STH-Comet is live!' });
  }

  private onCheckCometFail(): void {
    this.messageService.clear();
    this.messageService.add({ severity: 'error', summary: 'Cannot find the STH-Comet' });
  }

}
