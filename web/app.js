/** Missões 9 e 10 — a tela liga o formulário aos objetos do domínio e ao backend. */
import { criarCenarioExemplo } from "../src/dados/cenarioExemplo.js";
import { NotificadorPainel } from "../src/dominio/notificadores/NotificadorPainel.js";
import { SessaoExercicios } from "../src/dominio/sessoes/SessaoExercicios.js";
import { SessaoLeitura } from "../src/dominio/sessoes/SessaoLeitura.js";
import { SessaoPomodoro } from "../src/dominio/sessoes/SessaoPomodoro.js";
import { ClienteBackendEstudo } from "../src/servicos/ClienteBackendEstudo.js";
import { ServicoAlertaResponsavel } from "../src/servicos/ServicoAlertaResponsavel.js";

const DURACAO_DO_AVISO_MS = 4500;

/** Cada modalidade diz como se chama o seu dado extra e como criar a sua sessão. Sem if por tipo. */
const MODALIDADES = {
  pomodoro: {
    rotuloExtra: "Ciclos completos",
    criar: (disciplina, minutos, dados) => new SessaoPomodoro(disciplina, minutos, dados.extra),
  },
  exercicios: {
    rotuloExtra: "Acertos",
    criar: (disciplina, minutos, dados) => new SessaoExercicios(disciplina, minutos, dados.totalQuestoes, dados.extra),
  },
  leitura: {
    rotuloExtra: "Páginas lidas",
    criar: (disciplina, minutos, dados) => new SessaoLeitura(disciplina, minutos, dados.extra, dados.fezResumo),
  },
};

const { disciplinas, responsavel, discente, meta } = criarCenarioExemplo();
const cliente = new ClienteBackendEstudo();
const servicoDeAlerta = new ServicoAlertaResponsavel();
const notificador = new NotificadorPainel(mostrarAviso);

const $ = (seletor) => document.querySelector(seletor);
const formulario = $("#form-sessao");

function preencherDisciplinas() {
  const opcoes = disciplinas.map((disciplina, indice) => new Option(`${disciplina.codigo} · ${disciplina.nome}`, String(indice)));
  formulario.disciplina.replaceChildren(...opcoes);
}

function ajustarCamposDaModalidade() {
  const modalidade = formulario.modalidade.value;
  $("[data-rotulo-extra]").textContent = MODALIDADES[modalidade].rotuloExtra;
  for (const campo of document.querySelectorAll("[data-so-para]")) {
    campo.hidden = campo.dataset.soPara !== modalidade;
  }
}

function lerFormulario() {
  return {
    disciplina: disciplinas[Number(formulario.disciplina.value)],
    modalidade: formulario.modalidade.value,
    minutos: formulario.duracao.valueAsNumber,
    extra: formulario.extra.valueAsNumber,
    totalQuestoes: formulario.totalQuestoes.valueAsNumber,
    fezResumo: formulario.fezResumo.checked,
  };
}

function registrarEstudo(evento) {
  evento.preventDefault();
  const dados = lerFormulario();
  let sessao;
  try {
    sessao = MODALIDADES[dados.modalidade].criar(dados.disciplina, dados.minutos, dados);
  } catch (erro) {
    mostrarErro(erro.message);
    return;
  }
  if (!meta.registrarAvanco(dados.minutos)) {
    mostrarErro("A meta só aceita sessões de 1 a 480 minutos.");
    return;
  }
  discente.registrarEstudo(sessao);
  mostrarErro("");
  renderizar();
  enviarAoServidor(sessao);
}

async function enviarAoServidor(sessao) {
  try {
    await cliente.enviarSessao(discente, sessao);
    definirStatusServidor("Sessão gravada no servidor.");
  } catch {
    definirStatusServidor("Servidor fora do ar: a sessão ficou só na memória desta página.");
  }
}

async function carregarDoServidor(buscar, descricao) {
  definirStatusServidor(`Carregando ${descricao}…`);
  try {
    const dados = await buscar();
    const itens = Array.isArray(dados) ? dados : [dados];
    $("[data-historico-servidor]").replaceChildren(...itens.map((item) => criarItem(descreverItemDoServidor(item))));
    definirStatusServidor(`${itens.length} registro(s) em ${descricao}.`);
  } catch {
    definirStatusServidor("Não foi possível falar com http://localhost:5080. O backend está rodando?");
  }
}

/** O formato exato vem do backend; mostra os campos conhecidos e, se faltarem, o JSON. */
function descreverItemDoServidor(item) {
  if (item && item.modalidade && item.duracaoMinutos) {
    const disciplina = item.disciplina?.nome ?? item.disciplina ?? "";
    return `${item.modalidade} em ${disciplina} (${item.duracaoMinutos} min) -> +${item.xp ?? "?"} XP`;
  }
  return JSON.stringify(item);
}

function notificarResponsavel() {
  servicoDeAlerta.avaliarDiscente(discente, meta, responsavel, notificador);
}

function renderizar() {
  $('[data-perfil="discente"]').textContent = discente.gerarPainelResumo();
  $('[data-perfil="responsavel"]').textContent = responsavel.gerarPainelResumo();

  const percentual = meta.calcularPercentual();
  const barra = $("[data-barra]");
  barra.style.width = `${percentual}%`;
  barra.classList.toggle("cumprida", meta.estaCumprida());
  barra.parentElement.setAttribute("aria-valuenow", String(Math.round(percentual)));
  $("[data-legenda-meta]").textContent =
    `${meta.minutosCumpridos} de ${meta.metaMinutosSemana} min · ${percentual.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;

  const sessoes = [...discente.historico].reverse();
  $("[data-historico]").replaceChildren(...sessoes.map((sessao) => criarItem(sessao.gerarFeedback())));
  $("[data-historico-vazio]").hidden = sessoes.length > 0;
}

function criarItem(texto) {
  const item = document.createElement("li");
  item.textContent = texto;
  return item;
}

function mostrarErro(mensagem) {
  $("[data-erro]").textContent = mensagem;
}

function definirStatusServidor(mensagem) {
  $("[data-status-servidor]").textContent = mensagem;
}

function mostrarAviso(mensagem) {
  const aviso = document.createElement("div");
  aviso.className = "aviso";
  aviso.textContent = mensagem;
  $("[data-avisos]").append(aviso);
  setTimeout(() => aviso.remove(), DURACAO_DO_AVISO_MS);
}

preencherDisciplinas();
ajustarCamposDaModalidade();
renderizar();

formulario.modalidade.addEventListener("change", ajustarCamposDaModalidade);
formulario.addEventListener("submit", registrarEstudo);
$("[data-notificar]").addEventListener("click", notificarResponsavel);
$("[data-carregar-servidor]").addEventListener("click", () => carregarDoServidor(() => cliente.listarSessoes(), "/api/sessoes"));
$("[data-carregar-relatorio]").addEventListener("click", () =>
  carregarDoServidor(() => cliente.obterRelatorio(discente.nome), `relatório de ${discente.nome}`),
);
