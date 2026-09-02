// mock-data.js - Dados Iniciais para o Conecta Doações

window.INITIAL_DATA = {
  pontos: [
    {
      id: 'ponto-1',
      nome: 'Centro Comunitário Esperança Viva',
      endereco: 'Rua das Flores, 123 - Bairro Centenário',
      bairro: 'Centenário',
      contato: '(47) 99123-4567',
      responsavel: 'Maria Aparecida',
      categorias: ['alimentos', 'higiene'],
      statusEstoque: {
        alimentos: 'critico', // critico, moderado, suficiente
        higiene: 'moderado'
      },
      descricao: 'Atendemos cerca de 120 famílias cadastradas na região periférica. Necessidade urgente de arroz, feijão e sabonetes.',
      lat: -26.9167,
      lng: -49.0667,
      horario: 'Seg a Sex: 08h às 17h'
    },
    {
      id: 'ponto-2',
      nome: 'ONG Mãos Unidas & Agasalho',
      endereco: 'Av. Brasil, 4500 - Centro',
      bairro: 'Centro',
      contato: '(47) 98877-6655',
      responsavel: 'Carlos Eduardo',
      categorias: ['roupas', 'higiene'],
      statusEstoque: {
        roupas: 'critico',
        higiene: 'critico'
      },
      descricao: 'Foco na arrecadação de roupas de frio, cobertores e fraldas infantis/geriátricas para o inverno.',
      lat: -26.9200,
      lng: -49.0700,
      horario: 'Seg a Sáb: 09h às 18h'
    },
    {
      id: 'ponto-3',
      nome: 'Cozinha Solidária São Francisco',
      endereco: 'Rua São Paulo, 890 - Victor Konder',
      bairro: 'Victor Konder',
      contato: '(47) 99911-2233',
      responsavel: 'Irmã Tereza',
      categorias: ['alimentos'],
      statusEstoque: {
        alimentos: 'moderado'
      },
      descricao: 'Servimos 250 refeições diárias para pessoas em situação de rua. Aceitamos doações em grande quantidade de insumos alimentícios.',
      lat: -26.9100,
      lng: -49.0750,
      horario: 'Diariamente: 07h às 19h'
    }
  ],
  metas: [
    {
      id: 'meta-1',
      titulo: 'Campanha 500 Cestas Básicas - Inverno Sem Fome',
      pontoId: 'ponto-1',
      pontoNome: 'Centro Comunitário Esperança Viva',
      categoria: 'alimentos',
      metaQtd: 500,
      atualQtd: 340,
      unidade: 'cestas',
      dataLimite: '2026-08-30',
      descricao: 'Meta conjunta para garantir alimentação de 500 famílias durante o mês de agosto.'
    },
    {
      id: 'meta-2',
      titulo: 'Arrecadação de 300 Cobertores e Agasalhos',
      pontoId: 'ponto-2',
      pontoNome: 'ONG Mãos Unidas & Agasalho',
      categoria: 'roupas',
      metaQtd: 300,
      atualQtd: 185,
      unidade: 'peças',
      dataLimite: '2026-08-15',
      descricao: 'Campanha de emergência para a onda de frio.'
    },
    {
      id: 'meta-3',
      titulo: 'Kit Higiene Pessoal para Albergue Noturno',
      pontoId: 'ponto-2',
      pontoNome: 'ONG Mãos Unidas & Agasalho',
      categoria: 'higiene',
      metaQtd: 200,
      atualQtd: 120,
      unidade: 'kits',
      dataLimite: '2026-09-10',
      descricao: 'Kits contendo sabonete, creme dental, escova e toalha para acolhimento noturno.'
    }
  ],
  agendamentos: [
    {
      id: 'agend-1',
      doadorNome: 'João Pedro Silva',
      pontoId: 'ponto-1',
      pontoNome: 'Centro Comunitário Esperança Viva',
      itens: '10kg de Arroz, 5kg de Feijão, 2L de Óleo',
      categoria: 'alimentos',
      dataHora: '2026-08-02T14:30',
      modalidade: 'entrega', // entrega ou retirada
      status: 'confirmado'
    }
  ],
  mensagens: [
    {
      id: 'msg-1',
      autor: 'Coordenação Esperança Viva',
      papel: 'Administrador ONG',
      texto: 'Pessoal, conseguimos arrecadar 50kg de alimentos ontem! Muito obrigado a todos os doadores. Continuamos precisando de leite em pó.',
      data: '2026-07-31 14:20',
      tipo: 'aviso'
    },
    {
      id: 'msg-2',
      autor: 'Lucas Andrade',
      papel: 'Doador Voluntário',
      texto: 'Tenho um lote de agasalhos infantis para entregar neste sábado. Alguém da zona norte consegue ajudar com o transporte?',
      data: '2026-07-31 16:45',
      tipo: 'ajuda'
    }
  ]
};
