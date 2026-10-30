import { implementa, INotificador } from "../contratos/interfaces.js";
import { MetaEstudo } from "../dominio/MetaEstudo.js";
import { Discente } from "../dominio/usuarios/Discente.js";
import { Responsavel } from "../dominio/usuarios/Responsavel.js";
import { exigirInstancia } from "../util/validacao.js";

const formatarPercentual = (valor) => valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

/**
 * Missão 8 — Dependência (- - ->): o serviço usa Discente, MetaEstudo, Responsavel e INotificador
 * só durante `avaliarDiscente`. Não guarda nenhum deles: a classe não tem campos.
 */
export class ServicoAlertaResponsavel {
  avaliarDiscente(discente, meta, responsavel, notificador) {
    exigirInstancia(discente, Discente, "Discente");
    exigirInstancia(meta, MetaEstudo, "Meta");
    exigirInstancia(responsavel, Responsavel, "Responsável");
    if (!implementa(notificador, INotificador)) throw new TypeError("O notificador precisa cumprir INotificador.");

    const mensagem = meta.estaCumprida()
      ? `Parabéns! ${discente.nome} atingiu 100% da meta semanal de ${meta.metaMinutosSemana} min.`
      : `${discente.nome} cumpriu ${formatarPercentual(meta.calcularPercentual())}% da meta semanal ` +
        `(${meta.minutosCumpridos} de ${meta.metaMinutosSemana} min).`;

    return notificador.enviarAlerta(responsavel.email, mensagem);
  }
}
