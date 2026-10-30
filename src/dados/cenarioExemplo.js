import { Disciplina } from "../dominio/Disciplina.js";
import { MetaEstudo } from "../dominio/MetaEstudo.js";
import { Administrador } from "../dominio/usuarios/Administrador.js";
import { Discente } from "../dominio/usuarios/Discente.js";
import { Responsavel } from "../dominio/usuarios/Responsavel.js";

/**
 * Objetos de exemplo usados pela demonstração no terminal e pela tela.
 * Troque as disciplinas pelas do seu semestre.
 */
export function criarCenarioExemplo() {
  const disciplinas = [
    new Disciplina("ADS201", "Programação Orientada a Objetos", "Computação", 4),
    new Disciplina("ADS202", "Banco de Dados", "Dados", 4),
    new Disciplina("ADS203", "Engenharia de Software", "Computação", 3),
    new Disciplina("ADS204", "Empreendedorismo", "Negócios", 0), // carga inválida → padrão de 2h
  ];

  const administrador = new Administrador(1, "Carla Mendes", "carla.mendes@faculdade.edu.br", "admin#2026", "Coordenação PI");
  const responsavel = new Responsavel(2, "Marcos Lima", "marcos.lima@email.com", "resp#2026", "Pai");
  const discente = new Discente(3, "Ana Lima", "ana.lima@aluno.edu.br", "aluna#2026", "2026101234");
  const meta = new MetaEstudo(600);

  responsavel.vincularDiscente(discente);
  responsavel.definirMeta(discente, meta);

  return { disciplinas, administrador, responsavel, discente, meta };
}
