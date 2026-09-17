/**
 * BE'CAUSE — ATELIER WEB INDÉPENDANT
 * Logique Interactive & Simulateur de Devis Transparent
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     01. NAVIGATION FLUIDE & MENU MOBILE
     -------------------------------------------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const headerWrapper = document.getElementById('mainHeader');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .pill-navbar .btn');

  if (menuToggle && headerWrapper) {
    menuToggle.addEventListener('click', () => {
      headerWrapper.classList.toggle('menu-open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        headerWrapper.classList.remove('menu-open');
      });
    });
  }

  // Masquage intelligent ou ombrage au défilement
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const navbar = document.querySelector('.pill-navbar');
    if (navbar) {
      if (currentScroll > 60) {
        navbar.style.boxShadow = '0 16px 40px -10px rgba(20, 33, 61, 0.12)';
        navbar.style.backgroundColor = 'rgba(250, 249, 246, 0.94)';
      } else {
        navbar.style.boxShadow = '0 12px 36px -8px rgba(20, 33, 61, 0.08)';
        navbar.style.backgroundColor = 'rgba(250, 249, 246, 0.88)';
      }
    }
    lastScroll = currentScroll;
  });

  /* --------------------------------------------------------------------------
     02. SIMULATEUR DE PROJET INTERACTIF (TRANSPARENCE DEVIS)
     -------------------------------------------------------------------------- */
  const typeButtons = document.querySelectorAll('#projectTypeOptions .option-pill');
  const modSeo = document.getElementById('modSeo');
  const modDevis = document.getElementById('modDevis');
  const modPhoto = document.getElementById('modPhoto');
  const maintButtons = document.querySelectorAll('#maintenanceOptions .option-pill');

  const totalAmountEl = document.getElementById('totalAmount');
  const estimatedWeeksEl = document.getElementById('estimatedWeeks');
  const maintSummaryEl = document.getElementById('maintSummary');
  const reminderAmountEl = document.getElementById('reminderAmount');
  const clientMessageEl = document.getElementById('clientMessage');

  let state = {
    basePrice: 1800,
    baseWeeks: '3 à 4 semaines',
    typeLabel: 'Site Vitrine Essentiel',
    seo: true,
    devis: true,
    photo: false,
    maintPrice: 0,
    maintLabel: 'Autonomie totale (0 €/mois)'
  };

  const updateSimulation = () => {
    let total = state.basePrice;
    if (state.seo) total += 350;
    if (state.devis) total += 400;
    if (state.photo) total += 450;

    const formattedPrice = total.toLocaleString('fr-FR') + ' €';
    if (totalAmountEl) {
      totalAmountEl.textContent = formattedPrice;
    }
    if (reminderAmountEl) {
      reminderAmountEl.textContent = formattedPrice + (state.maintPrice > 0 ? ` (+ ${state.maintPrice} €/mois)` : '');
    }
    if (estimatedWeeksEl) {
      estimatedWeeksEl.textContent = state.baseWeeks;
    }
    if (maintSummaryEl) {
      maintSummaryEl.innerHTML = `Maintenance : <strong>${state.maintLabel}</strong>`;
    }
  };

  // Événements Type de Projet
  typeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      typeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      state.basePrice = parseInt(btn.getAttribute('data-base-price'), 10);
      const weeks = btn.getAttribute('data-weeks');
      state.baseWeeks = `${weeks} à ${parseInt(weeks) + 1} semaines`;
      state.typeLabel = btn.querySelector('.option-title').textContent;

      updateSimulation();
    });
  });

  // Événements Modules
  [modSeo, modDevis, modPhoto].forEach((checkbox) => {
    if (checkbox) {
      checkbox.addEventListener('change', () => {
        state.seo = modSeo.checked;
        state.devis = modDevis.checked;
        state.photo = modPhoto.checked;
        updateSimulation();
      });
    }
  });

  // Événements Maintenance
  maintButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      maintButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      state.maintPrice = parseInt(btn.getAttribute('data-maint-price'), 10);
      state.maintLabel = btn.getAttribute('data-maint-label');
      updateSimulation();
    });
  });

  // Bouton "Bloquer cette estimation et échanger"
  const btnApply = document.getElementById('btnApplyEstimation');
  if (btnApply) {
    btnApply.addEventListener('click', () => {
      const summaryText = `Bonjour l'équipe Be'Cause,\n\nJe souhaite échanger sur mon projet :\n- Formule : ${state.typeLabel}\n- Options : ${state.seo ? 'SEO Local, ' : ''}${state.devis ? 'Formulaire de devis sur-mesure, ' : ''}${state.photo ? 'Reportage photo chantier, ' : ''}\n- Suivi : ${state.maintLabel}\n- Estimation calculée : ${totalAmountEl.textContent} HT\n\nVoici quelques précisions sur notre activité : `;
      
      if (clientMessageEl) {
        clientMessageEl.value = summaryText;
      }
    });
  }

  updateSimulation();

  /* --------------------------------------------------------------------------
     03. FILTRES DES CHANTIERS
     -------------------------------------------------------------------------- */
  const filterPills = document.querySelectorAll('#projectFilters .filter-pill');
  const projectRows = document.querySelectorAll('.work-feature-row');

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const filterValue = pill.getAttribute('data-filter');

      projectRows.forEach((row) => {
        const cat = row.getAttribute('data-category');
        if (filterValue === 'all' || cat === filterValue) {
          row.style.display = 'grid';
          setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
          }, 20);
        } else {
          row.style.opacity = '0';
          row.style.transform = 'translateY(20px)';
          setTimeout(() => {
            row.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     04. MODAL ÉTUDE DE CAS DÉTAILLÉE
     -------------------------------------------------------------------------- */
  const caseData = {
    dubois: {
      title: "Atelier Dubois & Agencement",
      location: "Béthune (62) • Menuiserie Contemporaine & Ébénisterie",
      image: "./assets/project-wood.jpg",
      problem: "Julien possédait un site non responsive réalisé par un proche en 2016, invisible sur Google. Démarché par une régie lui demandant 180 €/mois sur 48 mois, il cherchait un artisan du web local, transparent et digne de confiance.",
      solution: "Création d'un écrin minimaliste mettant en valeur les veinages du chêne massif et les réalisations d'escaliers contemporains. Optimisation SEO locale ciblée sur 'menuisier Béthune' et 'agencement sur-mesure Artois'.",
      metrics: [
        { val: "+340%", label: "Demandes de devis qualifiées en 3 mois" },
        { val: "99/100", label: "Score Google Lighthouse Mobile" },
        { val: "0 €", label: "Frais d'abonnement captif" }
      ],
      tech: "Architecture HTML5/CSS Vanilla, Hébergement éco-conçu OVH Gravelines, Micro-animations fluides."
    },
    brasseur: {
      title: "Maison Brasseur des Flandres",
      location: "Bailleul & Métropole Lilloise • Brasserie Artisanale",
      image: "./assets/project-brewery.jpg",
      problem: "Nécessité de professionnaliser la vente directe et de faciliter la réservation des visites de dégustation sans s'encombrer d'un logiciel payant chaque mois.",
      solution: "Site vitrine chaleureux inspiré des matières nobles (cuivre, bois patiné, verre ambré). Module de géolocalisation des cavistes distributeurs et système de réservation synchronisé.",
      metrics: [
        { val: "1 200+", label: "Réservations de dégustation" },
        { val: "0.6s", label: "Temps d'affichage moyen" },
        { val: "100%", label: "Autonomie de l'équipe brasserie" }
      ],
      tech: "Design System sur-mesure, API OpenStreetMap, Formulaire de réservation autonome."
    },
    vanhove: {
      title: "Studio Vanhove Architectes Associés",
      location: "Lille (59) • Réhabilitation & Architecture Contemporaine",
      image: "./assets/project-architecture.jpg",
      problem: "Un collectif d'architectes réputé disposant d'un portfolio dispersé et peu valorisé sur grand écran, nécessitant une esthétique sans compromis à la hauteur de leurs chantiers.",
      solution: "Mise en scène monumentale et aérée, typographie architecturale tendue, immersion photographique plein cadre et respect absolu des matières.",
      metrics: [
        { val: "Grand Prix", label: "Sélection Design Nord 2026" },
        { val: "100%", label: "Accessibilité & fluidité multi-écrans" },
        { val: "3 semaines", label: "Délai de livraison total" }
      ],
      tech: "Typographie Outfit, Transitions CSS fluides, Compression d'images WebP haute fidélité."
    }
  };

  const caseModal = document.getElementById('caseModal');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');

  const openCaseModal = (projectId) => {
    const data = caseData[projectId];
    if (!data || !caseModal || !modalContent) return;

    modalContent.innerHTML = `
      <div style="margin-bottom: 2rem;">
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em;">${data.location}</span>
        <h2 style="font-family: var(--font-display); font-size: 2.25rem; font-weight: 800; color: var(--primary); margin-top: 0.5rem;">${data.title}</h2>
      </div>
      
      <div style="border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 2rem; max-height: 380px;">
        <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
        <div>
          <h4 style="font-size: 0.9rem; font-weight: 700; text-transform: uppercase; color: var(--primary); margin-bottom: 0.5rem;">Le Défi Initial</h4>
          <p style="font-size: 0.95rem; color: var(--on-surface-variant); line-height: 1.6;">${data.problem}</p>
        </div>
        <div>
          <h4 style="font-size: 0.9rem; font-weight: 700; text-transform: uppercase; color: var(--primary); margin-bottom: 0.5rem;">La Solution Be'Cause</h4>
          <p style="font-size: 0.95rem; color: var(--on-surface-variant); line-height: 1.6;">${data.solution}</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; padding: 1.5rem; background-color: var(--surface-bright); border-radius: var(--radius-lg); border: 1px solid var(--outline-light); margin-bottom: 2rem;">
        ${data.metrics.map(m => `
          <div>
            <div style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; color: var(--accent);">${m.val}</div>
            <div style="font-size: 0.78rem; color: var(--on-surface-variant);">${m.label}</div>
          </div>
        `).join('')}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--outline-light); padding-top: 1.5rem;">
        <span style="font-size: 0.85rem; color: var(--on-surface-variant);"><strong>Socle technique :</strong> ${data.tech}</span>
        <a href="#simulateur" class="btn btn-pill btn-accent btn-sm" onclick="document.getElementById('caseModal').classList.remove('active')">
          <span>Estimer un projet similaire</span>
        </a>
      </div>
    `;

    caseModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeCaseModal = () => {
    if (caseModal) {
      caseModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  document.querySelectorAll('.work-image-card').forEach((card) => {
    card.addEventListener('click', () => {
      const pid = card.getAttribute('data-project-id');
      if (pid) openCaseModal(pid);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeCaseModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeCaseModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCaseModal();
  });

  /* --------------------------------------------------------------------------
     05. ENVOI DU FORMULAIRE DE CONTACT
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const clientName = document.getElementById('clientName').value;
      const clientCompany = document.getElementById('clientCompany').value;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Envoi en cours...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Demande transmise avec succès !</span>`;
        submitBtn.style.backgroundColor = '#10B981';

        if (formFeedback) {
          formFeedback.className = 'form-feedback success';
          formFeedback.innerHTML = `
            <strong>Merci ${clientName} (${clientCompany}) !</strong><br>
            Votre demande et votre estimation de ${totalAmountEl.textContent} HT ont bien été reçues par l'équipe de Lens.<br>
            Matéo ou Nathanaël vous recontactera sous 24h pour convenir d'un échange à votre convenance.
          `;
        }

        contactForm.reset();
      }, 700);
    });
  }

});
