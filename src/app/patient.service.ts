import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from './patient';
import { Comment } from './comment';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})

export class PatientService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient){}

  public getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiServerUrl}/patient/all`);
  }

  public getComments() : Observable<Comment[]>{
    return this.http.get<Comment[]>(`${this.apiServerUrl}/patient/comment/all`);
  }

  public getCommentsByPatient(patientId: number) : Observable<Comment[]>{
      return this.http.get<Comment[]>(`${this.apiServerUrl}/patient/comment/all/${patientId}`);
  }

  public addComment(patientId: number,comment : Comment){
      return this.http.post<Comment>(`${this.apiServerUrl}/patient/comment/add/${patientId}`,comment);
  }

  public addPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(`${this.apiServerUrl}/patient/add`, patient);
  }

  public updatePatient(patient: Patient,patientId: number,comments:Array<Comment>): Observable<Patient> {
    patient.comments = comments;
    return this.http.put<Patient>(`${this.apiServerUrl}/patient/update/${patientId}`, patient);
  }

  public deletePatient(patientId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/patient/delete/${patientId}`);
  }
}