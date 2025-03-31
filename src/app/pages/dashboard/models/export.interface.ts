import jsPDF from 'jspdf';
import { IGender, IFrequencyByTimeRange, IGenderFormatTime } from './data.interface';

export interface IExportSummary {
    totalPeople: number;
    hitRate: number;
    averageStayTime: string;
    genderCount: IGender;
    genderFormatTime: IGenderFormatTime;
    frequencyByTimeRange: IFrequencyByTimeRange;
    frequencyByWeekday: {
        sunday: number;
        monday: number;
        tuesday: number;
        wednesday: number;
        thursday: number;
        friday: number;
        saturday: number;
    };
    genderProportionByPeriod: {
        morning: IGender;
        afternoon: IGender;
        evening: IGender;
        night: IGender;
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
