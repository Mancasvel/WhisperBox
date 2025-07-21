import type { Config } from 'tailwindcss'
import { heroui } from '@heroui/react'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
  			'serif': ['Lora', 'ui-serif', 'Georgia'],
  			'journal': ['Lora', 'ui-serif', 'Georgia'], // For journaling text
  			'ui': ['Inter', 'ui-sans-serif', 'system-ui'], // For UI elements
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			// Emotional journaling color palette
  			emotional: {
  				calm: {
  					50: '#f0f9ff',
  					100: '#e0f2fe',
  					200: '#bae6fd',
  					300: '#7dd3fc',
  					400: '#38bdf8',
  					500: '#0ea5e9',
  					600: '#0284c7',
  					700: '#0369a1',
  					800: '#075985',
  					900: '#0c4a6e',
  				},
  				warm: {
  					50: '#fef7ed',
  					100: '#fdedd3',
  					200: '#fed7aa',
  					300: '#fdba74',
  					400: '#fb923c',
  					500: '#f97316',
  					600: '#ea580c',
  					700: '#c2410c',
  					800: '#9a3412',
  					900: '#7c2d12',
  				},
  				healing: {
  					50: '#f0fdf4',
  					100: '#dcfce7',
  					200: '#bbf7d0',
  					300: '#86efac',
  					400: '#4ade80',
  					500: '#22c55e',
  					600: '#16a34a',
  					700: '#15803d',
  					800: '#166534',
  					900: '#14532d',
  				}
  			}
  		},
  		animation: {
  			'fade-in': 'fadeIn 0.5s ease-in-out',
  			'slide-up': 'slideUp 0.3s ease-out',
  			'gentle-pulse': 'gentlePulse 2s ease-in-out infinite',
  			'float': 'float 3s ease-in-out infinite',
  			'breathe': 'breathe 4s ease-in-out infinite',
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': { opacity: '0' },
  				'100%': { opacity: '1' },
  			},
  			slideUp: {
  				'0%': { opacity: '0', transform: 'translateY(10px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' },
  			},
  			gentlePulse: {
  				'0%, 100%': { opacity: '1' },
  				'50%': { opacity: '0.8' },
  			},
  			float: {
  				'0%, 100%': { transform: 'translateY(0px)' },
  				'50%': { transform: 'translateY(-4px)' },
  			},
  			breathe: {
  				'0%, 100%': { transform: 'scale(1)' },
  				'50%': { transform: 'scale(1.05)' },
  			},
  		},
  		backdropBlur: {
  			xs: '2px',
  		},
  		typography: (theme: any) => ({
  			journal: {
  				css: {
  					'--tw-prose-body': theme('colors.stone.200'),
  					'--tw-prose-headings': theme('colors.stone.100'),
  					'--tw-prose-links': theme('colors.emotional.calm.400'),
  					'--tw-prose-bold': theme('colors.stone.100'),
  					'--tw-prose-code': theme('colors.stone.300'),
  					'--tw-prose-pre-code': theme('colors.stone.200'),
  					'--tw-prose-pre-bg': theme('colors.stone.900'),
  					'--tw-prose-quotes': theme('colors.stone.300'),
  					fontFamily: theme('fontFamily.journal'),
  					fontSize: '1.1rem',
  					lineHeight: '1.8',
  					p: {
  						marginTop: '1.25em',
  						marginBottom: '1.25em',
  					},
  				},
  			},
  			ai: {
  				css: {
  					'--tw-prose-body': theme('colors.stone.300'),
  					'--tw-prose-headings': theme('colors.stone.200'),
  					fontFamily: theme('fontFamily.ui'),
  					fontSize: '0.95rem',
  					lineHeight: '1.6',
  				},
  			},
  		}),
  	}
  },
  darkMode: ["class", 'class'],
  plugins: [
    heroui(), 
    require("tailwindcss-animate"),
    require('@tailwindcss/typography'),
  ]
}
export default config 