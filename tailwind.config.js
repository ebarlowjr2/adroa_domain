/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0a1628",           // Dark navy background (onecs.net style)
          card: "#122035",         // Slightly lighter navy for cards
          accent: "#00aff1",       // Bright cyan accent (onecs.net exact color)
          "accent-light": "#33c4f5", // Lighter cyan for hover states
          "accent-dark": "#0099d4",  // Darker cyan for active states
          secondary: "#00aff1",    // Using cyan as secondary too for consistency
          "secondary-light": "#33c4f5", // Lighter cyan
          neutral: {
            50: "#ffffff",         // Pure white
            100: "#f0f4f8",        // Very light neutral
            200: "#d9e2ec",        // Light neutral
            300: "#bcccdc",        // Medium-light neutral
            400: "#9fb3c8",        // Medium neutral
            500: "#627d98",        // Base neutral
            600: "#486581",        // Medium-dark neutral
            700: "#334e68",        // Dark neutral
            800: "#243b53",        // Very dark neutral
            900: "#102a43"         // Deepest neutral
          }
        }
      }
    }
  },
  plugins: []
}
