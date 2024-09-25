import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CambiarUsuarioService {
  private usuarioSubject = new BehaviorSubject<string>(null); // Maneja el usuario actual
  usuario$ = this.usuarioSubject.asObservable(); // Exponemos como observable para suscribirse

  // Método para cambiar el usuario
  cambiarUsuario(usuario: string) {
    this.usuarioSubject.next(usuario); // Cambiamos el usuario actual
  }

  // Obtener el usuario actual
  obtenerUsuarioActual() {
    return this.usuarioSubject.getValue();
  }
}
