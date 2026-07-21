// Camada de dados mock para a entrega publicada.

const _mockDb = {
  "clube-rincao-migracao-2026": {
    id: "clube-rincao-migracao-2026",
    clientName: "Clube Rincão",
    clientLogoUrl: "assets/cluberincao.png",
    projectTitle: "Migração de Sistemas",
    description:
      "Conforme a proposta técnica e comercial apresentada, a Brevia concluiu a migração completa dos sistemas do Clube Rincão para o novo ambiente de hospedagem. Este documento formaliza a entrega para validação junto ao Wagner, responsável pela conferência final do projeto.",
    scopeItems: [
      "Migração de todos os sistemas do Clube Rincão: sites, APIs de ingressos, apps de validação, e-commerce escolar e reservas gratuitas.",
      "Migração dos bancos de dados dos sites e do sistema de Buffet, com as conexões devidamente ajustadas no novo ambiente.",
      "Configuração completa do novo ambiente de hospedagem na Locaweb, incluindo integrações de e-mail, WhatsApp, pagamentos e QR Code.",
      "Testes técnicos realizados e validação dos sistemas principais em funcionamento.",
      "Visita técnica de Isaque ao Clube Rincão para ajuste presencial do banco de dados dos computadores, já apontando para o novo servidor."
    ],
    guaranteeText:
      "A Brevia garante que, após a migração, não ocorrerão quedas do site, indisponibilidades ou bugs decorrentes de sistemas não devidamente conectados ao novo ambiente. Qualquer instabilidade relacionada à migração será corrigida sem custo adicional para o Clube Rincão.",
    deadline: "21/07 às 18h",
    effortHours: "40h",
    hourlyRate: "R$ 180",
    totalValue: "R$ 7.200,00",
    paymentTerms: "50% na aprovação · 50% na entrega",
    status: "pending",
    approvedBy: null,
    approverRole: null,
    approverComment: null,
    approvedAt: null
  }
};

const LATENCY = 250;
const delay = (v) => new Promise((res) => setTimeout(() => res(v), LATENCY));

export async function getDelivery(id) {
  const d = _mockDb[id];
  return delay(d ? { ...d } : null);
}

export async function getApprovalStatus(id) {
  const d = _mockDb[id];
  if (!d) return delay(null);
  return delay({
    status: d.status,
    approvedBy: d.approvedBy,
    approverRole: d.approverRole,
    approverComment: d.approverComment,
    approvedAt: d.approvedAt
  });
}

export async function approveDelivery(id, { name, role, comment }) {
  const d = _mockDb[id];
  if (!d) throw new Error("Entrega não encontrada: " + id);
  d.status = "approved";
  d.approvedBy = name;
  d.approverRole = role || null;
  d.approverComment = comment || null;
  d.approvedAt = new Date().toISOString();
  return delay({ ...d });
}

export async function listDeliveries() {
  return delay(Object.values(_mockDb).map((d) => ({ ...d })));
}
