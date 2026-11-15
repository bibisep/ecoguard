// ======================================
// ECOGUARD - NAVEGAÇÃO INICIAL
// ======================================

const welcome = document.querySelector(".welcome");
const permissions = document.querySelector(".permissions");

const startButton = document.querySelector(".start-button");
const backButton = document.getElementById("backWelcome");
const continueButton = document.getElementById("continuePermissions");

function showScreen(screen) {
  welcome.style.display = "none";
  permissions.style.display = "none";

  screen.style.display = "flex";
}

// Tela 1 -> Tela 2
startButton.addEventListener("click", () => {
  showScreen(permissions);
});

// Tela 2 -> Tela 1
backButton.addEventListener("click", () => {
  showScreen(welcome);
});

// Salvar preferências demonstrativas
const locationPermission = document.getElementById("locationPermission");
const notificationPermission = document.getElementById("notificationPermission");

locationPermission.checked = localStorage.getItem("ecoguard-location") === "true";

notificationPermission.checked = localStorage.getItem("ecoguard-notifications") === "true";

locationPermission.addEventListener("change", () => {
  localStorage.setItem("ecoguard-location", locationPermission.checked);
});

notificationPermission.addEventListener("change", () => {
  localStorage.setItem("ecoguard-notifications", notificationPermission.checked);
});

// A terceira tela será conectada depois
continueButton.addEventListener("click", () => {
  const permissions = document.getElementById("permissions");
  const dashboard = document.getElementById("dashboard");

  permissions.style.display = "none";
  dashboard.style.display = "flex";
});

// ======================================
// ECOGUARD - TELA 3 DASHBOARD
// ======================================

document.addEventListener("DOMContentLoaded", () => {
  const dashboard = document.getElementById("dashboard");
  const welcome = document.querySelector(".welcome");
  const permissions = document.querySelector(".permissions");

  const continueButton = document.getElementById("continuePermissions");

  // Tela 2 -> Tela 3
  continueButton.addEventListener("click", () => {
    welcome.style.display = "none";
    permissions.style.display = "none";
    dashboard.style.display = "flex";
    dashboard.scrollTop = 0;
    window.scrollTo(0, 0);
  });

  // Botões que terão telas próprias futuramente
  const upcoming = ["dashMenu", "dashBell", "dashLocation", "seeAllAlerts", "heatAlert"];

  upcoming.forEach((id) => {
    const button = document.getElementById(id);

    button.addEventListener("click", () => {
      alert("Essa funcionalidade será adicionada nas próximas telas!");
    });
  });

  // Navegação inferior demonstrativa
});

/* =====================================
   ECOGUARD - NAVEGAÇÃO DAS TELAS 3 E 4
===================================== */

const telaDashboard = document.getElementById("dashboard");
const telaAlertas = document.getElementById("alertsPage");

function abrirTelaEcoGuard(tela) {
  if (!telaDashboard || !telaAlertas) return;

  telaDashboard.style.display = tela === "inicio" ? "flex" : "none";

  telaAlertas.style.display = tela === "alertas" ? "flex" : "none";

  // Volta ao topo quando muda de tela
  const conteudo = document.querySelector(tela === "inicio" ? ".dashboard-content" : ".alerts-content");

  if (conteudo) conteudo.scrollTop = 0;
}

// Botões Início e Alertas das duas telas
document
  .querySelectorAll(
    '#dashboard [data-tab="inicio"], ' +
      '#dashboard [data-tab="alertas"], ' +
      '#alertsPage [data-tab="inicio"], ' +
      '#alertsPage [data-tab="alertas"]',
  )
  .forEach((botao) => {
    botao.addEventListener("click", () => {
      abrirTelaEcoGuard(botao.dataset.tab);
    });
  });

// Botão "Ver todos" do dashboard
document.querySelectorAll(".dash-section-title button").forEach((botao) => {
  botao.addEventListener("click", () => {
    abrirTelaEcoGuard("alertas");
  });
});

/* =====================================
   ECOGUARD - DETALHES DO ALERTA
===================================== */

const alertDetail = document.getElementById("alertDetail");
const alertsPage = document.getElementById("alertsPage");

// Abrir detalhes do calor extremo
document.querySelectorAll('[data-alert="calor"]').forEach((card) => {
  card.addEventListener("click", () => {
    alertsPage.style.display = "none";
    alertDetail.style.display = "flex";
    document.querySelector(".alert-detail-content").scrollTop = 0;
  });
});

// Voltar para a lista de alertas
document.getElementById("detailBack").addEventListener("click", () => {
  alertDetail.style.display = "none";
  alertsPage.style.display = "flex";
});

// Simular ativação de alertas
document.getElementById("activateAlert").addEventListener("click", function () {
  this.querySelector("span").textContent = "Alertas ativados!";
  this.disabled = true;
  this.style.opacity = "0.85";
});

/* =====================================
   ECOGUARD - SIMULAÇÃO DE NOTIFICAÇÃO
===================================== */

const ecoLockScreen = document.getElementById("lockScreen");
const ecoNotification = document.getElementById("ecoNotification");

let ecoIdleTimer;
let ecoNotificationTimer;
let ecoSimulationShown = false;

function startEcoIdleTimer() {
  clearTimeout(ecoIdleTimer);

  if (ecoSimulationShown) return;

  ecoIdleTimer = setTimeout(() => {
    // Simulação exibida apenas no Dashboard
    const dashboard = document.getElementById("dashboard");

    if (!dashboard || getComputedStyle(dashboard).display === "none") {
      return;
    }

    ecoSimulationShown = true;

    dashboard.style.display = "none";
    ecoLockScreen.style.display = "block";

    ecoNotification.classList.remove("show");

    // Notificação aparece após a tela bloquear
    ecoNotificationTimer = setTimeout(() => {
      ecoNotification.classList.add("show");
    }, 1200);
  }, 15000);
}

// Reinicia a contagem quando a pessoa interage
["pointerdown", "keydown", "scroll"].forEach((eventName) => {
  document.addEventListener(
    eventName,
    () => {
      if (!ecoSimulationShown) {
        startEcoIdleTimer();
      }
    },
    { passive: true },
  );
});

// Inicia a contagem
startEcoIdleTimer();

// Ao tocar na notificação, abre os detalhes
ecoNotification.addEventListener("click", () => {
  clearTimeout(ecoNotificationTimer);

  ecoLockScreen.style.display = "none";
  document.getElementById("alertDetail").style.display = "flex";

  const detailContent = document.querySelector(".alert-detail-content");

  if (detailContent) detailContent.scrollTop = 0;
});

/* =====================================
   ECOGUARD - HORÁRIO DE BRASÍLIA
===================================== */

function atualizarHorarioBrasilia() {
  const agora = new Date();

  const horario = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(agora);

  const data = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(agora);

  const relogio = document.getElementById("lockTime");
  const calendario = document.getElementById("lockDate");

  if (relogio) {
    relogio.textContent = horario;
  }

  if (calendario) {
    calendario.textContent = data.replace("-feira", "").replace(/\./g, "");
  }
}

// Atualiza imediatamente
atualizarHorarioBrasilia();

// Atualiza automaticamente a cada segundo
setInterval(atualizarHorarioBrasilia, 1000);

/* =====================================
   ECOGUARD - MAPA DE RISCOS
===================================== */

let ecoMap = null;

function iniciarMapaEcoGuard() {
  if (ecoMap) {
    ecoMap.invalidateSize();
    return;
  }

  if (typeof L === "undefined") {
    console.error("Leaflet não foi carregado.");
    return;
  }

  ecoMap = L.map("ecoRiskMap", {
    zoomControl: false,
  }).setView([-23.5505, -46.6333], 11);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19,
  }).addTo(ecoMap);

  L.control
    .zoom({
      position: "bottomright",
    })
    .addTo(ecoMap);

  // Regiões demonstrativas
  const regioes = [
    {
      nome: "Sé",
      lat: -23.5505,
      lng: -46.6333,
      cor: "#ef4444",
      risco: "Alto",
    },
    {
      nome: "Santana",
      lat: -23.502,
      lng: -46.625,
      cor: "#f97316",
      risco: "Médio",
    },
    {
      nome: "Lapa",
      lat: -23.523,
      lng: -46.705,
      cor: "#eab308",
      risco: "Baixo",
    },
    {
      nome: "Moema",
      lat: -23.602,
      lng: -46.666,
      cor: "#eab308",
      risco: "Baixo",
    },
    {
      nome: "Vila Mariana",
      lat: -23.587,
      lng: -46.635,
      cor: "#f97316",
      risco: "Médio",
    },
  ];

  regioes.forEach((regiao) => {
    const marcador = L.circleMarker([regiao.lat, regiao.lng], {
      radius: 14,
      color: "#ffffff",
      weight: 2,
      fillColor: regiao.cor,
      fillOpacity: 0.9,
    }).addTo(ecoMap);

    marcador.on("click", () => {
      mostrarRegiaoEcoGuard(regiao);
    });
  });
}

function abrirMapaEcoGuard() {
  const telas = ["dashboard", "alertsPage", "alertDetail", "mapPage"];

  telas.forEach((id) => {
    const tela = document.getElementById(id);
    if (tela) tela.style.display = "none";
  });

  document.getElementById("mapPage").style.display = "flex";

  requestAnimationFrame(() => {
    iniciarMapaEcoGuard();
  });
}

// Botões Mapa
document.querySelectorAll('[data-tab="mapa"]').forEach((botao) => {
  botao.addEventListener("click", abrirMapaEcoGuard);
});

// Voltar ao Dashboard
document.getElementById("mapBack").addEventListener("click", () => {
  document.getElementById("mapPage").style.display = "none";
  document.getElementById("dashboard").style.display = "flex";
});

// Botão Início dentro do Mapa
document.querySelectorAll('#mapPage [data-tab="inicio"]').forEach((botao) => {
  botao.addEventListener("click", () => {
    document.getElementById("mapPage").style.display = "none";
    document.getElementById("dashboard").style.display = "flex";
  });
});

// Botão Alertas dentro do Mapa
document.querySelectorAll('#mapPage [data-tab="alertas"]').forEach((botao) => {
  botao.addEventListener("click", () => {
    document.getElementById("mapPage").style.display = "none";
    document.getElementById("alertsPage").style.display = "flex";
  });
});

// Abrir detalhes do calor extremo
document.getElementById("mapHeatAlert").addEventListener("click", () => {
  document.getElementById("mapPage").style.display = "none";
  document.getElementById("alertDetail").style.display = "flex";
});


/* =====================================
   ECOGUARD - INTERAÇÃO COM REGIÕES
===================================== */

const ecoRegionCard =
  document.getElementById("mapRegionCard");

const ecoRegionClose =
  document.getElementById("mapRegionClose");

const ecoRegionDetails =
  document.getElementById("mapRegionDetails");

const ecoRegionData = {
  "Alto": {
    tipo: "Calor extremo",
    descricao:
      "Temperaturas elevadas podem representar riscos à saúde. Consulte as orientações preventivas."
  },

  "Médio": {
    tipo: "Atenção ambiental",
    descricao:
      "A região apresenta condições que merecem atenção. Acompanhe os avisos preventivos."
  },

  "Baixo": {
    tipo: "Monitoramento preventivo",
    descricao:
      "A região apresenta risco demonstrativo baixo. Continue acompanhando as condições ambientais."
  }
};

function mostrarRegiaoEcoGuard(regiao) {
  const dados = ecoRegionData[regiao.risco];

  document.getElementById("mapRegionName")
    .textContent = regiao.nome + ", São Paulo";

  const risco = document.getElementById("mapRegionRisk");

  risco.textContent = "Risco " + regiao.risco.toLowerCase();

  risco.className =
    "map-region-risk " +
    (regiao.risco === "Médio"
      ? "medio"
      : regiao.risco.toLowerCase());

  document.getElementById("mapRegionType")
    .textContent = dados.tipo;

  document.getElementById("mapRegionDescription")
    .textContent = dados.descricao;

  ecoRegionDetails.hidden = regiao.risco !== "Alto";

  ecoRegionCard.hidden = false;

  // Rola suavemente até o cartão
  setTimeout(() => {
    ecoRegionCard.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }, 100);
}

// Fechar cartão
ecoRegionClose.addEventListener("click", () => {
  ecoRegionCard.hidden = true;
});

// Abrir tela de detalhes do calor extremo
ecoRegionDetails.addEventListener("click", () => {
  document.getElementById("mapPage")
    .style.display = "none";

  document.getElementById("alertDetail")
    .style.display = "flex";

  const conteudo = document.querySelector(
    ".alert-detail-content"
  );

  if (conteudo) conteudo.scrollTop = 0;
});


/* =====================================
   ECOGUARD - TELA 8: PERFIL
===================================== */

const ecoProfilePage =
  document.getElementById("profilePage");

function abrirPerfilEcoGuard() {
  const telas = [
    "welcome",
    "permissions",
    "dashboard",
    "alertsPage",
    "alertDetail",
    "mapPage",
    "lockScreen"
  ];

  telas.forEach(id => {
    const tela = document.getElementById(id);

    if (tela) {
      tela.style.display = "none";
    }
  });

  // Algumas telas usam classes em vez de IDs
  document.querySelectorAll(".welcome, .permissions")
    .forEach(tela => {
      tela.style.display = "none";
    });

  ecoProfilePage.style.display = "flex";

  const conteudo = ecoProfilePage.querySelector(
    ".profile-scroll"
  );

  if (conteudo) conteudo.scrollTop = 0;
}

// Abrir Perfil a partir de qualquer menu
document.querySelectorAll('[data-tab="perfil"]')
  .forEach(botao => {
    botao.addEventListener(
      "click",
      abrirPerfilEcoGuard
    );
  });

// Voltar ao Dashboard
function voltarInicioDoPerfil() {
  ecoProfilePage.style.display = "none";

  const dashboard =
    document.getElementById("dashboard");

  dashboard.style.display = "flex";
}

document.getElementById("profileBack")
  .addEventListener("click", voltarInicioDoPerfil);

// Navegação inferior do Perfil
document.querySelectorAll(
  '#profilePage [data-tab="inicio"]'
).forEach(botao => {
  botao.addEventListener(
    "click",
    voltarInicioDoPerfil
  );
});

document.querySelectorAll(
  '#profilePage [data-tab="alertas"]'
).forEach(botao => {
  botao.addEventListener("click", () => {
    ecoProfilePage.style.display = "none";

    document.getElementById("alertsPage")
      .style.display = "flex";
  });
});

// O botão Mapa já é atendido pela
// função abrirMapaEcoGuard() existente.

/* =====================================
   ECOGUARD - REGISTRO DO PWA
===================================== */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => {
        console.log("ECOGUARD PWA registrado!");
      })
      .catch(error => {
        console.error(
          "Erro ao registrar Service Worker:",
          error
        );
      });
  });
}
