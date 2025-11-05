/**
 * DATA MANAGER - Gestion centralisée des données
 * CNIM BABCOCK MAROC - Département Méthodes
 * 
 * Ce fichier gère toutes les opérations sur les données :
 * - Sauvegarde / Chargement
 * - Import / Export
 * - Backup automatique
 * - Restauration
 * - Validation des données
 */

class DataManager {
    constructor() {
        this.storageKey = 'appPointageData';
        this.backupPrefix = 'appBackup_';
        this.maxBackups = 10; // Garder les 10 dernières sauvegardes
        this.autoBackupInterval = 5 * 60 * 1000; // 5 minutes
        this.backupTimer = null;
    }

    // ============================================
    // SAUVEGARDE ET CHARGEMENT
    // ============================================

    /**
     * Sauvegarder les données dans localStorage
     */
    save(data) {
        try {
            const dataToSave = {
                ...data,
                lastModified: new Date().toISOString(),
                version: '1.0'
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
            console.log('💾 Données sauvegardées:', new Date().toLocaleTimeString());
            return true;
        } catch (error) {
            console.error('❌ Erreur sauvegarde:', error);
            
            // Si erreur de quota, nettoyer les vieux backups
            if (error.name === 'QuotaExceededError') {
                this.cleanOldBackups();
                // Réessayer
                try {
                    localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
                    return true;
                } catch (retryError) {
                    console.error('❌ Erreur après nettoyage:', retryError);
                    return false;
                }
            }
            return false;
        }
    }

    /**
     * Charger les données depuis localStorage
     */
    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                const parsed = JSON.parse(data);
                console.log('📂 Données chargées:', parsed.lastModified || 'Date inconnue');
                return parsed;
            }
            console.log('ℹ️ Aucune donnée sauvegardée');
            return null;
        } catch (error) {
            console.error('❌ Erreur chargement:', error);
            return null;
        }
    }

    // ============================================
    // BACKUP AUTOMATIQUE
    // ============================================

    /**
     * Créer une sauvegarde automatique
     */
    createBackup(data) {
        try {
            const timestamp = new Date().getTime();
            const backupKey = `${this.backupPrefix}${timestamp}`;
            
            const backupData = {
                ...data,
                backupDate: new Date().toISOString(),
                timestamp: timestamp
            };
            
            localStorage.setItem(backupKey, JSON.stringify(backupData));
            console.log('💾 Backup créé:', new Date().toLocaleString());
            
            // Nettoyer les vieux backups
            this.cleanOldBackups();
            
            return true;
        } catch (error) {
            console.error('❌ Erreur création backup:', error);
            return false;
        }
    }

    /**
     * Lister tous les backups disponibles
     */
    listBackups() {
        const backups = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.backupPrefix)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    backups.push({
                        key: key,
                        date: data.backupDate,
                        timestamp: data.timestamp,
                        size: localStorage.getItem(key).length
                    });
                } catch (error) {
                    console.error('Erreur lecture backup:', key, error);
                }
            }
        }
        
        // Trier par date (plus récent en premier)
        return backups.sort((a, b) => b.timestamp - a.timestamp);
    }

    /**
     * Restaurer un backup
     */
    restoreBackup(backupKey) {
        try {
            const backupData = localStorage.getItem(backupKey);
            if (!backupData) {
                console.error('❌ Backup non trouvé:', backupKey);
                return null;
            }
            
            const data = JSON.parse(backupData);
            console.log('♻️ Backup restauré:', data.backupDate);
            
            return data;
        } catch (error) {
            console.error('❌ Erreur restauration backup:', error);
            return null;
        }
    }

    /**
     * Nettoyer les anciens backups
     */
    cleanOldBackups() {
        const backups = this.listBackups();
        
        if (backups.length > this.maxBackups) {
            const toDelete = backups.slice(this.maxBackups);
            
            toDelete.forEach(backup => {
                localStorage.removeItem(backup.key);
                console.log('🗑️ Backup supprimé:', backup.date);
            });
        }
    }

    /**
     * Démarrer le backup automatique
     */
    startAutoBackup(getData) {
        if (this.backupTimer) {
            clearInterval(this.backupTimer);
        }
        
        this.backupTimer = setInterval(() => {
            const data = getData();
            this.createBackup(data);
        }, this.autoBackupInterval);
        
        console.log('⚙️ Backup automatique activé (toutes les 5 minutes)');
    }

    /**
     * Arrêter le backup automatique
     */
    stopAutoBackup() {
        if (this.backupTimer) {
            clearInterval(this.backupTimer);
            this.backupTimer = null;
            console.log('⏸️ Backup automatique désactivé');
        }
    }

    // ============================================
    // IMPORT / EXPORT
    // ============================================

    /**
     * Exporter les données en JSON
     */
    exportToJSON(data, filename = null) {
        try {
            const exportData = {
                ...data,
                exportDate: new Date().toISOString(),
                version: '1.0',
                application: 'CNIM Pointage - Département Méthodes'
            };
            
            const json = JSON.stringify(exportData, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const defaultFilename = `CNIM_Pointage_${new Date().toISOString().split('T')[0]}.json`;
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || defaultFilename;
            a.click();
            
            URL.revokeObjectURL(url);
            
            console.log('📤 Données exportées:', a.download);
            return true;
        } catch (error) {
            console.error('❌ Erreur export JSON:', error);
            return false;
        }
    }

    /**
     * Importer des données depuis JSON
     */
    importFromJSON(file, callback) {
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                
                // Valider les données
                if (this.validateData(data)) {
                    console.log('📥 Données importées:', data.exportDate || 'Date inconnue');
                    callback(data, null);
                } else {
                    callback(null, 'Données invalides ou corrompues');
                }
            } catch (error) {
                console.error('❌ Erreur import JSON:', error);
                callback(null, error.message);
            }
        };
        
        reader.onerror = (error) => {
            console.error('❌ Erreur lecture fichier:', error);
            callback(null, 'Erreur de lecture du fichier');
        };
        
        reader.readAsText(file);
    }

    // ============================================
    // VALIDATION
    // ============================================

    /**
     * Valider la structure des données
     */
    validateData(data) {
        // Vérifier que les propriétés essentielles existent
        const requiredProps = ['agents', 'sousTaches', 'pointages'];
        
        for (const prop of requiredProps) {
            if (!data.hasOwnProperty(prop)) {
                console.error(`❌ Propriété manquante: ${prop}`);
                return false;
            }
            
            if (!Array.isArray(data[prop])) {
                console.error(`❌ ${prop} doit être un tableau`);
                return false;
            }
        }
        
        console.log('✅ Données validées');
        return true;
    }

    // ============================================
    // STATISTIQUES
    // ============================================

    /**
     * Obtenir des statistiques sur les données
     */
    getStats(data) {
        return {
            agents: data.agents?.length || 0,
            sousTaches: data.sousTaches?.length || 0,
            pointages: data.pointages?.length || 0,
            dependances: data.dependances?.length || 0,
            lastModified: data.lastModified || 'Jamais',
            storageSize: new Blob([JSON.stringify(data)]).size
        };
    }

    /**
     * Afficher les statistiques de stockage
     */
    getStorageStats() {
        let totalSize = 0;
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            totalSize += key.length + value.length;
        }
        
        // Estimation de la limite (généralement 5-10 MB)
        const estimatedLimit = 5 * 1024 * 1024; // 5 MB
        const percentUsed = ((totalSize / estimatedLimit) * 100).toFixed(2);
        
        return {
            totalSize: totalSize,
            totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
            percentUsed: percentUsed,
            itemCount: localStorage.length
        };
    }

    // ============================================
    // NETTOYAGE
    // ============================================

    /**
     * Supprimer toutes les données
     */
    clearAll() {
        if (confirm('⚠️ ATTENTION : Cela supprimera TOUTES les données. Continuer ?')) {
            // Créer un backup avant de tout supprimer
            const data = this.load();
            if (data) {
                this.createBackup(data);
            }
            
            localStorage.clear();
            console.log('🗑️ Toutes les données ont été supprimées');
            return true;
        }
        return false;
    }

    /**
     * Réinitialiser aux données par défaut
     */
    reset(defaultData) {
        if (confirm('⚠️ Réinitialiser aux données par défaut ?')) {
            // Backup des données actuelles
            const currentData = this.load();
            if (currentData) {
                this.createBackup(currentData);
            }
            
            this.save(defaultData);
            console.log('♻️ Données réinitialisées');
            return true;
        }
        return false;
    }
}

// Créer une instance globale
const dataManager = new DataManager();

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}
