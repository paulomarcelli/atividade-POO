/**
 * Missão 6 — Interfaces.
 *
 * JavaScript não tem a palavra-chave `interface`. Aqui um contrato é a lista de métodos que uma
 * classe promete ter. `assinarContrato` confere isso quando a classe é carregada (se faltar um
 * método, o programa nem sobe) e `implementa` confere um objeto antes de usá-lo.
 */

function definirInterface(nome, metodos) {
  return Object.freeze({ nome, metodos: Object.freeze([...metodos]) });
}

export const INotificador = definirInterface("INotificador", ["obterCanal", "enviarAlerta"]);
export const IExportavelJson = definirInterface("IExportavelJson", ["paraJson"]);

export function assinarContrato(Classe, ...contratos) {
  for (const contrato of contratos) {
    const faltando = contrato.metodos.filter((metodo) => typeof Classe.prototype[metodo] !== "function");
    if (faltando.length > 0) {
      throw new TypeError(`${Classe.name} não cumpre ${contrato.nome}: falta ${faltando.join(", ")}.`);
    }
  }
}

export function implementa(objeto, contrato) {
  return contrato.metodos.every((metodo) => typeof objeto?.[metodo] === "function");
}
