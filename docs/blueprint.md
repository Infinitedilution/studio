# **App Name**: Orbital Dock

## Core Features:

- App Grid Display: Display apps in a macOS-inspired, customizable grid interface, complete with icon hover effects, optional scaling animations, and subtle shadowing.
- Real-time App Search: Top-mounted search bar for quick filtering of apps by name.
- Quick Access Dock: Bottom or side dock for one-click access to favorite and frequently used apps.
- App Launch: Open app URLs in a new tab when an app icon is clicked.
- Custom App Addition: Add new apps by entering a URL. Secure URL validation ensures the URL is reachable via HTTPS.
- AI Category Suggestion: Use Gemini API to tool for categorizing user-added apps based on content from the entered URL.
- Wiggle Mode Editing: Wiggle mode imitates the macOS editing experience where app icons shake to allow deletion of custom apps. An 'X' is overlaid over each icon to facilitate one-click deletion. Optional confirmation dialog box to avoid accidental removal.

## Style Guidelines:

- Primary color: Soft blue (#749FDC), reminiscent of macOS Big Sur's default wallpaper, providing a calm and familiar aesthetic.
- Background color: Light gray (#F0F2F5), a desaturated extension of the soft blue, creating a clean backdrop that enhances the app icons' vibrancy.
- Accent color: Muted purple (#9F86C0), analogous to the primary blue but distinct enough to draw attention to interactive elements without overwhelming the UI.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines to provide a modern, computerized feel, paired with 'Inter' (sans-serif) for body text to ensure readability and a neutral aesthetic.
- Custom icons designed to reflect the branding of each Sonic network app. User-added app icons dynamically fetched from provided URLs with fallback to default icons if fetching fails.
- Grid-based layout resembling macOS Launchpad for a clean and intuitive user experience. A bottom dock provides quick access to favorite or frequently used apps.
- Smooth animations using Framer Motion for hover effects, drag-and-drop, wiggle mode, and transitions to enhance user interaction and provide a polished feel.