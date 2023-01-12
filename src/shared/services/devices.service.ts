import { HttpHeaders } from "@angular/common/http";
import { Injectable, SecurityContext } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { tap } from "rxjs";
import { DevicesResponse } from "../interfaces/devices";


const Device = gql`
  mutation Devices {
  Device {
  id
  uuid
  experimentId
  createdAt
  updatedAt
  experimentValue
  }

  }
`;

@Injectable({
  providedIn: 'root'
})

export class DevicesService {
  public uuid = '';
  public token = '';

  constructor(private apollo: Apollo) {

  }


  addNewDevice(uuid: string) {
    return this.apollo.mutate<DevicesResponse>({
      mutation: Device,
      context: {
        headers: new HttpHeaders().set('device-token', uuid)
      }
    }
    )

      .pipe(
        tap(
          (data) => {
            sessionStorage.setItem('device-token', data!.data!.Device.uuid)
          }
        )
      )
  }

  addOldDevice(token: string) {
    return this.apollo.mutate<DevicesResponse>({
      mutation: Device,
      context: {
        headers: new HttpHeaders().set('device-token', token)
      }
    })
    .pipe(
      tap(
        (data) => {
          sessionStorage.setItem('device-token', data!.data!.Device.uuid)
        }
      )
    )
  }
  checkIfTokenExists() {
    return !!this.getToken();
  }

  getToken() {
    return sessionStorage.getItem('device-token');
}
}