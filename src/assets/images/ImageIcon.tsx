const ImageIcon = ({ color1 = "#ada4d1", color2 ='#5ac9d1', size = 30 }) => (
  <svg
    width={`${size}px`}
    height={`${size}px`}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.53 2.78339H6.47009C4.43401 2.78339 2.78345 4.43395 2.78345 6.47002V17.5299C2.78345 19.566 4.43401 21.2166 6.47009 21.2166H17.53C19.5661 21.2166 21.2167 19.566 21.2167 17.53V6.47003C21.2167 4.43395 19.5661 2.78339 17.53 2.78339Z"
      stroke={color1}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M8.31341 21.2166C8.31341 19.2476 8.85425 16.3772 10.4311 13.8433M21.2166 8.31335C15.6197 8.31335 12.2988 10.8423 10.4311 13.8433M2.78345 12C4.19526 11.477 7.70134 11.1135 10.4311 13.8433"
      stroke={color1}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <circle cx="7.85246" cy="6.93089" r="1.38249" fill={color2} />
  </svg>
);

export default ImageIcon;
//https://www.svgrepo.com/svg/474683/image