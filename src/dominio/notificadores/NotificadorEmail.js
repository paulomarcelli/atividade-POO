import { assinarContrato, INotificador } from "../../contratos/interfaces.js";
import { FORMATO_EMAIL } from "../../util/validacao.js";

/** Envio simulado: a mensagem vai para a função `exibir` (por padrão, o console). */
export class NotificadorEmail {
  #exibir;

  constructor(exibir = console.log) {
    this.#exibir = exibir;
  }

  obterCanal() {
    return "E-mail";
  }

  enviarAlerta(destinatario, mensagem) {
    if (!FORMATO_EMAIL.test(destinatario ?? "") || !mensagem?.trim()) return false;
    this.#exibir(`[${this.obterCanal()} → ${destinatario}] ${mensagem}`);
    return true;
  }
}

assinarContrato(NotificadorEmail, INotificador);
