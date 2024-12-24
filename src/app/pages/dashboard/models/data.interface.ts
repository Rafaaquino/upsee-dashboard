export interface IData {
    stop_detection_time: string;
    score: number;
    detected_time: string;
    tracker_id: number;
    bbox: string;
    idTrack: number;
    class_name: string;
    client_id: number;
    gender: string;
}

export interface IGenderData {
    males: IData[];
    females: IData[];
}

export interface IGender {
    male: number;
    female: number;
}
