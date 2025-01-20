import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IData } from '../models/data.interface';
import { environment } from 'src/environments/environment.dev';
import { IParamsData } from '../models/params-data.interface';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    constructor(private http: HttpClient) {}

    getData(paramsdata: IParamsData): Observable<any> {
        const params = new HttpParams().set('client_id', paramsdata.cliente_id).set('from', paramsdata.from).set('to', paramsdata.to);

        return this.http.get<IData[]>(environment.host_api + `/data`, { params });
    }
}
