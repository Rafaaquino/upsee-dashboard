import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class MockDataService {
    generateMockData(): any[] {
        const baseData = {
            stop_detection_time: '24/12/24 15:43:31',
            score: 0.61,
            detected_time: '24/12/24 15:42:05',
            tracker_id: 1,
            gender: '',
            idTrack: 2580,
            bbox: '(10.875, 1.625, 518.0, 258.0)',
            class_name: 'pessoa',
            client_id: 21122024,
            gender_score: 0.72,
        };

        const mockData = [];

        // Função para gerar a data no formato DD/MM/YY HH:mm:ss
        const generateDate = (month: number): string => {
            const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0'); // Garante um valor de dia entre 01 e 28
            const hour = String(Math.floor(Math.random() * 24)).padStart(2, '0'); // Hora entre 00 e 23
            const minute = String(Math.floor(Math.random() * 60)).padStart(2, '0'); // Minuto entre 00 e 59
            const second = String(Math.floor(Math.random() * 60)).padStart(2, '0'); // Segundo entre 00 e 59

            // O formato de data final será 'DD/MM/YY HH:mm:ss'
            return `30/${String(month + 1).padStart(2, '0')}/24 ${hour}:${minute}:${second}`;
        };

        for (let month = 0; month < 12; month++) {
            // Geração de quantidades aleatórias de gêneros masculino e feminino para cada mês
            const maleCount = Math.floor(Math.random() * (20 - 5 + 1)) + 5; // Entre 5 e 20 para masculino
            const femaleCount = Math.floor(Math.random() * (20 - 5 + 1)) + 5; // Entre 5 e 20 para feminino

            // Geração de dados para os gêneros masculino
            for (let i = 0; i < maleCount; i++) {
                mockData.push({
                    ...baseData,
                    score: parseFloat((0.79 + Math.random() * (0.99 - 0.79)).toFixed(2)), // Gera score aleatório entre 0.79 e 0.99
                    gender: 'masculino',
                    idTrack: baseData.idTrack + mockData.length + 1,
                    detected_time: generateDate(month), // Chama a função para gerar a data
                    stop_detection_time: generateDate(month), // Chama a função para gerar a data
                    gender_score: parseFloat((0.61 + Math.random() * (0.99 - 0.61)).toFixed(2)),
                });
            }

            // Geração de dados para os gêneros feminino
            for (let i = 0; i < femaleCount; i++) {
                mockData.push({
                    ...baseData,
                    score: parseFloat((0.79 + Math.random() * (0.99 - 0.79)).toFixed(2)), // Gera score aleatório entre 0.79 e 0.99
                    gender: 'feminino',
                    idTrack: baseData.idTrack + mockData.length + 1,
                    detected_time: generateDate(month), // Chama a função para gerar a data
                    stop_detection_time: generateDate(month), // Chama a função para gerar a data
                    gender_score: parseFloat((0.61 + Math.random() * (0.99 - 0.61)).toFixed(2)), // Gera score aleatório entre 0.61 e 0.99
                });
            }
        }

        return mockData;
    }
}
