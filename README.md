# Atividade POO · Plataforma de Estudos do Projeto Interdisciplinar

As 10 missões de Programação Orientada a Objetos resolvidas em **JavaScript** (classes ES2022, campos privados `#`),
com testes automatizados, demonstração no terminal e tela em HTML5 + CSS3 + DOM. Não há dependências: basta o
Node.js 18 ou mais novo.

## Como rodar

```bash
npm test          # 29 testes (node:test), um bloco por missão
npm run demo      # Missões 1 a 8 no terminal
npm start         # tela (Missões 9 e 10) em http://localhost:5500/web/
```

A tela precisa ser aberta por HTTP (`npm start` ou a extensão Live Server do VS Code): módulos JavaScript não
carregam abrindo o `index.html` direto do disco.

## Onde está cada missão

| Missão | Conceito | Arquivos |
|---|---|---|
| 1 | Abstração, classes e objetos | `src/dominio/Disciplina.js` |
| 2 | Encapsulamento | `src/dominio/MetaEstudo.js` |
| 3 | Classe abstrata e herança | `src/dominio/usuarios/` (`Usuario`, `Administrador`, `Responsavel`, `Discente`) |
| 4 | Polimorfismo dinâmico | `src/dominio/sessoes/` (`SessaoEstudo` e as 3 modalidades) |
| 5 | Polimorfismo estático (sobrecarga) | `Discente.registrarEstudo` em `src/dominio/usuarios/Discente.js` |
| 6 | Interfaces | `src/contratos/interfaces.js`, `src/dominio/notificadores/` |
| 7 | Associação e agregação | `Responsavel` (vincula discentes e metas), `src/dominio/TrilhaEstudo.js` |
| 8 | Composição e dependência | `src/dominio/PlanoEstudo.js`, `src/servicos/ServicoAlertaResponsavel.js` |
| 9 | Interface gráfica | `web/index.html`, `web/estilos.css`, `web/app.js` |
| 10 | Backend C# e MySQL | `src/servicos/ClienteBackendEstudo.js` + botões da tela |

```
src/
├── contratos/interfaces.js     INotificador, IExportavelJson e a checagem dos contratos
├── dominio/                    as classes do negócio
│   ├── Disciplina.js, MetaEstudo.js, TrilhaEstudo.js, PlanoEstudo.js
│   ├── usuarios/               Usuario (abstrata) → Administrador, Responsavel, Discente
│   ├── sessoes/                SessaoEstudo (abstrata) → Pomodoro, Exercicios, Leitura
│   └── notificadores/          E-mail, WhatsApp e Painel
├── servicos/                   ServicoAlertaResponsavel, ClienteBackendEstudo
├── dados/cenarioExemplo.js     objetos de exemplo usados pela demo e pela tela
├── util/validacao.js           validações compartilhadas
└── main.js                     demonstração no terminal
web/                            a tela
test/                           os testes
scripts/servidor.js             servidor estático para abrir a tela
```

## Como os conceitos ficaram em JavaScript

O enunciado é escrito pensando em C#. Em JavaScript, algumas coisas precisam de outro caminho:

- **Nomes:** métodos em `camelCase` (`calcularCargaEmMinutos`, `exibirResumo`), como é o padrão da linguagem. Os
  getters são propriedades: `disciplina.nome` faz o papel de `GetNome()`.
- **Privado:** campos com `#` são privados de verdade. `meta.minutosCumpridos = 99999` dá erro, e `Usuario` não tem
  getter para a senha, só `autenticar(senhaDigitada)`.
- **Classe abstrata:** o construtor de `Usuario` e de `SessaoEstudo` confere `new.target` e recusa
  `new Usuario(...)`. Os métodos abstratos lançam erro se a subclasse não os sobrescrever.
- **Sobrecarga:** JavaScript não tem overload nativo. `registrarEstudo(...)` confere a quantidade e o tipo dos
  argumentos e escolhe uma das três formas, cada uma num método privado (`#registrarSessao`, `#registrarRapido`,
  `#registrarPorHorario`).
- **Interfaces:** não existe a palavra `interface`. Cada contrato é a lista dos métodos exigidos;
  `assinarContrato(Classe, Contrato)` confere isso quando a classe carrega, e `implementa(objeto, Contrato)` confere
  um objeto antes de usá-lo (o `ServicoAlertaResponsavel` faz isso com o notificador).
- **Composição:** `ItemCronograma` nem é exportado do módulo: só o `PlanoEstudo` consegue criá-lo, e `listarItens()`
  devolve cópias, nunca a lista interna.

## Observações finais do Mini-Projeto (Missão 10)

- Ao clicar em **Registrar Estudo**, a tela atualiza os objetos em memória e envia `POST /api/sessoes` com o JSON da
  sessão (`sessao.paraJson()`) acrescido de `discente` e `ra`, para que o relatório por discente funcione. Se o
  backend estiver fora do ar, a tela avisa e a sessão fica só na memória.
- **Carregar Histórico do Servidor** faz `GET /api/sessoes`; **Relatório do Discente** faz
  `GET /api/relatorio/{nomeDiscente}`.
- O formato do JSON aceito pelo `BackendEstudoAPI` não estava no enunciado. Os campos enviados são `discente`, `ra`,
  `modalidade`, `disciplina { codigo, nome }`, `duracaoMinutos`, `xp` e os dados da modalidade. Se o backend usar
  outros nomes, ajuste só o método `enviarSessao` de `ClienteBackendEstudo`.
- A tela roda em `localhost:5500` e o backend em `localhost:5080`: o backend precisa liberar CORS para essa origem.
- O cliente foi testado contra um backend simulado; com o `BackendEstudoAPI.exe` real, confira os dois pontos acima.

## Checklist

- [x] **Abstração, classes e objetos:** `Disciplina` modelada e instanciada.
- [x] **Encapsulamento:** `MetaEstudo` e `Usuario` com campos privados e validações.
- [x] **Classe abstrata e herança:** `Usuario` abstrata herdada por `Administrador`, `Responsavel` e `Discente`.
- [x] **Polimorfismo dinâmico:** `SessaoEstudo` e as 3 modalidades calculando XP e feedback por sobrescrita.
- [x] **Polimorfismo estático:** sobrecarga de `registrarEstudo` em `Discente`.
- [x] **Interfaces:** `INotificador` e `IExportavelJson` implementadas e usadas.
- [x] **Relacionamentos UML:** associação, agregação, composição e dependência.
- [x] **Tela visual + backend:** a tela envia `POST /api/sessoes` para `http://localhost:5080`.
