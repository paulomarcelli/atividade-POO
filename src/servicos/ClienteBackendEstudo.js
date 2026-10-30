/**
 * Missão 10 — Cliente do BackendEstudoAPI (C# + MySQL) em http://localhost:5080.
 * Dependência: recebe discente e sessão como parâmetros e não os guarda.
 */
export class ClienteBackendEstudo {
  #urlBase;
  #buscar;

  constructor(urlBase = "http://localhost:5080", buscar = globalThis.fetch) {
    this.#urlBase = urlBase.replace(/\/$/, "");
    // Chamado por uma função à parte: o fetch do navegador falha se `this` não for a janela.
    this.#buscar = (url, opcoes) => buscar(url, opcoes);
  }

  /** POST /api/sessoes com o JSON da sessão e a identificação do discente. */
  enviarSessao(discente, sessao) {
    const corpo = { discente: discente.nome, ra: discente.ra, ...JSON.parse(sessao.paraJson()) };
    return this.#requisitar("/api/sessoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
    });
  }

  /** GET /api/sessoes */
  listarSessoes() {
    return this.#requisitar("/api/sessoes");
  }

  /** GET /api/relatorio/{nomeDiscente} */
  obterRelatorio(nomeDiscente) {
    return this.#requisitar(`/api/relatorio/${encodeURIComponent(nomeDiscente)}`);
  }

  async #requisitar(caminho, opcoes) {
    const resposta = await this.#buscar(`${this.#urlBase}${caminho}`, opcoes);
    if (!resposta.ok) throw new Error(`O servidor respondeu ${resposta.status} em ${caminho}.`);
    const texto = await resposta.text();
    return texto ? JSON.parse(texto) : null;
  }
}
