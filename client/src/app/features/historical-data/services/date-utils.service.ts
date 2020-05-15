import { Injectable } from '@angular/core';
import { AggregatePeriod } from '../models/historical-data-objects';
import { Moment } from 'moment';
import * as moment from 'moment';
import { HistoricalDataGraphComponent } from '../components/historical-data-graph/historical-data-graph.component';

@Injectable({
    providedIn: 'root',
})
export class DateUtilsService {

    public setupDates(historicalComp: HistoricalDataGraphComponent): void {
        const d: Date = new Date();

        // Hours management
        historicalComp.hourDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const hourBefore: number = d.getHours() - 1;
        historicalComp.hourDate.setHours(hourBefore >= 0 ? hourBefore : 23);

        // Days management
        historicalComp.dayDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

        // Months management
        historicalComp.monthDate = new Date(d.getFullYear(), d.getMonth());

        // Years management
        historicalComp.currentYear = new Date().getFullYear();
        historicalComp.yearDate = historicalComp.currentYear;
        const yearsRange: number[] = [...Array(historicalComp.currentYear - historicalComp.firstYear + 1).keys()]
            .map(y => y + historicalComp.firstYear);
        historicalComp.years = yearsRange.map(y => ({ label: String(y), value: y }));
    }

    public getDateFrom(historicalComp: HistoricalDataGraphComponent): string {
        let d: Date;
        switch (historicalComp.currentPeriod) {

            case AggregatePeriod.MINUTE:
                d = new Date(historicalComp.hourDate);
                break;

            case AggregatePeriod.HOUR:
                d = new Date(historicalComp.dayDate);
                break;

            case AggregatePeriod.DAY:
                d = new Date(historicalComp.monthDate);
                d = new Date(d.getFullYear(), d.getMonth(), 1);
                break;

            case AggregatePeriod.MONTH:
                d = new Date(historicalComp.yearDate, 0, 1);
                break;

        }
        return d.toUTCString();
    }

    public getDateTo(historicalComp: HistoricalDataGraphComponent): string {
        let d: Date;
        switch (historicalComp.currentPeriod) {

            case AggregatePeriod.MINUTE:
                d = new Date(historicalComp.hourDate);
                d.setMinutes(59);
                d.setSeconds(59);
                d.setMilliseconds(59);
                break;

            case AggregatePeriod.HOUR:
                d = new Date(historicalComp.dayDate);
                d.setHours(23);
                d.setMinutes(59);
                d.setSeconds(59);
                d.setMilliseconds(59);
                break;

            case AggregatePeriod.DAY:
                d = new Date(historicalComp.monthDate);
                d = new Date(d.getFullYear(), (d.getMonth() + 1) % 12, 1);
                break;

            case AggregatePeriod.MONTH:
                d = new Date(historicalComp.yearDate + 1, 0, 1);
                break;

        }
        return d.toUTCString();
    }

    public getDateFormat(offset: number, historicalComp: HistoricalDataGraphComponent): string {
        let d: Moment;

        switch (historicalComp.currentPeriod) {

            case AggregatePeriod.MINUTE:
                d = moment.utc(historicalComp.hourDate);
                d.minutes(offset);
                return moment(d).local().format('HH:mm');

            case AggregatePeriod.HOUR:
                d = moment.utc(historicalComp.dayDate);
                const hourStart: string = moment(d.hours(offset)).local().format('HH');
                const hourEnd: string = moment(d.hours((offset + 1) % 23)).local().format('HH');
                return hourStart + ':00 - ' + hourEnd + ':00';

            case AggregatePeriod.DAY:
                d = moment.utc(historicalComp.monthDate);
                return String(offset) + ' (' + moment(d).local().date(offset).format('ddd') + ')';

            case AggregatePeriod.MONTH:
                return moment().month(offset - 1).format('MMMM');

        }
    }

    public getDatePeriod(historicalComp: HistoricalDataGraphComponent): string {
        let d: Moment;

        switch (historicalComp.currentPeriod) {

            case AggregatePeriod.MINUTE:
                d = moment.utc(historicalComp.hourDate);
                const hourStart: string = moment(d).local().format('HH:mm');
                const hourEnd: string = moment(d.hours((d.hours() + 1) % 23)).local().format('HH:mm');
                return 'at ' + hourStart + '-' + hourEnd;

            case AggregatePeriod.HOUR:
                d = moment.utc(historicalComp.dayDate);
                return 'in ' + moment(d).local().format('DD/MM/YYYY');

            case AggregatePeriod.DAY:
                d = moment.utc(historicalComp.monthDate);
                return 'in ' + moment(d).local().format('MMMM, YYYY');

            case AggregatePeriod.MONTH:
                return 'in ' + historicalComp.yearDate;

        }
    }

}
