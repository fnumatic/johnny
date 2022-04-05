module.exports = {
  mode: 'jit',
  content: ['*.html','*.js'],
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
