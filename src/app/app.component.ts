import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Authetication, idTypes, RestrictiveLists } from '../app/interfaces/aunthetication';
import Swal from 'sweetalert2';

export interface RestrictiveListsData {
  Matches: boolean,
  QueryNumber: number,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(
    public readonly _authenticationService: AuthenticationService,
  ) { }

  contentForm = {
    firstName: null,
    middleName: '',
    firstLastName: null,
    secondLastName: '',
    idType: null,
    idNumber: null,
    contact: null,
    propertyValue: null,
    birthDate: null,
  };

  idTypes: idTypes[] = [
    { value: 'CC', viewValue: 'Cédula de ciudadanía' },
    { value: 'NIT', viewValue: 'Nit' },
    { value: 'CE', viewValue: 'Cédula de extrangería' },
    { value: 'DI', viewValue: 'Documento de identidad' },
  ];

  maxDate = new Date();
  loading = false;
  flagForm = false;

  notificationObject = {} as RestrictiveLists;
  notificationQuote: any;

  ngOnInit() {
  }

  async checkRestrictiveLists(){
    this.loading = true;

    const body = {
      Applicant: {
        Type: 'AAAAAA',
        Identification: {
          Number: this.contentForm.idNumber,
          Type: this.contentForm.idType,
        },
        Person: {
          FirstName: this.contentForm.firstName,
          MiddleName: this.contentForm.middleName,
          LastName: this.contentForm.firstLastName,
          SecondLastName: this.contentForm.secondLastName,
        },
        ParameterizationCode: '0000',
        Policy: {
          Number: '0',
          StartDate: '',
          EndDate: '',
        },
        ApplicationCode: '01',
        User: '',
        BranchOffice: '',
        Region: '',
        EconomicActivity: '',
        ResidenceCity: '',
      },
    };

    const token: Authetication = await this._authenticationService.getAccessToken();
    await (await this._authenticationService.validateRestrictiveLists(token.access_token, body)).subscribe(data => {
      this.notificationObject = data;

      Swal.fire({
        title: this.notificationObject.Matches ? 'Reporta Listas Restrictivas' : 'No Reporta Listas Restrictivas',
        text: this.notificationObject.Matches ? 'El inmueble no es asegurable' : `El valor del aseguramiento es del 1% = $ ${ new Intl.NumberFormat().format(Number(this.contentForm.propertyValue)*0.01)}`,
        icon: this.notificationObject.Matches ? 'warning' : 'success',
        showCancelButton: true,
        confirmButtonText: 'Registrar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#ffd740',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.manageQuote(token.access_token, this.notificationObject.Matches);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: 'Solicitud Cancelada',
            text: 'Trámite cancelado por usuario.',
            icon: 'error',
            confirmButtonColor: '#ffd740',
            confirmButtonText: 'Aceptar',
          })
        }
      })
      this.loading = false;
    });
  }

  async manageQuote(token: string, match: boolean){
    const body = {
      dateCreated: '2022-10-04T17:19:01.862Z',
      dateModified: '2022-10-04T17:19:01.862Z',
      apellido: this.contentForm.firstLastName+' '+this.contentForm.secondLastName,
      consultaListaRestrictiva: match,
      createDate: '2022-10-04',
      fechaDeNacimiento: this.contentForm.birthDate,
      modifiedDate: '2022-10-04',
      nombre: `${this.contentForm.firstName} ${this.contentForm.middleName}`,
      numeroDeIdentificacion: this.contentForm.idNumber,
      numeroDeTelefono: this.contentForm.idNumber,
      tipoDeIdentificacion: this.contentForm.idType,
      valorDelPredioAAsegurar: this.contentForm.propertyValue,
    };

    await (await this._authenticationService.saveQuote(token, body)).subscribe(data => {
      this.notificationQuote = data;
      Swal.fire({
        title: 'Confirmación Guardado!',
        text: 'Cotización diligenciada con éxito.',
        icon: 'success',
        confirmButtonColor: '#ffd740',
        confirmButtonText: 'Aceptar',
      })
    });
    this.flagForm = true;
  }

  cleanForm(){
    this.contentForm = {
      firstName: null,
      middleName: null,
      firstLastName: null,
      secondLastName: null,
      idType: null,
      idNumber: null,
      contact: null,
      propertyValue: null,
      birthDate: null,
    };    
    this.notificationQuote = null;
    this.flagForm = false;
  }

}
