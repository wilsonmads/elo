// data-service.js - Camada de Serviço de Dados (Abstração LocalStorage com suporte a API Futura)

class DataService {
  constructor() {
    this.STORAGE_KEY = 'CONECTA_DOACOES_DB_V1';
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const initialData = window.INITIAL_DATA || {
        pontos: [],
        metas: [],
        agendamentos: [],
        mensagens: []
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
    }
  }

  _readDB() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || window.INITIAL_DATA;
    } catch (e) {
      console.error('Erro ao ler LocalStorage:', e);
      return window.INITIAL_DATA;
    }
  }

  _writeDB(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Erro ao salvar no LocalStorage:', e);
      return false;
    }
  }

  // --- PONTOS DE DOAÇÃO ---
  async getPontos(categoriaFiltro = 'todos', termoBusca = '') {
    const db = this._readDB();
    let pontos = db.pontos || [];

    if (categoriaFiltro !== 'todos') {
      pontos = pontos.filter(p => p.categorias.includes(categoriaFiltro));
    }

    if (termoBusca.trim() !== '') {
      const termo = termoBusca.toLowerCase();
      pontos = pontos.filter(p => 
        p.nome.toLowerCase().includes(termo) ||
        p.bairro.toLowerCase().includes(termo) ||
        p.endereco.toLowerCase().includes(termo) ||
        p.descricao.toLowerCase().includes(termo)
      );
    }

    return pontos;
  }

  async addPonto(novoPonto) {
    const db = this._readDB();
    const ponto = {
      id: 'ponto-' + Date.now(),
      ...novoPonto
    };
    db.pontos.unshift(ponto);
    this._writeDB(db);
    return ponto;
  }

  // --- METAS COLETIVAS (COOPERAÇÃO M3C) ---
  async getMetas() {
    const db = this._readDB();
    return db.metas || [];
  }

  async contribuirMeta(metaId, quantidadeDoador, nomeDoador) {
    const db = this._readDB();
    const index = db.metas.findIndex(m => m.id === metaId);
    if (index !== -1) {
      db.metas[index].atualQtd = Number(db.metas[index].atualQtd) + Number(quantidadeDoador);
      
      // Registrar log de cooperação no mural automaticamente (Percepção/Awareness M3C)
      const novaMsg = {
        id: 'msg-' + Date.now(),
        autor: nomeDoador || 'Doador Anônimo',
        papel: 'Doador Voluntário',
        texto: `🎉 Contribuiu com +${quantidadeDoador} ${db.metas[index].unidade} na meta: "${db.metas[index].titulo}"!`,
        data: new Date().toISOString().replace('T', ' ').substring(0, 16),
        tipo: 'aviso'
      };
      db.mensagens.unshift(novaMsg);

      this._writeDB(db);
      return db.metas[index];
    }
    throw new Error('Meta não encontrada');
  }

  async addMeta(novaMeta) {
    const db = this._readDB();
    const meta = {
      id: 'meta-' + Date.now(),
      atualQtd: 0,
      ...novaMeta
    };
    db.metas.unshift(meta);
    this._writeDB(db);
    return meta;
  }

  // --- AGENDAMENTOS E LOGÍSTICA (COORDENAÇÃO M3C) ---
  async getAgendamentos() {
    const db = this._readDB();
    return db.agendamentos || [];
  }

  async addAgendamento(novoAgendamento) {
    const db = this._readDB();
    const agendamento = {
      id: 'agend-' + Date.now(),
      status: 'confirmado',
      ...novoAgendamento
    };
    db.agendamentos.unshift(agendamento);
    this._writeDB(db);
    return agendamento;
  }

  async cancelarAgendamento(agendamentoId) {
    const db = this._readDB();
    db.agendamentos = db.agendamentos.filter(a => a.id !== agendamentoId);
    this._writeDB(db);
    return true;
  }

  // --- MURAL COMUNITÁRIO (COMUNICAÇÃO M3C) ---
  async getMensagens() {
    const db = this._readDB();
    return db.mensagens || [];
  }

  async addMensagem(novaMensagem) {
    const db = this._readDB();
    const msg = {
      id: 'msg-' + Date.now(),
      data: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ...novaMensagem
    };
    db.mensagens.unshift(msg);
    this._writeDB(db);
    return msg;
  }
}

window.dataService = new DataService();
