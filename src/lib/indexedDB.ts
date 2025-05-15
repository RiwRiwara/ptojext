/**
 * Utility service for managing IndexedDB operations
 * Handles storing and retrieving images for the image processing application
 */

// Database configuration
const DB_NAME = 'visualRightDB';
const DB_VERSION = 1;
const IMAGE_STORE_NAME = 'uploadedImages';

// Interface for stored image objects
export interface StoredImage {
  id?: number;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: number;
}

/**
 * Initialize the database connection
 * @returns A promise that resolves to the opened database
 */
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    // Open a connection to the IndexedDB database
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      reject('Error opening database');
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    // Create object stores when the database is first created or being upgraded
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(IMAGE_STORE_NAME)) {
        // Create the images store with auto-incrementing IDs
        const store = db.createObjectStore(IMAGE_STORE_NAME, { keyPath: 'id', autoIncrement: true });
        
        // Create indexes for querying
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
};

/**
 * Save an image to IndexedDB
 * @param file The file object from the file input
 * @returns A promise that resolves to the stored image object
 */
export const saveImageToDB = async (file: File): Promise<StoredImage> => {
  return new Promise((resolve, reject) => {
    // Create a URL for the image
    const url = URL.createObjectURL(file);
    
    // Create the image object
    const imageData: StoredImage = {
      name: file.name,
      url: url,
      type: file.type,
      size: file.size,
      createdAt: Date.now()
    };

    // Open the database connection
    initDB().then(db => {
      // Start a transaction
      const transaction = db.transaction([IMAGE_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(IMAGE_STORE_NAME);

      // Add the image to the store
      const request = store.add(imageData);

      request.onsuccess = () => {
        // Get the ID that was assigned to the image
        imageData.id = request.result as number;
        resolve(imageData);
      };

      request.onerror = (event) => {
        console.error('Error saving image:', event);
        reject('Failed to save image');
      };
      
      // Close the database when the transaction is complete
      transaction.oncomplete = () => {
        db.close();
      };
    }).catch(reject);
  });
};

/**
 * Get all images from IndexedDB
 * @returns A promise that resolves to an array of stored images
 */
export const getAllImages = async (): Promise<StoredImage[]> => {
  return new Promise((resolve, reject) => {
    initDB().then(db => {
      const transaction = db.transaction([IMAGE_STORE_NAME], 'readonly');
      const store = transaction.objectStore(IMAGE_STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        console.error('Error getting images:', event);
        reject('Failed to get images');
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    }).catch(reject);
  });
};

/**
 * Get a specific image by ID
 * @param id The ID of the image to retrieve
 * @returns A promise that resolves to the stored image or null if not found
 */
export const getImageById = async (id: number): Promise<StoredImage | null> => {
  return new Promise((resolve, reject) => {
    initDB().then(db => {
      const transaction = db.transaction([IMAGE_STORE_NAME], 'readonly');
      const store = transaction.objectStore(IMAGE_STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = (event) => {
        console.error('Error getting image:', event);
        reject('Failed to get image');
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    }).catch(reject);
  });
};

/**
 * Delete an image from IndexedDB
 * @param id The ID of the image to delete
 * @returns A promise that resolves when the image is deleted
 */
export const deleteImage = async (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    initDB().then(db => {
      const transaction = db.transaction([IMAGE_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(IMAGE_STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        console.error('Error deleting image:', event);
        reject('Failed to delete image');
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    }).catch(reject);
  });
};

/**
 * Clear all images from the store
 * @returns A promise that resolves when all images are deleted
 */
export const clearAllImages = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    initDB().then(db => {
      const transaction = db.transaction([IMAGE_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(IMAGE_STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        console.error('Error clearing images:', event);
        reject('Failed to clear images');
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    }).catch(reject);
  });
};
