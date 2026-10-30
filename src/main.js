/** Demonstração no terminal das Missões 1 a 8. Rode com: npm run demo */
import { implementa, IExportavelJson } from "./contratos/interfaces.js";
import { criarCenarioExemplo } from "./dados/cenarioExemplo.js";
import { MetaEstudo } from "./dominio/MetaEstudo.js";
import { NotificadorEmail } from "./dominio/notificadores/NotificadorEmail.js";
import { NotificadorPainel } from "./dominio/notificadores/NotificadorPainel.js";
import { NotificadorWhatsApp } from "./dominio/notificadores/NotificadorWhatsApp.js";
import { PlanoEstudo } from "./dominio/PlanoEstudo.js";
import { SessaoExercicios } from "./dominio/sessoes/SessaoExercicios.js";
import { SessaoLeitura } from "./dominio/sessoes/SessaoLeitura.js";
import { SessaoPomodoro } from "./dominio/sessoes/SessaoPomodoro.js";
import { TrilhaEstudo } from "./dominio/TrilhaEstudo.js";
import { Usuario } from "./dominio/usuarios/Usuario.js";
import { ServicoAlertaResponsavel } from "./servicos/ServicoAlertaResponsavel.js";

const titulo = (texto) => console.log(`\n=== ${texto} ===`);
const { disciplinas, administrador, responsavel, discente, meta } = criarCenarioExemplo();
const [poo, bancoDeDados, engenharia] = disciplinas;

titulo("Missão 1 · Disciplinas");
for (const disciplina of disciplinas) console.log(disciplina.exibirResumo());

titulo("Missão 2 · Meta semanal protegida");
const metaDeTeste = new MetaEstudo(-100);
console.log(`Meta pedida: -100 min → ajustada para ${metaDeTeste.metaMinutosSemana} min`);
console.log(`registrarAvanco(-50)  → ${metaDeTeste.registrarAvanco(-50)}`);
console.log(`registrarAvanco(600)  → ${metaDeTeste.registrarAvanco(600)} (acima de 480 numa sessão)`);
console.log(`registrarAvanco(45)   → ${metaDeTeste.registrarAvanco(45)}`);
console.log(`Percentual: ${metaDeTeste.calcularPercentual()}% · cumprida: ${metaDeTeste.estaCumprida()}`);

titulo("Missão 3 · Perfis (classe abstrata e herança)");
for (const usuario of [administrador, responsavel, discente]) {
  console.log(`${usuario.obterTipoPerfil().padEnd(13)} | ${usuario.gerarPainelResumo()}`);
}
console.log(`Ana autentica com a senha certa? ${discente.autenticar("aluna#2026")}`);
console.log(`E com a errada? ${discente.autenticar("123456")}`);
try {
  new Usuario(9, "Genérico", "x@y.com", "senha");
} catch (erro) {
  console.log(`new Usuario(...) → ${erro.message}`);
}

titulo("Missão 4 · Sessões polimórficas");
const sessoes = [
  new SessaoPomodoro(poo, 50, 2),
  new SessaoExercicios(bancoDeDados, 40, 10, 8),
  new SessaoLeitura(engenharia, 30, 12, true),
];
let xpTotal = 0;
for (const sessao of sessoes) {
  console.log(sessao.gerarFeedback());
  xpTotal += sessao.calcularXp();
}
console.log(`XP total das sessões: ${xpTotal}`);

titulo("Missão 5 · registrarEstudo sobrecarregado");
discente.registrarEstudo(sessoes[0]);
discente.registrarEstudo(bancoDeDados, 60);
discente.registrarEstudo(engenharia, 19, 21, 20);
for (const sessao of discente.historico) console.log(`- ${sessao.gerarFeedback()}`);
console.log(discente.gerarPainelResumo());

titulo("Missão 6 · Interfaces");
const notificadores = [new NotificadorEmail(), new NotificadorWhatsApp(), new NotificadorPainel()];
for (const notificador of notificadores) {
  notificador.enviarAlerta(notificador.obterCanal() === "WhatsApp" ? "+55 11 99999-0000" : responsavel.email, "Teste de canal");
}
for (const objeto of [sessoes[1], meta, discente]) {
  console.log(`${objeto.constructor.name} é IExportavelJson? ${implementa(objeto, IExportavelJson)} → ${objeto.paraJson()}`);
}

titulo("Missão 7 · Associação e agregação");
console.log(`Vincular Ana de novo duplica? ${responsavel.vincularDiscente(discente) ? "sim" : "não"}`);
console.log(responsavel.gerarPainelResumo());
const trilha = new TrilhaEstudo("Trilha 2º Semestre ADS", administrador);
disciplinas.forEach((disciplina) => trilha.adicionarDisciplina(disciplina));
console.log(`${trilha.titulo} (por ${trilha.administrador.nome}): ${trilha.calcularCargaHorariaTotal()}h/semana`);

titulo("Missão 8 · Composição e dependência");
const plano = new PlanoEstudo(discente);
plano.adicionarItem("segunda", 90);
plano.adicionarItem("quarta", 60);
plano.adicionarItem("sábado", 120);
for (const { diaSemana, minutosPlanejados } of plano.listarItens()) console.log(`- ${diaSemana}: ${minutosPlanejados} min`);
console.log(`Total planejado: ${plano.calcularTotalMinutos()} min`);

for (const sessao of discente.historico) meta.registrarAvanco(sessao.duracaoMinutos);
new ServicoAlertaResponsavel().avaliarDiscente(discente, meta, responsavel, new NotificadorEmail());
