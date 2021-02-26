import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  //TOKEN
  token:any = this.getToken();


  constructor(private http: HttpClient) {

    
    console.log('Spotify service listo');

    //TOKEN
    this.token = this.getToken()
  }
  
   //TOKEN
   async getToken() {
 
    //Estos datos nos otorga spotify
    const clientId = '8b4d4130a14b48bb85d25b2869246130';
 
    const clientSecret = 'c4b23d671fed48778f9108d77b691dfc';
 
    const body = new HttpParams()
      .append('grant_type', 'client_credentials')
      .append('client_id', clientId)
      .append('client_secret', clientSecret);
 
    return this.http.post('https://accounts.spotify.com/api/token', body)
            .toPromise()
            .then( (token:any) => {
                this.token = `Bearer ${ token['access_token'] }`;
                // console.log('estoy en el getToken');
                // console.log(this.token);
              }, (err: any) => {
               console.log(err);
              });
  }


  async  getQuery(query: string)   {
    console.log('get query');
    const token = await this.getToken();
    console.log(this.token);

    //Hacemos amigable la url
    const url = `https://api.spotify.com/v1/${ query }`;

    //Las cabeceras para la autorización
    const headers = new HttpHeaders({
      Authorization: `${this.token}`
    });
    return this.http.get(url, { headers });
  }

  //Obtener nuevos lanzamientos
   async getNewReleases(){

    const obs = await this.getQuery('browse/new-releases');
     return obs.pipe(map(data => data["albums"].items)).toPromise();
    
   }

   //Buscar artistas
   async getArtists(termino:string){

    const obs = await this.getQuery(`search?q=${termino}&type=artist&limit=15`);
    return obs.pipe(map(data => data["artists"].items)).toPromise();
  }

  //Obtener artista
  async getArtist(id: string){
    const obs = await this.getQuery(`artists/${id}`);
    return obs.toPromise(); 
  }

  //Obtener las mejores canciones de un artista
  async getTopTracks(id: string){
    const obs = await this.getQuery(`artists/${id}/top-tracks?market=us`);
    return obs.pipe(map( data => data["tracks"])).toPromise();
  }
}
