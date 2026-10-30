import { assinarContrato, INotificador } from "../../contratos/interfaces.js";

/** Envio simulado: a mensagem vai para a função `exibir` (por padrão, o console). */
export class NotificadorWhatsApp {
  #exibir;

  constructor(exibir = console.log) {
    this.#exibir = exibir;
  }

  obterCanal() {
    return "WhatsApp";
  }

  enviarAlerta(destinatario, mensagem) {
    if (!destinatario?.trim() || !mensagem?.trim()) return false;
    this.#exibir(`[${this.obterCanal()} → ${destinatario}] ${mensagem}`);
    return true;
  }
}

assinarContrato(NotificadorWhatsApp, INotificador);
