// Camada de dados — hoje mock local, amanhã Firestore.
// Coleção "deliveries" (entregas). Doc shape:
// {
//   id, clientName, clientLogoUrl, projectTitle,
//   scopeItems: string[], guaranteeText,
//   status: "pending" | "approved",
//   approvedBy, approverRole, approverComment, approvedAt (ISO string)
// }

const _mockDb = {
  "clube-rincao-migracao-2026": {
    id: "clube-rincao-migracao-2026",
    clientName: "Clube Rincão",
    clientLogoUrl: "assets/cluberincao.png",
    projectTitle: "Migração de Sistemas",
    description:
      "Conforme a proposta técnica e comercial apresentada, a Brevia concluiu a migração completa dos sistemas do Clube Rincão para o novo ambiente de hospedagem. Este documento formaliza a entrega para validação junto ao Wagner, responsável pela conferência final do projeto.",
    scopeItems: [
      "Migração de todos os sistemas do Clube Rincão — sites, APIs de ingressos, apps de validação, e-commerce escolar e reservas gratuitas.",
      "Migração dos bancos de dados dos sites e do sistema de Buffet, com as conexões devidamente ajustadas no novo ambiente.",
      "Configuração completa do novo ambiente de hospedagem na Locaweb, incluindo integrações de e-mail, WhatsApp, pagamentos e QR Code.",
      "Testes técnicos realizados e validação dos sistemas principais em funcionamento.",
      "Visita técnica de Isaque ao Clube Rincão para ajuste presencial do banco de dados dos computadores, já apontando para o novo servidor."
    ],
    guaranteeText:
      "A Brevia garante que, após a migração, não ocorrerão quedas do site, indisponibilidades ou bugs decorrentes de sistemas não devidamente conectados ao novo ambiente. Qualquer instabilidade relacionada à migração será corrigida sem custo adicional para o Clube Rincão.",
    status: "pending",
    approvedBy: null,
    approverRole: null,
    approverComment: null,
    approvedAt: null
  },
  "nortex-app-financeiro-2026": {
    id: "nortex-app-financeiro-2026",
    clientName: "Nortex Participações",
    clientLogoUrl: null,
    projectTitle: "Aplicativo de Controle Financeiro",
    scopeItems: [
      "App mobile (iOS e Android) de controle de despesas corporativas",
      "Dashboard web para gestores com relatórios exportáveis",
      "Integração com API bancária para conciliação automática",
      "Sistema de aprovação de despesas em múltiplos níveis"
    ],
    guaranteeText:
      "Garantia de 60 dias para correção de bugs. Atualizações de segurança inclusas nos primeiros 6 meses após a entrega.",
    status: "approved",
    approvedBy: "Marina Costa",
    approverRole: "Diretora Financeira, Nortex Participações",
    approverComment: "Aprovado após validação com o time de operações.",
    approvedAt: "2026-06-18T14:32:00-03:00"
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
