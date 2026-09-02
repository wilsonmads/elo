// app.js - Lógica da Aplicação SPA, Controle de Interface Material 3 & Modelo 3C

document.addEventListener('DOMContentLoaded', () => {
  // Instância do DataService
  const db = window.dataService;

  // Estado da aplicação
  let categoriaAtual = 'todos';
  let termoBuscaAtual = '';

  // Elementos do DOM
  const navItems = document.querySelectorAll('.m3-nav-item');
  const sectionViews = document.querySelectorAll('.section-view');
  const filterChips = document.querySelectorAll('.m3-chip-btn');
  const inputBusca = document.getElementById('input-busca-ponto');
  const gridPontos = document.getElementById('grid-pontos-container');
  const gridMetas = document.getElementById('grid-metas-container');
  const selectPontoAgendamento = document.getElementById('agend-ponto-select');
  const listaAgendamentos = document.getElementById('lista-agendamentos-container');
  const feedMural = document.getElementById('feed-mural-container');
  const snackbar = document.getElementById('snackbar');
  const snackbarMsg = document.getElementById('snackbar-message');

  // Modais
  const modalCadastrarPonto = document.getElementById('modal-cadastrar-ponto');
  const modalContribuirMeta = document.getElementById('modal-contribuir-meta');
  const modalTeoria = document.getElementById('modal-teoria');
  const fabCadastrarPonto = document.getElementById('fab-cadastrar-ponto');
  const btnTeoriaGuide = document.getElementById('btn-teoria-guide');

  // --- NAVEGAÇÃO ENTRE ABAS (SPA) ---
  navItems.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetViewId = btn.getAttribute('data-target');
      
      navItems.forEach(i => i.classList.remove('active'));
      sectionViews.forEach(v => v.classList.remove('active'));

      btn.classList.add('active');
      const targetView = document.getElementById(targetViewId);
      if (targetView) targetView.classList.add('active');
    });
  });

  // --- RECONHECIMENTO DA TEORIA (MODAL) ---
  if (btnTeoriaGuide) {
    btnTeoriaGuide.addEventListener('click', () => openModal(modalTeoria));
  }

  // --- HELPER TOAST / SNACKBAR (Nielsen Heurística #1) ---
  function showToast(message) {
    snackbarMsg.textContent = message;
    snackbar.classList.add('active');
    setTimeout(() => {
      snackbar.classList.remove('active');
    }, 3500);
  }

  // --- CONTROLE DE MODAIS ---
  function openModal(modalEl) {
    if (modalEl) modalEl.classList.add('active');
  }
  function closeModal(modalEl) {
    if (modalEl) modalEl.classList.remove('active');
  }

  document.querySelectorAll('.btn-close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.m3-dialog-overlay');
      closeModal(modal);
    });
  });

  if (fabCadastrarPonto) {
    fabCadastrarPonto.addEventListener('click', () => openModal(modalCadastrarPonto));
  }

  // --- RENDERIZAÇÃO DOS PONTOS DE DOAÇÃO ---
  async function renderPontos() {
    gridPontos.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--md-sys-color-outline);">Carregando pontos...</p>';
    const pontos = await db.getPontos(categoriaAtual, termoBuscaAtual);

    if (pontos.length === 0) {
      gridPontos.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 32px; background: var(--md-sys-color-surface-container); border-radius: var(--md-shape-corner-medium);">
          <span class="material-symbols-outlined" style="font-size: 48px; color: var(--md-sys-color-outline);">search_off</span>
          <p style="margin-top: 8px; font-weight: 600;">Nenhum ponto de doação encontrado para esse filtro.</p>
        </div>
      `;
      return;
    }

    gridPontos.innerHTML = pontos.map(ponto => {
      // Badges das categorias
      const chipsCategorias = ponto.categorias.map(cat => {
        const icones = { alimentos: '🌾 Alimentos', roupas: '👕 Roupas', higiene: 'diet 🧴 Higiene' };
        return `<span class="m3c-chip" style="font-size: 0.75rem;">${icones[cat] || cat}</span>`;
      }).join(' ');

      // Cor do status principal
      const statusAlimento = ponto.statusEstoque.alimentos || 'moderado';
      const badgeClass = statusAlimento === 'critico' ? 'status-critico' : (statusAlimento === 'suficiente' ? 'status-suficiente' : 'status-moderado');
      const badgeText = statusAlimento === 'critico' ? '🔴 Estoque Crítico' : (statusAlimento === 'suficiente' ? '🟢 Estoque Ok' : '🟡 Necessita Doações');

      return `
        <div class="m3-card">
          <div>
            <div class="m3-card-header">
              <span class="m3-badge-status ${badgeClass}">${badgeText}</span>
            </div>
            <h3 class="m3-card-title">${ponto.nome}</h3>
            <div class="m3-card-body" style="margin-top: 8px;">
              <p>${ponto.descricao}</p>
              <div class="m3-card-info-item" style="margin-top: 10px;">
                <span class="material-symbols-outlined">location_on</span>
                <span>${ponto.endereco}</span>
              </div>
              <div class="m3-card-info-item">
                <span class="material-symbols-outlined">schedule</span>
                <span>${ponto.horario}</span>
              </div>
              <div class="m3-card-info-item">
                <span class="material-symbols-outlined">call</span>
                <span>${ponto.contato} (${ponto.responsavel})</span>
              </div>
              <div style="display: flex; gap: 6px; margin-top: 12px; flex-wrap: wrap;">
                ${chipsCategorias}
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 8px; margin-top: 16px;">
            <button class="m3-btn m3-btn-primary btn-agendar-direto" data-pontoid="${ponto.id}" style="width: 100%; font-size: 0.8rem;">
              <span class="material-symbols-outlined">event</span> Agendar Entrega
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Preencher Select de Agendamento
    selectPontoAgendamento.innerHTML = pontos.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');

    // Event listeners dos botões dentro dos cards
    document.querySelectorAll('.btn-agendar-direto').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pontoId = e.currentTarget.getAttribute('data-pontoid');
        selectPontoAgendamento.value = pontoId;
        // Alternar para aba de agendamento
        document.querySelector('.m3-nav-item[data-target="view-agendamentos"]').click();
      });
    });
  }

  // --- FILTROS POR CHIP ---
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      categoriaAtual = chip.getAttribute('data-categoria');
      renderPontos();
    });
  });

  if (inputBusca) {
    inputBusca.addEventListener('input', (e) => {
      termoBuscaAtual = e.target.value;
      renderPontos();
    });
  }

  // --- RENDERIZAÇÃO DAS METAS (COOPERAÇÃO M3C) ---
  async function renderMetas() {
    gridMetas.innerHTML = '<p>Carregando metas...</p>';
    const metas = await db.getMetas();

    gridMetas.innerHTML = metas.map(meta => {
      const pct = Math.min(100, Math.round((meta.atualQtd / meta.metaQtd) * 100));
      return `
        <div class="m3-card">
          <div>
            <div class="m3-card-header">
              <span class="m3c-chip"><span class="material-symbols-outlined">track_changes</span> Meta Coletiva</span>
              <span style="font-weight: 700; color: var(--md-sys-color-primary); font-size: 0.9rem;">${pct}%</span>
            </div>
            <h3 class="m3-card-title">${meta.titulo}</h3>
            <p style="font-size: 0.85rem; color: var(--md-sys-color-on-surface-variant); margin: 6px 0;">📍 ${meta.pontoNome}</p>
            <p class="m3-card-body" style="margin-bottom: 8px;">${meta.descricao}</p>
            
            <div class="m3-progress-container">
              <div class="m3-progress-bar" style="width: ${pct}%;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; color: var(--md-sys-color-on-surface-variant);">
              <span>Arrecadado: ${meta.atualQtd} ${meta.unidade}</span>
              <span>Objetivo: ${meta.metaQtd} ${meta.unidade}</span>
            </div>
          </div>

          <button class="m3-btn m3-btn-primary btn-abrir-contribuir" data-id="${meta.id}" data-titulo="${meta.titulo}" data-unidade="${meta.unidade}" style="margin-top: 16px; width: 100%;">
            <span class="material-symbols-outlined">favorite</span> Contribuir com esta Meta
          </button>
        </div>
      `;
    }).join('');

    // Listener para o modal de contribuição
    document.querySelectorAll('.btn-abrir-contribuir').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const titulo = e.currentTarget.getAttribute('data-titulo');
        const unidade = e.currentTarget.getAttribute('data-unidade');

        document.getElementById('modal-meta-id').value = id;
        document.getElementById('modal-meta-titulo').textContent = `🤝 Contribuir: ${titulo}`;
        document.getElementById('modal-meta-unidade').textContent = unidade;
        openModal(modalContribuirMeta);
      });
    });
  }

  // Submit Contribuir Meta
  const formContribuirMeta = document.getElementById('form-contribuir-meta');
  if (formContribuirMeta) {
    formContribuirMeta.addEventListener('submit', async (e) => {
      e.preventDefault();
      const metaId = document.getElementById('modal-meta-id').value;
      const qtd = document.getElementById('meta-qtd').value;
      const doador = document.getElementById('meta-doador-nome').value;

      try {
        await db.contribuirMeta(metaId, qtd, doador);
        closeModal(modalContribuirMeta);
        showToast(`Sua contribuição de +${qtd} unidades foi registrada com sucesso! Obrigado! ❤️`);
        renderMetas();
        renderMural();
      } catch (err) {
        showToast('Erro ao registrar doação.');
      }
    });
  }

  // --- RENDERIZAÇÃO DOS AGENDAMENTOS (COORDENAÇÃO M3C) ---
  async function renderAgendamentos() {
    const agendamentos = await db.getAgendamentos();
    if (agendamentos.length === 0) {
      listaAgendamentos.innerHTML = '<p style="color: var(--md-sys-color-outline);">Nenhum agendamento ativo no momento.</p>';
      return;
    }

    listaAgendamentos.innerHTML = agendamentos.map(a => `
      <div class="m3-card" style="padding: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h4 style="font-size: 1rem; font-weight: 700;">${a.pontoNome}</h4>
            <p style="font-size: 0.85rem; color: var(--md-sys-color-on-surface-variant);"><strong>Doador:</strong> ${a.doadorNome}</p>
            <p style="font-size: 0.85rem; color: var(--md-sys-color-on-surface-variant);"><strong>Itens:</strong> ${a.itens}</p>
            <p style="font-size: 0.8rem; margin-top: 4px; color: var(--md-sys-color-primary); font-weight: 600;">
              📅 ${new Date(a.dataHora).toLocaleString('pt-BR')} (${a.modalidade.toUpperCase()})
            </p>
          </div>
          <button class="m3-btn-icon btn-cancelar-agend" data-id="${a.id}" title="Cancelar Agendamento" style="color: var(--md-sys-color-error);">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.btn-cancelar-agend').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Deseja realmente cancelar este agendamento?')) {
          await db.cancelarAgendamento(id);
          showToast('Agendamento cancelado.');
          renderAgendamentos();
        }
      });
    });
  }

  // Submit Novo Agendamento
  const formNovoAgendamento = document.getElementById('form-novo-agendamento');
  if (formNovoAgendamento) {
    formNovoAgendamento.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pontoSelect = document.getElementById('agend-ponto-select');
      const pontoNome = pontoSelect.options[pontoSelect.selectedIndex].text;

      const novo = {
        doadorNome: document.getElementById('agend-doador-nome').value,
        pontoId: pontoSelect.value,
        pontoNome: pontoNome,
        itens: document.getElementById('agend-itens').value,
        dataHora: document.getElementById('agend-data').value,
        modalidade: document.getElementById('agend-modalidade').value
      };

      await db.addAgendamento(novo);
      showToast('Agendamento realizado com sucesso!');
      formNovoAgendamento.reset();
      renderAgendamentos();
    });
  }

  // --- RENDERIZAÇÃO DO MURAL COMUNITÁRIO (COMUNICAÇÃO M3C) ---
  async function renderMural() {
    feedMural.innerHTML = '<p>Carregando mural...</p>';
    const mensagens = await db.getMensagens();

    feedMural.innerHTML = mensagens.map(m => {
      const badgesTipo = {
        aviso: '📢 Aviso',
        ajuda: '🆘 Pedido de Ajuda',
        agradecimento: '❤️ Agradecimento'
      };
      return `
        <div class="m3-post-card">
          <div class="m3-post-header">
            <div>
              <span class="m3-post-author">${m.autor}</span>
              <span style="font-size: 0.75rem; color: var(--md-sys-color-outline);"> (${m.papel})</span>
            </div>
            <span>${m.data}</span>
          </div>
          <p style="font-size: 0.9rem; margin-top: 4px;">${m.texto}</p>
          <div style="margin-top: 8px;">
            <span class="m3c-chip" style="font-size: 0.7rem; padding: 2px 8px;">${badgesTipo[m.tipo] || m.tipo}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Submit Novo Post no Mural
  const formNovoPost = document.getElementById('form-novo-post');
  if (formNovoPost) {
    formNovoPost.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nova = {
        autor: document.getElementById('post-autor').value,
        papel: 'Membro da Comunidade',
        texto: document.getElementById('post-texto').value,
        tipo: document.getElementById('post-tipo').value
      };

      await db.addMensagem(nova);
      showToast('Mensagem publicada no mural comunitário!');
      formNovoPost.reset();
      renderMural();
    });
  }

  // Submit Cadastrar Novo Ponto
  const formCadastrarPonto = document.getElementById('form-cadastrar-ponto');
  if (formCadastrarPonto) {
    formCadastrarPonto.addEventListener('submit', async (e) => {
      e.preventDefault();
      const checkboxes = document.querySelectorAll('input[name="cat-item"]:checked');
      const categorias = Array.from(checkboxes).map(c => c.value);

      if (categorias.length === 0) {
        showToast('Selecione pelo menos 1 categoria de item aceita.');
        return;
      }

      const novoPonto = {
        nome: document.getElementById('ponto-nome').value,
        endereco: document.getElementById('ponto-endereco').value,
        bairro: 'Centro',
        contato: document.getElementById('ponto-contato').value,
        horario: document.getElementById('ponto-horario').value,
        responsavel: 'Voluntário Cadastrado',
        categorias: categorias,
        statusEstoque: { alimentos: 'critico' },
        descricao: document.getElementById('ponto-descricao').value,
        lat: -26.9150,
        lng: -49.0650
      };

      await db.addPonto(novoPonto);
      closeModal(modalCadastrarPonto);
      showToast('Novo Ponto de Doação cadastrado com sucesso!');
      formCadastrarPonto.reset();
      renderPontos();
    });
  }

  // --- INICIALIZAÇÃO DA APLICAÇÃO ---
  renderPontos();
  renderMetas();
  renderAgendamentos();
  renderMural();
});
