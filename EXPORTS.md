# 📊 Guide des Exports - Application de Gestion de Pointage

Ce document détaille tous les formats d'export disponibles dans l'application.

## 📗 Exports Excel (.xlsx)

### 1. Pointage Mensuel - Export par Agent

**Emplacement** : Onglet "Pointage Mensuel" → Bouton "📗 Export Excel (.xlsx)"

**Technologie** : SheetJS (XLSX)

**Contenu généré** :
- **Une feuille par agent** contenant :
  - Titre : "Pointage Mensuel - [Nom de l'agent]"
  - Sous-titre : "[Mois] [Année]"
  - Tableau avec colonnes :
    - Colonne 1 : Affaire (format : "N° - Nom")
    - Colonnes 2-32 : Jours du mois (1 à 31)
    - Colonne 33 : Total heures
  - Ligne de total agent avec somme par jour
  
- **Feuille "Synthèse"** :
  - Tableau récapitulatif de tous les agents
  - Colonnes : Agent | Fonction | Nb Affaires | Heures Réalisées | Budget Total

**Format de fichier** : `Pointage_[Mois]_[Année].xlsx`

**Exemple** : `Pointage_Octobre_2025.xlsx`

**Optimisations** :
- Largeur des colonnes automatiquement ajustée
- Colonne "Affaire" : 30 caractères
- Colonnes "Jours" : 5 caractères
- Colonne "Total" : 10 caractères
- Noms de feuille limités à 31 caractères

---

### 2. Export Complet des Données

**Emplacement** : Onglet "Paramètres" → Section "Gestion des Données" → Bouton "📗 Exporter Excel"

**Technologie** : SheetJS (XLSX)

**Contenu généré** :

#### Feuille 1 : "Agents"
| ID | Nom | Fonction | Email | Nb Affaires | Heures Réalisées |
|----|-----|----------|-------|-------------|------------------|
| ... | ... | ... | ... | ... | ... |

**Largeurs** : 10, 25, 20, 30, 12, 15

#### Feuille 2 : "Affaires"
| ID | N° Affaire | Client | Désignation | Nom | Type | Agent | Budget (h) | Date Début | Date Fin | Priorité | Statut |
|----|------------|--------|-------------|-----|------|-------|------------|------------|----------|----------|--------|
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

**Largeurs** : 10, 15, 20, 30, 25, 20, 20, 12, 12, 12, 10, 12

#### Feuille 3 : "Pointages"
| ID | Date | Agent | N° Affaire | Nom Affaire | Heures | Type |
|----|------|-------|------------|-------------|--------|------|
| ... | ... | ... | ... | ... | ... | ... |

**Largeurs** : 10, 12, 20, 15, 30, 10, 8

#### Feuille 4 : "Synthèse"
Tableau de statistiques globales :
- Total Agents
- Total Affaires
- Affaires en cours
- Affaires terminées
- Heures Budget Total
- Heures Réalisées Total
- Date Export

**Format de fichier** : `Donnees-Completes-[YYYY-MM-DD].xlsx`

**Exemple** : `Donnees-Completes-2025-10-31.xlsx`

---

## 📕 Exports PDF (jsPDF)

### 1. Pointage Journalier - Calendrier Mensuel

**Emplacement** : Onglet "Pointage Journalier" → Bouton "📕 Exporter PDF (jsPDF)"

**Technologie** : jsPDF 2.5.1

**Format** : A4 Portrait

**Contenu généré** :
1. **En-tête** :
   - Titre : "POINTAGE MENSUEL - [NOM AGENT]"
   - Sous-titre : "[Mois] [Année]"

2. **Calendrier visuel** :
   - Grille de 7 colonnes × 5 lignes (max 31 jours)
   - Chaque cellule affiche :
     - Numéro du jour
     - Nom du jour (abrégé : Lun, Mar, etc.)
     - Indicateur J/D/A avec couleur de fond :
       - 🟢 Vert (J = Journée 8h)
       - 🟡 Jaune (D = Demi-journée 4h)
       - 🔴 Rouge (A = Absent 0h)
       - ⚫ Gris (Week-end)
   - Taille cellule : 27mm × 35mm

3. **Bandeau de totaux** :
   - Couleur : bleu (#007bff)
   - Affichage : "J: X | D: Y | A: Z | Total: Wh"

4. **Légende** :
   - J = Journée (8h)
   - D = Demi-journée (4h)
   - A = Absent (0h)
   - WE = Week-end

5. **Pied de page** :
   - Texte : "Document généré automatiquement..."

**Format de fichier** : `Pointage_[Agent]_[Mois]_[Année].pdf`

**Exemple** : `Pointage_Jean_Dupont_Octobre_2025.pdf`

---

### 2. Planning Gantt - Vue Projet

**Emplacement** : Onglet "Planning" → Bouton "📕 Export PDF"

**Technologie** : jsPDF 2.5.1

**Format** : A4 Paysage (Landscape)

**Contenu généré** :
1. **En-tête** :
   - Titre : "Diagramme de Gantt - Planning des Affaires"
   - Sous-titre avec filtres actifs : "Échelle: [échelle] | Priorité: [filtre] | Statut: [filtre]"
   - Date de génération

2. **Tableau des tâches** :
   - Colonnes :
     1. Affaire (70mm) : N° + Nom (25 premiers caractères)
     2. Agent (50mm)
     3. Début (25mm) : Date de début
     4. Fin (25mm) : Date de fin
     5. Statut (30mm) : Avec couleur selon statut
     6. Avancement (77mm) : Barre de progression + pourcentage
   
   - Couleurs de statut :
     - 🔵 Bleu : En cours
     - 🟢 Vert : Terminé
     - 🔴 Rouge : Suspendu
     - ⚫ Gris : En attente

3. **Barres de progression** :
   - Rectangle 60mm × 5mm
   - Remplissage selon avancement :
     - 🟢 Vert : 0-50%
     - 🟡 Jaune : 50-80%
     - 🟠 Orange : 80-100%
     - 🔴 Rouge : >100%
   - Texte du pourcentage affiché

4. **Légende** :
   - 4 items horizontaux expliquant les couleurs d'avancement
   - Position en bas du document

5. **Limites** :
   - Maximum 20 tâches par PDF
   - Avertissement si dépassement

**Format de fichier** : `Gantt_Planning_[YYYY-MM-DD].pdf`

**Exemple** : `Gantt_Planning_2025-10-31.pdf`

---

### 3. Pointage Mensuel - Impression

**Emplacement** : Onglet "Pointage Mensuel" → Bouton "📕 Export PDF"

**Technologie** : Fenêtre d'impression du navigateur

**Format** : Dépend du navigateur (généralement A4)

**Contenu** : 
- Grille mensuelle visible à l'écran
- Synthèse des écarts Budget vs Réalisé
- Utilise le CSS print pour optimisation

**Méthode** : `window.print()`

---

## 📥 Export JSON

**Emplacement** : Onglet "Paramètres" → Section "Gestion des Données" → Bouton "📥 Exporter JSON"

**Technologie** : Blob JavaScript natif

**Format** : JSON indenté (2 espaces)

**Contenu** :
```json
{
  "agents": [...],
  "sousTaches": [...],
  "pointages": [...],
  "dateExport": "2025-10-31T10:30:00.000Z",
  "version": "1.0"
}
```

**Format de fichier** : `pointage-export-[YYYY-MM-DD].json`

**Usage** : Sauvegarde complète et restauration via Import

---

## 📊 Comparaison des Formats

| Format | Usage | Avantages | Limites |
|--------|-------|-----------|---------|
| **Excel (.xlsx)** | Analyse, tableaux | Multi-feuilles, formules, filtres Excel | Nécessite SheetJS |
| **PDF (jsPDF)** | Archives, impression | Format universel, professionnel | Non éditable |
| **JSON** | Backup, migration | Complet, réimportable | Nécessite l'application |

---

## 🔧 Configuration Technique

### Bibliothèques CDN

```html
<!-- jsPDF pour PDF -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<!-- SheetJS pour Excel -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
```

### Fonctions Principales

#### Excel
- `exporterExcel()` - Pointage mensuel multi-feuilles
- `exporterDonneesExcel()` - Export complet 4 feuilles

#### PDF
- `exporterJournalierPDF()` - Calendrier J/D/A
- `exporterGanttPDF()` - Planning Gantt
- `exporterPDF()` - Impression pointage mensuel

#### JSON
- `exporterDonnees()` - Export JSON complet

---

## 💡 Bonnes Pratiques

### Nommage des Fichiers
✅ **Bonne pratique** : Inclure date, agent, mois dans le nom
- `Pointage_Jean_Dupont_Octobre_2025.pdf`
- `Donnees-Completes-2025-10-31.xlsx`

❌ **À éviter** : Noms génériques
- `export.pdf`
- `data.xlsx`

### Avant Export
1. ✅ Vérifier les filtres actifs (Gantt, Mensuel)
2. ✅ Sélectionner le bon mois/année
3. ✅ Choisir le bon agent si applicable
4. ✅ S'assurer que des données existent

### Notifications
L'application affiche des notifications de succès après chaque export :
- ✅ "Export Excel (.xlsx) généré avec succès !"
- ✅ "Export PDF du Gantt généré avec succès !"
- etc.

---

## 🚀 Cas d'Usage

### Reporting Mensuel
1. Ouvrir "Pointage Mensuel"
2. Sélectionner mois/année
3. Exporter Excel → Une feuille par agent + Synthèse
4. Ouvrir dans Excel pour analyses complémentaires

### Archive Individuelle
1. Ouvrir "Pointage Journalier"
2. Sélectionner agent + mois
3. Exporter PDF → Calendrier visuel professionnel
4. Envoyer par email ou archiver

### Réunion Projet
1. Ouvrir "Planning"
2. Filtrer par priorité/statut si besoin
3. Exporter Gantt PDF → Vue d'ensemble paysage
4. Imprimer ou partager

### Backup Complet
1. Ouvrir "Paramètres"
2. Export JSON → Sauvegarde complète
3. Conserver fichier en sécurité
4. Importer pour restaurer si besoin

---

**Version** : 2.0  
**Dernière mise à jour** : Octobre 2025
