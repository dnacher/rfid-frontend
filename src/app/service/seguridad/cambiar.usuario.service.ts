import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CambiarUsuarioService {
  private usuarioSubject = new BehaviorSubject<string>(null); // Maneja el usuario actual
  usuario$ = this.usuarioSubject.asObservable(); // Exponemos como observable para suscribirse

  private imagenSubject = new BehaviorSubject<string>('assets/default-user.png');
  imagen$ = this.imagenSubject.asObservable();

  // Método para cambiar el usuario
  cambiarUsuario(usuario: string) {
    this.usuarioSubject.next(usuario); // Cambiamos el usuario actual
  }

  cambiarImagen(imagen: string) {
    this.imagenSubject.next(imagen); // Cambiamos la imagen actual
  }

  // Obtener el usuario actual
  obtenerUsuarioActual() {
    return this.usuarioSubject.getValue();
  }

  obtenerImagenActual() {
    return this.imagenSubject.getValue();
  }
}
