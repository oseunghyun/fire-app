/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard-Medium'],
        'pretendard-strong': ['Pretendard-SemiBold'],
        'pretendard-bold': ['Pretendard-Bold'],
        display: ['JoyfulStory'],
        sticker: ['AbiMimi'],
      },
    },
  },
  plugins: [],
};
