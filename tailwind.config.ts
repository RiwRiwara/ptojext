import { heroui } from '@heroui/theme';
import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/theme";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/(dropdown|select|menu|divider|popover|button|ripple|spinner|form|listbox|scroll-shadow).js"
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'var(--font-en)',
  				'var(--font-th)',
  				'sans-serif'
  			],
  			en: [
  				'var(--font-en)'
  			],
  			th: [
  				'var(--font-th)'
  			]
  		},
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			'primary-50': '#eef6fc',
  			'primary-100': '#d9ebf7',
  			'primary-200': '#b6dbf5',
  			'primary-300': '#83AFC9',
  			'primary-400': '#5a9fc0',
  			'primary-500': '#3b88b8',
  			'primary-600': '#2e6c9a',
  			'primary-700': '#285a7f',
  			'primary-800': '#254c6a',
  			'primary-900': '#23425a',
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			success: '#00D26A',
  			danger: '#F8312F',
  			warning: '#F5C689',
  			info: '#B6DBF5',
  			'primary-default': '#83AFC9',
  			'primary-white': '#FFFFFF',
  			'primary-light-hover': '#DFDFE0',
  			'primary-light-active': '#BCBDBE',
  			'primary-normal': '#83AFC9',
  			'primary-normal-active': '#1F2224',
  			'primary-black': '#000000',
  			functional: {
  				neutral: '#DFDFE0',
  				success: '#00D26A',
  				error: '#F8312F'
  			},
  			logo: {
  				pink: '#F5A2C9',
  				orange: '#F5C689',
  				blue: '#B6DBF5',
  				violet: '#C59BD8'
  			},
  			gradients: {
  				pink: 'linear-gradient(to right, #F5A2C9, #FFC2D6)',
  				orange: 'linear-gradient(to right, #F5C689, #FFD8A9)',
  				blue: 'linear-gradient(to right, #B6DBF5, #D0F0FF)',
  				violet: 'linear-gradient(to right, #C59BD8, #E0B0FF)'
  			},
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
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
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
  			}
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
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [nextui(),
  heroui({
    prefix: "heroui",
    addCommonColors: false,
    defaultTheme: "light",
    defaultExtendTheme: "light",
    layout: {},
    themes: {
      light: {
        layout: {},
        colors: {
          primary: "#83AFC9",
        },
      },
      dark: {
        layout: {},
        colors: {
          primary: "#83AFC9",
        },
      },
    },
  }),
      require("tailwindcss-animate")
],
};
export default config;
