# Handmade by Egypt - Static Frontend

This is now a fully static frontend that can be run without a server.

## How to Run

1. **Simple Method**: Open `index.html` directly in your web browser
2. **Using Live Server** (recommended for best experience):
   - Install the "Live Server" extension in VS Code
   - Right-click on `index.html` and select "Open with Live Server"
   - This will serve the files locally and handle any CORS issues

## Features

- **Static Data**: All data is loaded from `js/mockData.js`
- **Form Submissions**: Simulated with success messages (no actual backend)
- **GSAP Animations**: Fully functional scroll and interactive animations
- **Responsive Design**: Works on all device sizes
- **Multi-language Support**: English and Arabic (RTL)

## File Structure

```
project/
├── index.html          # Main HTML file
├── styles/            # CSS files
│   ├── main.css       # Main styles with color palette
│   ├── components.css # Component-specific styles
│   ├── responsive.css # Responsive design
│   └── rtl.css       # RTL language support
├── js/               # JavaScript files
│   ├── mockData.js   # Static demo data
│   ├── api.js        # API layer (now static-friendly)
│   ├── main.js       # Main functionality
│   ├── animations.js # GSAP animations
│   ├── cart.js       # Shopping cart
│   ├── forms.js      # Form handling
│   └── language.js   # Language switching
└── server.js         # Server file (not needed for static)
```

## Color Palette

- Primary: #18442A (Deep Green)
- Secondary: #45644A (Medium Green)
- Light: #E4DBC4 (Soft Sand)
- Background: #F3EDE3 (Light Cream)

## Animations

- Scroll-triggered animations using GSAP
- Content stays visible after being revealed
- Smooth transitions and modern effects
- Optimized for performance

## Notes

- All forms will show success messages but won't actually submit data
- Shopping cart works but checkout is simulated
- Contact forms display confirmation messages
- All content is visible and interactive
