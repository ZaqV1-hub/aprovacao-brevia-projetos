import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
  runTransaction,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC2QlR1k0fHkCabF3o0iXF433tIm0m0s1Y",
  authDomain: "breviaprojects.firebaseapp.com",
  projectId: "breviaprojects",
  storageBucket: "breviaprojects.firebasestorage.app",
  messagingSenderId: "109697673902",
  appId: "1:109697673902:web:f23943ae5082ec10c3db3f",
  measurementId: "G-L2XX3V29KC"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const deliveriesCollection = collection(db, "deliveries");

const deliveryTemplates = {
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

function deliveryRef(id) {
  return doc(deliveriesCollection, id);
}

function cloneTemplate(id) {
  const template = deliveryTemplates[id];
  if (!template) throw new Error("Entrega não cadastrada: " + id);
  return JSON.parse(JSON.stringify(template));
}

function toIsoString(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  return null;
}

function normalizeDelivery(id, raw) {
  const base = cloneTemplate(id);
  const merged = { ...base, ...(raw || {}) };
  merged.scopeItems = Array.isArray(merged.scopeItems) ? merged.scopeItems : base.scopeItems;
  merged.approvedAt = toIsoString(merged.approvedAt);
  merged.status = merged.status === "approved" ? "approved" : "pending";
  merged.approvedBy = merged.approvedBy || null;
  merged.approverRole = merged.approverRole || null;
  merged.approverComment = merged.approverComment || null;
  return merged;
}

async function ensureDelivery(id) {
  const ref = deliveryRef(id);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) return normalizeDelivery(id, snapshot.data());

  const initial = cloneTemplate(id);
  await setDoc(ref, initial);
  return initial;
}

export async function getDelivery(id) {
  return ensureDelivery(id);
}

export async function getApprovalStatus(id) {
  const delivery = await ensureDelivery(id);
  return {
    status: delivery.status,
    approvedBy: delivery.approvedBy,
    approverRole: delivery.approverRole,
    approverComment: delivery.approverComment,
    approvedAt: delivery.approvedAt
  };
}

export async function approveDelivery(id, { name, role, comment }) {
  const ref = deliveryRef(id);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);
    const current = snapshot.exists()
      ? normalizeDelivery(id, snapshot.data())
      : cloneTemplate(id);

    if (current.status === "approved") return;

    transaction.set(
      ref,
      {
        ...current,
        status: "approved",
        approvedBy: name,
        approverRole: role || null,
        approverComment: comment || null,
        approvedAt: new Date().toISOString()
      },
      { merge: false }
    );
  });

  return getDelivery(id);
}

export async function listDeliveries() {
  const snapshots = await getDocs(deliveriesCollection);
  const items = snapshots.docs
    .map((entry) => normalizeDelivery(entry.id, entry.data()))
    .filter((entry) => !!deliveryTemplates[entry.id]);

  if (items.length > 0) return items;

  const firstId = Object.keys(deliveryTemplates)[0];
  return [await ensureDelivery(firstId)];
}
