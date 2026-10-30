import { assinarContrato, INotificador } from "../../contratos/interfaces.js";

/** Notificação no painel da plataforma. Na tela, `exibir` mostra um aviso (toast). */
export class NotificadorPainel {
  #exibir;

  constructor(exibir = console.log) {
    this.#exibir = exibir;
  }

  obterCanal() {
    return "Painel";
  }

  enviarAlerta(destinatario, mensagem) {
    if (!destinatario?.trim() || !mensagem?.trim()) return false;
    this.#exibir(`Para ${destinatario}: ${mensagem}`);
    return true;
  }
}

assinarContrato(NotificadorPainel, INotificador);
