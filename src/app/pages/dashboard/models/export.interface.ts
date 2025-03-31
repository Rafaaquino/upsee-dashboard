import jsPDF from 'jspdf';

export interface IExportSummary {
    totalPeople: number;
    genderDistribution: {
        male: number;
        female: number;
    };
    averageStayTime: string;
    genderStayTime: {
        male: string;
        female: string;
    };
    hitRate: number;
    timeRangeDistribution: {
        morning: number;
        afternoon: number;
        evening: number;
        night: number;
    };
    weekdayDistribution: {
        counts: number[];
        days: string[];
    };
}

interface AutoTableOptions {
    head?: any[];
    body?: any[];
    startY?: number;
    theme?: string;
    headStyles?: {
        fillColor?: number[];
        textColor?: number;
    };
    styles?: {
        fontSize?: number;
        cellPadding?: number;
        font?: string;
        textColor?: number | string;
        fillColor?: number | string;
    };
    margin?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
    pageBreak?: 'auto' | 'avoid' | 'always';
    rowPageBreak?: 'auto' | 'avoid';
    showHead?: 'everyPage' | 'firstPage' | 'never';
}

declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: AutoTableOptions) => void;
    }
}
