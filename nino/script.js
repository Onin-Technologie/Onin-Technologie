// ============================================================
//  Nino Beluze — Portfolio interactions
// ============================================================

// Always land at the top on refresh (disable browser scroll restoration),
// unless the URL targets a specific section via #anchor.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
if (!window.location.hash) {
  window.scrollTo(0, 0);
}

// Current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Sticky nav: add border/background once scrolled
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 12);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile menu toggle
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

const setMenu = (open) => {
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  const t = translations[currentLang];
  burger.setAttribute('aria-label', open ? t['nav.aria.closeMenu'] : t['nav.aria.openMenu']);
  mobileMenu.hidden = !open;
};

burger.addEventListener('click', () => setMenu(mobileMenu.hidden));
mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

// Trust marquee: if a logo image is missing, fall back to the brand name as text
document.querySelectorAll('.trust__logo img').forEach((img) => {
  const toText = () => {
    const span = document.createElement('span');
    span.className = 'trust__fallback';
    span.textContent = img.dataset.name || img.alt || '';
    if (img.closest('.trust__logo').getAttribute('aria-hidden') === 'true') {
      span.setAttribute('aria-hidden', 'true');
    }
    img.replaceWith(span);
  };
  img.addEventListener('error', toText);
  if (img.complete && img.naturalWidth === 0) toText();
});

// Modals (native <dialog>): open via [data-modal], close via [data-close], backdrop click & ESC
document.querySelectorAll('[data-modal]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const dlg = document.getElementById(btn.dataset.modal);
    if (dlg && typeof dlg.showModal === 'function') {
      dlg.showModal();
      document.body.style.overflow = 'hidden';
    }
  });
});
document.querySelectorAll('dialog.modal').forEach((dlg) => {
  const close = () => dlg.close();
  dlg.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', close));
  // Click on the backdrop (outside the card) closes
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  dlg.addEventListener('close', () => { document.body.style.overflow = ''; });
});

// Modal 3D gallery: show a placeholder when a photo is missing
document.querySelectorAll('.modal__shot img').forEach((img) => {
  const toPlaceholder = () => {
    const ph = document.createElement('div');
    ph.className = 'modal__shot-ph';
    ph.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>' +
      '<span>' + (img.dataset.ph || 'Photo à venir') + '</span>';
    img.replaceWith(ph);
  };
  img.addEventListener('error', toPlaceholder);
  if (img.complete && img.naturalWidth === 0) toPlaceholder();
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReduced || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  revealEls.forEach((el) => io.observe(el));
}

// ============================================================
//  Internationalisation — FR / EN
// ============================================================

const translations = {
  fr: {
    'skip.link': 'Aller au contenu',
    'nav.parcours': 'Parcours',
    'nav.skills': 'Compétences',
    'nav.cta': 'Me contacter',
    'nav.aria.home': 'Accueil',
    'nav.aria.mainNav': 'Navigation principale',
    'nav.aria.openMenu': 'Ouvrir le menu',
    'nav.aria.closeMenu': 'Fermer le menu',

    'hero.eyebrow': 'Disponible pour missions freelance',
    'hero.trust.label': "Ils m'ont fait confiance",
    'hero.trust.ariaLabel': "Ils m'ont fait confiance",
    'hero.lead': "Je conçois des applications, des outils métier et des solutions d'automatisation sur mesure, du back-office qui fait gagner des heures à l'app mobile et à l'embarqué piloté par logiciel. Polyvalent sur plusieurs langages (Python, JavaScript, TypeScript, C++, C#, SQL), je choisis la techno adaptée à chaque projet. Passé par STMicroelectronics, EDF et la robotique de compétition.",
    'hero.btn.start': 'Démarrer un projet',
    'hero.btn.journey': 'Voir mon parcours',
    'hero.stat.location': 'Localisation',

    // innerHTML keys
    'hero.title': 'Développeur <span class="accent" style="white-space:nowrap">full-stack</span><br />du logiciel au <span class="accent">matériel</span>',
    'services.sub': "Une double compétence rare : je code le logiciel <em>et</em> je maîtrise le matériel qui l'exécute.",
    'contact.title': 'Un projet en tête ?<br />Parlons-en.',

    'services.title': 'Ce que je peux construire pour vous',
    'services.card1.title': 'Développement Python',
    'services.card1.text': "Applications, scripts d'automatisation et back-office sur mesure. Du besoin métier au logiciel fiable, testé et maintenable.",
    'services.card1.tag.automation': 'Automatisation',
    'services.card2.title': 'Applications mobiles iOS & Android',
    'services.card2.text': 'Applications cross-platform en React Native, déployées sur iOS et Android depuis une seule base de code. Front mobile, API back-end et base de données — un système complet, du prototype au store.',
    'services.card2.tag.db': 'Back-end & BDD',
    'services.card3.title': 'Outils métier & digitalisation',
    'services.card3.text': "Interfaces internes, tableaux de bord et digitalisation de modes opératoires — comme pour EDF. Je transforme un process manuel en outil logiciel.",
    'services.card4.title': 'Data & traitement',
    'services.card4.text': 'Collecte, nettoyage et exploitation de données. Scripts de traitement, automatisation de rapports et fiabilisation des chaînes de données.',
    'services.card5.title': 'Systèmes embarqués & IoT',
    'services.card5.text': 'Firmware et IHM sur ESP32 / M5Stack, protocoles de communication (OneWire). La compétence logicielle qui sait aussi parler au matériel.',
    'services.card5.tag.hmi': 'IHM',

    'journey.tag': '// Parcours',
    'journey.title': 'Une expérience terrain, pas que théorique',
    'journey.sub': 'Grands groupes industriels, robotique de compétition internationale et projets concrets.',

    'tl1.date': 'Depuis jan. 2026',
    'tl1.tag.status': 'En cours',
    'tl1.tag.inst': 'CPE Lyon · Bénévolat',
    'tl1.role': 'Projet bénévole — Interface IA embarquée',
    'tl1.desc': "Conception d'une interface d'intelligence artificielle combinant des écrans multilatéraux, une caméra 360° et deux Asus GX10 (NPU dédiés au calcul IA) pour du traitement et de la vision par ordinateur en local (edge AI). Conception et modélisation 3D du dispositif.",
    'tl1.more': 'Voir plus',

    'tl2.date': 'Déc. 2025 – Jan. 2026',
    'tl2.tag': 'CPE Lyon · Encadrement',
    'tl2.role': "Encadrant technique — Projet de fin d'année robotique",
    'tl2.org': "CPE Lyon — Étudiants ingénieurs 5ᵉ année",
    'tl2.desc': "Accompagnement d'une classe d'élèves ingénieurs en 5ᵉ année, sur le prototypage de leur projet de fin d'année en robotique : support au développement ROS, IA, web et Python, à l'impression 3D et à la mécatronique.",

    'tl3.date': 'Depuis 2025',
    'tl3.tag': 'Bénévolat',
    'tl3.role': 'Bénévole en FabLab',
    'tl3.desc': "Membre bénévole d'un FabLab : développement du site web de l'association, accompagnement de la communauté maker, prototypage et partage de savoir-faire en électronique et impression 3D.",
    'tl3.link': 'Site web',

    'tl4.date': 'Depuis 2025',
    'tl4.role': 'Développeur freelance — full-stack',
    'tl4.desc': 'Prestations full-stack, du logiciel au matériel : développement Python, applications, électronique et solutions sur mesure.',

    'tl5.tag': 'CDD · Grenoble',
    'tl5.role': 'Technicien de validation fonctionnelle',
    'tl5.org': 'Elsys Design — pour STMicroelectronics',
    'tl5.desc': "Développement d'une application web de gestion du parc informatique des bancs de test en laboratoire. Validation fonctionnelle de composants au sein d'un leader mondial du semi-conducteur.",

    'tl6.tag': 'CDI · Lyon & Grenoble',
    'tl6.role': 'Technicien d\'étude — Data & développement',
    'tl6.org': 'LGM — pour EDF',
    'tl6.desc': "Développement d'une application de création et de gestion des modes opératoires de maintenance. Développement Python et digitalisation des process pour un acteur majeur de l'énergie.",

    'tl7.role': 'Développeur robotique & mécatronique — Équipe Lyontech',
    'tl7.org': 'CPE Lyon — RoboCup 2024, ligue @Home',
    'tl7.desc': "Robot d'assistance à domicile engagé en compétition internationale de robotique : développement de briques logicielles robotiques sous ROS, intégration, modélisation et fabrication 3D.",
    'tl7.more': 'Voir plus',

    'tl8.tag': 'Projet BTS',
    'tl8.role': "Reprogrammateur d'EEPROM",
    'tl8.org': 'Partenariat ADLC pour TCL',
    'tl8.desc': "Création d'IHM et d'un protocole de communication via OneWire sur M5Stack (base ESP32). Gestion de projet en groupe.",

    'tl9.role': 'Stagiaire robotique — Équipe Lyontech',
    'tl9.org': 'CPE Lyon — RoboCup 2023, ligue @Home',
    'tl9.desc': "Travail sur un robot destiné à la recherche en aide à domicile : développement robotique et IA sous ROS (Robot Operating System), mécanique et électronique.",
    'tl9.more': 'Voir plus',

    'tl10.date': 'Depuis 2020',
    'tl10.tag': 'Entrepreneuriat',
    'tl10.role': 'Réparateur smartphone & ordinateur — Indépendant',
    'tl10.org': 'Activité entrepreneuriale',
    'tl10.desc': "Réparation de smartphones et d'ordinateurs en indépendant : diagnostic, remplacement de composants et dépannage pour particuliers.",

    'skills.tag': '// Compétences',
    'skills.title': 'Boîte à outils',
    'skills.group1.label': 'Développement',
    'skills.chip.databases': 'Bases de données',
    'skills.chip.ai': 'Intelligence artificielle',
    'skills.chip.cv': 'Vision par ordinateur',
    'skills.group2.label': 'Systèmes & réseaux',
    'skills.chip.networks': 'Réseaux (Cisco CCNAv7)',
    'skills.chip.virtualization': 'Virtualisation',
    'skills.chip.it': 'Dépannage informatique',
    'skills.group3.label': 'Électronique & matériel',
    'skills.chip.microcontrollers': 'Microcontrôleurs',
    'skills.chip.sensors': 'Capteurs & IHM',
    'skills.chip.modeling3d': 'Modélisation & impression 3D',
    'skills.chip.electronics.repair': 'Réparation électronique',
    'skills.chip.smartphone.repair': 'Réparation smartphone',

    'edu.title': 'Formation',
    'edu1.deg': 'BTS Systèmes Numériques — Informatique & Réseaux',
    'edu1.school': 'Lycée Édouard Branly, Lyon · Certification Cisco CCNAv7',
    'edu2.school': "Lycée Carnot, Roanne · Systèmes d'Information & Numériques",
    'edu3.date': 'Langues',
    'edu3.deg': 'Français — natif · Anglais — B2',
    'edu3.school': 'À l\'aise en environnement technique international',

    'contact.sub': "Disponible pour des missions freelance en développement logiciel Python, automatisation et outils métier. Écrivez-moi sur LinkedIn, je réponds vite.",
    'contact.btn': 'Me contacter sur LinkedIn',

    'modal.close': 'Fermer la fenêtre',
    'modal.ia.tag': 'En cours · Depuis jan. 2026 · CPE Lyon',
    'modal.ia.title': 'Interface IA embarquée à LLM local',
    'modal.ia.org': 'Projet bénévole — IA & développement',
    'modal.ia.sub1': 'Ce que je développe',
    'modal.ia.sub2': 'Stack technique',
    'modal.ia.sub3': 'Photos du projet',
    'modal.ia.chip.cv': 'Vision par ordinateur',
    'modal.ia.chip.3d': 'Modélisation 3D',

    'modal.rc24.tag': '2024 · Eindhoven (Pays-Bas) · Équipe Lyontech',
    'modal.rc24.title': 'RoboCup 2024 — Robotique d\'assistance @Home',
    'modal.rc24.org': 'CPE Lyon — Équipe Lyontech',
    'modal.rc24.sub1': 'Mon rôle',
    'modal.rc24.sub2': 'Compétences mobilisées',
    'modal.rc24.sub3': 'Photos de la compétition',
    'modal.rc24.chip.3d': 'Modélisation 3D',
    'modal.rc24.chip.cv': 'Vision par ordinateur',

    'modal.rc23.tag': '2023 · Bordeaux · Équipe Lyontech',
    'modal.rc23.title': 'RoboCup 2023 — Robotique d\'assistance @Home',
    'modal.rc23.org': 'CPE Lyon — Équipe Lyontech',
    'modal.rc23.sub1': 'Mon rôle',
    'modal.rc23.sub2': 'Compétences mobilisées',
    'modal.rc23.sub3': 'Photos de la compétition',
    'modal.rc23.chip.ai': 'Intelligence artificielle',
    'modal.rc23.chip.mech': 'Mécanique',
    'modal.rc23.chip.elec': 'Électronique',

    'footer.role': 'Développeur freelance',
    'footer.note': 'Conçu & codé sur mesure',

    // innerHTML keys
    'modal.ia.body': "Un dispositif d'intelligence artificielle qui fonctionne <strong>entièrement en local</strong>, sans cloud : les <strong>LLM (modèles de langage)</strong> tournent directement sur <strong>deux Asus GX10</strong> équipés chacun d'un NPU dédié au calcul IA. L'interface combine des <strong>écrans multilatéraux</strong> et une <strong>caméra 360°</strong> pour une interaction immersive et une compréhension de l'environnement en temps réel — le tout sans qu'aucune donnée ne quitte l'appareil.",
    'modal.ia.li1': 'Intégration et optimisation de <strong>LLM en local</strong> (inférence on-device sur NPU).',
    'modal.ia.li2': 'Pipeline de <strong>vision par ordinateur</strong> exploitant la caméra 360°.',
    'modal.ia.li3': '<strong>Interface utilisateur</strong> répartie sur les écrans multilatéraux.',
    'modal.ia.li4': 'Conception et <strong>modélisation 3D</strong> du boîtier du dispositif.',

    'modal.rc24.body': "La <strong>RoboCup</strong> est la plus grande compétition internationale de robotique. Dans la ligue <strong>@Home</strong>, des robots <strong>autonomes</strong> doivent assister une personne dans un environnement domestique : se déplacer, percevoir leur environnement, comprendre des consignes et manipuler des objets. J'ai représenté l'équipe <strong>Lyontech</strong> (CPE Lyon) à l'édition <strong>2024 à Eindhoven</strong>, aux Pays-Bas.",
    'modal.rc24.li1': 'Développement de <strong>briques logicielles robotiques</strong> sous ROS (Robot Operating System).',
    'modal.rc24.li2': '<strong>Intégration</strong> logicielle et matérielle du robot.',
    'modal.rc24.li3': 'Conception <strong>mécatronique</strong> du système.',
    'modal.rc24.li4': '<strong>Modélisation et fabrication 3D</strong> de pièces fonctionnelles.',
    'modal.rc24.li5': 'Travail en équipe dans un contexte <strong>international</strong>.',

    'modal.rc23.body': "Première expérience en compétition de robotique : un stage au sein de l'équipe <strong>Lyontech</strong> (CPE Lyon) pour la <strong>RoboCup 2023 à Bordeaux</strong>, dans la ligue <strong>@Home</strong>. L'objectif : faire évoluer un robot <strong>autonome</strong> destiné à la recherche en aide à domicile, capable de se déplacer et d'interagir dans un environnement réel.",
    'modal.rc23.li1': 'Développement <strong>robotique et IA</strong> sous ROS (Robot Operating System).',
    'modal.rc23.li2': "Travaux de <strong>mécanique</strong> et d'<strong>électronique</strong> sur le robot.",
    'modal.rc23.li3': 'Mise au point et tests en conditions réelles.',
    'modal.rc23.li4': 'Contribution à un projet de <strong>recherche en aide à domicile</strong>.',
  },

  en: {
    'skip.link': 'Skip to content',
    'nav.parcours': 'Journey',
    'nav.skills': 'Skills',
    'nav.cta': 'Contact me',
    'nav.aria.home': 'Home',
    'nav.aria.mainNav': 'Main navigation',
    'nav.aria.openMenu': 'Open menu',
    'nav.aria.closeMenu': 'Close menu',

    'hero.eyebrow': 'Available for freelance projects',
    'hero.trust.label': 'They trusted me',
    'hero.trust.ariaLabel': 'They trusted me',
    'hero.lead': 'I design custom applications, business tools and automation solutions — from back-office software that saves hours to mobile apps and software-driven embedded systems. Proficient in multiple languages (Python, JavaScript, TypeScript, C++, C#, SQL), I choose the right technology for each project. Previously at STMicroelectronics, EDF and competitive robotics.',
    'hero.btn.start': 'Start a project',
    'hero.btn.journey': 'See my journey',
    'hero.stat.location': 'Location',

    // innerHTML keys
    'hero.title': '<span class="accent" style="white-space:nowrap">Full-stack</span><br />developer from software to <span class="accent">hardware</span>',
    'services.sub': 'A rare dual skill set: I code the software <em>and</em> master the hardware that runs it.',
    'contact.title': 'Have a project in mind?<br />Let\'s talk.',

    'services.title': 'What I can build for you',
    'services.card1.title': 'Python Development',
    'services.card1.text': 'Custom applications, automation scripts and back-office software. From business need to reliable, tested and maintainable code.',
    'services.card1.tag.automation': 'Automation',
    'services.card2.title': 'iOS & Android Mobile Apps',
    'services.card2.text': 'Cross-platform apps in React Native, deployed on iOS and Android from a single codebase. Mobile front-end, back-end API and database — a complete system, from prototype to store.',
    'services.card2.tag.db': 'Back-end & DB',
    'services.card3.title': 'Business Tools & Digitalization',
    'services.card3.text': 'Internal interfaces, dashboards and process digitalization — as done for EDF. I turn manual processes into software tools.',
    'services.card4.title': 'Data & Processing',
    'services.card4.text': 'Data collection, cleaning and exploitation. Processing scripts, report automation and data pipeline reliability.',
    'services.card5.title': 'Embedded Systems & IoT',
    'services.card5.text': 'Firmware and HMI on ESP32 / M5Stack, communication protocols (OneWire). Software expertise that also speaks hardware.',
    'services.card5.tag.hmi': 'HMI',

    'journey.tag': '// Journey',
    'journey.title': 'Real-world experience, not just theory',
    'journey.sub': 'Major industrial groups, international competition robotics and concrete projects.',

    'tl1.date': 'Since Jan. 2026',
    'tl1.tag.status': 'Ongoing',
    'tl1.tag.inst': 'CPE Lyon · Volunteer',
    'tl1.role': 'Volunteer Project — Embedded AI Interface',
    'tl1.desc': 'Design of an artificial intelligence interface combining multilateral screens, a 360° camera and two Asus GX10 units (NPUs dedicated to AI computing) for local processing and computer vision (edge AI). Design and 3D modeling of the device.',
    'tl1.more': 'See more',

    'tl2.date': 'Dec. 2025 – Jan. 2026',
    'tl2.tag': 'CPE Lyon · Mentoring',
    'tl2.role': 'Technical Mentor — Year-end Robotics Project',
    'tl2.org': 'CPE Lyon — 5th-year Engineering Students',
    'tl2.desc': 'Mentoring a class of 5th-year engineering students on their year-end robotics project prototyping: support for ROS, AI, web and Python development, 3D printing and mechatronics.',

    'tl3.date': 'Since 2025',
    'tl3.tag': 'Volunteer',
    'tl3.role': 'FabLab Volunteer',
    'tl3.desc': "Volunteer member of a FabLab: development of the association's website, supporting the maker community, prototyping and sharing expertise in electronics and 3D printing.",
    'tl3.link': 'Website',

    'tl4.date': 'Since 2025',
    'tl4.role': 'Freelance Developer — Full-stack',
    'tl4.desc': 'Full-stack services, from software to hardware: Python development, applications, electronics and custom solutions.',

    'tl5.tag': 'Fixed-term · Grenoble',
    'tl5.role': 'Functional Validation Technician',
    'tl5.org': 'Elsys Design — for STMicroelectronics',
    'tl5.desc': 'Development of a web application to manage the IT infrastructure of laboratory test benches. Functional validation of components within a world leader in semiconductors.',

    'tl6.tag': 'Permanent · Lyon & Grenoble',
    'tl6.role': 'Study Technician — Data & Development',
    'tl6.org': 'LGM — for EDF',
    'tl6.desc': 'Development of an application for creating and managing maintenance operating procedures. Python development and process digitalization for a major energy player.',

    'tl7.role': 'Robotics & Mechatronics Developer — Team Lyontech',
    'tl7.org': 'CPE Lyon — RoboCup 2024, @Home league',
    'tl7.desc': 'Home assistance robot entered in an international robotics competition: development of robotic software modules under ROS, integration, 3D modeling and manufacturing.',
    'tl7.more': 'See more',

    'tl8.tag': 'Technical School Project',
    'tl8.role': 'EEPROM Reprogrammer',
    'tl8.org': 'ADLC partnership for TCL',
    'tl8.desc': 'Creation of HMI and a OneWire communication protocol on M5Stack (ESP32 base). Group project management.',

    'tl9.role': 'Robotics Intern — Team Lyontech',
    'tl9.org': 'CPE Lyon — RoboCup 2023, @Home league',
    'tl9.desc': 'Work on a robot for home assistance research: robotic and AI development under ROS (Robot Operating System), mechanics and electronics.',
    'tl9.more': 'See more',

    'tl10.date': 'Since 2020',
    'tl10.tag': 'Entrepreneurship',
    'tl10.role': 'Smartphone & Computer Repair — Independent',
    'tl10.org': 'Entrepreneurial activity',
    'tl10.desc': 'Independent repair of smartphones and computers: diagnosis, component replacement and troubleshooting for individuals.',

    'skills.tag': '// Skills',
    'skills.title': 'Toolkit',
    'skills.group1.label': 'Development',
    'skills.chip.databases': 'Databases',
    'skills.chip.ai': 'Artificial Intelligence',
    'skills.chip.cv': 'Computer Vision',
    'skills.group2.label': 'Systems & Networks',
    'skills.chip.networks': 'Networking (Cisco CCNAv7)',
    'skills.chip.virtualization': 'Virtualization',
    'skills.chip.it': 'IT Troubleshooting',
    'skills.group3.label': 'Electronics & Hardware',
    'skills.chip.microcontrollers': 'Microcontrollers',
    'skills.chip.sensors': 'Sensors & HMI',
    'skills.chip.modeling3d': '3D Modeling & Printing',
    'skills.chip.electronics.repair': 'Electronics Repair',
    'skills.chip.smartphone.repair': 'Smartphone Repair',

    'edu.title': 'Education',
    'edu1.deg': 'BTS Digital Systems — Computer Science & Networks',
    'edu1.school': 'Édouard Branly High School, Lyon · Cisco CCNAv7 Certification',
    'edu2.school': 'Carnot High School, Roanne · Information & Digital Systems',
    'edu3.date': 'Languages',
    'edu3.deg': 'French — native · English — B2',
    'edu3.school': 'Comfortable in international technical environments',

    'contact.sub': 'Available for freelance missions in Python software development, automation and business tools. Message me on LinkedIn, I reply quickly.',
    'contact.btn': 'Contact me on LinkedIn',

    'modal.close': 'Close window',
    'modal.ia.tag': 'Ongoing · Since Jan. 2026 · CPE Lyon',
    'modal.ia.title': 'Embedded AI Interface with Local LLM',
    'modal.ia.org': 'Volunteer Project — AI & Development',
    'modal.ia.sub1': "What I'm developing",
    'modal.ia.sub2': 'Technical Stack',
    'modal.ia.sub3': 'Project Photos',
    'modal.ia.chip.cv': 'Computer Vision',
    'modal.ia.chip.3d': '3D Modeling',

    'modal.rc24.tag': '2024 · Eindhoven (Netherlands) · Team Lyontech',
    'modal.rc24.title': 'RoboCup 2024 — @Home Assistance Robotics',
    'modal.rc24.org': 'CPE Lyon — Team Lyontech',
    'modal.rc24.sub1': 'My role',
    'modal.rc24.sub2': 'Skills used',
    'modal.rc24.sub3': 'Competition photos',
    'modal.rc24.chip.3d': '3D Modeling',
    'modal.rc24.chip.cv': 'Computer Vision',

    'modal.rc23.tag': '2023 · Bordeaux · Team Lyontech',
    'modal.rc23.title': 'RoboCup 2023 — @Home Assistance Robotics',
    'modal.rc23.org': 'CPE Lyon — Team Lyontech',
    'modal.rc23.sub1': 'My role',
    'modal.rc23.sub2': 'Skills used',
    'modal.rc23.sub3': 'Competition photos',
    'modal.rc23.chip.ai': 'Artificial Intelligence',
    'modal.rc23.chip.mech': 'Mechanics',
    'modal.rc23.chip.elec': 'Electronics',

    'footer.role': 'Freelance Developer',
    'footer.note': 'Designed & coded from scratch',

    // innerHTML keys
    'modal.ia.body': 'An artificial intelligence device that runs <strong>entirely locally</strong>, without cloud: <strong>LLMs (language models)</strong> run directly on <strong>two Asus GX10</strong> units, each with a dedicated AI NPU. The interface combines <strong>multilateral screens</strong> and a <strong>360° camera</strong> for immersive interaction and real-time environment understanding — all without any data leaving the device.',
    'modal.ia.li1': 'Integration and optimization of <strong>local LLMs</strong> (on-device inference on NPU).',
    'modal.ia.li2': '<strong>Computer vision</strong> pipeline leveraging the 360° camera.',
    'modal.ia.li3': '<strong>User interface</strong> distributed across the multilateral screens.',
    'modal.ia.li4': 'Design and <strong>3D modeling</strong> of the device enclosure.',

    'modal.rc24.body': 'The <strong>RoboCup</strong> is the largest international robotics competition. In the <strong>@Home</strong> league, <strong>autonomous</strong> robots must assist a person in a domestic environment: navigate, perceive their surroundings, understand instructions and manipulate objects. I represented team <strong>Lyontech</strong> (CPE Lyon) at the <strong>2024 edition in Eindhoven</strong>, Netherlands.',
    'modal.rc24.li1': 'Development of <strong>robotic software modules</strong> under ROS (Robot Operating System).',
    'modal.rc24.li2': 'Software and hardware <strong>integration</strong> of the robot.',
    'modal.rc24.li3': '<strong>Mechatronic</strong> design of the system.',
    'modal.rc24.li4': '<strong>3D modeling and manufacturing</strong> of functional parts.',
    'modal.rc24.li5': 'Teamwork in an <strong>international</strong> context.',

    'modal.rc23.body': 'First robotics competition experience: an internship within team <strong>Lyontech</strong> (CPE Lyon) for the <strong>RoboCup 2023 in Bordeaux</strong>, in the <strong>@Home</strong> league. The goal: to advance an <strong>autonomous</strong> robot designed for home assistance research, capable of navigating and interacting in a real environment.',
    'modal.rc23.li1': '<strong>Robotics and AI</strong> development under ROS (Robot Operating System).',
    'modal.rc23.li2': '<strong>Mechanical</strong> and <strong>electronics</strong> work on the robot.',
    'modal.rc23.li3': 'Fine-tuning and testing in real conditions.',
    'modal.rc23.li4': 'Contribution to a <strong>home assistance research</strong> project.',
  },

  pt: {
    'skip.link': 'Ir para o conteúdo',
    'nav.parcours': 'Percurso',
    'nav.skills': 'Competências',
    'nav.cta': 'Contactar',
    'nav.aria.home': 'Início',
    'nav.aria.mainNav': 'Navegação principal',
    'nav.aria.openMenu': 'Abrir menu',
    'nav.aria.closeMenu': 'Fechar menu',

    'hero.eyebrow': 'Disponível para missões freelance',
    'hero.trust.label': 'Eles confiaram em mim',
    'hero.trust.ariaLabel': 'Eles confiaram em mim',
    'hero.lead': 'Crio aplicações personalizadas, ferramentas de negócio e soluções de automação — desde software back-office que poupa horas até aplicações móveis e sistemas embebidos controlados por software. Proficiente em várias linguagens (Python, JavaScript, TypeScript, C++, C#, SQL), escolho a tecnologia certa para cada projeto. Experiência prévia na STMicroelectronics, EDF e robótica de competição.',
    'hero.btn.start': 'Iniciar um projeto',
    'hero.btn.journey': 'Ver o meu percurso',
    'hero.stat.location': 'Localização',

    // innerHTML keys
    'hero.title': 'Desenvolvedor <span class="accent" style="white-space:nowrap">full-stack</span><br />do software ao <span class="accent">hardware</span>',
    'services.sub': 'Um duplo domínio raro: escrevo o software <em>e</em> domino o hardware que o executa.',
    'contact.title': 'Tem um projeto em mente?<br />Vamos falar.',

    'services.title': 'O que posso construir para si',
    'services.card1.title': 'Desenvolvimento Python',
    'services.card1.text': 'Aplicações, scripts de automação e back-office personalizados. Da necessidade de negócio ao software fiável, testado e mantível.',
    'services.card1.tag.automation': 'Automação',
    'services.card2.title': 'Apps móveis iOS & Android',
    'services.card2.text': 'Aplicações cross-platform em React Native, publicadas em iOS e Android a partir de uma única base de código. Front-end móvel, API back-end e base de dados — um sistema completo, do protótipo à loja.',
    'services.card2.tag.db': 'Back-end & BD',
    'services.card3.title': 'Ferramentas de negócio & Digitalização',
    'services.card3.text': 'Interfaces internas, painéis de controlo e digitalização de processos operacionais — como feito para a EDF. Transformo processos manuais em ferramentas de software.',
    'services.card4.title': 'Dados & Processamento',
    'services.card4.text': 'Recolha, limpeza e exploração de dados. Scripts de processamento, automatização de relatórios e fiabilização de pipelines de dados.',
    'services.card5.title': 'Sistemas Embebidos & IoT',
    'services.card5.text': 'Firmware e IHM em ESP32 / M5Stack, protocolos de comunicação (OneWire). Competência em software que também fala hardware.',
    'services.card5.tag.hmi': 'IHM',

    'journey.tag': '// Percurso',
    'journey.title': 'Experiência real, não apenas teórica',
    'journey.sub': 'Grandes grupos industriais, robótica de competição internacional e projetos concretos.',

    'tl1.date': 'Desde jan. 2026',
    'tl1.tag.status': 'Em curso',
    'tl1.tag.inst': 'CPE Lyon · Voluntariado',
    'tl1.role': 'Projeto voluntário — Interface IA Embebida',
    'tl1.desc': 'Conceção de uma interface de inteligência artificial combinando ecrãs multilaterais, uma câmara 360° e dois Asus GX10 (NPUs dedicados ao cálculo IA) para processamento local e visão por computador (edge AI). Conceção e modelação 3D do dispositivo.',
    'tl1.more': 'Ver mais',

    'tl2.date': 'Dez. 2025 – Jan. 2026',
    'tl2.tag': 'CPE Lyon · Mentoria',
    'tl2.role': 'Mentor Técnico — Projeto de fim de ano de Robótica',
    'tl2.org': 'CPE Lyon — Estudantes de Engenharia do 5.º ano',
    'tl2.desc': 'Acompanhamento de uma turma de estudantes de engenharia do 5.º ano no protótipo do projeto de fim de ano em robótica: suporte ao desenvolvimento ROS, IA, web e Python, impressão 3D e mecatrónica.',

    'tl3.date': 'Desde 2025',
    'tl3.tag': 'Voluntariado',
    'tl3.role': 'Voluntário em FabLab',
    'tl3.desc': 'Membro voluntário de um FabLab: desenvolvimento do site da associação, apoio à comunidade maker, prototipagem e partilha de conhecimentos em eletrónica e impressão 3D.',
    'tl3.link': 'Site web',

    'tl4.date': 'Desde 2025',
    'tl4.role': 'Desenvolvedor freelance — Full-stack',
    'tl4.desc': 'Serviços full-stack, do software ao hardware: desenvolvimento Python, aplicações, eletrónica e soluções personalizadas.',

    'tl5.tag': 'CDD · Grenoble',
    'tl5.role': 'Técnico de Validação Funcional',
    'tl5.org': 'Elsys Design — para STMicroelectronics',
    'tl5.desc': 'Desenvolvimento de uma aplicação web de gestão do parque informático das bancadas de teste em laboratório. Validação funcional de componentes num líder mundial em semicondutores.',

    'tl6.tag': 'CDI · Lyon & Grenoble',
    'tl6.role': 'Técnico de Estudo — Dados & Desenvolvimento',
    'tl6.org': 'LGM — para EDF',
    'tl6.desc': 'Desenvolvimento de uma aplicação de criação e gestão de modos operatórios de manutenção. Desenvolvimento Python e digitalização de processos para um grande ator do setor energético.',

    'tl7.role': 'Desenvolvedor de Robótica & Mecatrónica — Equipa Lyontech',
    'tl7.org': 'CPE Lyon — RoboCup 2024, liga @Home',
    'tl7.desc': 'Robô de assistência domiciliária em competição internacional de robótica: desenvolvimento de módulos de software robótico em ROS, integração, modelação e fabricação 3D.',
    'tl7.more': 'Ver mais',

    'tl8.tag': 'Projeto BTS',
    'tl8.role': 'Reprogramador de EEPROM',
    'tl8.org': 'Parceria ADLC para TCL',
    'tl8.desc': 'Criação de IHM e de um protocolo de comunicação via OneWire em M5Stack (base ESP32). Gestão de projeto em grupo.',

    'tl9.role': 'Estagiário em Robótica — Equipa Lyontech',
    'tl9.org': 'CPE Lyon — RoboCup 2023, liga @Home',
    'tl9.desc': 'Trabalho num robô para investigação em assistência domiciliária: desenvolvimento robótico e IA em ROS (Robot Operating System), mecânica e eletrónica.',
    'tl9.more': 'Ver mais',

    'tl10.date': 'Desde 2020',
    'tl10.tag': 'Empreendedorismo',
    'tl10.role': 'Reparador de Smartphone & Computador — Independente',
    'tl10.org': 'Atividade empreendedora',
    'tl10.desc': 'Reparação independente de smartphones e computadores: diagnóstico, substituição de componentes e assistência técnica a particulares.',

    'skills.tag': '// Competências',
    'skills.title': 'Caixa de ferramentas',
    'skills.group1.label': 'Desenvolvimento',
    'skills.chip.databases': 'Bases de dados',
    'skills.chip.ai': 'Inteligência artificial',
    'skills.chip.cv': 'Visão por computador',
    'skills.group2.label': 'Sistemas & Redes',
    'skills.chip.networks': 'Redes (Cisco CCNAv7)',
    'skills.chip.virtualization': 'Virtualização',
    'skills.chip.it': 'Suporte informático',
    'skills.group3.label': 'Eletrónica & Hardware',
    'skills.chip.microcontrollers': 'Microcontroladores',
    'skills.chip.sensors': 'Sensores & IHM',
    'skills.chip.modeling3d': 'Modelação & impressão 3D',
    'skills.chip.electronics.repair': 'Reparação eletrónica',
    'skills.chip.smartphone.repair': 'Reparação de smartphone',

    'edu.title': 'Formação',
    'edu1.deg': 'BTS Sistemas Digitais — Informática & Redes',
    'edu1.school': 'Lycée Édouard Branly, Lyon · Certificação Cisco CCNAv7',
    'edu2.school': 'Lycée Carnot, Roanne · Sistemas de Informação & Digitais',
    'edu3.date': 'Línguas',
    'edu3.deg': 'Francês — nativo · Inglês — B2',
    'edu3.school': 'À vontade em ambientes técnicos internacionais',

    'contact.sub': 'Disponível para missões freelance em desenvolvimento de software Python, automação e ferramentas de negócio. Envie-me uma mensagem no LinkedIn, respondo rapidamente.',
    'contact.btn': 'Contactar no LinkedIn',

    'modal.close': 'Fechar janela',
    'modal.ia.tag': 'Em curso · Desde jan. 2026 · CPE Lyon',
    'modal.ia.title': 'Interface IA Embebida com LLM Local',
    'modal.ia.org': 'Projeto voluntário — IA & desenvolvimento',
    'modal.ia.sub1': 'O que estou a desenvolver',
    'modal.ia.sub2': 'Stack técnica',
    'modal.ia.sub3': 'Fotos do projeto',
    'modal.ia.chip.cv': 'Visão por computador',
    'modal.ia.chip.3d': 'Modelação 3D',

    'modal.rc24.tag': '2024 · Eindhoven (Países Baixos) · Equipa Lyontech',
    'modal.rc24.title': 'RoboCup 2024 — Robótica de Assistência @Home',
    'modal.rc24.org': 'CPE Lyon — Equipa Lyontech',
    'modal.rc24.sub1': 'O meu papel',
    'modal.rc24.sub2': 'Competências utilizadas',
    'modal.rc24.sub3': 'Fotos da competição',
    'modal.rc24.chip.3d': 'Modelação 3D',
    'modal.rc24.chip.cv': 'Visão por computador',

    'modal.rc23.tag': '2023 · Bordeaux · Equipa Lyontech',
    'modal.rc23.title': 'RoboCup 2023 — Robótica de Assistência @Home',
    'modal.rc23.org': 'CPE Lyon — Equipa Lyontech',
    'modal.rc23.sub1': 'O meu papel',
    'modal.rc23.sub2': 'Competências utilizadas',
    'modal.rc23.sub3': 'Fotos da competição',
    'modal.rc23.chip.ai': 'Inteligência artificial',
    'modal.rc23.chip.mech': 'Mecânica',
    'modal.rc23.chip.elec': 'Eletrónica',

    'footer.role': 'Desenvolvedor freelance',
    'footer.note': 'Concebido & codificado à medida',

    // innerHTML keys
    'modal.ia.body': 'Um dispositivo de inteligência artificial que funciona <strong>inteiramente em local</strong>, sem cloud: os <strong>LLMs (modelos de linguagem)</strong> correm diretamente em <strong>dois Asus GX10</strong>, cada um com um NPU dedicado ao cálculo IA. A interface combina <strong>ecrãs multilaterais</strong> e uma <strong>câmara 360°</strong> para interação imersiva e compreensão do ambiente em tempo real — tudo sem que nenhum dado saia do dispositivo.',
    'modal.ia.li1': 'Integração e otimização de <strong>LLMs em local</strong> (inferência on-device em NPU).',
    'modal.ia.li2': 'Pipeline de <strong>visão por computador</strong> que utiliza a câmara 360°.',
    'modal.ia.li3': '<strong>Interface de utilizador</strong> distribuída pelos ecrãs multilaterais.',
    'modal.ia.li4': 'Conceção e <strong>modelação 3D</strong> do enclosure do dispositivo.',

    'modal.rc24.body': 'A <strong>RoboCup</strong> é a maior competição internacional de robótica. Na liga <strong>@Home</strong>, robôs <strong>autónomos</strong> devem assistir uma pessoa num ambiente doméstico: navegar, perceber a envolvente, compreender instruções e manipular objetos. Representei a equipa <strong>Lyontech</strong> (CPE Lyon) na edição <strong>2024 em Eindhoven</strong>, nos Países Baixos.',
    'modal.rc24.li1': 'Desenvolvimento de <strong>módulos de software robótico</strong> em ROS (Robot Operating System).',
    'modal.rc24.li2': '<strong>Integração</strong> de software e hardware do robô.',
    'modal.rc24.li3': 'Conceção <strong>mecatrónica</strong> do sistema.',
    'modal.rc24.li4': '<strong>Modelação e fabricação 3D</strong> de peças funcionais.',
    'modal.rc24.li5': 'Trabalho em equipa num contexto <strong>internacional</strong>.',

    'modal.rc23.body': 'Primeira experiência em competição de robótica: um estágio na equipa <strong>Lyontech</strong> (CPE Lyon) para a <strong>RoboCup 2023 em Bordeaux</strong>, na liga <strong>@Home</strong>. O objetivo: fazer evoluir um robô <strong>autónomo</strong> destinado à investigação em assistência domiciliária, capaz de navegar e interagir num ambiente real.',
    'modal.rc23.li1': 'Desenvolvimento <strong>robótico e IA</strong> em ROS (Robot Operating System).',
    'modal.rc23.li2': 'Trabalhos de <strong>mecânica</strong> e <strong>eletrónica</strong> no robô.',
    'modal.rc23.li3': 'Afinação e testes em condições reais.',
    'modal.rc23.li4': 'Contribuição para um projeto de <strong>investigação em assistência domiciliária</strong>.',
  },
};

// Keys that use innerHTML (contain HTML markup)
const HTML_KEYS = new Set([
  'hero.title', 'services.sub', 'contact.title',
  'modal.ia.body', 'modal.ia.li1', 'modal.ia.li2', 'modal.ia.li3', 'modal.ia.li4',
  'modal.rc24.body', 'modal.rc24.li1', 'modal.rc24.li2', 'modal.rc24.li3', 'modal.rc24.li4', 'modal.rc24.li5',
  'modal.rc23.body', 'modal.rc23.li1', 'modal.rc23.li2', 'modal.rc23.li3', 'modal.rc23.li4',
]);

const LANG_TITLES = {
  fr: 'Nino Beluze — Développeur logiciel Python freelance',
  en: 'Nino Beluze — Freelance Python Software Developer',
  pt: 'Nino Beluze — Desenvolvedor de software Python freelance',
};

function detectLang() {
  const saved = localStorage.getItem('lang');
  if (saved && translations[saved]) return saved;
  const preferred = Array.from(navigator.languages || [navigator.language || 'fr']);
  for (const l of preferred) {
    const code = l.split('-')[0].toLowerCase();
    if (translations[code]) return code;
  }
  return 'fr';
}

let currentLang = detectLang();

function applyLang(lang) {
  const t = translations[lang];

  // textContent replacements
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) {
      if (HTML_KEYS.has(key)) {
        el.innerHTML = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });

  // innerHTML replacements
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  // aria-label replacements
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.dataset.i18nAria;
    if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
  });

  // html[lang] attribute
  document.documentElement.lang = lang;

  // page title
  document.title = LANG_TITLES[lang];

  // highlight active language button
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.lang === lang);
    btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
  });

  // keep burger aria-label in sync
  const menuIsOpen = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-label', menuIsOpen ? t['nav.aria.closeMenu'] : t['nav.aria.openMenu']);

  localStorage.setItem('lang', lang);
  currentLang = lang;
}

document.querySelectorAll('.lang-btn').forEach((btn) => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

// Initialize with detected or saved language
applyLang(currentLang);
