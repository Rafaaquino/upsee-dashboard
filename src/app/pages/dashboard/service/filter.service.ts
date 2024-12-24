import { Injectable } from '@angular/core';
import { IData, IGender, IGenderData } from '../models/data.interface';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
import isBetween from 'dayjs/plugin/isBetween';

@Injectable({
    providedIn: 'root',
})
export class FilterService {
    genderData: IGenderData = { males: [], females: [] };

    constructor() {}

    filterByGender(data: IData[]) {
        this.genderData = data.reduce(
            (genders: IGenderData, item: IData) => {
                if (item.gender === 'Male') {
                    genders.males.push(item);
                } else if (item.gender === 'Female') {
                    genders.females.push(item);
                }
                return genders;
            },
            { males: [], females: [] }
        );

        console.log('Gender Data:', this.genderData);
    }

    filterData(data: any[], dataFilter: any): any[] {
        const { dateFilter, startDate, endDate } = dataFilter;

        // Determine a base de comparação dependendo do filtro
        const today = dayjs(); // Data de hoje
        let baseDate: any;

        switch (dateFilter) {
            case 'today':
                baseDate = today; // Hoje
                break;
            case 'month':
                baseDate = today.startOf('month'); // Início do mês atual
                break;
            case 'year':
                baseDate = today.startOf('year'); // Início do ano atual
                break;
            case 'range':
                baseDate = null; // O filtro de intervalo já usa startDate e endDate diretamente
                break;
            default:
                baseDate = today; // Padrão para evitar problemas
        }

        return data.filter((item) => {
            const normalizedDate = this.normalizeDate(item.detected_time);
            const detectedTime = dayjs(normalizedDate, 'DD/MM/YY HH:mm:ss', true);
            if (!detectedTime.isValid()) {
                console.log(`Data inválida encontrada: `);
                return false;
            }

            switch (dateFilter) {
                case 'today':
                    return detectedTime.isSame(baseDate, 'day');
                case 'month':
                    return detectedTime.isSame(baseDate, 'month'); // Mesmo mês
                case 'year':
                    return detectedTime.isSame(baseDate, 'year'); // Mesmo ano
                case 'range':
                    return startDate && endDate
                        ? detectedTime.isBetween(dayjs(startDate), dayjs(endDate), 'day', '[]') // Inclusivo
                        : true;
                default:
                    return true;
            }
        });
    }

    countGenderByMonth(data: any[]): Array<{ month: string; male: number; female: number }> {
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

        const genderCount: { [key: string]: { male: number; female: number } } = {};

        data.forEach((item) => {
            const detectedTime = dayjs(item.detected_time, 'DD/MM/YY HH:mm:ss', true); // A data gerada deve estar no formato 'DD/MM/YY HH:mm:ss'
            const month = months[detectedTime.month()]; // Get month name

            if (!genderCount[month]) {
                genderCount[month] = { male: 0, female: 0 };
            }

            if (item.gender === 'masculino') {
                genderCount[month].male += 1;
            } else if (item.gender === 'feminino') {
                genderCount[month].female += 1;
            }
        });

        return Object.keys(genderCount).map((month) => ({
            month,
            male: genderCount[month].male,
            female: genderCount[month].female,
        }));
    }

    normalizeDate = (date: string): string => {
        return date.replace(/\b(\d{1,2})\/(\d{1,2})\/(\d{2}) (\d{2}:\d{2}:\d{2})/, (match, day, month, year, time) => {
            const normalizedDay = day.padStart(2, '0');
            const normalizedMonth = month.padStart(2, '0');
            return `${normalizedDay}/${normalizedMonth}/${year} ${time}`;
        });
    };
}
