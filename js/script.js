/* ==========================================
   ECOGUARD - JAVASCRIPT COMPLETO
   Navegação, alertas, notificações, mapa e PWA
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* ELEMENTOS PRINCIPAIS */

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);
  const byId = (id) => document.getElementById(id);

  const screens = {
    welcome: $(".welcome"),
    permissions: byId("permissions") || $(".permissions"),
    dashboard: byId("dashboard"),
    alerts: byId("alertsPage"),
    detail: byId("alertDetail"),
    lock: byId("lockScreen"),
    map: byId("mapPage"),
    profile: byId("profilePage")
  };

  let currentScreen = "welcome";
  let previousDetailScreen = "alerts";

  /* CONTROLE CENTRAL DAS TELAS */

  function showScreen(name) {
    const target = screens[name];

    if (!target) {
      console.error("ECOGUARD: tela não encontrada:", name);
      return;
    }

    Object.values(screens).forEach((screen) => {
      if (screen) {
        screen.style.display = "none";
      }
    });

    target.style.display = "flex";
    currentScreen = name;

    const scrollArea = target.querySelector(
      ".dashboard-content, " +
      ".alerts-content, " +
      ".alert-detail-content, " +
      ".map-scroll, " +
      ".profile-scroll"
    );

    if (scrollArea) {
      scrollArea.scrollTop = 0;
    }

    window.scrollTo(0, 0);

    if (name === "dashboard") {
      startEcoIdleTimer();
    } else {
      clearTimeout(ecoIdleTimer);
    }

    if (name === "map") {
      requestAnimationFrame(() => {
        initializeEcoMap();

        if (ecoMap) {
          ecoMap.invalidateSize();
        }
      });
    }

    updateNavigation(name);
  }

  function updateNavigation(name) {
    const tabNames = {
      dashboard: "inicio",
      alerts: "alertas",
      map: "mapa",
      profile: "perfil"
    };

    const activeTab = tabNames[name];

    $$("[data-tab]").forEach((button) => {
      const active = button.dataset.tab === activeTab;

      button.classList.toggle(
        "active",
        Boolean(activeTab && active)
      );

      if (activeTab) {
        if (active) {
          button.setAttribute("aria-current", "page");
        } else {
          button.removeAttribute("aria-current");
        }
      }
    });
  }

  /* ========================================
     TELA 1 - BOAS-VINDAS
  ======================================== */

  $(".start-button")?.addEventListener("click", () => {
    showScreen("permissions");
  });

  /* ========================================
     TELA 2 - PERMISSÕES
  ======================================== */

  const locationPermission = byId("locationPermission");
  const notificationPermission = byId("notificationPermission");

  function readPreference(key) {
    try {
      return localStorage.getItem(key) === "true";
    } catch (error) {
      return false;
    }
  }

  function savePreference(key, value) {
    try {
      localStorage.setItem(key, String(value));
    } catch (error) {
      console.warn("Não foi possível salvar a preferência.", error);
    }
  }

  if (locationPermission) {
    locationPermission.checked = readPreference(
      "ecoguard-location"
    );

    locationPermission.addEventListener("change", () => {
      savePreference(
        "ecoguard-location",
        locationPermission.checked
      );
    });
  }

  if (notificationPermission) {
    notificationPermission.checked = readPreference(
      "ecoguard-notifications"
    );

    notificationPermission.addEventListener("change", () => {
      savePreference(
        "ecoguard-notifications",
        notificationPermission.checked
      );
    });
  }

  byId("backWelcome")?.addEventListener("click", () => {
    showScreen("welcome");
  });

  byId("continuePermissions")?.addEventListener(
    "click",
    () => {
      showScreen("dashboard");
    }
  );

  /* NAVEGAÇÃO INFERIOR DAS TELAS */

  $$("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.tab;

      const destinations = {
        inicio: "dashboard",
        alertas: "alerts",
        mapa: "map",
        perfil: "profile"
      };

      if (destinations[tab]) {
        showScreen(destinations[tab]);
      }
    });
  });

  /* ========================================
     TELA 3 - DASHBOARD
  ======================================== */

  byId("seeAllAlerts")?.addEventListener("click", () => {
    showScreen("alerts");
  });

  $$(".dash-section-title button").forEach((button) => {
    if (button.id === "seeAllAlerts") return;

    button.addEventListener("click", () => {
      showScreen("alerts");
    });
  });

  byId("dashBell")?.addEventListener("click", () => {
    showScreen("alerts");
  });

  byId("dashMenu")?.addEventListener("click", () => {
    showScreen("profile");
  });

  byId("dashLocation")?.addEventListener("click", () => {
    showScreen("map");
  });

  /* ========================================
     TELA 4 - ALERTAS AMBIENTAIS
  ======================================== */

  function openAlertDetail(origin = currentScreen) {
    previousDetailScreen =
      origin === "lock" ? "dashboard" : origin;

    showScreen("detail");
  }

  $$('[data-alert="calor"]').forEach((card) => {
    card.addEventListener("click", () => {
      openAlertDetail();
    });
  });

  byId("heatAlert")?.addEventListener("click", () => {
    openAlertDetail();
  });

  /* ========================================
     TELA 5 - DETALHES DO ALERTA
  ======================================== */

  byId("detailBack")?.addEventListener("click", () => {
    const allowed = ["dashboard", "alerts", "map"];

    const destination = allowed.includes(previousDetailScreen)
      ? previousDetailScreen
      : "alerts";

    showScreen(destination);
  });

  const activateAlertButton = byId("activateAlert");

  activateAlertButton?.addEventListener(
    "click",
    async () => {
      // A simulação funciona independentemente
      // da permissão de notificações do sistema.

      savePreference("ecoguard-notifications", true);

      if (notificationPermission) {
        notificationPermission.checked = true;
      }

      const label = activateAlertButton.querySelector("span");

      if (label) {
        label.textContent = "Alertas ativados!";
      }

      activateAlertButton.disabled = true;
      activateAlertButton.style.opacity = "0.85";

      // Solicitação real de permissão, quando suportada.
      // O navegador pode negar ou não oferecer o recurso.

      if (
        "Notification" in window &&
        Notification.permission === "default" &&
        window.isSecureContext
      ) {
        try {
          const result = await Notification.requestPermission();

          console.log(
            "Permissão de notificações:",
            result
          );
        } catch (error) {
          console.warn(
            "Permissão de notificações indisponível:",
            error
          );
        }
      }
    }
  );

  /* ========================================
     TELA 6 - NOTIFICAÇÃO ESTILO IPHONE
  ======================================== */

  const ecoNotification = byId("ecoNotification");

  let ecoIdleTimer = null;
  let ecoNotificationTimer = null;
  let ecoSimulationShown = false;

  function startEcoIdleTimer() {
    clearTimeout(ecoIdleTimer);

    if (ecoSimulationShown) return;
    if (currentScreen !== "dashboard") return;

    ecoIdleTimer = setTimeout(() => {
      if (currentScreen !== "dashboard") return;

      ecoSimulationShown = true;

      ecoNotification?.classList.remove("show");

      showScreen("lock");

      clearTimeout(ecoNotificationTimer);

      ecoNotificationTimer = setTimeout(() => {
        if (currentScreen === "lock") {
          ecoNotification?.classList.add("show");
        }
      }, 1200);
    }, 15000);
  }

  /* Reiniciar a contagem quando houver interação */

  ["pointerdown", "keydown", "scroll"].forEach(
    (eventName) => {
      document.addEventListener(
        eventName,
        () => {
          if (
            currentScreen === "dashboard" &&
            !ecoSimulationShown
          ) {
            startEcoIdleTimer();
          }
        },
        { passive: true }
      );
    }
  );

  /* Abrir detalhes ao tocar na notificação */

  ecoNotification?.addEventListener("click", () => {
    clearTimeout(ecoNotificationTimer);
    openAlertDetail("lock");
  });

  /* RELÓGIO E DATA DE BRASÍLIA */

  function updateBrasiliaClock() {
    const now = new Date();

    const time = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(now);

    const date = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      weekday: "long",
      day: "numeric",
      month: "long"
    }).format(now);

    const clockElement = byId("lockTime");
    const dateElement = byId("lockDate");

    if (clockElement) {
      clockElement.textContent = time;
    }

    if (dateElement) {
      dateElement.textContent =
        date.charAt(0).toUpperCase() + date.slice(1);
    }
  }

  updateBrasiliaClock();
  setInterval(updateBrasiliaClock, 1000);

  /* ========================================
     TELA 7 - MAPA DE RISCOS
  ======================================== */

  let ecoMap = null;

  // Dados fictícios para demonstração acadêmica.
  // Não representam medições ambientais em tempo real.

  const ecoRegions = [
    {
      nome: "Sé",
      lat: -23.5505,
      lng: -46.6333,
      cor: "#ef4444",
      risco: "Alto"
    },
    {
      nome: "Santana",
      lat: -23.502,
      lng: -46.625,
      cor: "#f97316",
      risco: "Médio"
    },
    {
      nome: "Lapa",
      lat: -23.523,
      lng: -46.705,
      cor: "#eab308",
      risco: "Baixo"
    },
    {
      nome: "Moema",
      lat: -23.602,
      lng: -46.666,
      cor: "#eab308",
      risco: "Baixo"
    },
    {
      nome: "Vila Mariana",
      lat: -23.587,
      lng: -46.635,
      cor: "#f97316",
      risco: "Médio"
    }
  ];

  const ecoRegionData = {
    Alto: {
      tipo: "Calor extremo",
      descricao:
        "Temperaturas elevadas podem representar riscos à saúde. Consulte as orientações preventivas."
    },
    Médio: {
      tipo: "Atenção ambiental",
      descricao:
        "A região apresenta condições que merecem atenção. Acompanhe os avisos preventivos."
    },
    Baixo: {
      tipo: "Monitoramento preventivo",
      descricao:
        "A região apresenta risco demonstrativo baixo. Continue acompanhando as condições ambientais."
    }
  };

  function initializeEcoMap() {
    if (ecoMap) {
      ecoMap.invalidateSize();
      return;
    }

    if (typeof L === "undefined") {
      console.error(
        "ECOGUARD: biblioteca Leaflet não carregada."
      );
      return;
    }

    if (!byId("ecoRiskMap")) {
      console.error(
        "ECOGUARD: elemento do mapa não encontrado."
      );
      return;
    }

    ecoMap = L.map("ecoRiskMap", {
      zoomControl: false
    }).setView([-23.5505, -46.6333], 11);

    L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19
      }
    ).addTo(ecoMap);

    L.control.zoom({
      position: "bottomright"
    }).addTo(ecoMap);

    ecoRegions.forEach((region) => {
      const marker = L.circleMarker(
        [region.lat, region.lng],
        {
          radius: 14,
          color: "#ffffff",
          weight: 2,
          fillColor: region.cor,
          fillOpacity: 0.9
        }
      ).addTo(ecoMap);

      marker.bindTooltip(region.nome);

      marker.on("click", () => {
        showEcoRegion(region);
      });
    });

    setTimeout(() => {
      ecoMap?.invalidateSize();
    }, 150);
  }

  /* CARTÃO DE DETALHES DO MAPA */

  const ecoRegionCard = byId("mapRegionCard");
  const ecoRegionClose = byId("mapRegionClose");
  const ecoRegionDetails = byId("mapRegionDetails");

  function showEcoRegion(region) {
    const data = ecoRegionData[region.risco];

    if (!data || !ecoRegionCard) return;

    const name = byId("mapRegionName");
    const risk = byId("mapRegionRisk");
    const type = byId("mapRegionType");
    const description = byId("mapRegionDescription");

    if (name) {
      name.textContent = `${region.nome}, São Paulo`;
    }

    if (risk) {
      risk.textContent =
        `Risco ${region.risco.toLowerCase()}`;

      const riskClass =
        region.risco === "Médio"
          ? "medio"
          : region.risco.toLowerCase();

      risk.className = `map-region-risk ${riskClass}`;
    }

    if (type) {
      type.textContent = data.tipo;
    }

    if (description) {
      description.textContent = data.descricao;
    }

    if (ecoRegionDetails) {
      ecoRegionDetails.hidden =
        region.risco !== "Alto";
    }

    ecoRegionCard.hidden = false;

    setTimeout(() => {
      if (currentScreen === "map") {
        ecoRegionCard.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }
    }, 100);
  }

  ecoRegionClose?.addEventListener("click", () => {
    if (ecoRegionCard) {
      ecoRegionCard.hidden = true;
    }
  });

  ecoRegionDetails?.addEventListener("click", () => {
    openAlertDetail("map");
  });

  byId("mapHeatAlert")?.addEventListener("click", () => {
    openAlertDetail("map");
  });

  byId("mapBack")?.addEventListener("click", () => {
    showScreen("dashboard");
  });

  /* ========================================
     TELA 8 - PERFIL
  ======================================== */

  byId("profileBack")?.addEventListener("click", () => {
    showScreen("dashboard");
  });

  function showProfileMessage(message) {
    window.alert(message);
  }

  byId("profileEdit")?.addEventListener("click", () => {
    showProfileMessage(
      "A edição dos dados pessoais estará disponível em uma próxima versão do ECOGUARD."
    );
  });

  byId("profileSettings")?.addEventListener("click", () => {
    showProfileMessage(
      "As configurações avançadas estarão disponíveis em uma próxima versão."
    );
  });

  byId("profileLocation")?.addEventListener("click", () => {
    showScreen("map");
  });

  byId("profileNotifications")?.addEventListener(
    "click",
    () => {
      showScreen("permissions");
    }
  );

  byId("profilePrivacy")?.addEventListener("click", () => {
    showProfileMessage(
      "O ECOGUARD utiliza preferências locais neste protótipo. Nenhuma conta de usuário ou banco de dados pessoal está conectado."
    );
  });

  byId("profileHelp")?.addEventListener("click", () => {
    showProfileMessage(
      "ECOGUARD: inteligência climática para o seu bem-estar. Este aplicativo é um protótipo acadêmico."
    );
  });

  /* ACESSIBILIDADE - TECLADO */

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      currentScreen === "detail"
    ) {
      const destination = [
        "dashboard",
        "alerts",
        "map"
      ].includes(previousDetailScreen)
        ? previousDetailScreen
        : "alerts";

      showScreen(destination);
    }

    if (
      event.key === "Escape" &&
      currentScreen === "lock"
    ) {
      clearTimeout(ecoNotificationTimer);
      showScreen("dashboard");
    }
  });

  /* INICIALIZAÇÃO */

  showScreen("welcome");

  console.log(
    "ECOGUARD iniciado! Todas as oito telas foram conectadas."
  );
});

/* ECOGUARD - REGISTRO DO PWA */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => {
        console.log("ECOGUARD PWA registrado!");
      })
      .catch((error) => {
        console.error(
          "Erro ao registrar Service Worker:",
          error
        );
      });
  });
}
