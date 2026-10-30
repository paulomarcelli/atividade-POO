import {
  erroMetodoAbstrato,
  exigirEmail,
  exigirInteiro,
  exigirTexto,
  impedirInstanciaDireta,
} from "../../util/validacao.js";

/**
 * Missão 3 — Classe abstrata: na plataforma não existe "usuário genérico", só Administrador,
 * Responsável e Discente. A senha é privada e não tem getter: só dá para conferi-la.
 */
export class Usuario {
  #id;
  #nome;
  #email;
  #senha;

  constructor(id, nome, email, senha) {
    impedirInstanciaDireta(new.target, Usuario);
    this.#id = exigirInteiro(id, "Id", { minimo: 1 });
    this.#nome = exigirTexto(nome, "Nome");
    this.#email = exigirEmail(email);
    this.#senha = exigirTexto(senha, "Senha");
  }

  get id() {
    return this.#id;
  }

  get nome() {
    return this.#nome;
  }

  get email() {
    return this.#email;
  }

  autenticar(senhaDigitada) {
    return senhaDigitada === this.#senha;
  }

  /** @abstract */
  obterTipoPerfil() {
    throw erroMetodoAbstrato(this, "obterTipoPerfil");
  }

  /** @abstract */
  gerarPainelResumo() {
    throw erroMetodoAbstrato(this, "gerarPainelResumo");
  }
}
