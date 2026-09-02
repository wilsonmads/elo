# CONECTA DOAÇÕES: UMA PLATAFORMA COLABORATIVA FUNDAMENTADA NO MODELO 3C, MATERIAL DESIGN 3 E HEURÍSTICAS DE NIELSEN PARA APOIO A FAMÍLIAS EM VULNERABILIDADE SOCIAL

**Resumo**  
A insegurança alimentar e a falta de insumos essenciais de vestuário e higiene constituem desafios críticos enfrentados por famílias em situação de vulnerabilidade social. Embora existam diversas iniciativas voluntárias de arrecadação, a falta de ferramentas centralizadas de comunicação e coordenação logísticas frequentemente limita o alcance e o impacto dessas ações. Este artigo apresenta o projeto e a avaliação do *Conecta Doações*, uma solução tecnológica colaborativa de código aberto projetada para otimizar a divulgação de pontos de coleta e a gestão participativa de doações. A concepção do sistema foi norteada pelo Modelo 3C de Colaboração (Comunicação, Coordenação e Cooperação), utilizando os padrões visuais do Material Design 3 da Google e as 10 Heurísticas de Usabilidade de Nielsen. Os testes de usabilidade realizados com participantes da comunidade demonstraram uma pontuação média de 88,5 no System Usability Scale (SUS), evidenciando alta aceitação, eficiência de uso e relevante contribuição acadêmica e social.

**Palavras-chave**: Sistemas Colaborativos. Modelo 3C. Material Design. Heurísticas de Nielsen. Inovação Social.

---

## 1. INTRODUÇÃO

Nas periferias urbanas brasileiras, centenas de famílias dependem diariamente de ações comunitárias para garantir o sustento alimentar básico e o acesso a peças de vestuário e produtos de higiene (Steinback, 2023). Contudo, a desarticulação entre doadores e entidades receptoras costuma resultar no desabastecimento de itens críticos em certos pontos, enquanto outros acumulam excedentes.

Iniciativas relevantes como o *Vakinha* (2021) focam na captação de recursos financeiros, enquanto projetos como o *ColetAí* (Steinback, 2023) avançaram na divulgação de pontos de coleta de alimentos. O presente trabalho expande essa abordagem ao integrar a arrecadação de múltiplos insumos (alimentos, roupas e higiene) a uma arquitetura colaborativa fundamentada na Engenharia de Groupware.

---

## 2. FUNDAMENTAÇÃO TEÓRICA

### 2.1 Modelo 3C de Colaboração
O Modelo 3C (Fuks et al., 2005, 2012) postula que a colaboração em grupo ocorre pela articulação contínua entre:
- **Comunicação**: Troca de mensagens e alinhamento de intenções.
- **Coordenação**: Organização de fluxos de trabalho e tarefas temporais.
- **Cooperação**: Atuação conjunta no espaço compartilhado para alcançar uma meta comum.

Adicionalmente, o mecanismo de **Percepção (Awareness)** garante que os usuários acompanhem o estado das ações dos demais participantes em tempo real.

### 2.2 Material Design 3 e Heurísticas de Nielsen
A interface foi projetada sob as diretrizes do Material Design 3 (Google, 2024), aplicando componentes semânticos (Cards, Chips, FAB, Modais) e um sistema de cores responsivo. As 10 Heurísticas de Usabilidade de Nielsen (1994, 2020) foram empregadas para prevenir erros de digitação, garantir legibilidade e oferecer feedback imediato a cada ação executada pelo usuário.

---

## 3. ARQUITETURA E IMPLEMENTAÇÃO DA PLATAFORMA

O *Conecta Doações* foi construído como uma Single Page Application (SPA) responsiva. A persistência de dados foi estruturada sob o padrão de projeto *Repository Pattern* (`DataService`), utilizando armazenamento local (`localStorage`) para execução rápida e sem dependências de servidor no ambiente de testes.

```
┌─────────────────────────────────────────────────────────────┐
│                 Interface de Usuário (SPA)                  │
│       (HTML5 Semântico + CSS Material Design 3 + JS)        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              DataService (Camada de Abstração)              │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
    [LocalStorageRepository]        [ApiRepository (Futuro)]
       (Persistência Atual)         (Node.js + Express + MySQL)
```

### Principais Módulos Colaborativos:
1. **Pontos & Mapa**: Exibição dos locais de arrecadação com tags de estoque (Crítico, Moderado, Suficiente) e busca interativa.
2. **Metas Coletivas (Cooperação)**: Progresso colaborativo com barras de preenchimento dinâmicas.
3. **Agendamento de Entregas (Coordenação)**: Marcação de dia, hora e tipo de transporte.
4. **Mural Comunitário (Comunicação)**: Feed de recados e solicitações de auxílio logístico.

---

## 4. MATRIZ DE AVALIAÇÃO DE USABILIDADE E RESULTADOS

A plataforma foi submetida a ensaios de usabilidade com 10 usuários representativos (5 doadores e 5 gestores de ONGs).

| Métrica Avaliada | Ferramenta / Método | Resultado Obtido | Meta Acadêmica |
| :--- | :--- | :---: | :---: |
| **Escala de Usabilidade** | SUS (System Usability Scale) | **88.5 / 100** | > 70.0 (Aprovado) |
| **Checklist de Interface** | Sapo UX (ux.sapo.pt) | **100% de Conformidade** | > 85% |
| **Acessibilidade Web** | WCAG 2.1 Nível AA | **Aprovado (Contraste 4.5:1)** | Nível AA |
| **Taxa de Conclusão de Tarefas** | Teste de Tarefas Direcionadas | **96.7%** | > 90% |

---

## 5. CONCLUSÃO E TRABALHOS FUTUROS

O projeto *Conecta Doações* demonstrou que o uso integrado do Modelo 3C com padrões modernos de UI/UX (Material Design 3 e Heurísticas de Nielsen) eleva significativamente o engajamento e a eficácia de sistemas voltados à inovação social.

Como trabalhos futuros, propõe-se a integração da camada `DataService` com uma API REST em **Node.js/Express** e banco de dados relacional **MySQL**, permitindo a expansão da plataforma para múltiplos municípios e a incorporação de notificações push em tempo real.

---

## REFERÊNCIAS

- FUKS, H. et al. Applying The 3C Model to Groupware Development. IJCIS, v. 14, p. 299-328, 2005.
- MATERIAL DESIGN GOOGLE. Accessibility & Material Design. Disponível em: https://m3.material.io/. 2024.
- NIELSEN, J. 10 Usability heuristics for user interface design. Nielsen Norman Group, 2020.
- SAPO UX. Avaliação e Usabilidade. Disponível em: https://ux.sapo.pt/. Acesso em: 2026.
- STEINBACK, J. A. COLETAÍ: website para divulgação de pontos de coleta de doação de alimentos. TCC - FURB, Blumenau, 2023.
