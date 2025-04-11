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
        "banner": "url('../src/Assets/Image/Banner.jpg')",
        "AboutBanner": "url('../src/Assets/Image/cms.jpg')",
        "ab_banner": "url('../src/Assets/Image/ab_banner.jpg')",
        "Doctor_Banner": "url('../src/Assets/Image/Find_Banner.png')",
        "Contact_Banner": "url('../src/Assets/Image/contact_banner.jpg')",
        "loginbg": "url('../src/Assets/Image/Logbg.jpg')",
        "auth_bg": "url('../src/Assets/Image/d_bg.png')",
      },
      height: {
        "full": "70vh",
        "90vh": "90vh",
        "50vh": "55vh",
        "75vh": "75vh",
      },
      width: {
        "30rem": "30rem",
        "100rem": "95rem",
        "60rem": "60rem",
        "70rem": "70rem",
      },
      fontSize: {
        "Subheading": "2.8rem",
        "1.8rem": "1.8rem",
        "1.5": "2.5rem",
        "1": "1rem",
        "4rem": "14rem",
      },
      fontFamily: {
        comic: ['"Comic Neue"', 'cursive'],
      },
      colors: {
        "primary": '#4181C2',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1920px', // Custom breakpoint for very large screens (if needed)
        '300px': '300px',
        '350px': '350px',
        '400px': '400px',
        '450px': '450px', // Additional breakpoints
        '500px': '500px',
        '550px': '550px',
        '600px': '600px',
        '650px': '650px',
        '700px': '700px',
        '750px': '750px',
        '800px': '800px',
        '850px': '850px',
        '900px': '900px',
        '950px': '950px',
        '1000px': '1000px',
        '1200px': '1200px',
      },
    },
  },
  plugins: [],
};
