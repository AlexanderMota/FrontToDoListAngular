import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Collaborator, getAvatarUrl, User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-collaborators',
  imports: [ NgIf, NgFor, ReactiveFormsModule ],
  templateUrl: './collaborators.component.html',
  styleUrl: './collaborators.component.scss'
})
export class CollaboratorsComponent {

  @ViewChild('searchContainer')
  searchContainer!: ElementRef;
  @ViewChild('menuColab')
  menuColab!: ElementRef;

  @Input() 
  task_id!: string;
  @Input() 
  currentUser: string = "";
  
  searchControl = new FormControl('');
  menuPosition = { x: 0, y: 0 };
  isCollaborator = false;
  searchResultsVisible = false;
  openedMenu: number | null = null;
  results:User[] = [];
  colaboradores : Collaborator[] = [];
  colaboradoresPendientes : Collaborator[] = [];
  
  constructor( private userServ: UserService,
      private route: ActivatedRoute,
      private router: Router ) { }
  
  ngOnInit(){
    this.loadCollabs();
  }

  ngOnChanges() {
    this.loadCollabs();
  }

  loadCollabs(){

    this.userServ.getCollabsConfirmed(this.task_id).subscribe({
      next : (res) => {

        console.log(res.message);
        this.colaboradores = res.collaborators!
      },
      error : (err) => console.log(err)
    });
    
    this.userServ.getCollabsPending(this.task_id).subscribe({
      next : (res) => {
        console.log(res.message);
        this.colaboradoresPendientes = res.collaborators!;

        this.isCollaborator = this.colaboradoresPendientes.some(
          c => c.user.user_id == this.currentUser
        );
      },
      error : (err) => console.log(err)
    });

    this.searchControl.valueChanges.pipe(

      debounceTime(300),

      distinctUntilChanged()

    ).subscribe(value => {

      if (!value || value.trim().length < 1) {
        this.results = [];
        this.searchResultsVisible = false;
        return;
      }

      this.userServ.searchUsers(value!, this.task_id).subscribe({

        next: res => {
          this.results = res.users!;
          this.searchResultsVisible = this.results.length > 0;
        },
        error: err => console.error(err)
      });
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent){

    if (
        this.searchContainer &&
        !this.searchContainer.nativeElement.contains(event.target as Node)
    ) this.searchResultsVisible = false
    
    this.openedMenu = null;
  }

  @HostListener('document:keydown.escape')
  closeMenuColab(){ this.searchResultsVisible = false; }

  selectUser(usuario: User) {
    
    this.userServ.postSolicitudColaboracion(usuario.user_id, this.task_id).subscribe({
      next : (res) =>  {
        console.log(res.message);
        this.colaboradoresPendientes.push(res.collaborator!);
      }, 
      error : (err) => console.log(err)
    });
    this.searchResultsVisible = false;
    this.searchControl.setValue('');
  }

  openSearch(){ if(this.results.length) this.searchResultsVisible = true; }

  toggleMenuCollab(event: MouseEvent, id: number){
    event.stopPropagation();

    if (this.openedMenu === id) {
      this.openedMenu = null;
      return;
    }

    this.openedMenu = id;

    this.menuPosition = {
      x: event.clientX,
      y: event.clientY
    };
  }
  aceptarColab(request_id:number){
    this.openedMenu = null;

    this.userServ.updateSolicitudColaboracion(request_id.toString()).subscribe({
      next : (res) => console.log(res.message),
      error : (err) => console.log(err)
    });
  }
  
  cancelarColab(request_id:number){
    this.openedMenu = null;

    this.userServ.deleteSolicitudColaboracion(request_id.toString()).subscribe({
      next : (res) => {
        console.log(res.message);
        this.colaboradoresPendientes = this.colaboradoresPendientes.filter(
          c => c.request_task!.request_id !== Number(request_id)
        );
      },
      error : (err) => console.log(err)
    });
  }
  
  eliminarColab(request_id:number){
    this.userServ.deleteColaboracion(request_id.toString()).subscribe({
      next : (res) => {
        console.log(res.message);
        this.colaboradores = this.colaboradores.filter(
          c => c.request_task!.request_id !== Number(request_id)
        );
      },
      error : (err) => console.log(err)
    });

  }
  getAvatarUrl = getAvatarUrl;
}
