export interface Scene {
    id: string; // Unique identifier (e.g., 'tennis_court_day', 'classroom')
    name: string; // Display name (optional)
    backgroundPath: string; // Path to background image
    // You might add things like available characters in this scene, entry BGM, etc. later
  }