# 🎬 Indicateur de Processus Cinématique - Documentation

## Vue d'ensemble

L'indicateur de processus cinématique est un composant visuel animé qui affiche la progression des opérations multi-étapes dans l'application CNIM. Il offre un retour visuel professionnel et engageant pour l'utilisateur.

## Fonctionnalités

### ✨ Caractéristiques principales

1. **Panneau coulissant animé**
   - Apparaît depuis le côté droit de l'écran
   - Animation fluide avec effet de rebond
   - Effet glassmorphisme (fond semi-transparent avec flou)
   - Position fixe qui reste visible lors du défilement

2. **Affichage des étapes**
   - Icônes personnalisables (emoji ou numéros)
   - Libellés et descriptions pour chaque étape
   - 3 états visuels : En attente / Actif / Terminé
   - Badges de statut colorés avec animations

3. **Barre de progression globale**
   - Calcul automatique basé sur les étapes terminées
   - Effet shimmer animé
   - Affichage du pourcentage
   - Couleurs dégradées (bleu CNIM)

4. **Chronomètre intégré**
   - Démarrage automatique à l'ouverture
   - Affichage MM:SS
   - Icône animée (rotation)
   - Arrêt automatique à 100%

5. **Fermeture automatique**
   - Se ferme automatiquement 2 secondes après la complétion (100%)
   - Bouton de fermeture manuel disponible
   - Réinitialisation complète après fermeture

6. **Mode sombre**
   - Support complet du thème sombre
   - Couleurs adaptées automatiquement
   - Conserve la lisibilité dans tous les modes

## Utilisation

### Fonction principale : `showProcessIndicator()`

```javascript
showProcessIndicator(processName, steps)
```

**Paramètres :**
- `processName` (string) : Nom du processus à afficher dans l'en-tête
- `steps` (array) : Tableau d'objets définissant les étapes

**Exemple d'étape :**
```javascript
{
    label: 'Validation des données',
    description: 'Vérification des champs',
    icon: '📋'  // Optionnel, sinon numéro auto
}
```

### Contrôle des étapes : `updateProcessStep()`

```javascript
updateProcessStep(stepIndex, status, customLabel)
```

**Paramètres :**
- `stepIndex` (number) : Index de l'étape (0-based)
- `status` (string) : 'active', 'completed', ou 'pending'
- `customLabel` (string, optionnel) : Texte personnalisé pour le badge

**Exemples :**
```javascript
updateProcessStep(0, 'active');              // Démarre l'étape 1
updateProcessStep(0, 'completed');           // Termine l'étape 1
updateProcessStep(1, 'completed', '✓ OK');   // Termine avec label custom
updateProcessStep(2, 'active', '⏳ 75%');    // Active avec progression
```

### Progression globale : `updateGlobalProgress()`

```javascript
updateGlobalProgress(percentage)
```

**Paramètre :**
- `percentage` (number) : Valeur entre 0 et 100

**Note :** Cette fonction est appelée automatiquement par `updateProcessStep()`, mais peut être utilisée manuellement si nécessaire.

### Fermeture : `closeProcessIndicator()`

```javascript
closeProcessIndicator()
```

Ferme l'indicateur et réinitialise tous les états.

## Exemple complet d'intégration

```javascript
function monProcessusMetier() {
    // 1. Afficher l'indicateur avec les étapes
    showProcessIndicator('Exportation des données', [
        { label: 'Validation', description: 'Vérification paramètres', icon: '✅' },
        { label: 'Collection', description: 'Récupération données', icon: '📦' },
        { label: 'Traitement', description: 'Formatage & calculs', icon: '⚙️' },
        { label: 'Génération', description: 'Création fichier Excel', icon: '📊' },
        { label: 'Téléchargement', description: 'Sauvegarde locale', icon: '💾' }
    ]);
    
    // 2. Étape 1 : Validation
    updateProcessStep(0, 'active');
    
    // Faire la validation...
    if (validationReussie) {
        updateProcessStep(0, 'completed');
    } else {
        updateProcessStep(0, 'completed', '❌ Échec');
        closeProcessIndicator();
        return;
    }
    
    // 3. Étape 2 : Collection
    setTimeout(() => {
        updateProcessStep(1, 'active');
        
        // Collecter les données...
        updateProcessStep(1, 'completed');
        
        // 4. Étape 3 : Traitement
        setTimeout(() => {
            updateProcessStep(2, 'active');
            
            // Traiter...
            updateProcessStep(2, 'completed');
            
            // Et ainsi de suite...
        }, 500);
    }, 500);
}
```

## Intégrations existantes

### ✅ Fonction `ajouterAffaire()`

L'indicateur de processus est déjà intégré dans la fonction de création d'affaire avec 5 étapes :

1. **Validation des données** - Vérification de tous les champs
2. **Vérification doublons** - Contrôle d'unicité
3. **Création affaire** - Enregistrement en base
4. **Mise à jour interface** - Actualisation des vues
5. **Finalisation** - Complétion

**Déclenchement :** Automatiquement lors de la soumission du formulaire "Nouvelle Affaire"

### 🎬 Bouton de démonstration

Un bouton "🎬 Démo Processus" a été ajouté dans l'en-tête (à côté de Mode Sombre et Compact).

**Fonction :** `demoProcessIndicator()`

Cette démo simule un processus complet avec 6 étapes qui se déroulent automatiquement toutes les 1,5 secondes.

## Personnalisation CSS

### Classes principales

- `.process-indicator` : Conteneur principal
- `.process-indicator.active` : État ouvert
- `.process-header` : En-tête avec titre et bouton fermer
- `.process-step` : Container d'une étape
- `.process-step.active` : Étape en cours
- `.process-step.completed` : Étape terminée
- `.process-step-icon` : Icône circulaire
- `.process-step-status` : Badge de statut
- `.process-progress` : Conteneur barre de progression
- `.process-progress-bar` : Barre animée
- `.process-timer` : Chronomètre

### Animations définies

- `slideInBounce` : Entrée du panneau avec rebond
- `iconPulse` : Pulsation de l'icône active
- `statusBlink` : Clignotement du badge actif
- `shimmer` : Effet brillant sur la barre de progression

### Variables de couleur

```css
/* Couleurs CNIM */
--cnim-blue: #0066cc
--cnim-dark-blue: #003d7a

/* États */
--pending: #9e9e9e (gris)
--active: #ffc107 (orange/jaune)
--completed: #4caf50 (vert)
```

## Conseils d'utilisation

### ✅ Bonnes pratiques

1. **Étapes claires** : Utilisez des libellés courts et descriptifs
2. **Icônes pertinentes** : Choisissez des emoji qui représentent bien l'action
3. **Feedback d'erreur** : Utilisez des labels custom (❌) pour les échecs
4. **Timing cohérent** : Espacez les étapes de 300-500ms pour une animation fluide
5. **Gestion async** : Utilisez setTimeout/Promise pour coordonner les étapes

### ❌ À éviter

1. Trop d'étapes (max 6-8 pour la lisibilité)
2. Changements trop rapides (< 200ms)
3. Étapes sans description
4. Oublier de gérer les cas d'erreur
5. Ne pas fermer l'indicateur en cas d'échec

## Exemples de cas d'usage

### 📋 Validation de pointage

```javascript
showProcessIndicator('Validation Pointage', [
    { label: 'Vérification heures', icon: '⏰' },
    { label: 'Calcul budget', icon: '💰' },
    { label: 'Validation manager', icon: '✅' },
    { label: 'Verrouillage', icon: '🔒' }
]);
```

### 📊 Génération de rapport

```javascript
showProcessIndicator('Génération Rapport Analytics', [
    { label: 'Collecte données', icon: '📦' },
    { label: 'Calcul KPIs', icon: '📈' },
    { label: 'Création graphiques', icon: '📊' },
    { label: 'Export PDF', icon: '📄' }
]);
```

### 👥 Création agent

```javascript
showProcessIndicator('Ajout Nouvel Agent', [
    { label: 'Validation infos', icon: '📋' },
    { label: 'Création compte', icon: '👤' },
    { label: 'Attribution permissions', icon: '🔑' },
    { label: 'Notification email', icon: '📧' }
]);
```

## Support et compatibilité

- ✅ Chrome, Edge, Firefox, Safari (versions récentes)
- ✅ Mode clair et mode sombre
- ✅ Responsive (optimisé pour écrans > 1024px)
- ✅ Animations GPU (performance optimale)
- ✅ Accessible (contraste WCAG AA)

## Notes techniques

- **Position :** Fixed (reste visible au scroll)
- **Z-index :** 1000 (au-dessus du contenu, sous le loader)
- **Largeur :** 350px
- **Performance :** Animations CSS uniquement (transform + opacity)
- **Stockage :** Aucune donnée persistée (état runtime uniquement)

---

**Créé pour :** Application CNIM BABCOCK MAROC  
**Version :** 1.0  
**Date :** 2024  
**Style :** Cinématique professionnel avec animations fluides
