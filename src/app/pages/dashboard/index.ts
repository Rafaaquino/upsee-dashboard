import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { animate, style, transition, trigger } from '@angular/animations';
import { DataService } from './service/data.service';
import { FilterService } from './service/filter.service';
import { IParamsData } from './models/params-data.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MockDataService } from './service/MockData.service';
import { IData, IFrequencyByTimeRange, IGender, IGenderFormatTime, IScoreTotal } from './models/data.interface';
import { FlatpickrOptions } from 'ng2-flatpickr';

@Component({
    moduleId: module.id,
    templateUrl: './index.html',
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})
export class IndexComponent implements OnInit {
    store: any;
    revenueChart: any;
    salesByCategory: any;
    dailySales: any;
    totalOrders: any;
    uniqueVisitor: any;
    lineTimeHours: any;
    hitRate: any;
    isLoading = true;
    filterForm: FormGroup;
    fetchData: IData[] = [];
    averageStayTime: any;
    genderProportionByPeriod: any;
    frequencyByWeekday: any;
    gender: any;
    totalPeople: any;
    totalScore: IScoreTotal = { genderScore: 0, personScore: 0 };
    genderFormatTime: IGenderFormatTime = { male: '00:00:00', female: '00:00:00' };
    frequencyByTimeRange: IFrequencyByTimeRange = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    params: IParamsData = { cliente_id: '21122024', from: '21/12/24', to: '21/12/24' };
    basic: FlatpickrOptions;
    basicEnd: FlatpickrOptions;

    constructor(
        public storeData: Store<any>,
        private fb: FormBuilder,
        private _dataService: DataService,
        private _filterService: FilterService,
        private _mockDataService: MockDataService
    ) {
        this.initStore();
        this.isLoading = false;
        this.filterForm = this.fb.group({
            dateFilter: ['today'], // Options: 'today', 'month', 'year', 'range'
            startDate: [null],
            endDate: [null],
        });

        this.basic = {
            defaultDate: '00/00/00 00:00:00',
            dateFormat: 'DD/MM/YY HH:mm:ss',
            position: this.store.rtlClass === 'rtl' ? 'auto right' : 'auto left',
        };

        this.basicEnd = {
            defaultDate: '00/00/00  00:00:00',
            dateFormat: 'DD/MM/YY HH:mm:ss',
            position: this.store.rtlClass === 'rtl' ? 'auto right' : 'auto left',
        };

        this.initializeData(); // Usamos uma função separada para garantir a inicialização síncrona
    }

    async ngOnInit() {
        this.filterForm.valueChanges.subscribe(() => {
            this.updateChart();
        });
    }

    private async initializeData() {
        this.fetchData = await this._mockDataService.generateMockData();

        console.log('início', this.fetchData);
        this.updateChart();
    }

    private async getFetchData(): Promise<any> {
        try {
            return await firstValueFrom(this._dataService.getData(this.params));
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            return null;
        }
    }

    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                const hasChangeTheme = this.store?.theme !== d?.theme;
                const hasChangeLayout = this.store?.layout !== d?.layout;
                const hasChangeMenu = this.store?.menu !== d?.menu;
                const hasChangeSidebar = this.store?.sidebar !== d?.sidebar;

                this.store = d;

                if (hasChangeTheme || hasChangeLayout || hasChangeMenu || hasChangeSidebar) {
                    if (this.isLoading || hasChangeTheme) {
                        this.initCharts(); //init charts
                    } else {
                        setTimeout(() => {
                            this.initCharts(); // refresh charts
                        }, 300);
                    }
                }
            });
    }

    initCharts() {
        const isDark = this.store.theme === 'dark' || this.store.isDarkMode ? true : false;
        const isRtl = this.store.rtlClass === 'rtl' ? true : false;

        // revenue
        this.revenueChart = {
            chart: {
                height: 325,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
                lineCap: 'square',
            },
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 10,
                left: -7,
                top: 22,
            },
            colors: isDark ? ['#2196f3', '#e7515a'] : ['#1b55e2', '#e7515a'],
            markers: {
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: 6,
                        fillColor: '#1b55e2',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesIndex: 1,
                        dataPointIndex: 5,
                        fillColor: '#e7515a',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                ],
            },
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    show: true,
                },
                labels: {
                    offsetX: isRtl ? 2 : 0,
                    offsetY: 5,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-xaxis-title',
                    },
                },
            },
            yaxis: {
                tickAmount: 7,
                labels: {
                    formatter: (value: number) => {
                        return value / 1000 + 'K';
                    },
                    offsetX: isRtl ? -30 : -10,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                opposite: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                yaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '16px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                x: {
                    show: false,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: isDark ? 0.19 : 0.28,
                    opacityTo: 0.05,
                    stops: isDark ? [100, 100] : [45, 100],
                },
            },
            series: [
                {
                    name: 'Income',
                    data: [168, 16800, 15500, 17800, 15500, 17000, 19000, 16000, 15000, 17000, 14000, 17000],
                },
                {
                    name: 'Expenses',
                    data: [165, 17500, 16200, 17300, 16000, 19500, 16000, 17000, 16000, 19000, 18000, 19000],
                },
            ],
        };

        //lineTimeHours
        this.lineTimeHours = {
            chart: {
                type: 'line', // Altere para 'area' se desejar
                height: 350,
                toolbar: {
                    show: false, // Desativa a toolbar
                },
            },
            xaxis: {
                categories: [],
                title: {
                    text: 'Horários',
                },
            },
            stroke: {
                curve: 'smooth',
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'light',
                    type: 'horizontal',
                    shadeIntensity: 0.5,
                    gradientToColors: undefined,
                    inverseColors: true,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 50, 100],
                },
            },
            dataLabels: {
                enabled: false,
            },
            series: [
                {
                    name: 'Pessoas',
                    data: [],
                },
            ],
        };

        //
        this.uniqueVisitor = {
            chart: {
                height: 360,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 2,
                colors: ['transparent'],
            },
            colors: ['#5c1ac3', '#ffbb44'],
            dropShadow: {
                enabled: true,
                blur: 3,
                color: '#515365',
                opacity: 0.4,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 10,
                    borderRadiusApplication: 'end',
                },
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                itemMargin: {
                    horizontal: 8,
                    vertical: 8,
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                padding: {
                    left: 20,
                    right: 20,
                },
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                axisBorder: {
                    show: true,
                    color: isDark ? '#3b3f5c' : '#e0e6ed',
                },
            },
            yaxis: {
                tickAmount: 6,
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: isDark ? 'dark' : 'light',
                    type: 'vertical',
                    shadeIntensity: 0.3,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                y: {
                    formatter: (val: any) => {
                        return val;
                    },
                },
            },
            series: [
                {
                    name: 'Direct',
                    data: [58, 44, 55, 57, 56, 61, 58, 63, 60, 66, 56, 63],
                },
                {
                    name: 'Organic',
                    data: [91, 76, 85, 101, 98, 87, 105, 91, 114, 94, 66, 70],
                },
            ],
        };

        //HitRate
        this.hitRate = {
            series: [75],
            chart: {
                height: 350,
                type: 'radialBar',
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 225,
                    hollow: {
                        margin: 0,
                        size: '70%',
                        background: '#fff',
                        image: undefined,
                        imageOffsetX: 0,
                        imageOffsetY: 0,
                        position: 'front',
                        dropShadow: {
                            enabled: true,
                            top: 3,
                            left: 0,
                            blur: 4,
                            opacity: 0.5,
                        },
                    },
                    track: {
                        background: '#fff',
                        strokeWidth: '67%',
                        margin: 0, // margin is in pixels
                        dropShadow: {
                            enabled: true,
                            top: -3,
                            left: 0,
                            blur: 4,
                            opacity: 0.7,
                        },
                    },

                    dataLabels: {
                        show: true,
                        name: {
                            offsetY: -10,
                            show: true,
                            color: '#888',
                            fontSize: '17px',
                        },
                        value: {
                            formatter: function (val: any) {
                                return parseInt(val);
                            },
                            color: '#111',
                            fontSize: '36px',
                            show: true,
                        },
                    },
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: 'horizontal',
                    shadeIntensity: 0.5,
                    gradientToColors: ['#ABE5A1'],
                    inverseColors: true,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 100],
                },
            },
            stroke: {
                lineCap: 'round',
            },
            labels: ['Porcentagem'],
        };

        // sales by category
        this.salesByCategory = {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: isDark ? '#0e1726' : '#fff',
            },
            colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                },
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                        return a + b;
                                    }, 0);
                                },
                            },
                        },
                    },
                },
            },
            labels: ['Homem', 'Mulher'],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
            series: [985, 737, 270],
        };

        // daily sales
        // this.dailySales = {
        //     chart: {
        //         height: 160,
        //         type: 'bar',
        //         fontFamily: 'Nunito, sans-serif',
        //         toolbar: {
        //             show: false,
        //         },
        //         stacked: true,
        //         stackType: '100%',
        //     },
        //     dataLabels: {
        //         enabled: false,
        //     },
        //     stroke: {
        //         show: true,
        //         width: 1,
        //     },
        //     colors: ['#e2a03f', '#e0e6ed'],
        //     responsive: [
        //         {
        //             breakpoint: 480,
        //             options: {
        //                 legend: {
        //                     position: 'bottom',
        //                     offsetX: -10,
        //                     offsetY: 0,
        //                 },
        //             },
        //         },
        //     ],
        //     xaxis: {
        //         labels: {
        //             show: false,
        //         },
        //         categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
        //     },
        //     yaxis: {
        //         show: false,
        //     },
        //     fill: {
        //         opacity: 1,
        //     },
        //     plotOptions: {
        //         bar: {
        //             horizontal: false,
        //             columnWidth: '25%',
        //         },
        //     },
        //     legend: {
        //         show: false,
        //     },
        //     grid: {
        //         show: false,
        //         xaxis: {
        //             lines: {
        //                 show: false,
        //             },
        //         },
        //         padding: {
        //             top: 10,
        //             right: -20,
        //             bottom: -20,
        //             left: -20,
        //         },
        //     },
        //     series: [
        //         {
        //             name: 'Sales',
        //             data: [44, 55, 41, 67, 22, 43, 21],
        //         },
        //         {
        //             name: 'Last Week',
        //             data: [13, 23, 20, 8, 13, 27, 33],
        //         },
        //     ],
        // };

        // total orders
        this.totalOrders = {
            chart: {
                height: 290,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: isDark ? ['#00ab55'] : ['#00ab55'],
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            yaxis: {
                min: 0,
                show: false,
            },
            grid: {
                padding: {
                    top: 125,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            fill: {
                opacity: 1,
                type: 'gradient',
                gradient: {
                    type: 'vertical',
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: 0.3,
                    opacityTo: 0.05,
                    stops: [100, 100],
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
            },
            series: [
                {
                    name: 'Sales',
                    data: [28, 40, 36, 52, 38, 60, 38, 52, 36, 40],
                },
            ],
        };

        //frequencyByWeekday
        this.frequencyByWeekday = {
            series: [
                {
                    name: 'Frequência',
                    data: [],
                },
            ],
            chart: {
                type: 'bar', // Ou 'column' para gráfico de colunas
                height: 350,
                toolbar: {
                    show: false, // Remove a toolbar
                },
            },
            xaxis: {
                categories: [], // Dias da semana
                title: {
                    text: 'Dia da Semana',
                },
            },
            yaxis: {
                title: {
                    text: 'Número de Pessoas',
                },
            },
            dataLabels: {
                enabled: false,
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    horizontal: false, // Altere para true para barras horizontais
                },
            },
            fill: {
                opacity: 1,
            },
            colors: ['#1E90FF'], // Cor opcional
        };

        //
        this.genderProportionByPeriod = {
            series: [
                {
                    name: 'Masculino',
                    data: [],
                },
                {
                    name: 'Feminino',
                    data: [],
                },
            ],
            chart: {
                type: 'bar', // Altere para 'donut' para gráfico de rosca
                height: 350,
                stacked: false, // Empilhamento
                toolbar: {
                    show: false, // Remove a toolbar
                },
            },
            xaxis: {
                categories: [], // Faixas horárias
                title: {
                    text: 'Período do Dia',
                },
            },
            yaxis: {
                title: {
                    text: 'Quantidade',
                },
            },
            fill: {
                opacity: 1,
            },
            colors: ['#1E90FF', '#FF69B4'], // Azul e rosa para representar gêneros
            plotOptions: {
                bar: {
                    horizontal: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            legend: {
                position: 'top',
            },
        };
    }

    updateChart(): void {
        debugger;
        const filteredData = this._filterService.filterData(this.fetchData, this.filterForm.value);

        const genderCountByMonth = this._filterService.countGenderByMonth(filteredData);
        console.log('genderCountByMonth', genderCountByMonth);
        genderCountByMonth.map((monthData) => {
            this.totalPeople = monthData.male + monthData.female;
        });

        console.log('totalPeople', this.totalPeople);

        this.totalScore = this._filterService.calculateGenderScoreAverage(filteredData);
        console.log('totalScore', this.totalScore);
        const hitRatePercent = this.totalScore?.personScore?.toFixed(1).toString();

        console.log('hitRatePercent', hitRatePercent);

        const isDark = this.store.theme === 'dark' || this.store.isDarkMode ? true : false;
        const isRtl = this.store.rtlClass === 'rtl' ? true : false;

        this.averageStayTime = this._filterService.calculateAverageStayTime(filteredData);
        console.log(`Média de Permanência: ${this.averageStayTime}`);

        this.genderFormatTime = this._filterService.calculateAverageStayTimeByGender(filteredData);
        console.log(`Média de Permanência por genero: ${this.genderFormatTime.female} - ${this.genderFormatTime.male}`);

        this.frequencyByTimeRange = this._filterService.calculateFrequencyByTimeRange(filteredData);
        console.log('Frequência por Faixa Horária:', this.frequencyByTimeRange);

        const peopleData = this._filterService.calculatePeopleOverTime(filteredData);

        const weekdayData = this._filterService.calculateFrequencyByWeekday(filteredData);
        console.log('Frequência por semana:', weekdayData);

        const proportionData = this._filterService.calculateGenderProportionByPeriod(filteredData);
        console.log('Frequência por genero:', proportionData);

        this.uniqueVisitor = {
            ...this.uniqueVisitor,
            xaxis: {
                categories: genderCountByMonth.map((monthData) => monthData.month),
                axisBorder: {
                    show: true,
                    color: isDark ? '#3b3f5c' : '#e0e6ed',
                },
            },
            series: [
                {
                    name: 'Homem',
                    data: genderCountByMonth.map((monthData) => monthData.male),
                },
                {
                    name: 'Mulher',
                    data: genderCountByMonth.map((monthData) => monthData.female),
                },
            ],
        };

        this.salesByCategory = {
            ...this.salesByCategory,
            series: this._filterService.filterGenderCounts(filteredData).series,
        };

        this.lineTimeHours = {
            ...this.lineTimeHours,
            series: [
                {
                    name: 'Pessoas',
                    data: peopleData.counts,
                },
            ],
            xaxis: {
                categories: peopleData.times,
                title: {
                    text: 'Horários mais movimentados',
                },
            },
        };

        this.hitRate = {
            ...this.hitRate,
            series: [hitRatePercent],
        };

        this.frequencyByWeekday = {
            ...this.frequencyByWeekday,
            series: [
                {
                    name: 'Frequência',
                    data: weekdayData.counts,
                },
            ],
            xaxis: {
                categories: weekdayData.days, // Dias da semana
                title: {
                    text: 'Dia da Semana',
                },
            },
        };

        this.genderProportionByPeriod = {
            ...this.genderProportionByPeriod,
            series: [
                {
                    name: 'Masculino',
                    data: proportionData.male,
                },
                {
                    name: 'Feminino',
                    data: proportionData.female,
                },
            ],
            xaxis: {
                categories: proportionData.labels, // Faixas horárias
                title: {
                    text: 'Período do Dia',
                },
            },
        };
    }
}
