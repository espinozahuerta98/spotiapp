import { Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router'
import { SpotifyService } from 'src/app/services/spotify.service';
@Component({
  selector: 'app-artista',
  templateUrl: './artista.component.html',
  styles: [
  ]
})
export class ArtistaComponent{
  
  artista:any={};
  topTracks:any[] = [];

  loadingArtist:boolean;
  

  constructor(private router:ActivatedRoute,private spotify:SpotifyService) {

    this.loadingArtist = true
    
    this.router.params.subscribe(params => {
    
      this.getArtist(params['id']);      
      this.getTopTracks(params['id']);      
    });
   }

   getArtist(id:string){

      this.loadingArtist = true
      
      this.spotify.getArtist(id).then(artista =>{
        console.log(artista);
        this.artista = artista;
        
        this.loadingArtist = false

      })
   }

   getTopTracks(id:string){
     this.spotify.getTopTracks(id)
     .then(topTracks =>{
       console.log(topTracks);
       this.topTracks = topTracks;
       
     })
   }



}
