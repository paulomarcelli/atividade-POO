/** Validações compartilhadas pelas classes do domínio. Todas devolvem o valor já validado. */

export const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function exigirTexto(valor, campo) {
  if (typeof valor !== "string" || valor.trim() === "") {
    throw new TypeError(`${campo} deve ser um texto não vazio.`);
  }
  return valor.trim();
}

export function exigirInteiro(valor, campo, { minimo, maximo } = {}) {
  if (!Number.isInteger(valor)) throw new TypeError(`${campo} deve ser um número inteiro.`);
  if (minimo !== undefined && valor < minimo) throw new RangeError(`${campo} deve ser no mínimo ${minimo}.`);
  if (maximo !== undefined && valor > maximo) throw new RangeError(`${campo} deve ser no máximo ${maximo}.`);
  return valor;
}

export function exigirEmail(valor, campo = "e-mail") {
  const email = exigirTexto(valor, campo);
  if (!FORMATO_EMAIL.test(email)) throw new TypeError(`${campo} inválido: ${email}`);
  return email;
}

export function exigirInstancia(valor, Classe, campo) {
  if (!(valor instanceof Classe)) throw new TypeError(`${campo} deve ser um(a) ${Classe.name}.`);
  return valor;
}

/** Classes abstratas chamam isto no construtor com `new.target`: só as subclasses podem ser instanciadas. */
export function impedirInstanciaDireta(alvo, ClasseAbstrata) {
  if (alvo === ClasseAbstrata) {
    throw new TypeError(`${ClasseAbstrata.name} é abstrata: instancie uma das subclasses.`);
  }
}

/** Erro lançado por métodos abstratos que a subclasse esqueceu de sobrescrever. */
export function erroMetodoAbstrato(objeto, metodo) {
  return new Error(`${objeto.constructor.name} precisa sobrescrever ${metodo}().`);
}
