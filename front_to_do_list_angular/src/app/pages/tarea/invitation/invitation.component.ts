import { DatePipe, NgIf } from '@angular/common';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { getAvatarUrl, Invitation } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invitation',
  imports: [NgIf,DatePipe],
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.scss'
})
export class InvitationComponent {
  
  @Input() 
  task_id!: string;

  invitacion!: Invitation;
  openedMenu = false;

  @ViewChild('menuContainer')
  menuContainer?: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {

    if (
      this.menuContainer &&
      !this.menuContainer.nativeElement.contains(event.target as Node)
    ) {
      this.openedMenu = false;
    }

  }
    
  constructor( private userServ: UserService,
        private route: ActivatedRoute,
        private router: Router ){

  }

  ngOnInit(){
    this.route.paramMap.subscribe(() => {
      this.loadInvitation();
    });

  } 
  ngOnChanges() {

      if (this.task_id) {

        this.loadInvitation();
        
      }

  }
  
  loadInvitation(){
    this.userServ.getInvitation(this.task_id).subscribe({
      next : (res) => this.invitacion = res.invitation!,
      error : (err) => console.log(err)
    });
  }

  aceptarColab(request_id:number){
    this.userServ.updateSolicitudColaboracion(request_id.toString()).subscribe({
      next : (res) => {
        console.log(res);
        this.loadInvitation();
      },
      error : (err) => console.log(err)
    });
    this.openedMenu = false;
  }
  
  cancelarColab(request_id:number){
    this.userServ.deleteSolicitudColaboracion(request_id.toString()).subscribe({
      next : (res) => {
        console.log(res.message);
        this.router.navigate(['/home']);
      },
      error : (err) => console.log(err)
    });
  }

  eliminarColab(request_id:number){
    this.userServ.deleteColaboracion(request_id.toString()).subscribe({
      next : (res) => {
        console.log(res.message);
        this.router.navigate(['/home']);
      },
      error : (err) => console.log(err)
    });

  }
  
  toggleMenu(event: MouseEvent){

    event.stopPropagation();

    this.openedMenu = !this.openedMenu;
  }
  getAvatarUrl = getAvatarUrl;
}
