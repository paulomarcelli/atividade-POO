import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Disciplina } from "../src/dominio/Disciplina.js";
import { MetaEstudo } from "../src/dominio/MetaEstudo.js";

describe("Missão 1 · Disciplina", () => {
  it("monta o resumo no formato pedido", () => {
    const poo = new Disciplina("ADS201", "Programação Orientada a Objetos", "Computação", 4);
    assert.equal(poo.calcularCargaEmMinutos(), 240);
    assert.equal(poo.exibirResumo(), "[ADS201] Programação Orientada a Objetos (Computação) — 4h/semana (240 min)");
  });

  it("usa 2h quando a carga é zero ou negativa", () => {
    assert.equal(new Disciplina("X1", "Teste", "Dados", 0).cargaHorariaSemanalHoras, 2);
    assert.equal(new Disciplina("X2", "Teste", "Dados", -3).cargaHorariaSemanalHoras, 2);
  });

  it("recusa texto vazio", () => {
    assert.throws(() => new Disciplina("", "Teste", "Dados", 2), TypeError);
  });
});

describe("Missão 2 · MetaEstudo", () => {
  it("ajusta a meta para a faixa de 30 a 3000", () => {
    assert.equal(new MetaEstudo(-100).metaMinutosSemana, 30);
    assert.equal(new MetaEstudo(9999).metaMinutosSemana, 3000);
    assert.equal(new MetaEstudo(600).metaMinutosSemana, 600);
  });

  it("só aceita avanços entre 1 e 480 minutos", () => {
    const meta = new MetaEstudo(600);
    assert.equal(meta.registrarAvanco(0), false);
    assert.equal(meta.registrarAvanco(-10), false);
    assert.equal(meta.registrarAvanco(481), false);
    assert.equal(meta.registrarAvanco(480), true);
    assert.equal(meta.minutosCumpridos, 480);
  });

  it("não deixa alterar os minutos por fora", () => {
    const meta = new MetaEstudo(100);
    assert.throws(() => {
      meta.minutosCumpridos = 99999;
    }, TypeError);
    assert.equal(meta.minutosCumpridos, 0);
  });

  it("trava o percentual em 100", () => {
    const meta = new MetaEstudo(100);
    meta.registrarAvanco(50);
    assert.equal(meta.calcularPercentual(), 50);
    assert.equal(meta.estaCumprida(), false);
    meta.registrarAvanco(200);
    assert.equal(meta.calcularPercentual(), 100);
    assert.equal(meta.estaCumprida(), true);
  });
});
