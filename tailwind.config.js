module.exports = {
  mode: 'jit',
  purge: ['*.html','*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
        backgroundSize: {
            '100wh': '100vw 100vh',
            '100%': '100% 100%',
        }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
