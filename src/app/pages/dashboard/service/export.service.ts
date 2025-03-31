import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as Papa from 'papaparse';
import { IExportSummary } from '../models/export.interface';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Registrar o plugin
dayjs.extend(customParseFormat);

interface ExportData {
    detailedData: Array<{
        'Data e Hora': string;
        Gênero: string;
        'Pontuação Gênero': string;
        'Pontuação Pessoa': string;
        'Tempo de Permanência': string;
    }>;
    weekdayData: Array<{
        'Dia da Semana': string;
        Frequência: number;
    }>;
    genderProportionData: Array<{
        Período: string;
        Masculino: number;
        Feminino: number;
    }>;
    timeRangeData: Array<{
        Período: string;
        'Total de Pessoas': number;
    }>;
}

@Injectable({
    providedIn: 'root',
})
export class ExportService {
    exportData(format: 'pdf' | 'csv' | 'excel', rawData: any[], params: any, summary: IExportSummary): void {
        const data = this.prepareDataForExport(rawData, summary);

        switch (format) {
            case 'pdf':
                this.exportToPDF(data, params, summary);
                break;
            case 'csv':
                this.exportToCSV(data, params);
                break;
            case 'excel':
                this.exportToExcel(data, params, summary);
                break;
        }
    }

    private prepareDataForExport(rawData: any[], summary: IExportSummary): ExportData {
        // Dados detalhados
        const detailedData = rawData.map((item) => {
            // Formatação de data e hora
            const formatDate = (dateStr: string) => {
                if (!dateStr) return 'N/A';

                // Primeiro tenta converter para objeto Date
                const date = new Date(dateStr);
                if (!isNaN(date.getTime())) {
                    return dayjs(date).format('DD/MM/YY HH:mm:ss');
                }

                // Se não funcionar, tenta diferentes formatos de data
                const formats = [
                    'DD/MM/YY HH:mm:ss',
                    'DD/MM/YYYY HH:mm:ss',
                    'YYYY-MM-DD HH:mm:ss',
                    'DD-MM-YY HH:mm:ss',
                    'DD/MM/YY HH:mm',
                    'DD/MM/YYYY HH:mm',
                    'YYYY-MM-DD HH:mm',
                    'DD-MM-YY HH:mm',
                ];

                let parsedDate = null;
                for (const format of formats) {
                    parsedDate = dayjs(dateStr, format, true);
                    if (parsedDate.isValid()) break;
                }

                if (!parsedDate?.isValid()) {
                    // Se ainda não funcionou, tenta extrair data e hora separadamente
                    const [datePart, timePart] = dateStr.split(' ');
                    if (datePart && timePart) {
                        const [day, month, year] = datePart.split(/[/-]/);
                        if (day && month && year) {
                            const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year.slice(-2)} ${timePart}`;
                            return formattedDate;
                        }
                    }
                    return 'N/A';
                }

                return parsedDate.format('DD/MM/YY HH:mm:ss');
            };

            // Cálculo do tempo de permanência
            const calculateStayTime = () => {
                if (!item.detected_time || !item.stop_detection_time) return 'N/A';

                const detectedTime = dayjs(item.detected_time, 'DD/MM/YY HH:mm:ss', true);
                const stopTime = dayjs(item.stop_detection_time, 'DD/MM/YY HH:mm:ss', true);

                if (!detectedTime.isValid() || !stopTime.isValid()) return 'N/A';

                const duration = stopTime.diff(detectedTime, 'seconds');
                if (duration <= 0) return 'N/A';

                const hours = Math.floor(duration / 3600);
                const minutes = Math.floor((duration % 3600) / 60);
                const seconds = duration % 60;

                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            };

            return {
                'Data e Hora': formatDate(item.detected_time),
                Gênero: item.gender || 'N/A',
                'Pontuação Gênero': item.gender_score ? item.gender_score.toFixed(2) : 'N/A',
                'Pontuação Pessoa': item.score ? item.score.toFixed(2) : 'N/A',
                'Tempo de Permanência': calculateStayTime(),
            };
        });

        // Dados de frequência por dia da semana
        const weekdayData = [
            { 'Dia da Semana': 'Domingo', Frequência: summary.frequencyByWeekday?.sunday || 0 },
            { 'Dia da Semana': 'Segunda', Frequência: summary.frequencyByWeekday?.monday || 0 },
            { 'Dia da Semana': 'Terça', Frequência: summary.frequencyByWeekday?.tuesday || 0 },
            { 'Dia da Semana': 'Quarta', Frequência: summary.frequencyByWeekday?.wednesday || 0 },
            { 'Dia da Semana': 'Quinta', Frequência: summary.frequencyByWeekday?.thursday || 0 },
            { 'Dia da Semana': 'Sexta', Frequência: summary.frequencyByWeekday?.friday || 0 },
            { 'Dia da Semana': 'Sábado', Frequência: summary.frequencyByWeekday?.saturday || 0 },
        ];

        // Dados de proporção de gênero por faixa horária
        const genderProportionData = [
            {
                Período: 'Manhã',
                Masculino: summary.genderProportionByPeriod?.morning?.male || 0,
                Feminino: summary.genderProportionByPeriod?.morning?.female || 0,
            },
            {
                Período: 'Tarde',
                Masculino: summary.genderProportionByPeriod?.afternoon?.male || 0,
                Feminino: summary.genderProportionByPeriod?.afternoon?.female || 0,
            },
            {
                Período: 'Noite',
                Masculino: summary.genderProportionByPeriod?.evening?.male || 0,
                Feminino: summary.genderProportionByPeriod?.evening?.female || 0,
            },
            {
                Período: 'Madrugada',
                Masculino: summary.genderProportionByPeriod?.night?.male || 0,
                Feminino: summary.genderProportionByPeriod?.night?.female || 0,
            },
        ];

        // Dados de frequência por faixa horária
        const timeRangeData = [
            { Período: 'Manhã', 'Total de Pessoas': summary.frequencyByTimeRange?.morning || 0 },
            { Período: 'Tarde', 'Total de Pessoas': summary.frequencyByTimeRange?.afternoon || 0 },
            { Período: 'Noite', 'Total de Pessoas': summary.frequencyByTimeRange?.evening || 0 },
            { Período: 'Madrugada', 'Total de Pessoas': summary.frequencyByTimeRange?.night || 0 },
        ];

        return {
            detailedData,
            weekdayData,
            genderProportionData,
            timeRangeData,
        };
    }

    private exportToPDF(data: ExportData, params: any, summary: IExportSummary): void {
        try {
            const doc = new jsPDF();
            const dateRange = `${params.from} - ${params.to}`;

            // Título e período
            doc.setFontSize(20);
            doc.text('Relatório de Análise Facial', 14, 20);
            doc.setFontSize(12);
            doc.text(`Período: ${dateRange}`, 14, 30);

            // Seção de resumo
            const summaryContent = [
                ['Total de Pessoas', summary.totalPeople?.toString() || '0'],
                ['Distribuição por Gênero:', ''],
                ['Masculino', summary.genderCount?.male?.toString() || '0'],
                ['Feminino', summary.genderCount?.female?.toString() || '0'],
                ['Taxa de Acerto', `${summary.hitRate?.toString() || '0'}%`],
                ['Tempo Médio de Permanência:', ''],
                ['Geral', summary.averageStayTime || '00:00:00'],
                ['Masculino', summary.genderFormatTime?.male || '00:00:00'],
                ['Feminino', summary.genderFormatTime?.female || '00:00:00'],
            ];

            // Tabela de resumo
            (doc as any).autoTable({
                startY: 55,
                head: [['Métrica', 'Valor']],
                body: summaryContent,
                theme: 'grid',
                headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                styles: { fontSize: 10 },
            });

            // Frequência por dia da semana
            doc.addPage();
            doc.setFontSize(16);
            doc.text('Frequência por Dia da Semana', 14, 20);
            (doc as any).autoTable({
                startY: 30,
                head: [Object.keys(data.weekdayData[0])],
                body: data.weekdayData.map(Object.values),
                theme: 'grid',
                headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                styles: { fontSize: 10 },
            });

            // Proporção de gênero por faixa horária
            doc.addPage();
            doc.setFontSize(16);
            doc.text('Proporção de Gênero por Faixa Horária', 14, 20);
            (doc as any).autoTable({
                startY: 30,
                head: [Object.keys(data.genderProportionData[0])],
                body: data.genderProportionData.map(Object.values),
                theme: 'grid',
                headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                styles: { fontSize: 10 },
            });

            // Frequência por faixa horária
            doc.addPage();
            doc.setFontSize(16);
            doc.text('Frequência por Faixa Horária', 14, 20);
            (doc as any).autoTable({
                startY: 30,
                head: [Object.keys(data.timeRangeData[0])],
                body: data.timeRangeData.map(Object.values),
                theme: 'grid',
                headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                styles: { fontSize: 10 },
            });

            // Dados detalhados
            doc.addPage();
            doc.setFontSize(16);
            doc.text('Dados Detalhados', 14, 20);
            if (data.detailedData.length > 0) {
                (doc as any).autoTable({
                    startY: 30,
                    head: [Object.keys(data.detailedData[0])],
                    body: data.detailedData.map(Object.values),
                    theme: 'grid',
                    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                    styles: { fontSize: 8 },
                });
            }

            doc.save(`relatorio_completo_${params.from}_${params.to}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw new Error('Failed to generate PDF report');
        }
    }

    private exportToExcel(data: ExportData, params: any, summary: IExportSummary): void {
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        // Resumo
        const summaryData = [
            ['Relatório de Análise Facial'],
            [`Período: ${params.from} - ${params.to}`],
            [''],
            ['Resumo Geral'],
            ['Total de Pessoas', summary.totalPeople],
            [''],
            ['Distribuição por Gênero'],
            ['Masculino', summary.genderCount.male],
            ['Feminino', summary.genderCount.female],
            [''],
            ['Tempo Médio de Permanência'],
            ['Geral', summary.averageStayTime],
            ['Masculino', summary.genderFormatTime.male],
            ['Feminino', summary.genderFormatTime.female],
            [''],
            ['Taxa de Acerto', `${summary.hitRate}%`],
        ];

        const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumo');

        // Frequência por dia da semana
        const wsWeekday = XLSX.utils.json_to_sheet(data.weekdayData);
        XLSX.utils.book_append_sheet(wb, wsWeekday, 'Frequência por Dia');

        // Proporção de gênero por faixa horária
        const wsGenderProportion = XLSX.utils.json_to_sheet(data.genderProportionData);
        XLSX.utils.book_append_sheet(wb, wsGenderProportion, 'Gênero por Período');

        // Frequência por faixa horária
        const wsTimeRange = XLSX.utils.json_to_sheet(data.timeRangeData);
        XLSX.utils.book_append_sheet(wb, wsTimeRange, 'Frequência por Período');

        // Dados detalhados
        const wsData = XLSX.utils.json_to_sheet(data.detailedData);
        XLSX.utils.book_append_sheet(wb, wsData, 'Dados Detalhados');

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, `relatorio_completo_${params.from}_${params.to}.xlsx`);
    }

    private exportToCSV(data: ExportData, params: any): void {
        // Exportar dados detalhados
        const detailedCsv = Papa.unparse(data.detailedData);
        const detailedBlob = new Blob([detailedCsv], { type: 'text/csv;charset=utf-8;' });
        saveAs(detailedBlob, `dados_detalhados_${params.from}_${params.to}.csv`);

        // Exportar frequência por dia da semana
        const weekdayCsv = Papa.unparse(data.weekdayData);
        const weekdayBlob = new Blob([weekdayCsv], { type: 'text/csv;charset=utf-8;' });
        saveAs(weekdayBlob, `frequencia_dia_semana_${params.from}_${params.to}.csv`);

        // Exportar proporção de gênero por faixa horária
        const genderCsv = Papa.unparse(data.genderProportionData);
        const genderBlob = new Blob([genderCsv], { type: 'text/csv;charset=utf-8;' });
        saveAs(genderBlob, `genero_periodo_${params.from}_${params.to}.csv`);

        // Exportar frequência por faixa horária
        const timeRangeCsv = Papa.unparse(data.timeRangeData);
        const timeRangeBlob = new Blob([timeRangeCsv], { type: 'text/csv;charset=utf-8;' });
        saveAs(timeRangeBlob, `frequencia_periodo_${params.from}_${params.to}.csv`);
    }
}
