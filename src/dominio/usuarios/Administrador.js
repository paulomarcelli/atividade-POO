import { exigirTexto } from "../../util/validacao.js";
import { Usuario } from "./Usuario.js";

export class Administrador extends Usuario {
  #cargo;

  constructor(id, nome, email, senha, cargo) {
    super(id, nome, email, senha);
    this.#cargo = exigirTexto(cargo, "Cargo");
  }

  get cargo() {
    return this.#cargo;
  }

  obterTipoPerfil() {
    return "Administrador";
  }

  gerarPainelResumo() {
    return `${this.obterTipoPerfil()} ${this.nome} · ${this.#cargo}`;
  }
}
