import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  BinaryQuantityRequest,
  ConvertRequest,
  DivisionResponse,
  MeasurementCategory,
  OperationHistory,
  QuantityDTO,
  QuantityResponse,
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class QuantityService {

  private base = `${environment.apiUrl}/v1/quantities`;

  constructor(private http: HttpClient) {}

  // ─────────────────────────────────────────────────────────────
  // CATEGORY
  // ─────────────────────────────────────────────────────────────
  categoryFor(unit: string): MeasurementCategory {
    const map: Record<string, MeasurementCategory> = {
      Feet: 'Length',
      Inches: 'Length',
      Yards: 'Length',
      Centimeters: 'Length',
      Meters: 'Length',

      Kilograms: 'Weight',
      Grams: 'Weight',
      Pounds: 'Weight',
      Ounces: 'Weight',

      Litres: 'Volume',
      Millilitres: 'Volume',
      Gallons: 'Volume',

      Celsius: 'Temperature',
      Fahrenheit: 'Temperature',
      Kelvin: 'Temperature'
    };

    return map[unit] ?? 'Length';
  }

  private dto(value: number, unit: string): QuantityDTO {
    return {
      value,
      unit: unit,  // IMPORTANT: NO mapping
      category: this.categoryFor(unit)
    };
  }

  // ─────────────────────────────────────────────────────────────
  // API
  // ─────────────────────────────────────────────────────────────

  convert(data: { value: number; fromUnit: string; toUnit: string }): Observable<QuantityResponse> {

    const body: ConvertRequest = {
      source: this.dto(data.value, data.fromUnit),
      targetUnit: data.toUnit   // IMPORTANT: NO mapping
    };

    return this.http.post<QuantityResponse>(`${this.base}/convert`, body)
      .pipe(catchError(err => throwError(() => err)));
  }

  compare(data: {
    quantity1: { value: number; unit: string };
    quantity2: { value: number; unit: string };
  }): Observable<QuantityResponse> {

    const body: BinaryQuantityRequest = {
      quantity1: this.dto(data.quantity1.value, data.quantity1.unit),
      quantity2: this.dto(data.quantity2.value, data.quantity2.unit)
    };

    return this.http.post<QuantityResponse>(`${this.base}/compare`, body)
      .pipe(catchError(err => throwError(() => err)));
  }

  add(data: {
    quantity1: { value: number; unit: string };
    quantity2: { value: number; unit: string };
    resultUnit: string;
  }): Observable<QuantityResponse> {

    const body: BinaryQuantityRequest = {
      quantity1: this.dto(data.quantity1.value, data.quantity1.unit),
      quantity2: this.dto(data.quantity2.value, data.quantity2.unit),
      targetUnit: data.resultUnit
    };

    return this.http.post<QuantityResponse>(`${this.base}/add`, body)
      .pipe(catchError(err => throwError(() => err)));
  }

  subtract(data: {
    quantity1: { value: number; unit: string };
    quantity2: { value: number; unit: string };
    resultUnit: string;
  }): Observable<QuantityResponse> {

    const body: BinaryQuantityRequest = {
      quantity1: this.dto(data.quantity1.value, data.quantity1.unit),
      quantity2: this.dto(data.quantity2.value, data.quantity2.unit),
      targetUnit: data.resultUnit
    };

    return this.http.post<QuantityResponse>(`${this.base}/subtract`, body)
      .pipe(catchError(err => throwError(() => err)));
  }

  divide(data: {
    quantity1: { value: number; unit: string };
    quantity2: { value: number; unit: string };
  }): Observable<DivisionResponse> {

    const body: BinaryQuantityRequest = {
      quantity1: this.dto(data.quantity1.value, data.quantity1.unit),
      quantity2: this.dto(data.quantity2.value, data.quantity2.unit)
    };

    return this.http.post<DivisionResponse>(`${this.base}/divide`, body)
      .pipe(catchError(err => throwError(() => err)));
  }

  getHistory(): Observable<OperationHistory[]> {
    return this.http.get<OperationHistory[]>(`${this.base}/history`)
      .pipe(catchError(err => throwError(() => err)));
  }

  getErroredHistory(): Observable<OperationHistory[]> {
    return this.http.get<OperationHistory[]>(`${this.base}/history/errored`)
      .pipe(catchError(err => throwError(() => err)));
  }

  getCount(): Observable<number> {
    return this.http.get<number>(`${this.base}/count`)
      .pipe(catchError(err => throwError(() => err)));
  }
}