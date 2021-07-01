import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Patient } from './patient';
import { Comment } from './comment';
import { PatientService } from './patient.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
    title(title: any) {
      throw new Error('Method not implemented.');
    }

    public patients!: Patient[];
    public comments : Comment[] = [];
    public editPatient: Patient | undefined;    
    public deletePatient!: Patient;  
    @ViewChild('showPatientBody') showPatientBody!: TemplateRef<any>;
    @ViewChild('addPatientBody') addPatientBody!: TemplateRef<any>;
    @ViewChild('showPatientHead') showPatientHead!: TemplateRef<any>;
    @ViewChild('addPatientHead') addPatientHead!: TemplateRef<any>;
    @ViewChild('editPatientHead') editPatientHead!: TemplateRef<any>;
    @ViewChild('editPatientBody') editPatientBody!: TemplateRef<any>;
    public newPatient! : Patient;
    isShowPatient!: boolean;
    isAddPatient! : boolean;
    isEditPatient! : boolean;

    constructor(private patientService: PatientService){
      this.isShowPatient = true;
      this.isEditPatient = false; 
      this.isAddPatient = false;
    }

    ngOnInit(){
       this.getPatients(); 
       this.getComments(); 
    }

    public getPatients(): void {
        this.patientService.getPatients().subscribe(
            (response: Patient[]) =>{
               this.patients = response;
            },
            (error: HttpErrorResponse) => {
                alert(error.message)
            }
        );             
    }

    public getComments(): void {
      this.patientService.getCommentsByPatient(this.GetCasePatient().id).subscribe(
          (response: Comment[]) =>{
            this.GetCasePatient().comments = response;
          },
          (error: HttpErrorResponse) => {
              alert(error.message)
          }
      );
    }
   
    public GetCasePatient() : Patient{
      if(this.newPatient){
        return this.newPatient; 
      }
      else{
         return this.patients[0];
      }
    }

    Reload(){
      window.location.reload();
    }

    public onAddPatient(addForm: NgForm) : void{
      document.getElementById('add-patient-form')?.click();
      this.patientService.addPatient(addForm.value).subscribe(
        (response : Patient) => {
          console.log(response);
          this.getPatients();
          addForm.reset();       
        },
        (error : HttpErrorResponse) => {
            alert(error.message);
            addForm.reset();
        }
      );
      this.Reload();
    }

    public onAddComment(id:number,addForm: NgForm) : void{     
      document.getElementById('add-comment-form')?.click();
      this.patientService.addComment(id,addForm.value).subscribe(
        (response : Comment) => {
          console.log(response);
          this.getComments();
          addForm.reset();
        },
        (error : HttpErrorResponse) => {
            alert(error.message);
            addForm.reset();
        }
      );
    }

    public onUpdatePatient(patient: Patient,patientId: number) : void{
      this.patientService.updatePatient(patient,patientId,this.GetCasePatient().comments).subscribe(
        (response : Patient) => {
          console.log(response);
          this.getPatients();
        },
        (error : HttpErrorResponse) => {
            alert(error.message);
        }
      );
      this.showInfoPatientBody(patient);
    }
    public onDeletePatient(patientId: number): void {
      this.patientService.deletePatient(patientId).subscribe(
        (response: void) => {
          console.log(response);
          this.getPatients();
          this.Reload();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }

    public onOpenModalDelete(patient : Patient): void {     
      const container = document.getElementById('patientInformation');
      const button = document.createElement('button');
      button.type = 'button';
      button.style.display = 'none';

      button.setAttribute('data-toggle', 'modal');
      
      this.deletePatient = patient;
      button.setAttribute('data-target', '#deletePatientModal');

      container?.appendChild(button);
      button.click();
    }

    get getMethodViewPatientHead(){
      if(this.isAddPatient){
        return this.addPatientHead;
      }
      else if(this.isEditPatient){
        return this.editPatientHead;
      }
      return this.showPatientHead;
    }
    get getMethodViewPatientBody(){
     if(this.isAddPatient){
        return this.addPatientBody;
      }
      else if(this.isEditPatient){
        return this.editPatientBody;
      }
      return this.showPatientBody;
    }

    showInfoPatientBody(patient : Patient){
      this.newPatient = patient;
      this.isShowPatient = true;
      this.isAddPatient = false;
      this.isEditPatient = false;
    }

    showAddPatientBody(){
      this.isShowPatient = false;
      this.isAddPatient = true;
      this.isEditPatient = false;
    }

    showEditPatientBody(patient : Patient){
      this.editPatient = patient;
      this.editPatient.comments = patient.comments;
      this.isShowPatient = false;
      this.isAddPatient = false;
      this.isEditPatient = true;
    }

    public searchPatients(key: string): void {
      console.log(key);     
      const results: Patient[] = [];
      for (const patient of this.patients) {
        if (patient.firstName.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || patient.lastName.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || patient.address.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
          results.push(patient);
        }
      }
      this.patients = results;

      if (!key) {
        this.getPatients();
        this.getComments();
      }
    }
}