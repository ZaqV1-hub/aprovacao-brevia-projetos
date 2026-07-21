// Camada de dados mock para a entrega publicada.

const _mockDb = {
  "clube-rincao-migracao-2026": {
    id: "clube-rincao-migracao-2026",
    clientName: "Clube Rincao",
    clientLogoUrl: "assets/cluberincao.png",
    projectTitle: "Migracao de Sistemas",
    description:
      "Conforme a proposta tecnica e comercial apresentada, a Brevia concluiu a migracao completa dos sistemas do Clube Rincao para o novo ambiente de hospedagem. Este documento formaliza a entrega para validacao junto ao Wagner, responsavel pela conferencia final do projeto.",
    scopeItems: [
      "Migracao de todos os sistemas do Clube Rincao: sites, APIs de ingressos, apps de validacao, e-commerce escolar e reservas gratuitas.",
      "Migracao dos bancos de dados dos sites e do sistema de Buffet, com as conexoes devidamente ajustadas no novo ambiente.",
      "Configuracao completa do novo ambiente de hospedagem na Locaweb, incluindo integracoes de e-mail, WhatsApp, pagamentos e QR Code.",
      "Testes tecnicos realizados e validacao dos sistemas principais em funcionamento.",
      "Visita tecnica de Isaque ao Clube Rincao para ajuste presencial do banco de dados dos computadores, ja apontando para o novo servidor."
    ],
    guaranteeText:
      "A Brevia garante que, apos a migracao, nao ocorrerao quedas do site, indisponibilidades ou bugs decorrentes de sistemas nao devidamente conectados ao novo ambiente. Qualquer instabilidade relacionada a migracao sera corrigida sem custo adicional para o Clube Rincao.",
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
  if (!d) throw new Error("Entrega nao encontrada: " + id);
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
