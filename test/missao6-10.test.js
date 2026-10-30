import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { implementa, IExportavelJson, INotificador } from "../src/contratos/interfaces.js";
import { criarCenarioExemplo } from "../src/dados/cenarioExemplo.js";
import { MetaEstudo } from "../src/dominio/MetaEstudo.js";
import { NotificadorEmail } from "../src/dominio/notificadores/NotificadorEmail.js";
import { NotificadorPainel } from "../src/dominio/notificadores/NotificadorPainel.js";
import { NotificadorWhatsApp } from "../src/dominio/notificadores/NotificadorWhatsApp.js";
import { PlanoEstudo } from "../src/dominio/PlanoEstudo.js";
import { SessaoExercicios } from "../src/dominio/sessoes/SessaoExercicios.js";
import { TrilhaEstudo } from "../src/dominio/TrilhaEstudo.js";
import { ClienteBackendEstudo } from "../src/servicos/ClienteBackendEstudo.js";
import { ServicoAlertaResponsavel } from "../src/servicos/ServicoAlertaResponsavel.js";

describe("Missão 6 · Interfaces", () => {
  it("os três notificadores cumprem INotificador", () => {
    const enviadas = [];
    const guardar = (texto) => enviadas.push(texto);
    for (const notificador of [new NotificadorEmail(guardar), new NotificadorWhatsApp(guardar), new NotificadorPainel(guardar)]) {
      assert.ok(implementa(notificador, INotificador));
    }
    assert.equal(new NotificadorEmail(guardar).enviarAlerta("pai@email.com", "Oi"), true);
    assert.equal(new NotificadorEmail(guardar).enviarAlerta("sem-arroba", "Oi"), false);
    assert.equal(new NotificadorWhatsApp(guardar).enviarAlerta("", "Oi"), false);
    assert.deepEqual(enviadas, ["[E-mail → pai@email.com] Oi"]);
  });

  it("sessão e meta exportam JSON válido", () => {
    const { disciplinas } = criarCenarioExemplo();
    const sessao = new SessaoExercicios(disciplinas[1], 40, 10, 8);
    const meta = new MetaEstudo(100);
    meta.registrarAvanco(40);
    assert.ok(implementa(sessao, IExportavelJson) && implementa(meta, IExportavelJson));
    assert.deepEqual(JSON.parse(sessao.paraJson()), {
      modalidade: "Lista de Exercícios",
      disciplina: { codigo: "ADS202", nome: "Banco de Dados" },
      duracaoMinutos: 40,
      xp: 120,
      totalQuestoes: 10,
      acertos: 8,
    });
    assert.deepEqual(JSON.parse(meta.paraJson()), { metaMinutosSemana: 100, minutosCumpridos: 40, percentual: 40, cumprida: false });
  });
});

describe("Missão 7 · Associação e agregação", () => {
  it("vincula discentes sem duplicar", () => {
    const { responsavel, discente } = criarCenarioExemplo();
    assert.equal(responsavel.vincularDiscente(discente), false);
    assert.equal(responsavel.discentes.length, 1);
    assert.ok(responsavel.obterMeta(discente) instanceof MetaEstudo);
  });

  it("a trilha soma a carga e as disciplinas sobrevivem a ela", () => {
    const { administrador, disciplinas } = criarCenarioExemplo();
    let trilha = new TrilhaEstudo("Trilha 2º Semestre ADS", administrador);
    disciplinas.forEach((disciplina) => trilha.adicionarDisciplina(disciplina));
    assert.equal(trilha.adicionarDisciplina(disciplinas[0]), false);
    assert.equal(trilha.calcularCargaHorariaTotal(), 4 + 4 + 3 + 2);
    trilha = null;
    assert.equal(disciplinas[0].nome, "Programação Orientada a Objetos");
  });
});

describe("Missão 8 · Composição e dependência", () => {
  it("o plano cria os itens e não expõe a lista interna", () => {
    const { discente } = criarCenarioExemplo();
    const plano = new PlanoEstudo(discente);
    plano.adicionarItem("Segunda", 90);
    plano.adicionarItem("sábado", 30);
    const itens = plano.listarItens();
    assert.deepEqual(itens, [
      { diaSemana: "segunda", minutosPlanejados: 90 },
      { diaSemana: "sábado", minutosPlanejados: 30 },
    ]);
    itens.pop();
    assert.equal(plano.calcularTotalMinutos(), 120);
    assert.throws(() => plano.adicionarItem("feriado", 30), RangeError);
  });

  it("o serviço de alerta informa o percentual ou parabeniza", () => {
    const { discente, meta, responsavel } = criarCenarioExemplo();
    const enviadas = [];
    const notificador = new NotificadorEmail((texto) => enviadas.push(texto));
    const servico = new ServicoAlertaResponsavel();

    meta.registrarAvanco(150);
    assert.equal(servico.avaliarDiscente(discente, meta, responsavel, notificador), true);
    meta.registrarAvanco(450);
    servico.avaliarDiscente(discente, meta, responsavel, notificador);

    assert.equal(enviadas[0], "[E-mail → marcos.lima@email.com] Ana Lima cumpriu 25% da meta semanal (150 de 600 min).");
    assert.match(enviadas[1], /Parabéns! Ana Lima atingiu 100%/);
    assert.equal(Object.keys(servico).length, 0);
  });
});

describe("Missão 10 · ClienteBackendEstudo", () => {
  const respostaJson = (dados, status = 200) => ({ ok: status < 400, status, text: async () => JSON.stringify(dados) });

  it("envia a sessão por POST em /api/sessoes", async () => {
    const chamadas = [];
    const cliente = new ClienteBackendEstudo("http://localhost:5080/", async (url, opcoes) => {
      chamadas.push({ url, opcoes });
      return respostaJson({ id: 1 }, 201);
    });
    const { discente, disciplinas } = criarCenarioExemplo();
    const sessao = discente.registrarEstudo(disciplinas[0], 50);

    assert.deepEqual(await cliente.enviarSessao(discente, sessao), { id: 1 });
    assert.equal(chamadas[0].url, "http://localhost:5080/api/sessoes");
    assert.equal(chamadas[0].opcoes.method, "POST");
    const corpo = JSON.parse(chamadas[0].opcoes.body);
    assert.equal(corpo.discente, "Ana Lima");
    assert.equal(corpo.modalidade, "Pomodoro");
    assert.equal(corpo.xp, 130);
  });

  it("busca o relatório pelo nome e avisa quando o servidor falha", async () => {
    const urls = [];
    const cliente = new ClienteBackendEstudo(undefined, async (url) => {
      urls.push(url);
      return respostaJson({ erro: "x" }, 500);
    });
    await assert.rejects(cliente.obterRelatorio("Ana Lima"), /500/);
    assert.equal(urls[0], "http://localhost:5080/api/relatorio/Ana%20Lima");
  });
});
