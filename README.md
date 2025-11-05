# 📊 Application de Gestion de Pointage et Planning

Application web mono-fichier pour la gestion complète des pointages, affaires, et planification d'équipe avec alertes en temps réel, calendrier interactif et graphiques dynamiques.

## 🎯 Périmètre Fonctionnel

### Fonctionnalités Principales
- ⚠️ **Alertes urgentes en temps réel** : Notifications visuelles pour tâches urgentes et retards
- 📅 **Calendrier interactif** : Agenda filtrable, planning Gantt avec zoom et échelles multiples
- 📊 **Graphiques dynamiques** : Barres de progression, synthèse budget/réalisé, statistiques globales
- 📱 **Design responsive** : Interface adaptative mobile/tablette/desktop
- 💾 **Persistance locale** : Sauvegarde automatique dans le navigateur (localStorage)
- 📤 **Exports professionnels** : Excel (.xlsx), PDF (jsPDF), JSON
- 🔍 **Recherche globale** : Filtres multi-critères avec vues sauvegardées
- 🏷️ **Étiquettes visuelles** : À risque (≤7j), En retard, Bloqué
- 📌 **Vue Kanban** : Drag & drop pour gestion visuelle des tâches
- 🌙 **Mode sombre** : Thème clair/sombre avec persistance
- 📏 **Densité compacte** : Affichage optimisé pour grands tableaux
- ⏱️ **Pointage avancé** : Heures supplémentaires, pauses, absences avec justificatifs
- 🔒 **Validation pointages** : Workflow brouillon → validé → verrouillé
- 🔄 **Auto-remplissage** : Répétition semaine précédente (ignore week-ends et jours fériés)
- 📈 **Suivi budget** : Rapprochement budget/réalisé avec alertes dépassement
- 🔗 **Dépendances tâches** : FS/SS/FF avec détection cycles et recalcul auto
- 🎯 **Chemin critique** : Algorithme CPM pour identifier tâches critiques
- 📊 **Baseline & Courbe S** : Comparaison planifié vs réalisé (Earned Value)

### Règles Métier et Validations

**Validation des données** :
- ✅ Champs requis obligatoires (N° affaire, client, dates, agent, budget)
- ✅ Formats de dates ISO (YYYY-MM-DD)
- ✅ Cohérence des dates (début < fin)
- ✅ Budget heures > 0
- ✅ Agent doit exister dans la base
- ✅ **Unicité N° affaire + année** (format : AFF-YYYY-XXX)
- ✅ Avancement calculé automatiquement (non saisi)

**Calcul d'avancement** :
```
Avancement sous-tâche = (heures réalisées / heures prévues) × 100
Avancement affaire = Σ(avancement_sousTâche × poids) / Σ(poids)
où poids = heures prévues
```

**Configuration métier** :
- ⚙️ **Heures configurables** : J (jour complet), D (demi-journée), A (absent)
- 🇲🇦 **Jours fériés Maroc** : Configuration personnalisable
- 🌙 **Mode Ramadan** : Horaires réduits automatiques pendant Ramadan
  - Heures/jour ajustables (par défaut 6h)
  - Période Ramadan configurable (dates début/fin)
  - Calcul automatique des pointages selon le contexte

**Exemples de jours fériés Maroc** :
- Jour de l'An (1er janvier)
- Fête du Travail (1er mai)
- Fête du Trône (30 juillet)
- Aïd al-Fitr, Aïd al-Adha (dates variables)
- Anniversaire du Roi (21 août)
- Marche Verte (6 novembre)
- Jour de l'Indépendance (18 novembre)

**Pointage avancé** :
- ⏰ **Heures supplémentaires** : Champ dédié (0-12h par incréments de 0.5h)
- ☕ **Pauses** : Saisie en minutes (0-120min par tranches de 15min)
- 📊 **Heures nettes** : Calcul automatique = heures + sup - pause
- 🏥 **Absences justifiées** : Types (congé, maladie, formation, autre) + motif libre
- 🔒 **Workflow validation** :
  - **Brouillon** : Modifiable et supprimable
  - **Validé** : Verrouillable, déverrouillable
  - **Verrouillé** : Immuable définitivement
- 🔄 **Auto-remplissage** : Fonction "Répéter semaine précédente"
  - Copie automatique des pointages de la semaine N-1 vers N
  - Ignore automatiquement les week-ends (samedi/dimanche)
  - Ignore automatiquement les jours fériés configurés
  - Prévient les doublons (ne copie pas si pointage existe déjà)

**Suivi Budget & Alertes** :
- 📊 **Dashboard dédié** : Onglet "Suivi Budget" avec filtres affaire/agent
- 📈 **Indicateurs visuels** :
  - Cartes statistiques (budget total, réalisé, taux global, alertes)
  - Tableau détaillé avec barres de progression
  - Codes couleur : ✅ Vert (<50%), ℹ️ Bleu (50-80%), ⚠️ Jaune (≥80%), 🚨 Rouge (≥100%)
- 🚨 **Alertes temps réel** :
  - Warning lors de l'enregistrement d'un pointage si consommation ≥80%
  - Confirmation obligatoire si dépassement budget (≥100%)
  - Seuil d'alerte configurable dans le dashboard

**Dépendances de tâches** :
- 🔗 **4 types de relations** :
  - **FS** (Finish-to-Start) : Tâche B commence quand A finit
  - **SS** (Start-to-Start) : B commence quand A commence
  - **FF** (Finish-to-Finish) : B finit quand A finit
  - **SF** (Start-to-Finish) : B finit quand A commence (rare)
- 🔄 **Détection cycles** : Algorithme DFS empêche dépendances circulaires
- ⚡ **Recalcul auto** : Dates recalculées automatiquement via tri topologique
- 🎯 **Chemin critique** : Algorithme CPM (Critical Path Method)
  - Identifie les tâches sans marge de manœuvre
  - Visualisation : bordure rouge épaisse + indicateur 🔴
  - Toggle pour activer/désactiver l'affichage

**Baseline & Earned Value** :
- 📸 **Snapshot baseline** : Sauvegarde état planifié à un instant T
- 📊 **Courbe S** : Graphique SVG comparant planifié vs réalisé
  - Ligne bleue pointillée : Avancement planifié (baseline)
  - Ligne verte continue : Avancement réalisé (pointages)
  - Échantillonnage 20 points sur toute la période
- 📉 **Analyse écarts** : Visualisation des dérives de planning

### Modules Intégrés
1. **Gestion des Affaires** : Création, suivi, 10 types de sous-tâches, 4 niveaux de priorité
2. **Pointage** : Saisie heures avec sup/pauses/absences, validation workflow, historique détaillé
3. **Pointage Journalier** : Grille simplifiée J/D/A, auto-remplissage intelligent, export PDF
4. **Pointage Mensuel** : Calendrier 31 jours, export Excel multi-feuilles
5. **Planning Gantt** : Visualisation chronologique, dépendances, chemin critique, baseline, filtres, zoom 50-200%
6. **Suivi Budget** : Rapprochement budget/réalisé par affaire/agent, alertes dépassement (>80%)
7. **Rapports** : Placeholders pour rapports mensuels/annuels (en développement)
8. **Paramètres** : Gestion agents, configuration métier, import/export données, statistiques

## 🚀 Démarrage Rapide

### Installation

**Téléchargement** :
```bash
# Méthode 1 : Télécharger directement
# Récupérer le fichier app.html depuis le dépôt
```

**Structure des fichiers** :
```
Pointages/
├── app.html          # Application principale (fichier unique)
├── README.md         # Ce fichier
└── EXPORTS.md        # Guide des exports
```

### Mise en Route

1. **Ouvrir l'application** :
   - Double-cliquer sur `app.html`
   - OU : Clic droit → "Ouvrir avec" → Navigateur web
   - OU : Glisser-déposer `app.html` dans un onglet du navigateur

2. **URL locale** :
   ```
   file:///C:/Users/[utilisateur]/Desktop/Pointages/app.html
   ```

3. **Premier lancement** :
   - ✅ Des données de démonstration sont chargées automatiquement
   - ✅ 3 agents préenregistrés (Jean Dupont, Marie Martin, Pierre Durand)
   - ✅ 4 affaires exemples avec différents statuts
   - ✅ Quelques pointages de test

4. **Commencer à utiliser** :
   - Navigation via les 7 onglets en haut
   - Horloge en temps réel affichée dans l'en-tête
   - Bouton "📅 Agenda" pour voir les tâches actives

### Configuration Requise

**Navigateur** (un de ces navigateurs modernes) :
- ✅ Google Chrome 90+ (recommandé)
- ✅ Mozilla Firefox 88+
- ✅ Microsoft Edge 90+
- ✅ Safari 14+

**Connexion Internet** :
- ⚠️ **Requise au premier chargement** pour télécharger les bibliothèques CDN :
  - jsPDF 2.5.1 (génération PDF)
  - SheetJS 0.18.5 (export Excel)
- ✅ **Hors ligne ensuite** : L'application fonctionne sans Internet après le premier chargement

**Espace disque** :
- 📦 Fichier app.html : ~150 KB
- 💾 localStorage : ~5-10 MB (données utilisateur)

### Pas de Serveur Requis

❌ **Pas besoin de** :
- Installation Node.js
- Serveur web (Apache, Nginx, etc.)
- Base de données
- Compilation ou build

✅ **Simple fichier HTML** :
- Tout est contenu dans `app.html`
- Fonctionne directement dans le navigateur
- Aucune dépendance locale à installer

### Démonstration Rapide

**Tester les fonctionnalités clés** :

1. **⚠️ Voir les alertes urgentes** :
   - Créer une nouvelle affaire (onglet "Affaires")
   - Sélectionner priorité "Urgente"
   - Observer l'animation pulse rouge en temps réel

2. **📅 Calendrier interactif** :
   - Cliquer sur "📅 Agenda" dans l'en-tête
   - Filtrer par date pour voir les tâches du jour
   - Observer l'agenda filtré dynamiquement

3. **📊 Graphiques dynamiques** :
   - Aller sur "Planning" (Gantt)
   - Utiliser le zoom (50% à 200%)
   - Changer l'échelle (jours/semaines/mois)
   - Observer les barres colorées selon avancement

4. **📱 Test responsive** :
   - Redimensionner la fenêtre du navigateur
   - Observer l'adaptation automatique de l'interface
   - Tester sur mobile/tablette

5. **🔍 Recherche et filtres** :
   - Utiliser la barre de recherche globale (sous l'en-tête)
   - Tester les filtres par statut, priorité, dates
   - Sauvegarder une vue personnalisée

6. **📌 Vue Kanban** :
   - Basculer en vue Kanban (bouton dans Affaires)
   - Glisser-déposer une carte entre colonnes
   - Observer le changement de statut automatique

7. **🌙 Thèmes et densité** :
   - Activer le mode sombre (bouton dans l'en-tête)
   - Tester la densité compacte pour les grands tableaux

8. **⚙️ Configuration métier** :
   - Aller dans Paramètres
   - Configurer les heures J/D/A
   - Ajouter des jours fériés
   - Activer le mode Ramadan

5. **📗 Export Excel** :
   - Aller sur "Pointage Mensuel"
   - Cliquer "📗 Export Excel (.xlsx)"
   - Ouvrir le fichier généré → plusieurs feuilles par agent

## ✨ Fonctionnalités Principales

### 📅 Onglet Affaires

**Gestion des Affaires et Sous-tâches**
- ➕ Création d'affaires avec 10 types de sous-tâches :
  - Expression de besoin
  - Préparation dossier
  - Achat matière
  - Châssis transport
  - Liste de colisage
  - Mise en camion
  - Schéma
  - Épreuve hydraulique
  - Étude
  - Fabrication

**Fonctionnalités**
- 🎯 Système de priorités (4 niveaux : basse, normale, haute, **urgente avec animation pulse**)
- 📊 Tableau détaillé avec 14 colonnes (N° affaire, client, désignation, agent, dates, budget, réalisé, avancement, statut...)
- ⚠️ **Colonne "Retards" latérale** : Affichage en temps réel des tâches en retard avec nombre de jours
- 📈 **Barres de progression visuelles** : Couleurs dynamiques selon avancement (vert/jaune/orange/rouge)
- 🔄 Calcul automatique de l'avancement (Budget vs Réalisé)
- ✏️ Édition et suppression d'affaires
- 🔴 **Alerte visuelle urgente** : Animation pulse pour priorité "urgente"

**Vue par Affaire**
- 📋 Cartes expandables avec résumé de l'affaire
- 📅 **Timeline colorée interactive** selon l'urgence
- 🔍 Détails des sous-tâches avec filtrage
- 📊 **Graphiques de progression** intégrés

### ⏱️ Onglet Pointage

**Enregistrement détaillé des heures**
- ⏰ **Saisie précise HH:MM** : Format heures:minutes (ex: `07:30`, `08:15`)
  - Auto-complétion intelligente : `7` → `07:00`, `7.5` → `07:30`
  - Validation temps réel avec affichage équivalent décimal
  - Code couleur : vert (valide), rouge (invalide)
- 🔘 **Raccourcis rapides** : Absent (0h), Demi-j. (4h), Journée (8h), Ramadan (6h)
- ➕ **Heures supplémentaires** : Saisie 0-12h par paliers 0.5h
- ☕ **Pauses** : Saisie 0-120min par paliers 15min
- ❌ **Types d'absence** : Congé payé, Maladie, Formation, Autre
- 📝 **Motif/Justificatif** : Champ libre pour commentaires
- 🔄 **Workflow de validation** :
  - 📝 Brouillon (éditable, supprimable)
  - ✓ Validé (verrouillable, non supprimable)
  - 🔒 Verrouillé (immuable définitivement)
- � **Historique enrichi** : 10 colonnes avec heures précises, sup, pauses, net, statut
- 📊 **Calcul automatique** : Heures nettes = Base + Sup - Pause
- ⚠️ **Alertes budget** : Warning à 80%, confirmation obligatoire à 100%
- � Synthèse par agent et par affaire

### 📅 Onglet Pointage Journalier

**Grille simplifiée J/D/A**
- 📅 Sélection Agent + Mois
- 🟢 **J** = Journée (8h)
- 🟡 **D** = Demi-journée (4h)
- 🔴 **A** = Absent (0h)
- 📊 Calcul automatique des totaux
- ✏️ Édition rapide par clic
- 📕 **Export PDF avec jsPDF** :
  - Calendrier visuel avec couleurs (J/D/A)
  - Totaux par catégorie et heures totales
  - Légende complète
  - Format professionnel
  - Nom de fichier : `Pointage_[Agent]_[Mois]_[Année].pdf`

### 📊 Onglet Pointage Mensuel

**Grille détaillée mensuelle**
- 📅 Vue calendaire complète (31 jours)
- 👥 Filtrage par agent et affaire
- 🔢 Saisie des heures jour par jour
- 📈 Synthèse Budget vs Réalisé avec cartes de statut
- 📗 **Export Excel (.xlsx) avec SheetJS** :
  - **Une feuille par agent** avec ses affaires
  - Grille mensuelle complète (1-31)
  - Totaux par ligne et par jour
  - **Feuille de synthèse globale** : tous les agents avec statistiques
  - Largeurs de colonnes optimisées
  - Nom de fichier : `Pointage_[Mois]_[Année].xlsx`
- 📕 **Export PDF** (fenêtre d'impression)

### 📅 Onglet Planning

**Diagramme de Gantt Interactif**
- 🔍 Zoom : 50% à 200%
- ⏱️ Échelles temporelles : Jours / Semaines / Mois
- 🎨 Barres colorées selon l'avancement :
  - 🟢 Vert (0-50%)
  - 🟡 Jaune (50-80%)
  - 🟠 Orange (80-100%)
  - 🔴 Rouge (>100%)
  - ⚫ Gris (Terminé)
- 🔎 Filtres : Priorité + Statut
- 🔄 Rafraîchissement manuel
- 📕 **Export PDF avec jsPDF** :
  - Format paysage (A4)
  - Tableau détaillé avec toutes les tâches filtrées
  - Barres de progression colorées
  - Légende des couleurs
  - Informations de filtrage appliqués
  - Nom de fichier : `Gantt_Planning_YYYY-MM-DD.pdf`

### 📑 Onglet Rapports

**Génération de rapports** (Placeholders)
- 📊 Rapport Mensuel Global
- 👤 Rapport par Agent
- 🏢 Rapport par Affaire
- 📆 Rapport Annuel
- 📤 Options d'export : PDF, Excel, Email, Impression

*Note : Fonctionnalités à venir avec alertes informatives*

### ⚙️ Onglet Paramètres

#### 👥 Gestion des Agents

**Modal de Création/Édition**
- ➕ Ajouter un agent (Nom, Fonction, Email)
- ✏️ Modifier un agent existant
- 🔍 Validation anti-doublons
- ⚠️ Confirmation avant suppression
- 📊 Affichage des statistiques par agent (nb affaires, heures)

**Contrôles Avancés**
- ❌ Prévention des doublons de noms
- ⚠️ Avertissement avant suppression si agent a des affaires/pointages
- 🔄 Mise à jour automatique de tous les sélecteurs
- 📈 Rafraîchissement du Gantt après modifications

#### 💾 Gestion des Données

**Exports intégrés**
- 📥 **Export JSON** : Sauvegarde complète (agents, sous-tâches, pointages)
- 📗 **Export Excel (.xlsx) avec SheetJS** :
  - **4 feuilles Excel** : Agents, Affaires, Pointages, Synthèse
  - Agents : ID, Nom, Fonction, Email, Nb Affaires, Heures Réalisées
  - Affaires : 12 colonnes avec tous les détails (ID, N° Affaire, Client, etc.)
  - Pointages : Historique complet avec dates, agents, affaires, heures
  - Synthèse : Statistiques globales (totaux, en cours, terminées, budget, réalisé)
  - Largeurs de colonnes optimisées pour lisibilité
  - Nom de fichier : `Donnees-Completes_YYYY-MM-DD.xlsx`
- 📤 **Import JSON** : Restauration complète des données
- 🗑️ **Réinitialisation** : Double confirmation + rechargement données démo

#### 📊 Statistiques Globales

**4 cartes visuelles avec gradients dynamiques**
- 👥 **Agents** : Nombre total avec dégradé violet
- 🏢 **Affaires** : Total, en cours, terminées avec dégradé rose
- ⏱️ **Heures** : Réalisées vs budget avec dégradé bleu
- 📊 **Taux** : Réalisation % avec couleur dynamique (vert/jaune/rouge)

## 🎨 Interface Utilisateur

### Alertes en Temps Réel
- 🔴 **Priorité urgente** : Animation pulse continue sur les tâches urgentes
- ⚠️ **Retards** : Colonne dédiée avec nombre de jours de retard
- 🔔 **Notifications visuelles** : Slide-in/slide-out pour actions importantes
- ⏱️ **Horloge en direct** : Mise à jour chaque seconde dans l'en-tête

### Calendrier Interactif
- 📅 **Agenda filtrable** : Modal avec filtrage par date des tâches actives
- 📊 **Grille mensuelle** : Calendrier 31 jours cliquable pour saisie heures
- 📅 **Grille journalière** : Vue J/D/A avec édition rapide par clic
- 🗓️ **Timeline visuelle** : Affichage chronologique des affaires avec couleurs urgence

### Graphiques Dynamiques
- 📊 **Barres de progression** : Couleur changeante selon % (0-50% vert, 50-80% jaune, 80-100% orange, >100% rouge)
- 📈 **Gantt interactif** : Barres temporelles avec zoom, filtres, échelles multiples
- 💹 **Synthèse écarts** : Cartes de statut budget vs réalisé (En avance/Dans les temps/Léger dépassement/Dépassement)
- 🎯 **Statistiques en temps réel** : Calculs automatiques et mise à jour instantanée

### Design Responsive
- 📱 **Mobile** : Interface adaptée smartphones (menu burger, cartes empilées)
- 📋 **Tablette** : Grilles optimisées 2 colonnes
- 🖥️ **Desktop** : Vue complète multi-colonnes
- 🎨 **CSS Grid & Flexbox** : Disposition fluide qui s'adapte à toutes tailles d'écran
- 🔄 **Tableaux responsifs** : Scroll horizontal automatique sur petits écrans

### Notifications
- ✅ **Messages de succès** (vert) : Animations slide-in depuis la droite
- ❌ **Messages d'erreur** (rouge) : Alertes visuelles avec icônes
- ℹ️ **Messages informatifs** (bleu) : Tooltips et confirmations
- 🎬 **Animations fluides** : Slide-in/slide-out (0.3s), durée 3 secondes
- 🔔 **Position fixe** : Top-right, z-index élevé, toujours visible

### Modals
- 📅 **Modal Agenda** : Filtrage par date des tâches actives avec interface calendrier
- 👤 **Modal Agent** : Création/édition avec validation en temps réel
- 🔒 **Fermeture intuitive** : Clic extérieur, bouton ×, ou Echap
- 🎨 **Overlay sombre** : Fond semi-transparent pour focus

### Design
- 🎨 **Palette de couleurs moderne** : Dégradés violets, bleus, roses pour cartes
- 📱 **Interface responsive** : Mobile-first, adapté tablette/desktop
- 🌈 **Code couleur intelligent** :
  - Priorités : 🟢 Basse, 🟡 Normale, 🟠 Haute, 🔴 Urgente (pulse)
  - Statuts : ⏸️ Attente, ▶️ En cours, ✅ Terminé, ⏹️ Suspendu
  - Avancement : Vert (0-50%), Jaune (50-80%), Orange (80-100%), Rouge (>100%)
- 📊 **Graphiques visuels** : Barres de progression, timeline, Gantt coloré
- ✨ **Micro-animations** : Hover effects, transitions, pulse pour urgences

## 🛠️ Technologies

- **HTML5** : Structure sémantique
- **CSS3** : Animations, Flexbox, Grid
- **Vanilla JavaScript** : Logique métier
- **localStorage** : Persistance des données côté navigateur
- **jsPDF 2.5.1** : Génération PDF professionnels
  - Pointage journalier (calendrier coloré)
  - Planning Gantt (format paysage avec barres de progression)
- **SheetJS (xlsx) 0.18.5** : Export Excel (.xlsx) natif
  - Pointage mensuel (une feuille par agent + synthèse)
  - Export complet des données (4 feuilles structurées)

## 📦 Stockage des Données

### Structure localStorage
```json
{
  "agents": [
    {
      "id": 1,
      "nom": "Jean Dupont",
      "fonction": "Développeur",
      "email": "jean.dupont@exemple.com"
    }
  ],
  "sousTaches": [
    {
      "id": 1001,
      "numAffaire": "AFF-2024-001",
      "client": "Entreprise ABC",
      "designation": "Projet XYZ",
      "nom": "Sous-tâche",
      "typeSousTache": "etude",
      "agentId": 1,
      "budgetHeures": 40,
      "dateDebut": "2024-10-01",
      "dateFin": "2024-10-15",
      "priorite": "haute",
      "statut": "en-cours"
    }
  ],
  "pointages": [
    {
      "id": 5001,
      "date": "2024-10-15",
      "agentId": 1,
      "sousTacheId": 1001,
      "heures": 8,
      "type": "J"
    }
  ]
}
```

### Types de données

**Priorités**
- `basse` 🟢
- `normale` 🟡
- `haute` 🟠
- `urgente` 🔴 (avec animation pulse)

**Statuts**
- `en-attente` ⏸️
- `en-cours` ▶️
- `termine` ✅
- `suspendu` ⏹️

**Types de pointage**
- `J` : Journée complète (8h)
- `D` : Demi-journée (4h)
- `A` : Absent (0h)

## 🔒 Sécurité et Validation

### Contrôles implémentés
- ✅ Validation anti-doublons (agents)
- ✅ Confirmation avant suppression
- ✅ Messages d'avertissement si données liées
- ✅ Validation des formats (email, dates)
- ✅ Double confirmation pour réinitialisation

### Messages contextuels
- Nombre d'affaires et pointages avant suppression d'agent
- Informations détaillées dans les alertes
- Notifications visuelles temporaires (3 secondes)

## 📊 Calculs Automatiques

### Avancement
```
Avancement (%) = (Heures Réalisées / Budget Heures) × 100
```

### Retards
- Détection automatique : `Date du jour > Date de fin` ET `Statut ≠ terminé`
- Calcul du nombre de jours de retard
- Affichage dans colonne latérale

### Totaux
- Somme heures par agent
- Somme heures par affaire
- Taux global de réalisation
- Statistiques globales

## 🎯 Cas d'Usage

1. **Suivi quotidien**
   - Pointage journalier simplifié (J/D/A)
   - Agenda des tâches actives

2. **Gestion de projet**
   - Création affaires avec sous-tâches
   - Gantt pour visualiser le planning
   - Suivi avancement et retards

3. **Reporting**
   - Synthèse mensuelle budget vs réalisé
   - Export Excel pour analyses externes
   - Export PDF pour archives

4. **Administration**
   - Gestion des agents (CRUD complet)
   - Import/Export pour backup
   - Statistiques en temps réel

## 🔄 Rafraîchissements Automatiques

L'application actualise intelligemment les vues :
- ✅ Tous les sélecteurs après ajout/suppression agent
- ✅ Gantt après modification des affaires
- ✅ Synthèse après nouveaux pointages
- ✅ Statistiques après changements de données
- ✅ Sauvegarde automatique dans localStorage

## 📝 Notes Techniques

### Performances
- Utilisation de `Date.now()` pour IDs uniques
- Filtrage efficace avec `.filter()` et `.find()`
- Rafraîchissements ciblés par onglet

### Compatibilité
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

### Limitations
- Données stockées localement (localStorage ~5-10 MB)
- Pas de synchronisation cloud
- Pas d'authentification multi-utilisateurs

## 🚧 Évolutions Futures

## 📚 Documentation

### Guides Disponibles

1. **README.md** (ce fichier) : Documentation technique complète
2. **[GUIDE-DEMARRAGE.md](GUIDE-DEMARRAGE.md)** : Guide pas à pas pour débutants
   - Installation détaillée
   - Découverte des fonctionnalités
   - Tests rapides
   - Dépannage
3. **[EXPORTS.md](EXPORTS.md)** : Guide complet des exports
   - Formats Excel (.xlsx)
   - Formats PDF (jsPDF)
   - Export JSON
   - Bonnes pratiques

### Fichiers de l'Application

- **index.html** : Page de redirection vers l'application
- **app.html** : Application principale (fichier unique auto-suffisant)

## 🚧 Évolutions Futures

- [x] Mode sombre
- [x] Recherche globale et filtres avancés
- [x] Vue Kanban avec drag & drop
- [x] Étiquettes visuelles (À risque, En retard, Bloqué)
- [x] Vues sauvegardées
- [x] Configuration métier (jours fériés, Ramadan)
- [x] Validation métier complète
- [x] Avancement calculé automatiquement
- [ ] Rapports mensuels/annuels complets
- [ ] Export PDF pour tous les rapports
- [ ] Envoi de rapports par email
- [ ] Synchronisation cloud
- [ ] Multi-utilisateurs avec authentification
- [ ] API REST pour intégrations externes
- [ ] Notifications push
- [ ] Graphiques avancés (Chart.js)
- [ ] Gestion des dépendances entre tâches

## 📄 Licence

Application libre d'utilisation et de modification.

## 👨‍💻 Support

**Ressources** :
- 📖 README.md : Documentation technique
- 🚀 GUIDE-DEMARRAGE.md : Tutoriel débutant
- 📊 EXPORTS.md : Guide des exports

**Démarrage** :
1. Ouvrir `index.html` ou `app.html` dans un navigateur
2. Suivre le [Guide de Démarrage](GUIDE-DEMARRAGE.md)
3. Consulter la section "Démonstration Rapide" ci-dessus

Pour toute question ou suggestion d'amélioration, contactez l'équipe de développement.

---

**Version 2.0** - Octobre 2025
