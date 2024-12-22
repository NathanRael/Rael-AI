
import typography from '@tailwindcss/typography';
const colors = {
    'primary': '#421BDD',
    'secondary' : '#821BDE',
    'danger': '#e74c3c',
    'black': '#12161C',
    // 'black': '#09090b',
    'white': '#fafafa',
    'dark': '#12161C',
}

/** @type {import('tailwindcss').Config} */
export default {
        content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "node_modules/rael-ui/dist/*"],
        darkMode: ['selector'],
        theme: {
            extend: {
                typography : {
                    DEFAULTS: {
                        
                    }
                },
                colors: {
                    'dark': colors.dark,
                    primary : {
                        DEFAULT : colors.primary, 
                        100 : 'hsl(var(--color-primary-100))',
                        80 : 'hsl(var(--color-primary-80))',
                    },
                    secondary: {
                        DEFAULT : colors.secondary,
                        100 : 'hsl(var(--color-secondary-100))',
                    },
                    white : {
                        DEFAULT : colors.white,
                        100 : 'hsl(var(--color-white-100))',
                        80 : 'hsl(var(--color-white-80))',
                    },
                    black : {
                        DEFAULT : colors.black,
                        100 : 'hsl(var(--color-black-100))',
                        80 : 'hsl(var(--color-black-80))',
                    },
                    'neutral-light' : {
                        100 : 'hsl(var(--color-neutral-light-100))',
                        80 : 'hsl(var(--color-neutral-light-80))',
                        60 : 'hsl(var(--color-neutral-light-60))',
                    },
                    'neutral-dark' : {
                        100 : 'hsl(var(--color-neutral-dark-100))',
                        80 : 'hsl(var(--color-neutral-dark-80))',
                        60 : 'hsl(var(--color-neutral-dark-60))',
                    },
                    
                    // Component colors

                    input: {
                        fill: {
                            d: {
                                'bg': '#1b1d22',
                                // 'bg': '#27272a',
                                'placeholder' : '#737373',
                                'text' : colors.white,
                                'border' : colors.black,
                            },
                            l: {
                                'bg': '#e5e5e5',
                                'placeholder' : '#737373',
                                'text' : colors.black,
                                'border' : colors.white,

                            }
                        },
                        outline: {
                            d: {
                                'bg': colors.black,
                                'border': '#a3a3a3',
                                'placeholder' : '#a3a3a3',
                                'text' : colors.white,
                            },
                            l: {
                                'bg': colors.white,
                                'border': '#a3a3a3',
                                'placeholder' : '#737373',
                                'text' : colors.black,
                            }
                        }
                    },
                    meta: {
                        fill : {
                            d: {
                                'bg': '#1e2228',
                                // 'bg': '#18181b',
                                'border': '#262626',
                                'text' : colors.white,
                                'text-sec' : '#9ca3af',
                            },
                            l: {
                                'bg': '#fff',
                                'border': '#e4e4e7',
                                'text' : colors.black,
                                'text-sec' : '#4b5563',
                            },
                        },
                        outline : {
                            d: {
                                'bg': colors.black,
                                'border': '#a3a3a3',
                                'text' : colors.white,
                                'text-sec' : '#6b7280',
                            },
                            l: {
                                'bg': colors.white,
                                'border': '#a3a3a3',
                                'text' : colors.black,
                                'text-sec' : '#6b7280',
                            },
                        },
                    }
                },
                fontSize: {
                    'big-title' : ['40px', '60px'],
                    title : ['24px', '36px'],
                    subtitle : ['20px', '30px'],
                    lead : ['18px', '27px'],
                    base : '16px',
                    small : '14px',
                    'small-2' : '12px',
                    "button": "17px",
                },
                fontFamily: {
                    sans: ['SchibsetGrotesk'],
                    md: ['SchibsetGroteskMd'],
                    semibold: ['SchibsetGroteskSemibold'],
                    bold: ['SchibsetGroteskBold'],
                },
                animation: {
                    'slide-in': 'slide-in 0.3s ease-out forwards',
                    'slide-out': 'slide-out 0.3s ease-out forwards',
                },

            },
        },
        plugins: [
            typography
        ],
    };
