/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
    './src/hooks/**/*.{js,ts,jsx,tsx}',
    './src/context/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // Soporte para modo oscuro
  theme: {
    extend: {
      colors: {
        // ===== COLORES PRINCIPALES DEL SISTEMA =====
        'azul-oscuro': {
          DEFAULT: '#19407b',
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae3fd',
          300: '#7ccefb',
          400: '#37b6f7',
          500: '#0d9fe8',
          600: '#0180c7',
          700: '#19407b', // Color principal
          800: '#1a4c7d',
          900: '#1b4c7f',
          950: '#132f52',
        },
        'azul-medio': {
          DEFAULT: '#0075bf',
          50: '#eff9ff',
          100: '#def3ff',
          200: '#b6e8ff',
          300: '#75d7ff',
          400: '#2cc4ff',
          500: '#0075bf', // Color principal
          600: '#0084d1',
          700: '#006ba5',
          800: '#005c89',
          900: '#064e72',
          950: '#04314b',
        },
        'azul-claro': {
          DEFAULT: '#08dcff',
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#08dcff', // Color principal
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        'blanco': {
          DEFAULT: '#ffffff',
          50: '#ffffff',
          100: '#fefefe',
          200: '#fdfdfd',
          300: '#fcfcfc',
          400: '#fafafa',
          500: '#f8f8f8',
        },
        
        // ===== COLORES SECUNDARIOS/NEUTROS =====
        'gris-claro': {
          DEFAULT: '#f4f4f4',
          50: '#f9f9f9',
          100: '#f4f4f4', // Color principal
          200: '#efefef',
          300: '#e5e5e5',
          400: '#d4d4d4',
          500: '#a3a3a3',
        },
        'gris-medio': {
          DEFAULT: '#e0e0e0',
          50: '#f7f7f7',
          100: '#ededed',
          200: '#e0e0e0', // Color principal
          300: '#c8c8c8',
          400: '#adadad',
          500: '#999999',
          600: '#888888',
          700: '#7b7b7b',
          800: '#676767',
          900: '#545454',
        },
        'borde': {
          DEFAULT: '#dddddd',
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#dddddd', // Color principal
          300: '#cccccc',
          400: '#b3b3b3',
          500: '#999999',
        },
        
        // ===== COLORES DE ESTADO =====
        'rojo-error': {
          DEFAULT: '#ff4d4d',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ff4d4d', // Color principal
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        'rojo-hover': {
          DEFAULT: '#c0392b',
          500: '#c0392b', // Color principal
          600: '#a93226',
          700: '#922b21',
        },
        'verde-exito': {
          DEFAULT: '#4caf50',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#4caf50', // Color principal
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        
        // ===== COLORES EXTENDIDOS PARA UX =====
        primary: {
          DEFAULT: '#0075bf',
          50: '#eff9ff',
          100: '#def3ff',
          200: '#b6e8ff',
          300: '#75d7ff',
          400: '#2cc4ff',
          500: '#0075bf',
          600: '#0084d1',
          700: '#19407b',
          800: '#1a4c7d',
          900: '#1b4c7f',
          950: '#132f52',
        },
        secondary: {
          DEFAULT: '#e0e0e0',
          50: '#f4f4f4',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#dddddd',
          400: '#c4c4c4',
          500: '#9ca3af',
          600: '#6b7280',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        accent: {
          DEFAULT: '#08dcff',
          light: '#66e7ff',
          dark: '#0099cc',
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#08dcff',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        success: {
          DEFAULT: '#4caf50',
          light: '#81c784',
          dark: '#388e3c',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#4caf50',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        error: {
          DEFAULT: '#ff4d4d',
          hover: '#c0392b',
          light: '#ffcdd2',
          dark: '#d32f2f',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ff4d4d',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        warning: {
          DEFAULT: '#f59e0b',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        info: {
          DEFAULT: '#3b82f6',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        
        // ===== COLORES ESPECIALES =====
        sidebar: {
          bg: '#19407b',
          hover: 'rgba(8, 220, 255, 0.1)',
          active: 'rgba(8, 220, 255, 0.15)',
          border: 'rgba(8, 220, 255, 0.2)',
        },
        modal: {
          overlay: 'rgba(25, 64, 123, 0.1)',
          bg: 'rgba(255, 255, 255, 0.95)',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.15)',
          medium: 'rgba(255, 255, 255, 0.25)',
          dark: 'rgba(25, 64, 123, 0.1)',
        }
      },
      
      // ===== TIPOGRAFÍA EXTENDIDA =====
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        display: ['Inter Display', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      
      // ===== SOMBRAS NEUMÓRFICAS COMPLETAS =====
      boxShadow: {
        // Sombras neumórficas básicas
        'neu-xs': '1px 1px 2px rgba(25, 64, 123, 0.08), -1px -1px 2px rgba(255, 255, 255, 0.9)',
        'neu-sm': '2px 2px 4px rgba(25, 64, 123, 0.1), -2px -2px 4px rgba(255, 255, 255, 0.8)',
        'neu': '4px 4px 8px rgba(25, 64, 123, 0.15), -4px -4px 8px rgba(255, 255, 255, 0.7)',
        'neu-md': '6px 6px 12px rgba(25, 64, 123, 0.18), -6px -6px 12px rgba(255, 255, 255, 0.65)',
        'neu-lg': '8px 8px 16px rgba(25, 64, 123, 0.2), -8px -8px 16px rgba(255, 255, 255, 0.6)',
        'neu-xl': '12px 12px 24px rgba(25, 64, 123, 0.25), -12px -12px 24px rgba(255, 255, 255, 0.5)',
        'neu-2xl': '16px 16px 32px rgba(25, 64, 123, 0.3), -16px -16px 32px rgba(255, 255, 255, 0.4)',
        
        // Sombras invertidas (hundidas)
        'neu-inset-xs': 'inset 1px 1px 2px rgba(25, 64, 123, 0.08), inset -1px -1px 2px rgba(255, 255, 255, 0.9)',
        'neu-inset-sm': 'inset 2px 2px 4px rgba(25, 64, 123, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.8)',
        'neu-inset': 'inset 3px 3px 6px rgba(25, 64, 123, 0.12), inset -3px -3px 6px rgba(255, 255, 255, 0.75)',
        'neu-inset-md': 'inset 4px 4px 8px rgba(25, 64, 123, 0.15), inset -4px -4px 8px rgba(255, 255, 255, 0.7)',
        'neu-inset-lg': 'inset 6px 6px 12px rgba(25, 64, 123, 0.18), inset -6px -6px 12px rgba(255, 255, 255, 0.65)',
        'neu-inset-xl': 'inset 8px 8px 16px rgba(25, 64, 123, 0.2), inset -8px -8px 16px rgba(255, 255, 255, 0.6)',
        
        // Sombras de estado
        'neu-hover': '6px 6px 12px rgba(25, 64, 123, 0.18), -6px -6px 12px rgba(255, 255, 255, 0.65)',
        'neu-active': 'inset 1px 1px 2px rgba(25, 64, 123, 0.2), inset -1px -1px 2px rgba(255, 255, 255, 0.9)',
        'neu-focus': '0 0 0 3px rgba(8, 220, 255, 0.3), 4px 4px 8px rgba(25, 64, 123, 0.15), -4px -4px 8px rgba(255, 255, 255, 0.7)',
        
        // Sombras flotantes
        'modal': '0 25px 50px -12px rgba(25, 64, 123, 0.25)',
        'dropdown': '0 10px 25px rgba(25, 64, 123, 0.15)',
        'tooltip': '0 4px 14px rgba(25, 64, 123, 0.12)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'card-hover': '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
        
        // Glassmorphism
        'glass': '0 8px 32px rgba(8, 220, 255, 0.1)',
        'glass-lg': '0 16px 64px rgba(8, 220, 255, 0.15)',
        
        // Sombras de botones
        'btn': '0 2px 4px rgba(25, 64, 123, 0.1)',
        'btn-hover': '0 4px 8px rgba(25, 64, 123, 0.15)',
        'btn-active': 'inset 0 2px 4px rgba(25, 64, 123, 0.1)',
        
        // Sombras especiales
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'outline': '0 0 0 3px rgba(8, 220, 255, 0.5)',
        'none': 'none',
      },
      
      // ===== ANIMACIONES COMPLETAS =====
      animation: {
        // Animaciones básicas
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-out': 'fadeOut 0.3s ease-in',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'fade-in-left': 'fadeInLeft 0.5s ease-out',
        'fade-in-right': 'fadeInRight 0.5s ease-out',
        
        // Animaciones de deslizamiento
        'slide-in-up': 'slideInUp 0.4s ease-out',
        'slide-in-down': 'slideInDown 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-out-up': 'slideOutUp 0.3s ease-in',
        'slide-out-down': 'slideOutDown 0.3s ease-in',
        'slide-out-left': 'slideOutLeft 0.3s ease-in',
        'slide-out-right': 'slideOutRight 0.3s ease-in',
        
        // Animaciones neumórficas
        'neu-hover': 'neuHover 0.2s ease-out',
        'neu-press': 'neuPress 0.1s ease-in',
        'neu-release': 'neuRelease 0.15s ease-out',
        'neu-float': 'neuFloat 0.3s ease-out',
        
        // Animaciones de modal y overlay
        'modal-appear': 'modalAppear 0.3s ease-out',
        'modal-disappear': 'modalDisappear 0.2s ease-in',
        'overlay-appear': 'overlayAppear 0.3s ease-out',
        'overlay-disappear': 'overlayDisappear 0.2s ease-in',
        
        // Animaciones de glassmorphism
        'glass-appear': 'glassAppear 0.4s ease-out',
        'glass-disappear': 'glassDisappear 0.3s ease-in',
        
        // Animaciones sutiles
        'bounce-subtle': 'bounceSubtle 0.6s ease-out',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'sway': 'sway 4s ease-in-out infinite',
        
        // Animaciones de carga
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        
        // Animaciones de notificación
        'notification-enter': 'notificationEnter 0.4s ease-out',
        'notification-exit': 'notificationExit 0.3s ease-in',
        'toast-enter': 'toastEnter 0.3s ease-out',
        'toast-exit': 'toastExit 0.2s ease-in',
        
        // Animaciones de elementos de UI
        'dropdown-enter': 'dropdownEnter 0.2s ease-out',
        'dropdown-exit': 'dropdownExit 0.15s ease-in',
        'accordion-down': 'accordionDown 0.2s ease-out',
        'accordion-up': 'accordionUp 0.2s ease-out',
        
        // Efectos especiales
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'heartbeat': 'heartbeat 1s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'rubber-band': 'rubberBand 1s ease-out',
        'zoom-in': 'zoomIn 0.3s ease-out',
        'zoom-out': 'zoomOut 0.2s ease-in',
        'rotate-in': 'rotateIn 0.5s ease-out',
        'flip': 'flip 0.6s ease-in-out',
      },
      
      // ===== KEYFRAMES COMPLETOS =====
      keyframes: {
        // Fade animations
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        
        // Slide animations
        slideInUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutUp: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-100%)', opacity: '0' },
        },
        slideOutDown: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        slideOutLeft: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        
        // Neumorphism animations
        neuHover: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-2px)' },
        },
        neuPress: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.98)' },
        },
        neuRelease: {
          '0%': { transform: 'scale(0.98)' },
          '100%': { transform: 'scale(1)' },
        },
        neuFloat: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-4px)' },
        },
        
        // Modal animations
        modalAppear: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        modalDisappear: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.9)' },
        },
        overlayAppear: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        overlayDisappear: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        
        // Glass animations
        glassAppear: {
          '0%': { opacity: '0', backdropFilter: 'blur(0px)' },
          '100%': { opacity: '1', backdropFilter: 'blur(10px)' },
        },
        glassDisappear: {
          '0%': { opacity: '1', backdropFilter: 'blur(10px)' },
          '100%': { opacity: '0', backdropFilter: 'blur(0px)' },
        },
        
        // Subtle animations
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sway: {
          '0%, 100%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(5px)' },
        },
        
        // Notification animations
        notificationEnter: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        notificationExit: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(100%)' },
        },
        toastEnter: {
          '0%': { opacity: '0', transform: 'translateY(-20px) scale(0.9)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        toastExit: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-20px) scale(0.9)' },
        },
        
        // UI element animations
        dropdownEnter: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        dropdownExit: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' },
        },
        accordionDown: {
          '0%': { height: '0' },
          '100%': { height: 'var(--radix-accordion-content-height)' },
        },
        accordionUp: {
          '0%': { height: 'var(--radix-accordion-content-height)' },
          '100%': { height: '0' },
        },
        
        // Special effects
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(8, 220, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(8, 220, 255, 0.8)' },
        },
        heartbeat: {
          '0%, 50%, 100%': { transform: 'scale(1)' },
          '25%, 75%': { transform: 'scale(1.1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        rubberBand: {
          '0%': { transform: 'scale3d(1, 1, 1)' },
          '30%': { transform: 'scale3d(1.25, 0.75, 1)' },
          '40%': { transform: 'scale3d(0.75, 1.25, 1)' },
          '50%': { transform: 'scale3d(1.15, 0.85, 1)' },
          '65%': { transform: 'scale3d(0.95, 1.05, 1)' },
          '75%': { transform: 'scale3d(1.05, 0.95, 1)' },
          '100%': { transform: 'scale3d(1, 1, 1)' },
        },
        zoomIn: {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        zoomOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.5)' },
        },
        rotateIn: {
          '0%': { opacity: '0', transform: 'rotate(-180deg)' },
          '100%': { opacity: '1', transform: 'rotate(0deg)' },
        },
        flip: {
          '0%': { transform: 'perspective(400px) rotateY(0)' },
          '40%': { transform: 'perspective(400px) translateZ(150px) rotateY(-190deg)' },
          '50%': { transform: 'perspective(400px) translateZ(150px) rotateY(-190deg)' },
          '80%': { transform: 'perspective(400px) rotateY(0deg)' },
          '100%': { transform: 'perspective(400px)' },
        },
      },
      
      // ===== BORDES Y RADIOS =====
      borderRadius: {
        'none': '0px',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
        
        // Bordes neumórficos
        'neu-xs': '4px',
        'neu-sm': '8px',
        'neu': '12px',
        'neu-md': '14px',
        'neu-lg': '16px',
        'neu-xl': '20px',
        'neu-2xl': '24px',
        'neu-3xl': '28px',
        'neu-full': '9999px',
      },
      borderWidth: {
        'DEFAULT': '1px',
        '0': '0px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
      },
      
      // ===== ESPACIADO EXTENDIDO =====
      spacing: {
        '0': '0px',
        'px': '1px',
        '0.5': '0.125rem',
        '1': '0.25rem',
        '1.5': '0.375rem',
        '2': '0.5rem',
        '2.5': '0.625rem',
        '3': '0.75rem',
        '3.5': '0.875rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
        '9': '2.25rem',
        '10': '2.5rem',
        '11': '2.75rem',
        '12': '3rem',
        '14': '3.5rem',
        '16': '4rem',
        '18': '4.5rem',
        '20': '5rem',
        '22': '5.5rem',
        '24': '6rem',
        '28': '7rem',
        '32': '8rem',
        '36': '9rem',
        '40': '10rem',
        '44': '11rem',
        '48': '12rem',
        '52': '13rem',
        '56': '14rem',
        '60': '15rem',
        '64': '16rem',
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
        
        // Espacios especiales para el diseño
        'sidebar': '16rem',
        'sidebar-collapsed': '4rem',
        'header': '4rem',
        'content': 'calc(100vh - 4rem)',
      },
      
      // ===== TAMAÑOS =====
      width: {
        'auto': 'auto',
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '2/4': '50%',
        '3/4': '75%',
        '1/5': '20%',
        '2/5': '40%',
        '3/5': '60%',
        '4/5': '80%',
        '1/6': '16.666667%',
        '2/6': '33.333333%',
        '3/6': '50%',
        '4/6': '66.666667%',
        '5/6': '83.333333%',
        'full': '100%',
        'screen': '100vw',
        'min': 'min-content',
        'max': 'max-content',
        'fit': 'fit-content',
        
        // Tamaños específicos
        'sidebar': '16rem',
        'sidebar-collapsed': '4rem',
        'content': 'calc(100% - 16rem)',
        'content-collapsed': 'calc(100% - 4rem)',
      },
      height: {
        'auto': 'auto',
        'full': '100%',
        'screen': '100vh',
        'min': 'min-content',
        'max': 'max-content',
        'fit': 'fit-content',
        
        // Alturas específicas
        'header': '4rem',
        'content': 'calc(100vh - 4rem)',
        'modal': 'calc(100vh - 8rem)',
      },
      
      // ===== EFECTOS DE BLUR =====
      backdropBlur: {
        'none': 'none',
        'sm': 'blur(4px)',
        'DEFAULT': 'blur(8px)',
        'md': 'blur(12px)',
        'lg': 'blur(16px)',
        'xl': 'blur(24px)',
        '2xl': 'blur(40px)',
        '3xl': 'blur(64px)',
        
        // Blur neumórfico
        'neu': 'blur(10px)',
        'neu-sm': 'blur(6px)',
        'neu-lg': 'blur(16px)',
      },
      
      // ===== OPACIDAD =====
      opacity: {
        '0': '0',
        '5': '0.05',
        '10': '0.1',
        '15': '0.15',
        '20': '0.2',
        '25': '0.25',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '75': '0.75',
        '80': '0.8',
        '85': '0.85',
        '90': '0.9',
        '95': '0.95',
        '100': '1',
      },
      
      // ===== TRANSFORMACIONES =====
      scale: {
        '0': '0',
        '50': '.5',
        '75': '.75',
        '90': '.9',
        '95': '.95',
        '100': '1',
        '105': '1.05',
        '110': '1.1',
        '125': '1.25',
        '150': '1.5',
        
        // Escalas neumórficas
        'neu-press': '0.98',
        'neu-hover': '1.02',
        'neu-active': '0.96',
      },
      rotate: {
        '0': '0deg',
        '1': '1deg',
        '2': '2deg',
        '3': '3deg',
        '6': '6deg',
        '12': '12deg',
        '45': '45deg',
        '90': '90deg',
        '180': '180deg',
      },
      
      // ===== TRANSICIONES =====
      transitionProperty: {
        'none': 'none',
        'all': 'all',
        'default': 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
        'opacity': 'opacity',
        'shadow': 'box-shadow',
        'transform': 'transform',
        'neu': 'all, box-shadow, transform',
      },
      transitionTimingFunction: {
        'DEFAULT': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'linear': 'linear',
        'in': 'cubic-bezier(0.4, 0, 1, 1)',
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'neu': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      transitionDuration: {
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
        'neu': '200ms',
        'neu-fast': '100ms',
        'neu-slow': '300ms',
      },
      
      // ===== Z-INDEX =====
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        'auto': 'auto',
        
        // Z-index específicos
        'sidebar': '40',
        'header': '50',
        'dropdown': '60',
        'modal': '70',
        'tooltip': '80',
        'notification': '90',
        'overlay': '100',
      },
      
      // ===== FILTROS =====
      blur: {
        'none': 'none',
        'sm': 'blur(4px)',
        'DEFAULT': 'blur(8px)',
        'md': 'blur(12px)',
        'lg': 'blur(16px)',
        'xl': 'blur(24px)',
        '2xl': 'blur(40px)',
        '3xl': 'blur(64px)',
      },
      brightness: {
        '0': '0',
        '50': '.5',
        '75': '.75',
        '90': '.9',
        '95': '.95',
        '100': '1',
        '105': '1.05',
        '110': '1.1',
        '125': '1.25',
        '150': '1.5',
        '200': '2',
      },
      contrast: {
        '0': '0',
        '50': '.5',
        '75': '.75',
        '100': '1',
        '125': '1.25',
        '150': '1.5',
        '200': '2',
      },
      
      // ===== GRADIENTES =====
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #19407b 0%, #0075bf 100%)',
        'gradient-accent': 'linear-gradient(135deg, #0075bf 0%, #08dcff 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'gradient-neu': 'linear-gradient(145deg, #f4f4f4 0%, #e0e0e0 100%)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(8, 220, 255, 0.4), transparent)',
      },
      
      // ===== VARIABLES PERSONALIZADAS =====
      content: {
        'none': 'none',
        'empty': '""',
      },
      
      // ===== CONFIGURACIONES DE CONTENEDOR =====
      container: {
        center: true,
        padding: {
          'DEFAULT': '1rem',
          'sm': '2rem',
          'lg': '4rem',
          'xl': '5rem',
          '2xl': '6rem',
        },
        screens: {
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
          '2xl': '1536px',
        },
      },
      
      // ===== BREAKPOINTS PERSONALIZADOS =====
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1792px',
        
        // Breakpoints para sidebar
        'sidebar-lg': '1200px',
        'sidebar-xl': '1400px',
        
        // Breakpoints para componentes específicos
        'mobile': { 'max': '767px' },
        'tablet': { 'min': '768px', 'max': '1023px' },
        'desktop': { 'min': '1024px' },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    
    // Plugin personalizado para utilidades neumórficas
    function({ addUtilities, addComponents, theme }) {
      const newUtilities = {
        // Utilidades de hover neumórfico
        '.hover-neu': {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme('boxShadow.neu-hover'),
            transition: 'all 0.2s ease-out',
          },
        },
        
        // Utilidades de press neumórfico
        '.active-neu': {
          '&:active': {
            transform: 'scale(0.98)',
            boxShadow: theme('boxShadow.neu-active'),
            transition: 'all 0.1s ease-in',
          },
        },
        
        // Utilidades de glassmorphism
        '.glass-light': {
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-medium': {
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        },
        '.glass-dark': {
          background: 'rgba(25, 64, 123, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(25, 64, 123, 0.2)',
        },
        
        // Scrollbars personalizados
        '.scrollbar-neu': {
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme('colors.gris-claro.DEFAULT'),
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme('colors.gris-medio.DEFAULT'),
            borderRadius: '4px',
            border: `2px solid ${theme('colors.gris-claro.DEFAULT')}`,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme('colors.azul-medio.DEFAULT'),
          },
        },
        
        // Texto con gradiente
        '.text-gradient-primary': {
          background: theme('backgroundImage.gradient-primary'),
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        '.text-gradient-accent': {
          background: theme('backgroundImage.gradient-accent'),
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        
        // Efectos de shimmer
        '.shimmer': {
          background: theme('backgroundImage.shimmer'),
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        },
      }
      
      const newComponents = {
        // Componente de botón neumórfico base
        '.btn-neu': {
          '@apply neu-button hover-neu active-neu px-6 py-3 rounded-neu font-medium transition-all duration-neu': {},
        },
        
        // Componente de tarjeta neumórfica base
        '.card-neu': {
          '@apply neu-card p-6 rounded-neu hover-neu': {},
        },
        
        // Componente de input neumórfico base
        '.input-neu': {
          '@apply neu-input w-full px-4 py-3 rounded-neu border-0 focus:ring-2 focus:ring-azul-claro/30': {},
        },
      }
      
      addUtilities(newUtilities)
      addComponents(newComponents)
    },
  ],
}