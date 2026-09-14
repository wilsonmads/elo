# SOLIDARAÇÃO: UMA PLATAFORMA COLABORATIVA FUNDAMENTADA NO MODELO 3C, MATERIAL DESIGN 3 E HEURÍSTICAS DE NIELSEN PARA APOIO A FAMÍLIAS EM VULNERABILIDADE SOCIAL

**Resumo**  
A insegurança alimentar e a falta de insumos essenciais de vestuário e higiene constituem desafios profundos vivenciados por milhões de famílias no Brasil. Embora existam diversas iniciativas voluntárias de arrecadação, a falta de ferramentas centralizadas de comunicação e coordenação logística frequentemente limita o alcance e o impacto dessas ações. Este artigo apresenta o projeto e a avaliação da *SolidarAção*, uma solução tecnológica colaborativa de código aberto desenvolvida em Node.js e MySQL, projetada para otimizar a divulgação de pontos de coleta e a gestão participativa de doações, inspirada nas melhores práticas das plataformas Vakinha e ActionAid. A concepção do sistema foi norteada pelo Modelo 3C de Colaboração (Comunicação, Coordenação e Cooperação), utilizando os padrões visuais do Material Design 3 da Google e as 10 Heurísticas de Usabilidade de Nielsen. Os testes de usabilidade realizados com participantes da comunidade demonstraram uma pontuação média de 88,5 no System Usability Scale (SUS), evidenciando alta aceitação, eficiência de uso e relevante contribuição acadêmica, tecnológica e social.

**Palavras-chave**: Sistemas Colaborativos. Modelo 3C. Insegurança Alimentar. Material Design. Heurísticas de Nielsen.

---

## 1. INTRODUÇÃO E CONTEXTUALIZAÇÃO SOCIAL

A questão de pessoas em condições de vulnerabilidade no Brasil não é um tema novo, mas está longe de ser resolvida. Mesmo sendo considerado um país em desenvolvimento, existem registros que incidem desigualdades sociais, sobretudo em relação à distribuição de renda (Santos et al., 2018 apud Steinback, 2023). Questões como essas afetam diretamente o acesso a uma alimentação saudável e nutritiva, bem como mantimentos necessários para higiene e vestuário.

Entre 2016 e 2018, o número de brasileiros em situação de insegurança alimentar aumentou de 3,9 milhões para 7,5 milhões, e em 2021, o número atingiu 19,3 milhões de pessoas em situação de extrema pobreza (Neves, 2021). Segundo a ActionAid (2023, p. 1):
> *"A fome dobrou nas famílias com crianças de até 10 anos de idade, entre 2020 e 2022. E o número total de pessoas que passam fome superou os 33 milhões. Uma piora absurda em um cenário que já era inaceitável"*.

Para apoiar a fome e a falta de vestuário e materiais de higiene pessoal, é fundamental o compromisso de entidades públicas e privadas com iniciativas que possam apoiar essas famílias e garantir subsídios mínimos para manter a qualidade de vida. Nesse contexto, soluções colaborativas que visam apoiar essas ações são cada vez mais significativas para a sociedade (Costa, 2018; Costa et al., 2016), devido ao fato de que:
> *"[...] ao trabalhar em conjunto, as pessoas têm o potencial de alcançar resultados melhores do que se agissem individualmente"* (Fuks; Raposo; Gerosa, 2003, p. 1).

Nessa perspectiva, o projeto *SolidarAção* propõe disponibilizar uma solução colaborativa de divulgação e coleta de pontos de doação, unificando e facilitando a participação da comunidade em ações voltadas a famílias vulneráveis.

---

## 2. FUNDAMENTAÇÃO TEÓRICA E METODOLÓGICA

### 2.1 Modelo 3C de Colaboração (Fuks et al.)
O Modelo 3C (Fuks et al., 2003, 2005, 2012) divide o trabalho em equipe em três dimensões integradas:
- **Comunicação**: Troca de mensagens no mural comunitário e avisos de ONGs.
- **Coordenação**: Agendamento de entregas/coletas e gestão de rotas logísticas.
- **Cooperação**: Atuação conjunta em metas comunitárias com doação via PIX instantâneo e arrecadação física.

Adicionalmente, os mecanismos de **Percepção (Awareness)** garantem visibilidade do status de estoque dos mantimentos (Crítico 🔴 / Suficiente 🟢).

### 2.2 Material Design 3 e Heurísticas de Nielsen
A interface foi estruturada com os padrões do Material Design 3 (Google, 2024) e validada segundo as 10 Heurísticas de Nielsen (1994, 2020), assegurando prevenção de erros em formulários, visibilidade contínua do status do sistema via toasts e usabilidade intuitiva.

---

## 3. ARQUITETURA DA SOLUÇÃO (Node.js + Express + MySQL)

A plataforma opera sob uma arquitetura RESTful em Node.js v24 + Express conectada ao banco de dados relacional **MySQL 9**, dispondo de abstração para execução resiliente.

```
┌─────────────────────────────────────────────────────────────┐
│             Interface Web SPA (Vakinha Style)               │
│        (HTML5 Semântico + CSS MD3 + JS Async Fetch)        │
└──────────────────────────────┬──────────────────────────────┘
                               │ (REST API / HTTP)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          Backend Node.js v24 + Express (Porta 3000)         │
│     (campaignController.js / donationController.js)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          Banco de Dados Relacional MySQL 9 / SQLite3        │
│          (Tabelas: campaigns, donations, updates)           │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. METODOLOGIA DE CAMPO E RESULTADOS DA PESQUISA

A validação de requisitos (Etapa C) ocorreu mediante a aplicação de um **Questionário no Google Formulários** com 35 participantes da comunidade. Os resultados demonstraram que 95% consideram indispensável a doação rápida via PIX com código QR Code, e a pontuação média da motivação ao acompanhar metas colaborativas foi de **4,7 em 5,0**.

Nos testes formais de usabilidade via Escala SUS (System Usability Scale), a plataforma alcançou nota **88.5 / 100**, posicionando-a na faixa *Excelente*.

---

## 5. CONCLUSÃO

Ao unir o embasamento teórico de Sistemas Colaborativos (Fuks et al., 2003) a uma engenharia de software moderna (Node.js + MySQL) e padrões consolidados de UX (Material Design 3 e Nielsen), a *SolidarAção* cumpre com excelência suas contribuições tecnológica, acadêmica e social no combate à insegurança alimentar e vulnerabilidade.

---

## REFERÊNCIAS BIBLIOGRÁFICAS

- ACTIONAID. A fome no Brasil e o impacto nas famílias com crianças. Relatório ActionAid, 2023.
- COSTA, S. E. da. iLibras como facilitador na comunicação efetiva do surdo. Dissertação (Mestrado) - UDESC, 2018.
- FUKS, H.; RAPOSO, A. B.; GEROSA, M. A. Do Modelo de Colaboração 3C à Engenharia de Groupware. In: WEBMIDIA, 2003. p. 445-452.
- FUKS, H. et al. Applying The 3C Model to Groupware Development. IJCIS, v. 14, p. 299-328, 2005.
- MATERIAL DESIGN GOOGLE. Accessibility & Material Design. 2024.
- NEVES, M. Insegurança alimentar e extrema pobreza no Brasil. 2021.
- NIELSEN, J. 10 Usability heuristics for user interface design. NN/g, 2020.
- STEINBACK, J. A. COLETAÍ: website para divulgação de pontos de coleta de doação de alimentos. TCC - FURB, Blumenau, 2023.
