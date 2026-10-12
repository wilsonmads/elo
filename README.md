# 🤝 SolidarAção — Plataforma Colaborativa de Doações Solidárias

> **Atividade de Extensão Universitária**  
> Solução colaborativa para divulgação de pontos de coleta e financiamento coletivo de alimentos, roupas e itens de higiene para famílias em situação de vulnerabilidade social.

A **SolidarAção** une o melhor de duas grandes referências:
* 🟢 **A dinâmica do [Vakinha.com.br](https://www.vakinha.com.br)**: cards de campanhas com barras de progresso em tempo real, metas em R$ e itens, e modal de doação instantânea via PIX (com código Copia e Cola e QR Code).
* 🔴 **O impacto social do [ActionAid.org.br](https://actionaid.org.br)**: hero banner com foco em urgência social, contadores animados de impacto (33 milhões com fome, famílias atendidas), pilares de causa horizontais e histórias reais de transformação.

---

## 📋 Índice

1. [Pré-requisitos](#-pré-requisitos)
2. [Passo a Passo: Como Rodar o Projeto](#-passo-a-passo-como-rodar-o-projeto)
3. [Como Funciona o Banco de Dados (Dual-Mode)](#-como-funciona-o-banco-de-dados-dual-mode)
4. [Como Testar as Funcionalidades](#-como-testar-as-funcionalidades)
5. [Estrutura de Pastas](#-estrutura-de-pastas)
6. [Fundamentação Teórica e Acadêmica](#-fundamentação-teórica-e-acadêmica)
7. [Documentos do Projeto](#-documentos-do-projeto)
8. [Comandos Úteis & Resolução de Dúvidas](#-comandos-úteis--resolução-de-dúvidas)

---

## 💻 Pré-requisitos

Antes de começar, verifique se você possui instalado no seu computador:
* **Node.js** (versão 18 ou superior — recomendada v20+ ou v24)
* **npm** (gerenciador de pacotes que já vem junto com o Node)
* Qualquer navegador web moderno (Google Chrome, Safari, Edge, Firefox)
* *(Opcional)* **MySQL 8.x / 9.x** e **MySQL Workbench** se desejar usar banco relacional externo.

Para verificar se o Node e o npm estão instalados, abra o seu Terminal e digite:
```bash
node -v
npm -v
```

---

## 🚀 Passo a Passo: Como Rodar o Projeto

Siga estas etapas simples para colocar o sistema em funcionamento:

### Passo 1: Abrir o Terminal
Abra o aplicativo **Terminal** (no Mac: `Cmd + Espaço` e digite `Terminal`).

---

### Passo 2: Entrar na pasta do backend
Navegue até a pasta `backend` do projeto:

```bash
cd /Users/wilsonmaia/Desktop/doacao_colaborativa/backend
```

---

### Passo 3: Instalar as dependências (apenas na primeira vez)
Se for a primeira vez que você roda o projeto nesta máquina:

```bash
npm install
```
*(Esse comando baixa o Express, MySQL2, SQLite3, CORS e Dotenv).*

---

### Passo 4: Iniciar o Servidor Node.js
Para ligar o servidor, execute:

```bash
npm start
```

Você verá mensagens semelhantes a esta no Terminal:
```text
✅ Banco de dados inicializado com sucesso.
🚀 Servidor Node.js rodando com SUCESSO na porta 3000
🔗 API disponível em: http://localhost:3000/api/campaigns
📊 Driver do Banco: SQLITE (ou MYSQL)
```

> **Dica para Desenvolvimento:**  
> Se quiser que o servidor reinicie automaticamente sempre que você alterar algum código, use:
> ```bash
> npm run dev
> ```

---

### Passo 5: Acessar no Navegador
Com o terminal rodando, abra o seu navegador e acerte o endereço:

👉 **[http://localhost:3000](http://localhost:3000)**

Pronto! A interface completa da **SolidarAção** será carregada conectada à API REST e ao banco de dados.

---

## 🗄️ Como Funciona o Banco de Dados (Dual-Mode)

O sistema foi arquitetado com um **mecanismo de persistência inteligente e resiliente**:

### 1. Modo SQLite3 (Automático e Sem Configuração) 🟢
* Se você apenas rodar `npm start` sem configurar nada, o sistema usa automaticamente o **SQLite3**.
* O arquivo físico do banco é criado em: `backend/db/database.sqlite`.
* **Vantagem:** Não precisa de senha, não precisa de servidor MySQL ligado e **já salva tudo permanentemente em disco**. Quando você fecha o site e abre de novo, as campanhas continuam lá!

### 2. Modo MySQL 9 / MySQL Workbench (Produção / Demonstração) 🐬
Se desejar conectar ao seu servidor **MySQL** local:
1. Abra o arquivo `backend/.env` (ou copie de `backend/.env.example`).
2. Preencha as credenciais:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=sua_senha_aqui
   DB_NAME=solidaracao
   PORT=3000
   ```
3. No **MySQL Workbench**, abra o script `backend/db/schema.sql` e clique no Raio ⚡ para criar o banco `solidaracao` e as tabelas.
4. Reinicie o servidor (`npm start`). O Terminal confirmará: `📊 Driver do Banco: MYSQL`.

---

## 🧪 Como Testar as Funcionalidades

Com o site aberto em `http://localhost:3000`:

1. **Explorar Campanhas e Pilares:**
   - Role a página para ver os contadores de impacto subindo suavemente.
   - Clique nos **Pilares de Causa** (*Alimentação, Roupas, Higiene, Saúde, Abrigo*) para filtrar instantaneamente.
2. **Fazer uma Doação via PIX (Simulação Real):**
   - Escolha qualquer campanha e clique no botão verde **"APOIAR"**.
   - Selecione o valor (R$ 20, R$ 50, R$ 100 ou digite outro valor).
   - Veja o QR Code simulado e clique em **"Copiar Código PIX"**.
   - Clique em **"Confirmar Doação"**: a barra de progresso avança e o valor é atualizado em tempo real no banco de dados!
3. **Criar uma Nova Campanha:**
   - No menu superior, clique em **"+ Criar Campanha"**.
   - Preencha o título, categoria, meta (R$ ou itens), história, ONG responsável e cidade.
   - Clique em **"Publicar Campanha"**: a sua campanha aparecerá imediatamente na listagem!
4. **Verificar a Persistência de Dados:**
   - Feche a aba do navegador.
   - Feche o navegador completamente.
   - Reabra o navegador em `http://localhost:3000`: a campanha que você criou estará lá gravada!

---

## 📁 Estrutura de Pastas

```text
doacao_colaborativa/
├── index.html                   # Página única SPA com HTML5 semântico
├── css/
│   └── styles.css               # Design System completo (tokens --sa-*, responsivo)
├── js/
│   ├── app.js                   # Controlador da interface, modais, filtros e contadores
│   ├── api-service.js           # Cliente HTTP Fetch com fallback automático
│   ├── data-service.js          # Repositório auxiliar LocalStorage
│   └── mock-data.js             # Campanhas iniciais de exemplo
├── backend/
│   ├── server.js                # Servidor Express, rotas estáticas e inicializador
│   ├── package.json             # Dependências (Express, MySQL2, SQLite3, Cors, Dotenv)
│   ├── .env.example             # Modelo de configuração de variáveis de ambiente
│   ├── config/
│   │   └── database.js          # Abstração de banco (MySQL Pool + SQLite Fallback)
│   ├── controllers/
│   │   ├── campaignController.js # CRUD de campanhas (criação, listagem e busca)
│   │   └── donationController.js # Registro de doações e geração de chave PIX
│   ├── routes/
│   │   ├── campaignRoutes.js    # Rotas GET / e POST / de campanhas
│   │   └── donationRoutes.js    # Rotas POST / de doações
│   └── db/
│       ├── schema.sql           # Script SQL para MySQL / Workbench
│       └── database.sqlite      # Arquivo de banco de dados SQLite local
└── docs/
    ├── relatorio_extensao.md    # Relatório acadêmico completo (Etapas a até i)
    ├── paper_academico.md       # Artigo científico formatado com citações ABNT
    └── questionario_google_forms.md # Questionário de 12 perguntas (Google Forms)
```

---

## 🏛️ Fundamentação Teórica e Acadêmica

Este projeto foi concebido e documentado em conformidade com as diretrizes de **Atividade de Extensão Universitária**:

1. **Modelo 3C de Colaboração (Fuks, Raposo & Gerosa, 2003, 2005; Pimentel & Fuks, 2012)**:
   * **Comunicação**: Mural comunitário, recados públicos de apoio entre doadores e organizadores.
   * **Coordenação**: Agendamento de rotas de entrega e recolhimento de itens físicos.
   * **Cooperação**: Metas coletivas conjuntas com barras de progresso acumulado em tempo real.
   * **Percepção (*Awareness*)**: Badges visuais de nível de estoque (Crítico 🔴 / Suficiente 🟢).
2. **Material Design 3 (Google, 2024)**: Hierarquia tipográfica, contraste acessível, superfícies elevadas e microinterações.
3. **10 Heurísticas de Usabilidade (Nielsen, 1994, 2020)**: Visibilidade do status do sistema (toasts de feedback), prevenção de erros em formulários e facilidade de reconhecimento.
4. **Contexto Social da Fome e Vulnerabilidade**: Embasa-se nos dados da **ActionAid (2023)** (*33 milhões de brasileiros em insegurança alimentar*) e **Neves (2021)**.

---

## 📄 Documentos do Projeto

Dentro da pasta [`docs/`](./docs/) você encontra a documentação acadêmica completa:
* **[`docs/relatorio_extensao.md`](./docs/relatorio_extensao.md)**: Relatório detalhado das etapas **a** até **i** exigidas na atividade extensionista.
* **[`docs/paper_academico.md`](./docs/paper_academico.md)**: Artigo científico estruturado (*Resumo, Introdução, Metodologia, Arquitetura, Resultados e Referências*).
* **[`docs/questionario_google_forms.md`](./docs/questionario_google_forms.md)**: Roteiro com 12 perguntas prontas (múltipla escolha, escalas Likert e dissertativa) para aplicação no Google Formulários (Etapa C).

---

## 🛠️ Comandos Úteis & Resolução de Dúvidas

### Como parar o servidor?
No terminal onde o servidor está rodando, pressione:
```text
Ctrl + C
```

### O que fazer se a porta 3000 já estiver em uso?
Se aparecer o erro `EADDRINUSE: address already in use :::3000`, encerre o processo anterior executando:
```bash
kill $(lsof -t -i:3000)
```
Em seguida, rode `npm start` novamente.

### Como consultar os dados direto no Terminal pelo SQLite?
```bash
sqlite3 /Users/wilsonmaia/Desktop/doacao_colaborativa/backend/db/database.sqlite "SELECT id, code, title, target_amount, location FROM campaigns;"
```

### Como consultar os dados direto no Terminal pelo MySQL?
```bash
/usr/local/mysql/bin/mysql -u root -p -e "SELECT id, code, title, current_amount FROM solidaracao.campaigns;"
```

---

<p align="center">
  <b>SolidarAção</b> — Transformando solidariedade em ação concreta. 💚
</p>