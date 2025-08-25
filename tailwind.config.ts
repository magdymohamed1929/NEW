import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					glow: 'hsl(var(--secondary-glow))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					glow: 'hsl(var(--accent-glow))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
					border: 'hsl(var(--card-border))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				holographic: {
					DEFAULT: 'hsl(var(--holographic))',
					secondary: 'hsl(var(--holographic-secondary))'
				},
				grid: {
					DEFAULT: 'hsl(var(--grid))',
					glow: 'hsl(var(--grid-glow))'
				},
				glass: {
					bg: 'hsl(var(--glass-bg))',
					border: 'hsl(var(--glass-border))'
				},
				hover: 'hsl(var(--hover))',
				active: 'hsl(var(--active))',
				particle: {
					cyan: 'hsl(var(--particle-cyan))',
					purple: 'hsl(var(--particle-purple))',
					magenta: 'hsl(var(--particle-magenta))'
				}
			},
			fontFamily: {
				orbitron: ['Orbitron', 'monospace'],
				inter: ['Inter', 'sans-serif'],
				arabic: ['Cairo', 'Inter', 'sans-serif']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'holographic-shift': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				},
				'floating': {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
					'33%': { transform: 'translateY(-10px) rotate(1deg)' },
					'66%': { transform: 'translateY(5px) rotate(-1deg)' }
				},
				'particle-float': {
					'0%': { 
						transform: 'translateY(100vh) scale(0)',
						opacity: '0'
					},
					'10%': { opacity: '1' },
					'90%': { opacity: '1' },
					'100%': { 
						transform: 'translateY(-100px) scale(1)',
						opacity: '0'
					}
				},
				'pulse-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 20px hsl(var(--primary) / 0.3)'
					},
					'50%': { 
						boxShadow: '0 0 40px hsl(var(--primary) / 0.6), 0 0 80px hsl(var(--primary) / 0.3)'
					}
				},
				'rocket-launch': {
					'0%': {
						transform: 'translateY(0) scale(1)',
						opacity: '0.8'
					},
					'100%': {
						transform: 'translateY(-100vh) scale(0.3)',
						opacity: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'holographic-shift': 'holographic-shift 3s ease-in-out infinite',
				'floating': 'floating 3s ease-in-out infinite',
				'particle-float': 'particle-float 4s linear infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'rocket-launch': 'rocket-launch 3s var(--ease-premium) forwards'
			},
			backdropBlur: {
				'xs': '2px',
				'4xl': '72px'
			},
			transitionTimingFunction: {
				'premium': 'cubic-bezier(0.16, 1, 0.3, 1)',
				'elastic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
