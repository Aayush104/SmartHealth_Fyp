/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "hero": "url('../src/Assets/Image/Intro.png')",
        "banner" : "url('../src/Assets/Image/Banner.jpg')",
        "AboutBanner" :  "url('../src/Assets/Image/cms.jpg')",
        "ab" :  "url('../src/Assets/Image/ab.jpg')",
        "Doctor_Banner" : "url('../src/Assets/Image/Find_Banner.png')",

      }, 
      height:{
        "full":"70vh",
        "90vh" : "90vh",
        "50vh" : "55vh",
        "75vh" : "75vh"

      },
      width :{

      "30rem": "30rem",
      "100rem": "95rem",
      "60rem" : "60rem"

      },
      fontSize :
      {
        "Subheading" : "2.8rem",
        "1.8rem" : "1.8rem",
        "1" : "1rem"
      },
      fontFamily: {
        comic: ['"Comic Neue"', 'cursive'], 
      },
      colors :
      {
         "primary": '#336699'
      }
    },
  },
  plugins: [],
};
