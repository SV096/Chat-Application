/**
 * Safe LocalStorage Utility
 * Handles cases where localStorage might not be available (SSR, private browsing, etc.)
 */

const StorageUtil = {
  /**
   * Safely get item from localStorage
   */
  getItem: (key) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (error) {
      console.warn("localStorage not available:", error);
    }
    return null;
  },

  /**
   * Safely set item in localStorage
   */
  setItem: (key, value) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
        return true;
      }
    } catch (error) {
      console.warn("localStorage not available:", error);
    }
    return false;
  },

  /**
   * Safely remove item from localStorage
   */
  removeItem: (key) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
        return true;
      }
    } catch (error) {
      console.warn("localStorage not available:", error);
    }
    return false;
  },

  /**
   * Safely clear localStorage
   */
  clear: () => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.clear();
        return true;
      }
    } catch (error) {
      console.warn("localStorage not available:", error);
    }
    return false;
  },

  /**
   * Get parsed JSON from localStorage
   */
  getJSON: (key) => {
    try {
      const item = StorageUtil.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn("Error parsing localStorage item:", error);
      return null;
    }
  },

  /**
   * Set JSON to localStorage
   */
  setJSON: (key, value) => {
    try {
      return StorageUtil.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("Error stringifying localStorage item:", error);
      return false;
    }
  },
};

export default StorageUtil;
