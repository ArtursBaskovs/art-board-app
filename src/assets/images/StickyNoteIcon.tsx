const StickyNoteIcon = ({ color1 = "#5ac9d1", color2 ='#ada4d1', size = 30 }) => (
  <svg
    width={`${size}px`}
    height={`${size}px`}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M36.862 52.6251H14.562C13.5011 52.6251 12.4837 52.2037 11.7336 51.4535C10.9834 50.7034 10.562 49.6859 10.562 48.6251V14.7051C10.562 13.6442 10.9834 12.6268 11.7336 11.8766C12.4837 11.1265 13.5011 10.7051 14.562 10.7051H48.481C49.5419 10.7051 50.5593 11.1265 51.3094 11.8766C52.0596 12.6268 52.481 13.6442 52.481 14.7051V36.9551"
      stroke={color1}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M52.486 36.958L36.857 52.628V36.958H52.486Z"
      stroke={color2}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M31.524 52.628H36.857L52.486 36.958V28.958"
      stroke={color1}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default StickyNoteIcon;
//https://www.svgrepo.com/svg/485539/sticky-note