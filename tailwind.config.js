/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '*/*.html',
    './static/js/*.js'
  ],
  theme: {
    extend: {
      width: {
        '1/8': '12.5%',
        '2/8': '25%',
        '3/8': '37.5%',
        '4/8': '50%',
        '5/8': '62.5%',
        '6/8': '75%',
        '7/8': '87.5%',
      },
      backgroundImage: theme => ({
        'leftP': "url('../img/note-l.png')",
        'rightP': "url('../img/note-r.png')",
        'wood': "url('../img/bg-dashboard.png')",
      }),
      fontFamily: {
        notoSer: ['Noto Serif JP', 'serif'],
        allura: ['Allura', 'cursive']
      },
      boxShadow: {
        'inner-custom': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.10)',
      },
    },
    plugins: [],
  }
}
