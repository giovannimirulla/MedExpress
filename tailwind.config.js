/** @type {import('tailwindcss').Config} */

export default {
  content: ["./frontend/views/index.html", "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors:{
        "primary-color": "var(--lumo-primary-color)",
        "secondary-color": "var(--lumo-contrast-10pct) ",
        "tertiary-color": "var(--lumo-contrast-30pct) ",
        "button-text-color": "var(--button-text-color) ",
        "line-color": "var(--line-color) ",
        "locale-color": "var(--locale-color) ",


        "heading-text": "var(--lumo-header-text-color)",
        "body-text": "var(--lumo-body-color)",
        "secondary-text-color": "var(--lumo-secondary-text-color)",
        "button-color": "var(--lumo-success-color)",
        "navbar-color": "var(--lumo-contrast-10pct) ",
        "footer-color": "var(--lumo-success-color)",
        "banner-color": "var(--lumo-contrast-5ct)",
        "result-color": "var(--lumo-success-text-color)",
        "test-color": "var(--lumo-warning-color-10pct)",
        "test2-color": "var(--lumo-primary-color)",
        "test3-color": "var(--lumo-primary-text-colors)",
        "header-text-color": "var(--lumo-contrast)",
        "banner-color": "var(--lumo-contrast-90pct)",

        "primary-background-color": "var(--primary-background-color)",
        "body-background-color": "var(--lumo-body-color",
        "secondary-background-color": "var(--secondary-background-color)",
        "tertiary-background-color": "var(--tertiary-background-color)",
        "accent-background-color": "var(--accent-background-color)",
        "text-color": "hsla(214, 78%, 88%, 0.5)",





      }
    },
  },
  plugins: [],
}
