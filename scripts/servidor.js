/**
 * Servidor estático mínimo para abrir a tela (web/) no navegador. Módulos ES não carregam por
 * file://, por isso é preciso servir por HTTP. Rode com: npm start
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const PORTA = Number(process.env.PORTA ?? 5500);
const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const servidor = createServer(async (pedido, resposta) => {
  const caminho = decodeURIComponent(new URL(pedido.url, "http://localhost").pathname);
  if (caminho === "/") {
    resposta.writeHead(302, { Location: "/web/" }).end();
    return;
  }

  const arquivo = normalize(join(RAIZ, caminho.endsWith("/") ? `${caminho}index.html` : caminho));
  if (!arquivo.startsWith(RAIZ.endsWith(sep) ? RAIZ : RAIZ + sep)) {
    resposta.writeHead(403).end("Acesso negado");
    return;
  }

  try {
    const conteudo = await readFile(arquivo);
    resposta.writeHead(200, { "Content-Type": TIPOS[extname(arquivo)] ?? "application/octet-stream" }).end(conteudo);
  } catch {
    resposta.writeHead(404).end("Não encontrado");
  }
});

servidor.listen(PORTA, () => console.log(`Plataforma de Estudos em http://localhost:${PORTA}/web/`));
