# 🚀 Guide de Démarrage - Application de Pointage

Guide pas à pas pour installer et commencer à utiliser l'application.

## 📥 Installation (2 minutes)

### Étape 1 : Télécharger l'Application

**Option A : Téléchargement Direct**
1. Télécharger le fichier `app.html`
2. Enregistrer dans un dossier (ex: `C:\Pointages\` ou `~/Documents/Pointages/`)

**Option B : Clone Git** (si disponible)
```bash
git clone [repository-url]
cd Pointages
```

### Étape 2 : Ouvrir l'Application

**Méthode 1 : Double-clic**
- Double-cliquer sur `app.html`
- L'application s'ouvre dans le navigateur par défaut

**Méthode 2 : Glisser-déposer**
- Ouvrir votre navigateur (Chrome, Firefox, Edge, Safari)
- Glisser `app.html` dans la fenêtre du navigateur

**Méthode 3 : Menu du navigateur**
- Ouvrir le navigateur
- Fichier → Ouvrir → Sélectionner `app.html`

### Étape 3 : Vérification

✅ **L'application est chargée si vous voyez** :
- En-tête violet avec horloge en temps réel
- 7 onglets : Affaires, Pointage, Pointage Journalier, Pointage Mensuel, Planning, Rapports, Paramètres
- Bouton "📅 Agenda" en haut à droite
- Données de démonstration affichées

❌ **En cas de problème** :
- Vérifier la connexion Internet (nécessaire au 1er chargement pour CDN)
- Essayer un autre navigateur
- Vider le cache du navigateur (Ctrl+F5)

## 🎯 Découverte des Fonctionnalités (5 minutes)

### 1. Horloge en Temps Réel ⏱️

**Localisation** : En-tête, coin droit

**Ce que vous voyez** :
```
🕐 12:34:56 | 📅 Jeudi 31 Octobre 2025
```

**Fonctionnalité** :
- Mise à jour chaque seconde automatiquement
- Date et heure en français
- Toujours visible, tous les onglets

### 2. Agenda Interactif 📅

**Accès** : Bouton "📅 Agenda" dans l'en-tête

**Test rapide** :
1. Cliquer sur "📅 Agenda"
2. Une fenêtre modale s'ouvre
3. Sélectionner une date dans le champ
4. Observer le filtrage automatique des tâches

**Ce que ça fait** :
- Affiche les sous-tâches actives pour la date sélectionnée
- Filtre en temps réel
- Montre : N° affaire, client, agent, dates, priorité

### 3. Alertes Urgentes 🔴

**Localisation** : Onglet "Affaires" → Tableau principal

**Test rapide** :
1. Aller sur l'onglet "Affaires"
2. Cliquer "➕ Nouvelle Affaire"
3. Remplir le formulaire
4. Sélectionner Priorité : **"Urgente"**
5. Enregistrer

**Résultat** :
- La ligne de l'affaire a une **animation pulse rouge**
- Badge "🔴 URGENTE" qui pulse continuellement
- Visible immédiatement dans la liste

### 4. Colonne Retards ⚠️

**Localisation** : Onglet "Affaires" → Colonne droite "⚠️ Retards"

**Ce que vous voyez** :
```
⚠️ RETARDS
─────────────
🔴 Projet ABC
   → 5 jours de retard
   
🟠 Étude XYZ
   → 2 jours de retard
```

**Fonctionnalité** :
- Détection automatique : Date du jour > Date de fin ET Statut ≠ Terminé
- Calcul du nombre de jours de retard
- Mise à jour en temps réel

### 5. Graphiques Dynamiques 📊

**Localisation** : Plusieurs endroits

#### A. Barres de Progression (Onglet Affaires)

**Ce que vous voyez** :
- Barre horizontale colorée pour chaque affaire
- Couleurs changeantes :
  - 🟢 Vert : 0-50% (en bonne voie)
  - 🟡 Jaune : 50-80% (attention)
  - 🟠 Orange : 80-100% (presque dépassé)
  - 🔴 Rouge : >100% (dépassement budget)

**Test** :
1. Créer une affaire avec Budget : 40h
2. Ajouter un pointage de 45h
3. Observer la barre devenir rouge (112.5%)

#### B. Gantt Interactif (Onglet Planning)

**Test rapide** :
1. Aller sur "Planning"
2. Observer le diagramme de Gantt
3. Tester les contrôles :
   - **Zoom** : Boutons − et + (50% à 200%)
   - **Échelle** : Sélectionner "Par jours", "Par semaines", "Par mois"
   - **Filtres** : Priorité + Statut

**Ce que vous voyez** :
- Barres temporelles colorées
- Timeline avec dates
- Zoom fluide
- Filtrage instantané

#### C. Synthèse Budget vs Réalisé (Onglet Pointage Mensuel)

**Localisation** : En bas du pointage mensuel

**Ce que vous voyez** :
```
📈 SYNTHÈSE DES ÉCARTS
─────────────────────
✅ EN AVANCE (5 affaires)
⏱️ DANS LES TEMPS (12 affaires)
⚠️ LÉGER DÉPASSEMENT (3 affaires)
🔴 DÉPASSEMENT (2 affaires)
```

**Couleurs** :
- 🟢 Vert : < 80%
- 🟡 Jaune : 80-100%
- 🟠 Orange : 100-120%
- 🔴 Rouge : > 120%

### 6. Calendrier Interactif 📅

**Localisation** : Onglet "Pointage Journalier"

**Test rapide** :
1. Aller sur "Pointage Journalier"
2. Sélectionner un agent
3. Sélectionner un mois
4. Cliquer "Afficher"

**Ce que vous voyez** :
- Grille 7 colonnes (semaine) × 5 lignes (max)
- Chaque jour affiche :
  - Numéro (1-31)
  - Nom du jour (Lun, Mar, etc.)
  - Indicateur J/D/A coloré

**Interaction** :
- Cliquer sur un jour pour éditer (prompt)
- Entrée : J, D, ou A
- Mise à jour immédiate
- Totaux recalculés automatiquement

### 7. Design Responsive 📱

**Test rapide** :
1. Redimensionner la fenêtre du navigateur
2. Observer l'adaptation automatique

**Breakpoints** :
- **< 768px (Mobile)** :
  - Menu burger (si implémenté)
  - Cartes empilées verticalement
  - Tableaux avec scroll horizontal
  
- **768px - 1024px (Tablette)** :
  - Grilles 2 colonnes
  - Contrôles compacts
  
- **> 1024px (Desktop)** :
  - Vue complète multi-colonnes
  - Tous les éléments visibles

**Test mobile** :
- Ouvrir Chrome DevTools (F12)
- Cliquer icône mobile (Ctrl+Shift+M)
- Tester différentes tailles (iPhone, iPad, etc.)

## 📤 Exports Professionnels (2 minutes)

### Export Excel (.xlsx)

**Test Pointage Mensuel** :
1. Aller sur "Pointage Mensuel"
2. Sélectionner Mois + Année
3. Cliquer "📗 Export Excel (.xlsx)"
4. Fichier téléchargé : `Pointage_Octobre_2025.xlsx`

**Contenu** :
- Une feuille par agent avec ses affaires
- Grille 31 jours
- Totaux automatiques
- Feuille "Synthèse" globale

**Test Export Complet** :
1. Aller sur "Paramètres"
2. Section "Gestion des Données"
3. Cliquer "📗 Exporter Excel"
4. Fichier téléchargé : `Donnees-Completes-2025-10-31.xlsx`

**Contenu** :
- 4 feuilles : Agents, Affaires, Pointages, Synthèse
- Toutes les données exportées

### Export PDF (jsPDF)

**Test Pointage Journalier** :
1. Aller sur "Pointage Journalier"
2. Sélectionner Agent + Mois
3. Cliquer "Afficher"
4. Cliquer "📕 Exporter PDF (jsPDF)"
5. PDF téléchargé : `Pointage_Jean_Dupont_Octobre_2025.pdf`

**Contenu** :
- Calendrier visuel coloré
- J/D/A avec codes couleurs
- Totaux et légende

**Test Gantt** :
1. Aller sur "Planning"
2. Appliquer filtres si souhaité
3. Cliquer "📕 Export PDF"
4. PDF téléchargé : `Gantt_Planning_2025-10-31.pdf`

**Contenu** :
- Format paysage (A4)
- Tableau des tâches
- Barres de progression colorées
- Légende

## 💾 Sauvegarde et Récupération

### Backup Automatique

**Fonctionnement** :
- ✅ Sauvegarde automatique dans `localStorage` du navigateur
- ✅ Après chaque action (ajout, modification, suppression)
- ✅ Aucune action manuelle requise

**Vérification** :
1. Ajouter une affaire
2. Fermer le navigateur complètement
3. Rouvrir `app.html`
4. ✅ L'affaire est toujours là

### Export Manuel (Recommandé)

**Pour sauvegardes externes** :
1. Aller sur "Paramètres"
2. Cliquer "📥 Exporter JSON"
3. Conserver le fichier `.json` en sécurité
4. Pour restaurer : "📤 Importer" → Sélectionner le fichier

**Fréquence recommandée** : Hebdomadaire ou après modifications importantes

## ⚙️ Gestion des Agents

### Ajouter un Agent

1. Aller sur "Paramètres"
2. Section "Gestion des Agents"
3. Cliquer "➕ Nouvel Agent"
4. Modal s'ouvre
5. Remplir :
   - Nom : **Requis**
   - Fonction : **Requis**
   - Email : Optionnel
6. Cliquer "💾 Enregistrer"

**Validation** :
- ❌ Nom en doublon → Erreur
- ✅ Nom unique → Succès avec notification verte

### Modifier un Agent

1. Dans le tableau des agents
2. Cliquer "✏️ Modifier"
3. Modal s'ouvre avec données pré-remplies
4. Modifier les champs
5. Enregistrer

**Répercussions automatiques** :
- ✅ Tous les sélecteurs mis à jour
- ✅ Gantt rafraîchi
- ✅ Statistiques recalculées

### Supprimer un Agent

1. Cliquer "🗑️ Supprimer"
2. Message d'avertissement si agent a des données :
   ```
   ⚠️ ATTENTION :
   • 5 affaire(s) assignée(s)
   • 25 pointage(s) enregistré(s)
   
   Ces données seront également supprimées.
   ```
3. Confirmer

## 🎨 Personnalisation

### Priorités des Affaires

**4 niveaux disponibles** :
- 🟢 **Basse** : Aucune urgence
- 🟡 **Normale** : Par défaut
- 🟠 **Haute** : Important
- 🔴 **Urgente** : **Animation pulse** en temps réel

### Statuts des Affaires

**4 statuts** :
- ⏸️ **En attente** : Pas encore démarrée
- ▶️ **En cours** : En progression
- ✅ **Terminé** : Complété
- ⏹️ **Suspendu** : En pause

### Types de Sous-tâches

**10 types prédéfinis** :
1. Expression de besoin
2. Préparation dossier
3. Achat matière
4. Châssis transport
5. Liste de colisage
6. Mise en camion
7. Schéma
8. Épreuve hydraulique
9. Étude
10. Fabrication

## 🔧 Dépannage

### L'horloge ne se met pas à jour

**Solution** :
- Rafraîchir la page (F5)
- Vérifier que JavaScript est activé

### Les données ne se sauvegardent pas

**Solutions** :
1. Vérifier que `localStorage` est activé :
   - Chrome : Paramètres → Confidentialité → Cookies
   - Firefox : Options → Vie privée
   
2. Vider le cache et recharger :
   - Ctrl+Shift+Delete → Vider le cache
   - Rouvrir `app.html`

3. Navigation privée ?
   - ❌ `localStorage` ne fonctionne pas en navigation privée
   - ✅ Utiliser fenêtre normale

### Les exports ne fonctionnent pas

**Solutions** :
1. **Bloqueur de pop-ups** ?
   - Autoriser les pop-ups pour l'application
   
2. **Pas de connexion Internet** ?
   - Nécessaire au 1er chargement pour CDN
   - Ensuite : fonctionne hors ligne

3. **Bibliothèques non chargées** ?
   - Ouvrir Console (F12)
   - Vérifier erreurs réseau
   - Rafraîchir (Ctrl+F5)

### L'interface ne s'affiche pas correctement

**Solutions** :
1. **Navigateur obsolète** ?
   - Mettre à jour : Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
   
2. **Zoom du navigateur** ?
   - Réinitialiser zoom : Ctrl+0
   
3. **Résolution trop petite** ?
   - Minimum recommandé : 1024×768

## 📱 Utilisation Mobile

### Ouvrir sur Smartphone

**Android** :
1. Transférer `app.html` sur téléphone
2. Ouvrir avec Chrome Mobile
3. OU : Héberger sur serveur web et ouvrir URL

**iOS** :
1. Transférer `app.html` via AirDrop ou iCloud
2. Ouvrir avec Safari Mobile

### Limitations Mobile

❌ **Fonctions limitées** :
- Export fichiers (selon navigateur)
- Clavier virtuel peut masquer interface

✅ **Fonctions disponibles** :
- Consultation des données
- Ajout pointages
- Visualisation Gantt
- Agenda

### Mode Plein Écran Mobile

**Android Chrome** :
1. Menu (⋮) → "Ajouter à l'écran d'accueil"
2. Icône créée
3. Ouvrir → Mode plein écran

**iOS Safari** :
1. Bouton Partage
2. "Sur l'écran d'accueil"
3. Icône créée

## 🎓 Prochaines Étapes

### Apprendre les Fonctionnalités Avancées

1. **Lire EXPORTS.md** : Guide complet des exports
2. **Consulter README.md** : Documentation technique complète
3. **Expérimenter** : Créer affaires, pointages, tester filtres

### Adapter à Votre Usage

1. **Supprimer données démo** :
   - Paramètres → Réinitialiser
   - Confirmer
   
2. **Ajouter vos agents** :
   - Paramètres → Nouvel Agent
   - Créer tous vos agents
   
3. **Créer vos affaires** :
   - Affaires → Nouvelle Affaire
   - Définir budget, dates, priorité

4. **Commencer le suivi** :
   - Pointage → Enregistrer heures quotidiennes
   - Consulter statistiques et rapports

### Backup et Sécurité

**Routine recommandée** :
- 📅 **Quotidien** : Vérification visuelle (données présentes)
- 📅 **Hebdomadaire** : Export JSON de sauvegarde
- 📅 **Mensuel** : Export Excel pour archives

**Stockage sécurisé** :
- Cloud (Google Drive, OneDrive, Dropbox)
- Disque externe
- Plusieurs emplacements

## 📞 Support

### Ressources

- 📖 **README.md** : Documentation principale
- 📊 **EXPORTS.md** : Guide des exports
- 🚀 **Ce fichier** : Guide de démarrage

### En Cas de Problème

1. Consulter section "Dépannage" ci-dessus
2. Vérifier Console navigateur (F12) pour erreurs
3. Tester dans un autre navigateur
4. Exporter JSON avant toute manipulation

---

**Bon démarrage ! 🎉**

*Application de Gestion de Pointage v2.0 - Octobre 2025*
