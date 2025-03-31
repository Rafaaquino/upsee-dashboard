import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as Papa from 'papaparse';
import { IExportSummary } from '../models/export.interface';

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

    private prepareDataForExport(rawData: any[], summary: IExportSummary): any[] {
        return rawData.map((item) => ({
            Data: new Date(item.detected_time).toLocaleDateString(),
            Horário: new Date(item.detected_time).toLocaleTimeString(),
            Gênero: item.gender,
            'Pontuação Gênero': item.gender_score?.toFixed(2),
            'Pontuação Pessoa': item.person_score?.toFixed(2),
            'Tempo de Permanência': item.stop_detection_time,
        }));
    }

    private exportToPDF(data: any[], params: any, summary: IExportSummary): void {
        try {
            // Create new jsPDF instance
            const doc = new jsPDF();
            const dateRange = `${params.from} - ${params.to}`;

            // Title and date range
            doc.setFontSize(20);
            doc.text('Relatório de Análise Facial', 14, 20);
            doc.setFontSize(12);
            doc.text(`Período: ${dateRange}`, 14, 30);

            // Summary section
            const summaryContent = [
                ['Total de Pessoas', summary.totalPeople?.toString() || '0'],
                ['Distribuição por Gênero:', ''],
                ['Masculino', summary.genderDistribution?.male?.toString() || '0'],
                ['Feminino', summary.genderDistribution?.female?.toString() || '0'],
                ['Taxa de Acerto', `${summary.hitRate?.toString() || '0'}%`],
                ['Tempo Médio de Permanência:', ''],
                ['Geral', summary.averageStayTime || '00:00:00'],
                ['Masculino', summary.genderStayTime?.male || '00:00:00'],
                ['Feminino', summary.genderStayTime?.female || '00:00:00'],
            ];

            // Add summary table using autoTable
            (doc as any).autoTable({
                startY: 55,
                head: [['Métrica', 'Valor']],
                body: summaryContent,
                theme: 'grid',
                headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                styles: { fontSize: 10 },
            });

            // Add new page for detailed data
            doc.addPage();
            doc.setFontSize(16);
            doc.text('Dados Detalhados', 14, 20);

            // Add detailed data table
            if (data.length > 0) {
                (doc as any).autoTable({
                    startY: 30,
                    head: [Object.keys(data[0])],
                    body: data.map(Object.values),
                    theme: 'grid',
                    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                    styles: { fontSize: 8 },
                });
            }

            // Save the PDF
            doc.save(`relatorio_detalhado_${params.from}_${params.to}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw new Error('Failed to generate PDF report');
        }
    }

    private exportToExcel(data: any[], params: any, summary: IExportSummary): void {
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        // Summary sheet
        const summaryData = [
            ['Relatório de Análise Facial'],
            [`Período: ${params.from} - ${params.to}`],
            [''],
            ['Resumo Geral'],
            ['Total de Pessoas', summary.totalPeople],
            [''],
            ['Distribuição por Gênero'],
            ['Masculino', summary.genderDistribution.male],
            ['Feminino', summary.genderDistribution.female],
            [''],
            ['Tempo Médio de Permanência'],
            ['Geral', summary.averageStayTime],
            ['Masculino', summary.genderStayTime.male],
            ['Feminino', summary.genderStayTime.female],
            [''],
            ['Taxa de Acerto', `${summary.hitRate}%`],
            [''],
            ['Distribuição por Período'],
            ['Manhã', summary.timeRangeDistribution.morning],
            ['Tarde', summary.timeRangeDistribution.afternoon],
            ['Noite', summary.timeRangeDistribution.evening],
            ['Madrugada', summary.timeRangeDistribution.night],
        ];

        const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumo');

        // Detailed data sheet
        const wsData = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, wsData, 'Dados Detalhados');

        // Generate and save file
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, `relatorio_completo_${params.from}_${params.to}.xlsx`);
    }

    private exportToCSV(data: any[], params: any): void {
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `dados_detalhados_${params.from}_${params.to}.csv`);
    }
}
