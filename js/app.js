// app.js - Controlador do Frontend Estilo Vakinha.com.br

document.addEventListener('DOMContentLoaded', () => {
  const api = window.apiService;

  // Estado da aplicação
  let currentCategory = 'todos';
  let currentSearch = '';
  let activeCampaignForDonation = null;

  // Elementos do DOM
  const gridContainer = document.getElementById('grid-vaquinhas-container');
  const searchInput = document.getElementById('vk-search-input');
  const categoryPills = document.querySelectorAll('.vk-pill-btn');
  const lblContagem = document.getElementById('lbl-contagem-vaquinhas');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');

  // Modais
  const modalDoarPix = document.getElementById('modal-doar-pix');
  const modalCriarVaquinha = document.getElementById('modal-criar-vaquinha');
  const modalDetalhes = document.getElementById('modal-detalhes-vaquinha');
  const btnAbrirCriar = document.getElementById('btn-abrir-criar-vaquinha');

  // Helper Toast Notification
  function showToast(message) {
    toastMsg.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 4000);
  }

  // Modais Controls
  function openModal(modalEl) {
    if (modalEl) modalEl.classList.add('active');
  }

  function closeModal(modalEl) {
    if (modalEl) modalEl.classList.remove('active');
  }

  document.querySelectorAll('.btn-close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.vk-modal-overlay');
      closeModal(modal);
    });
  });

  if (btnAbrirCriar) {
    btnAbrirCriar.addEventListener('click', () => openModal(modalCriarVaquinha));
  }

  // --- ACORDEÃO DE DUVIDAS (FAQ) ---
  const faqQuestions = document.querySelectorAll('.vk-faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.vk-faq-item');
      item.classList.toggle('active');
    });
  });

  // --- RENDERIZAÇÃO DAS VAQUINHAS (VAKINHA STYLE) ---
  async function loadAndRenderCampaigns() {
    gridContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--vk-text-muted);">Carregando vaquinhas da rede...</p>';
    
    const campaigns = await api.getCampaigns(currentCategory, currentSearch);

    if (!campaigns || campaigns.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: white; border-radius: var(--vk-radius-lg); border: 1px solid #e2e8f0;">
          <span class="material-symbols-outlined" style="font-size: 56px; color: var(--vk-text-muted);">search_off</span>
          <h3 style="margin-top: 12px; font-weight: 800;">Nenhuma vaquinha encontrada.</h3>
          <p style="color: var(--vk-text-muted); font-size: 0.9rem;">Tente buscar por outro termo ou selecione outra categoria.</p>
        </div>
      `;
      if (lblContagem) lblContagem.textContent = '0 vaquinhas encontradas';
      return;
    }

    if (lblContagem) lblContagem.textContent = `${campaigns.length} vaquinha(s) ativa(s)`;

    gridContainer.innerHTML = campaigns.map(c => {
      const currentAmt = parseFloat(c.current_amount || c.atualQtd || 0);
      const targetAmt = parseFloat(c.target_amount || c.metaQtd || 1000);
      const targetItems = parseInt(c.target_items || 0);
      const currentItems = parseInt(c.current_items || 0);

      // Calcular % de progresso
      const pct = targetAmt > 0 ? Math.min(100, Math.round((currentAmt / targetAmt) * 100)) : 50;

      const code = c.code || `#VK-${c.id}`;
      const creator = c.creator_name || c.responsavel || 'Organização Solidária';
      const location = c.location || c.endereco || 'Blumenau - SC';
      const image = c.image_url || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80';
      const title = c.title || c.nome || 'Campanha Solidária';
      const desc = c.description || c.descricao || 'Contribua com esta causa importante.';
      const cat = c.category || (c.categorias ? c.categorias[0] : 'alimentos');

      return `
        <article class="vk-card">
          <div>
            <div class="vk-card-media">
              <img src="${image}" alt="${title}" loading="lazy">
              <span class="vk-card-badge-cat">${cat}</span>
              <span class="vk-card-code">${code}</span>
            </div>

            <div class="vk-card-content">
              <div>
                <div class="vk-card-creator">
                  <span>${creator}</span>
                  <span class="material-symbols-outlined vk-verified-check" title="Criador Verificado">verified</span>
                  <span>• ${location}</span>
                </div>
                <h3 class="vk-card-title">${title}</h3>
                <p class="vk-card-desc">${desc}</p>
              </div>

              <div>
                <div class="vk-progress-box">
                  <div class="vk-progress-bar" style="width: ${pct}%;"></div>
                </div>

                <div class="vk-card-metrics">
                  <div>
                    <div class="vk-metric-raised">R$ ${currentAmt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    <div class="vk-metric-target">Meta: R$ ${targetAmt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${pct}%)</div>
                  </div>
                  ${targetItems > 0 ? `<div style="text-align: right; font-size: 0.8rem; font-weight: 700; color: var(--vk-text-muted);">${currentItems}/${targetItems} ${c.unit || 'itens'}</div>` : ''}
                </div>

                <div class="vk-card-footer">
                  <button class="vk-btn-doar btn-abrir-doar" data-id="${c.id}" data-title="${title}" data-code="${code}">
                    <span class="material-symbols-outlined">favorite</span> DOAR AGORA
                  </button>
                  <button class="vk-btn-share btn-ver-detalhes" data-id="${c.id}" title="Ver detalhes e apoiadores">
                    <span class="material-symbols-outlined">info</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach Listeners aos botões DOAR AGORA
    document.querySelectorAll('.btn-abrir-doar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const title = e.currentTarget.getAttribute('data-title');
        const code = e.currentTarget.getAttribute('data-code');

        activeCampaignForDonation = id;
        document.getElementById('modal-doar-campaign-id').value = id;
        document.getElementById('modal-doar-titulo').textContent = `💚 Apoiar: ${title} (${code})`;
        
        // Gerar código PIX único
        const randomPix = `00020126580014br.gov.bcb.pix0136${code}-PIX-${Date.now()}520400005303986540550.005802BR5920CONECTA DOAÇÕES VK6009BLUMENAU62070503***6304`;
        document.getElementById('lbl-pix-code').textContent = randomPix;

        openModal(modalDoarPix);
      });
    });

    // Attach Listeners para Ver Detalhes
    document.querySelectorAll('.btn-ver-detalhes').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const detailsContainer = document.getElementById('detalhes-conteudo');
        detailsContainer.innerHTML = '<p>Carregando detalhes...</p>';
        openModal(modalDetalhes);

        const data = await api.getCampaignById(id);
        if (!data) {
          detailsContainer.innerHTML = '<p>Erro ao carregar detalhes.</p>';
          return;
        }

        const currentAmt = parseFloat(data.current_amount || 0);
        const targetAmt = parseFloat(data.target_amount || 1000);
        const pct = Math.min(100, Math.round((currentAmt / targetAmt) * 100));

        detailsContainer.innerHTML = `
          <div>
            <img src="${data.image_url}" style="width: 100%; height: 220px; object-fit: cover; border-radius: var(--vk-radius-md); margin-bottom: 16px;">
            <span class="vk-card-code" style="position: static;">${data.code}</span>
            <h2 style="font-size: 1.3rem; font-weight: 800; margin: 8px 0;">${data.title}</h2>
            <p style="font-size: 0.85rem; color: var(--vk-text-muted); margin-bottom: 12px;">Organizado por <strong>${data.creator_name}</strong> • ${data.location}</p>
            <p style="font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px;">${data.description}</p>
            
            <div class="vk-progress-box">
              <div class="vk-progress-bar" style="width: ${pct}%;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: 800; margin-bottom: 24px;">
              <span>R$ ${currentAmt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} arrecadados</span>
              <span>Meta: R$ ${targetAmt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            <h3 style="font-size: 1.1rem; font-weight: 800; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-bottom: 12px;">👥 Recentes Apoiadores / Doadores</h3>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${data.donations && data.donations.length > 0 ? data.donations.map(d => `
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: var(--vk-radius-sm);">
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700;">
                    <span>${d.donor_name}</span>
                    <span style="color: var(--vk-green-dark);">R$ ${parseFloat(d.amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <p style="font-size: 0.82rem; color: var(--vk-text-secondary); margin-top: 4px;">"${d.support_message || 'Apoiou esta vaquinha!'}"</p>
                </div>
              `).join('') : '<p style="font-size: 0.85rem; color: var(--vk-text-muted);">Seja o primeiro a apoiar esta vaquinha!</p>'}
            </div>
          </div>
        `;
      });
    });
  }

  // --- NAVEGAÇÃO POR CATEGORIAS & BUSCA ---
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-cat');
      loadAndRenderCampaigns();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      loadAndRenderCampaigns();
    });
  }

  // --- SELEÇÃO RÁPIDA DE VALORES R$ ---
  const amountBtns = document.querySelectorAll('.vk-amount-btn');
  const inputValor = document.getElementById('input-doar-valor');

  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      inputValor.value = btn.getAttribute('data-val');
    });
  });

  // --- COPIAR CÓDIGO PIX ---
  const btnCopiarPix = document.getElementById('btn-copiar-pix');
  if (btnCopiarPix) {
    btnCopiarPix.addEventListener('click', () => {
      const codeText = document.getElementById('lbl-pix-code').textContent;
      navigator.clipboard.writeText(codeText).then(() => {
        showToast('📋 Código PIX copiado com sucesso para a sua área de transferência!');
      }).catch(() => {
        showToast('Código PIX selecionado.');
      });
    });
  }

  // --- SUBMIT DOAR AGORA ---
  const formDoarPix = document.getElementById('form-doar-pix');
  if (formDoarPix) {
    formDoarPix.addEventListener('submit', async (e) => {
      e.preventDefault();
      const campaign_id = document.getElementById('modal-doar-campaign-id').value;
      const amount = parseFloat(document.getElementById('input-doar-valor').value || 0);
      const items_qty = parseInt(document.getElementById('input-doar-itens').value || 0);
      const donor_name = document.getElementById('input-doar-nome').value;
      const support_message = document.getElementById('input-doar-mensagem').value;

      try {
        await api.createDonation({
          campaign_id,
          amount,
          items_qty,
          donor_name,
          support_message,
          payment_method: 'pix'
        });

        closeModal(modalDoarPix);
        showToast(`🎉 Doação de R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} registrada com sucesso! Muito obrigado pelo apoio! ❤️`);
        loadAndRenderCampaigns();
      } catch (err) {
        showToast('Erro ao processar doação.');
      }
    });
  }

  // --- SUBMIT CRIAR UMA VAQUINHA ---
  const formCriarVaquinha = document.getElementById('form-criar-vaquinha');
  if (formCriarVaquinha) {
    formCriarVaquinha.addEventListener('submit', async (e) => {
      e.preventDefault();

      const newCampaign = {
        title: document.getElementById('new-title').value,
        category: document.getElementById('new-category').value,
        target_amount: parseFloat(document.getElementById('new-target-amount').value || 0),
        target_items: parseInt(document.getElementById('new-target-items').value || 0),
        unit: document.getElementById('new-unit').value || 'unidades',
        description: document.getElementById('new-description').value,
        creator_name: document.getElementById('new-creator-name').value,
        location: document.getElementById('new-location').value,
        image_url: document.getElementById('new-image-url').value
      };

      try {
        await api.createCampaign(newCampaign);
        closeModal(modalCriarVaquinha);
        showToast('🚀 Sua Vaquinha Solidária foi criada e publicada com SUCESSO!');
        formCriarVaquinha.reset();
        loadAndRenderCampaigns();
      } catch (err) {
        showToast('Erro ao criar vaquinha.');
      }
    });
  }

  // Carga inicial das campanhas
  loadAndRenderCampaigns();
});
