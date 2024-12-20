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
        "ab_banner" :  "url('../src/Assets/Image/ab_banner.jpg')",
        "Doctor_Banner" : "url('../src/Assets/Image/Find_Banner.png')",
        "Contact_Banner" : "url('../src/Assets/Image/contact_banner.jpg')",
        "loginbg" : "url('../src/Assets/Image/Logbg.jpg')",

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
      "60rem" : "60rem",
      "70rem" : "70rem"

      },
      fontSize :
      {
        "Subheading" : "2.8rem",
        "1.8rem" : "1.8rem",
        "1.5"  : "2.5rem",
        "1" : "1rem",
        "4rem" : "14rem"
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
