// app.js - Controlador do Frontend SolidarAção
// Combinação: Funcionalidades de Crowdfunding (Vakinha) + Narrativa e Engajamento Social (ActionAid)

document.addEventListener('DOMContentLoaded', () => {
  const api = window.apiService;

  // Estado da aplicação
  let currentCategory = 'todos';
  let currentSearch = '';
  let activeCampaignForDonation = null;

  // Elementos do DOM
  const gridContainer = document.getElementById('grid-campanhas-container');
  const searchInput = document.getElementById('sa-search-input');
  const categoryPills = document.querySelectorAll('.sa-pill-btn');
  const lblContagem = document.getElementById('lbl-contagem-campanhas');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');

  // Modais
  const modalDoarPix = document.getElementById('modal-doar-pix');
  const modalCriarCampanha = document.getElementById('modal-criar-campanha');
  const modalDetalhes = document.getElementById('modal-detalhes-campanha');
  const btnAbrirCriar = document.getElementById('btn-abrir-criar-campanha');
  const btnHeroCriar = document.getElementById('btn-hero-criar');
  const btnCtaCriar = document.getElementById('btn-cta-criar');
  const btnDoeAgora = document.getElementById('btn-doe-agora');

  // Helper Toast Notification
  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // Controle de Modais
  function openModal(modalEl) {
    if (modalEl) modalEl.classList.add('open');
  }

  function closeModal(modalEl) {
    if (modalEl) modalEl.classList.remove('open');
  }

  document.querySelectorAll('.btn-close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.sa-modal-overlay');
      closeModal(modal);
    });
  });

  // Fechar ao clicar fora do modal
  document.querySelectorAll('.sa-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // Gatilhos para abrir modal de criação de campanha
  [btnAbrirCriar, btnHeroCriar, btnCtaCriar].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => openModal(modalCriarCampanha));
    }
  });

  // Leva o usuário diretamente para o apoio de uma campanha disponível.
  if (btnDoeAgora) {
    btnDoeAgora.addEventListener('click', async (e) => {
      e.preventDefault();
      document.getElementById('section-campanhas')?.scrollIntoView({ behavior: 'smooth' });

      try {
        await loadAndRenderCampaigns();
        const campaignButtons = gridContainer?.querySelectorAll('.btn-abrir-doar') || [];
        const randomIndex = Math.floor(Math.random() * campaignButtons.length);
        const randomCampaignButton = campaignButtons[randomIndex];

        if (randomCampaignButton) {
          randomCampaignButton.click();
          return;
        }
      } catch (error) {
        console.error('Erro ao carregar campanhas para doação:', error);
      }

      {
        showToast('No momento, não há campanhas disponíveis para apoiar.');
      }
    });
  }

  // --- CONTADORES DE IMPACTO ANIMADOS (Estilo ActionAid) ---
  function initImpactCounters() {
    const counters = document.querySelectorAll('.sa-counter-num');
    if (!counters.length) return;

    const animateCount = (el) => {
      const target = parseInt(el.getAttribute('data-target') || '0', 10);
      const duration = 2000;
      const startTime = performance.now();

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cúbico
        const currentVal = Math.floor(easeProgress * target);

        if (target >= 1000000) {
          el.textContent = `${(currentVal / 1000000).toFixed(currentVal >= target ? 0 : 1)} Milhões`;
        } else if (target >= 1000) {
          el.textContent = currentVal.toLocaleString('pt-BR');
        } else {
          el.textContent = `${currentVal}+`;
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          if (target >= 1000000) {
            el.textContent = '33 Milhões';
          } else if (target === 350) {
            el.textContent = '350+';
          } else {
            el.textContent = target.toLocaleString('pt-BR');
          }
        }
      };

      requestAnimationFrame(update);
    };

    // IntersectionObserver para iniciar animação ao rolar até a seção
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            counters.forEach(c => animateCount(c));
            obs.disconnect();
          }
        });
      }, { threshold: 0.25 });

      const impactoSec = document.getElementById('section-impacto');
      if (impactoSec) observer.observe(impactoSec);
    } else {
      counters.forEach(c => animateCount(c));
    }
  }

  // --- FILTRAGEM VIA PILARES DE CAUSA (Estilo ActionAid) ---
  document.querySelectorAll('.sa-pilar-item a').forEach(link => {
    link.addEventListener('click', (e) => {
      const filter = e.currentTarget.getAttribute('data-filter');
      if (filter) {
        // Encontrar e ativar o pill correspondente
        categoryPills.forEach(p => {
          if (p.getAttribute('data-cat') === filter) {
            p.classList.add('active');
          } else {
            p.classList.remove('active');
          }
        });
        currentCategory = filter;
        loadAndRenderCampaigns();
      }
    });
  });

  // --- ACORDEÃO DE DÚVIDAS (FAQ) ---
  const faqQuestions = document.querySelectorAll('.sa-faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.sa-faq-item');
      const answer = item.querySelector('.sa-faq-answer');
      const isOpen = btn.classList.contains('open');

      // Fecha todos os outros
      document.querySelectorAll('.sa-faq-question').forEach(q => q.classList.remove('open'));
      document.querySelectorAll('.sa-faq-answer').forEach(a => a.classList.remove('open'));

      if (!isOpen) {
        btn.classList.add('open');
        answer.classList.add('open');
      }
    });
  });

  // --- RENDERIZAÇÃO DAS CAMPANHAS SOLIDÁRIAS ---
  async function loadAndRenderCampaigns() {
    if (!gridContainer) return;

    gridContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--sa-text-muted); padding: 32px 0;">Carregando campanhas da rede SolidarAção...</p>';
    
    const campaigns = await api.getCampaigns(currentCategory, currentSearch);

    if (!campaigns || campaigns.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: white; border-radius: var(--sa-radius-lg); border: 1px solid #e2e8f0;">
          <span class="material-symbols-outlined" style="font-size: 56px; color: var(--sa-text-muted);">search_off</span>
          <h3 style="margin-top: 12px; font-weight: 800;">Nenhuma campanha encontrada.</h3>
          <p style="color: var(--sa-text-muted); font-size: 0.9rem; margin-top: 4px;">Tente buscar por outro termo ou selecione outra categoria.</p>
        </div>
      `;
      if (lblContagem) lblContagem.textContent = '0 campanhas encontradas';
      return;
    }

    if (lblContagem) lblContagem.textContent = `${campaigns.length} campanha(s) ativa(s) na rede SolidarAção`;

    gridContainer.innerHTML = campaigns.map(c => {
      const currentAmt = parseFloat(c.current_amount || c.atualQtd || 0);
      const targetAmt = parseFloat(c.target_amount || c.metaQtd || 1000);
      const targetItems = parseInt(c.target_items || 0, 10);
      const currentItems = parseInt(c.current_items || 0, 10);

      // Calcular % de progresso
      const pct = targetAmt > 0 ? Math.min(100, Math.round((currentAmt / targetAmt) * 100)) : 50;

      const code = c.code || `#SA-${c.id}`;
      const creator = c.creator_name || c.responsavel || 'Organização Solidária';
      const location = c.location || c.endereco || 'Aracati - CE';
      const image = c.image_url || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80';
      const title = c.title || c.nome || 'Campanha Solidária';
      const desc = c.description || c.descricao || 'Contribua com esta causa de impacto real.';
      const cat = c.category || (c.categorias ? c.categorias[0] : 'alimentos');

      const isUrgent = pct < 40;

      return `
        <article class="sa-campaign-card">
          <div class="sa-card-image">
            <img src="${image}" alt="${title}" loading="lazy">
          </div>

          <div class="sa-card-body">
            <div class="sa-card-tags">
              <span class="sa-card-tag">${cat.toUpperCase()}</span>
              ${isUrgent ? '<span class="sa-card-tag sa-card-tag--urgent">PRIORIDADE</span>' : ''}
            </div>

            <h3 class="sa-card-title">${title}</h3>
            <p class="sa-card-desc">${desc}</p>

            <div class="sa-card-creator">
              <span class="material-symbols-outlined">verified</span>
              <strong>${creator}</strong> • ${location}
            </div>

            <div class="sa-progress-bar-wrapper">
              <div class="sa-progress-bar-track">
                <div class="sa-progress-bar-fill" style="width: ${pct}%;"></div>
              </div>
              <div class="sa-progress-label">
                <span>R$ ${currentAmt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <strong>${pct}% (Meta: R$ ${targetAmt.toLocaleString('pt-BR', { minimumFractionDigits: 0 })})</strong>
              </div>
              ${targetItems > 0 ? `
                <div style="font-size: 0.75rem; color: var(--sa-text-muted); margin-top: 4px; text-align: right;">
                  ${currentItems}/${targetItems} ${c.unit || 'itens'} arrecadados
                </div>
              ` : ''}
            </div>
          </div>

          <div class="sa-card-actions">
            <button class="sa-btn-primary btn-abrir-doar" style="flex: 1;" data-id="${c.id}" data-title="${title}" data-code="${code}">
              <span class="material-symbols-outlined">volunteer_activism</span> APOIAR
            </button>
            <button class="sa-btn-secondary btn-ver-detalhes" data-id="${c.id}" title="Ver detalhes da campanha">
              <span class="material-symbols-outlined">info</span> Detalhes
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Attach Listeners aos botões APOIAR
    document.querySelectorAll('.btn-abrir-doar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const title = e.currentTarget.getAttribute('data-title');
        const code = e.currentTarget.getAttribute('data-code');

        activeCampaignForDonation = id;
        document.getElementById('modal-doar-campaign-id').value = id;
        document.getElementById('modal-doar-titulo').textContent = `💚 Apoiar: ${title} (${code})`;
        
        // Gerar código PIX único
        const randomPix = `00020126580014br.gov.bcb.pix0136${code}-PIX-${Date.now()}520400005303986540550.005802BR5920SOLIDARACAO BR6007ARACATI62070503***6304`;
        document.getElementById('lbl-pix-code').textContent = randomPix;

        openModal(modalDoarPix);
      });
    });

    // Attach Listeners para Ver Detalhes
    document.querySelectorAll('.btn-ver-detalhes').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const detailsContainer = document.getElementById('detalhes-conteudo');
        detailsContainer.innerHTML = '<p style="padding: 20px; text-align: center;">Carregando informações da campanha...</p>';
        openModal(modalDetalhes);

        const data = await api.getCampaignById(id);
        if (!data) {
          detailsContainer.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--sa-red-accent);">Erro ao carregar os detalhes da campanha.</p>';
          return;
        }

        const currentAmt = parseFloat(data.current_amount || 0);
        const targetAmt = parseFloat(data.target_amount || 1000);
        const pct = Math.min(100, Math.round((currentAmt / targetAmt) * 100));

        detailsContainer.innerHTML = `
          <div>
            <img src="${data.image_url}" style="width: 100%; height: 220px; object-fit: cover; border-radius: var(--sa-radius-md); margin-bottom: 16px;">
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
              <span class="sa-card-tag">${data.code}</span>
              <span class="sa-card-tag">${(data.category || 'GERAL').toUpperCase()}</span>
            </div>
            <h2 style="font-size: 1.35rem; font-weight: 900; margin: 8px 0; color: var(--sa-text-primary);">${data.title}</h2>
            <p style="font-size: 0.85rem; color: var(--sa-text-muted); margin-bottom: 14px;">Organizado por <strong>${data.creator_name}</strong> • ${data.location}</p>
            <p style="font-size: 0.95rem; line-height: 1.65; margin-bottom: 24px; color: var(--sa-text-secondary);">${data.description}</p>
            
            <div class="sa-progress-bar-wrapper">
              <div class="sa-progress-bar-track" style="height: 10px;">
                <div class="sa-progress-bar-fill" style="width: ${pct}%;"></div>
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: 800; margin-top: 8px;">
                <span style="color: var(--sa-green-dark);">R$ ${currentAmt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} arrecadados</span>
                <span style="color: var(--sa-text-muted);">Meta: R$ ${targetAmt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${pct}%)</span>
              </div>
            </div>

            <h3 style="font-size: 1.05rem; font-weight: 800; border-top: 1px solid #e2e8f0; padding-top: 18px; margin: 20px 0 12px; color: var(--sa-text-primary);">👥 Apoiadores Recentes</h3>
            <div style="display: flex; flex-direction: column; gap: 10px; max-height: 200px; overflow-y: auto;">
              ${data.donations && data.donations.length > 0 ? data.donations.map(d => `
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 14px; border-radius: var(--sa-radius-sm);">
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700;">
                    <span>${d.donor_name}</span>
                    <span style="color: var(--sa-green-dark);">R$ ${parseFloat(d.amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <p style="font-size: 0.82rem; color: var(--sa-text-secondary); margin-top: 4px;">"${d.support_message || 'Apoiou esta campanha solidária!'}"</p>
                </div>
              `).join('') : '<p style="font-size: 0.85rem; color: var(--sa-text-muted); text-align: center; padding: 12px;">Seja o primeiro a apoiar esta campanha!</p>'}
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
  const amountBtns = document.querySelectorAll('.sa-amount-btn');
  const inputValor = document.getElementById('input-doar-valor');

  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (inputValor) inputValor.value = btn.getAttribute('data-val');
    });
  });

  // --- COPIAR CÓDIGO PIX ---
  const btnCopiarPix = document.getElementById('btn-copiar-pix');
  if (btnCopiarPix) {
    btnCopiarPix.addEventListener('click', () => {
      const codeText = document.getElementById('lbl-pix-code').textContent;
      navigator.clipboard.writeText(codeText).then(() => {
        showToast('📋 Código PIX copiado com sucesso! Abra o app do seu banco para pagar.');
      }).catch(() => {
        showToast('Código PIX selecionado.');
      });
    });
  }

  // --- SUBMIT APOIAR VIA PIX ---
  const formDoarPix = document.getElementById('form-doar-pix');
  if (formDoarPix) {
    formDoarPix.addEventListener('submit', async (e) => {
      e.preventDefault();
      const campaign_id = document.getElementById('modal-doar-campaign-id').value;
      const amount = parseFloat(document.getElementById('input-doar-valor').value || 0);
      const items_qty = parseInt(document.getElementById('input-doar-itens').value || 0, 10);
      const donor_name = document.getElementById('input-doar-nome').value || 'Apoiador Solidário';
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
        showToast(` Apoio de R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} registrado com sucesso! Obrigado pela solidariedade! ❤️`);
        loadAndRenderCampaigns();
      } catch (err) {
        showToast('Erro ao processar o apoio.');
      }
    });
  }

  // --- SUBMIT CRIAR NOVA CAMPANHA ---
  const formCriarCampanha = document.getElementById('form-criar-campanha');
  if (formCriarCampanha) {
    formCriarCampanha.addEventListener('submit', async (e) => {
      e.preventDefault();

      const newCampaign = {
        title: document.getElementById('new-title').value,
        category: document.getElementById('new-category').value,
        target_amount: parseFloat(document.getElementById('new-target-amount').value || 0),
        target_items: parseInt(document.getElementById('new-target-items').value || 0, 10),
        unit: document.getElementById('new-unit').value || 'unidades',
        description: document.getElementById('new-description').value,
        creator_name: document.getElementById('new-creator-name').value,
        location: document.getElementById('new-location').value,
        image_url: document.getElementById('new-image-url').value || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80'
      };

      try {
        await api.createCampaign(newCampaign);
        closeModal(modalCriarCampanha);
        showToast('🚀 Sua Campanha Solidária foi criada e publicada com sucesso na rede SolidarAção!');
        formCriarCampanha.reset();
        loadAndRenderCampaigns();
      } catch (err) {
        showToast('Erro ao criar campanha.');
      }
    });
  }

  // Inicializações
  initImpactCounters();
  loadAndRenderCampaigns();
});
