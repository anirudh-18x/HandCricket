/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-contrast, clean, and pleasing light theme to easily differentiate components
        c: {
          bg:       '#F4F2EB',   // soft warm ivory background
          surface:  '#FFFFFF',   // clean white panels (stands out starkly from ivory bg)
          card:     '#FAF8F5',   // light warm card fill
          border:   '#AFA493',   // darker, high-contrast border for clear component boundaries
          text:     '#1C150C',   // deep charcoal-black text for sharp readability
          muted:    '#5C5243',   // dark gray-brown for readable secondary text

          // Lush grass green
          green:    '#1E7F4E',   // dark emerald green (high contrast)
          greenlt:  '#E2F5EC',   // light green tint
          greenmd:  '#9AD8B9',   // medium green border

          // Clay / wicket red
          coral:    '#C84B3B',   // deep terracotta red
          corallt:  '#FCECE9',   // light red tint

          // Saffron gold
          gold:     '#C28711',   // warm ochre gold
          goldlt:   '#FDF4DF',   // light gold tint

          // Clear sky blue
          blue:     '#3673B5',   // distinct sky blue
          bluelt:   '#EBF3FC',   // light blue tint

          // Accents — soft warm orange & lavender
          orange:   '#C6682B',   // warm leather orange
          orangelt: '#FDF1E9',   // light orange tint
          indigo:   '#705EB1',   // deep lavender
          indigolt: '#F1EEF8',   // light lavender tint

          nav:      '#EBE8E0',   // slightly darker warm navbar to anchor the page top
        }
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif']
      },
      animation: {
        'bounce-gentle': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        'pop': 'pop 0.25s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        pop: {
          '0%':   { transform: 'scale(0.92)' },
          '60%':  { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
