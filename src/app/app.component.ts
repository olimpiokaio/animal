import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Animal } from './post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts: Animal[] = [];
  isFetching = false;

  step: number = 1;
  option: number = 0;
  
  terrestre: number = 0;
  refCaracteristica: number = null;
  palpite: string = null;

  animal = {
    nome: null, 
    caracteristica: null,
    refCaracteristica: this.refCaracteristica,
    terrestre: this.terrestre
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.resetGame();
  }

  submitNewAnimal() {
    this.http
    .post<{ name: string }>(
      'http://localhost:8080/api/animal',
      this.animal
    )
    .subscribe(responseData => {
      console.log('Res: ', responseData);
    });
    this.resetGame();
  }

  newNameAnimal() {
    this.step = 4;
    this.animal.refCaracteristica = this.refCaracteristica;
  }

  fetchAnimal = () => {
    this.isFetching = true;
    this.http
    .get<{ [key: string]: Animal }>(`http://localhost:8080/api/animal/listar/${this.terrestre}`)
    .pipe(
      map(responseData => {
        const postArray: Animal[] = [];
        for(const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postArray.push({ ...responseData[key] })
          }
        }
        return postArray;
    }))
    .subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
      if (this.loadedPosts.length <= 0) {
        this.step = 0;
      }
    });
  }

  fetchAnimalRelated = () => {
    this.isFetching = true;
    this.http
    .get<{ [key: string]: Animal }>(`http://localhost:8080/api/animal/listar/relacionado/${this.refCaracteristica}`)
    .pipe(
      map(responseData => {
        const postArray: Animal[] = [];
        for(const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postArray.push({ ...responseData[key] })
          }
        }
        return postArray;
    }))
    .subscribe(posts => {
      this.isFetching = false;
      this.option = 0;
      this.loadedPosts = posts;
      if (this.loadedPosts.length <= 0) {
        this.step = 0;
      }
    });

    this.option = 0;
  }

  finish = () => {
    window.alert('Eu acertei!');
    this.resetGame();
  }

  nextStep = () => {
    this.step++;
    if (this.step === 3) {
      this.fetchAnimal();
    }

    if (this.step === 5 && this.palpite === null) {
      this.palpite = this.terrestre === 0 ? 'Macaco' : 'Tubarão'; 
    }
  }

  setCaracteristica = (terrestre: boolean) => {
    let res = terrestre === true ? 1 : 0;
    this.terrestre = res;
    this.animal.terrestre = res;
    this.nextStep();
  }

  nextOption = (resposta: boolean) => {
    if(resposta) {
      this.palpite = this.loadedPosts[this.option].nome;
      this.refCaracteristica = this.loadedPosts[this.option].id;

      this.fetchAnimalRelated();
    }

    this.option++;
    if(this.option < this.loadedPosts.length) {
    } else {
      this.palpitar();
    }
  }
  
  palpitar = () => {
    this.step = 0
  }

  resetGame = () => {
    this.step = 1;
    this.option = 0;
    
    this.terrestre = 0;
    this.refCaracteristica = null;
    this.palpite = null;
  
    this.animal = {
      nome: null, 
      caracteristica: null,
      refCaracteristica: this.refCaracteristica,
      terrestre: this.terrestre
    }
  }

}

