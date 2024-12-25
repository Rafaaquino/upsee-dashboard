import { Injectable } from '@angular/core';
import { IData, IGender, IGenderData } from '../models/data.interface';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

// Registrar o plugin
dayjs.extend(isBetween);
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

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

    calculateGenderScoreAverage(data: any[]): number {
        const scores = data.filter((item) => typeof item.gender_score === 'number').map((item) => item.gender_score);

        if (scores.length === 0) return 0;

        const totalScore = scores.reduce((sum, score) => sum + score, 0);
        const average = totalScore / scores.length;

        return average * 100;
    }

    filterGenderCounts(data: any[]): { series: number[] } {
        const counts = {
            total: 0,
            male: 0,
            female: 0,
        };

        data.forEach((item) => {
            if (item.gender === 'masculino') {
                counts.male += 1;
            } else if (item.gender === 'feminino') {
                counts.female += 1;
            }
        });

        counts.total = counts.male + counts.female;

        return {
            series: [counts.male, counts.female],
        };
    }

    calculateAverageStayTime(data: any[]): string {
        let totalSeconds = 0;
        let validEntries = 0;

        data.forEach((item) => {
            const detectedTime = dayjs(item.detected_time, 'DD/MM/YY HH:mm:ss', true);
            const stopTime = dayjs(item.stop_detection_time, 'DD/MM/YY HH:mm:ss', true);

            if (detectedTime.isValid() && stopTime.isValid()) {
                const duration = stopTime.diff(detectedTime, 'seconds');
                if (duration > 0) {
                    totalSeconds += duration;
                    validEntries += 1;
                }
            }
        });

        // Formatar para HH:mm:ss
        return this.formatTime(totalSeconds, validEntries);
    }

    calculateAverageStayTimeByGender(data: any[]): { male: string; female: string } {
        const genderStats = {
            male: { totalSeconds: 0, count: 0 },
            female: { totalSeconds: 0, count: 0 },
        };

        data.forEach((item) => {
            const detectedTime = dayjs(item.detected_time, 'DD/MM/YY HH:mm:ss', true);
            const stopTime = dayjs(item.stop_detection_time, 'DD/MM/YY HH:mm:ss', true);

            if (detectedTime.isValid() && stopTime.isValid()) {
                const duration = stopTime.diff(detectedTime, 'seconds');
                if (duration > 0) {
                    if (item.gender === 'masculino') {
                        genderStats.male.totalSeconds += duration;
                        genderStats.male.count += 1;
                    } else if (item.gender === 'feminino') {
                        genderStats.female.totalSeconds += duration;
                        genderStats.female.count += 1;
                    }
                }
            }
        });

        return {
            male: this.formatTime(genderStats.male.totalSeconds, genderStats.male.count),
            female: this.formatTime(genderStats.female.totalSeconds, genderStats.female.count),
        };
    }

    calculateFrequencyByTimeRange(data: any[]): { morning: number; afternoon: number; evening: number; night: number } {
        const timeRanges = {
            morning: { start: 6, end: 12, count: 0 }, // 06:00 - 11:59
            afternoon: { start: 12, end: 18, count: 0 }, // 12:00 - 17:59
            evening: { start: 18, end: 24, count: 0 }, // 18:00 - 23:59
            night: { start: 0, end: 6, count: 0 }, // 00:00 - 05:59
        };

        data.forEach((item) => {
            const detectedTime = dayjs(item.detected_time, 'DD/MM/YY HH:mm:ss', true);

            if (detectedTime.isValid()) {
                const hour = detectedTime.hour();

                if (hour >= timeRanges.morning.start && hour < timeRanges.morning.end) {
                    timeRanges.morning.count += 1;
                } else if (hour >= timeRanges.afternoon.start && hour < timeRanges.afternoon.end) {
                    timeRanges.afternoon.count += 1;
                } else if (hour >= timeRanges.evening.start && hour < timeRanges.evening.end) {
                    timeRanges.evening.count += 1;
                } else if (hour >= timeRanges.night.start && hour < timeRanges.night.end) {
                    timeRanges.night.count += 1;
                }
            }
        });

        return {
            morning: timeRanges.morning.count,
            afternoon: timeRanges.afternoon.count,
            evening: timeRanges.evening.count,
            night: timeRanges.night.count,
        };
    }

    formatTime = (totalSeconds: number, count: number): string => {
        if (count === 0) return '00:00:00'; // Retorna zero caso não haja entradas válidas
        const averageSeconds = totalSeconds / count;
        const hours = Math.floor(averageSeconds / 3600);
        const minutes = Math.floor((averageSeconds % 3600) / 60);
        const seconds = Math.floor(averageSeconds % 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    normalizeDate = (date: string): string => {
        return date.replace(/\b(\d{1,2})\/(\d{1,2})\/(\d{2}) (\d{2}:\d{2}:\d{2})/, (match, day, month, year, time) => {
            const normalizedDay = day.padStart(2, '0');
            const normalizedMonth = month.padStart(2, '0');
            return `${normalizedDay}/${normalizedMonth}/${year} ${time}`;
        });
    };
}
