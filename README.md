# SolidarAção — Plataforma Colaborativa de Doações Solidárias

**SolidarAção** é uma plataforma colaborativa de arrecadação social e divulgação de campanhas solidárias voltada ao combate da fome e da vulnerabilidade social.

O projeto combina:
- **A dinâmica e facilidade do [Vakinha.com.br](https://www.vakinha.com.br)**: cards de campanhas com barra de progresso em tempo real, doação rápida via PIX com chave Copia e Cola e QR Code simulado, e filtros por categoria.
- **A narrativa e o impacto social do [ActionAid.org.br](https://actionaid.org.br)**: hero banner com foco em urgência social, contadores animados de impacto (33 milhões com fome, famílias beneficiadas), pilares de causa horizontais e histórias reais de impacto.

---

## 🏛️ Fundamentação Teórica e Acadêmica

Desenvolvido como **Atividade de Extensão Universitária**:
1. **Modelo 3C de Colaboração (Fuks et al., 2003)**:
   - **Comunicação**: Mural comunitário e mensagens públicas de apoio.
   - **Coordenação**: Agendamento de entregas/coletas físicas de mantimentos.
   - **Cooperação**: Metas conjuntas e financiamento coletivo com atualização em tempo real.
   - **Percepção (Awareness)**: Indicadores de nível de estoque (Crítico 🔴 / Suficiente 🟢).
2. **Material Design 3 (Google, 2024)**: Padrões visuais modernos, elevação, paleta de contraste e design responsivo.
3. **10 Heurísticas de Usabilidade (Nielsen, 1994, 2020)**: Feedback visual, prevenção de erros e consistência.

---

## 🚀 Como Executar

### 1. Teste Rápido no Navegador (Frontend com Fallback LocalStorage)
Basta abrir o arquivo `index.html` diretamente em qualquer navegador moderno. Todas as funcionalidades operam normalmente através do armazenamento local (`localStorage`).

### 2. Executando com Backend Node.js + Express (API REST + Banco de Dados)
```bash
cd backend
npm start
```
- O servidor iniciará em `http://localhost:3000`.
- API REST de campanhas: `http://localhost:3000/api/campaigns`
- Status do servidor: `http://localhost:3000/api/status`
- O backend conta com suporte a **MySQL 9** e fallback automático resiliente para **SQLite3**.

---

## 📁 Estrutura de Diretórios

```
doacao_colaborativa/
├── index.html                 # Interface SPA SolidarAção (Vakinha × ActionAid)
├── css/
│   └── styles.css             # Design System com tokens --sa-*, responsivo
├── js/
│   ├── app.js                 # Controlador da UI, modais, contadores e filtros
│   ├── api-service.js         # Cliente HTTP REST com fallback resiliente
│   ├── data-service.js        # Repositório de dados em LocalStorage
│   └── mock-data.js           # Dados iniciais de campanhas (SA-1001, SA-1002, etc.)
├── backend/
│   ├── server.js              # Servidor Express e inicializador de banco
│   ├── package.json           # Dependências (express, mysql2, sqlite3, cors)
│   ├── config/
│   │   └── database.js        # Abstração MySQL com fallback para SQLite3
│   ├── controllers/           # campaignController.js, donationController.js
│   ├── routes/                # Rotas da API REST
│   └── db/
│       ├── schema.sql         # DDL do banco relacional
│       └── database.sqlite    # Banco local SQLite3
└── docs/
    ├── relatorio_extensao.md  # Relatório completo das etapas (a até i)
    ├── paper_academico.md     # Artigo científico formatado
    └── questionario_google_forms.md # Questionário estruturado de pesquisa (Etapa C)
```