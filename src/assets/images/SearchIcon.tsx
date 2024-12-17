const SearchIcon = ({ size = 30, color = "#5ac9d1", color2 ='#ada4d1' }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      fill="none"
    >
      <path
        d="M515.967 232.506c-98.756 0.043-178.955 80.241-179 179 0 12.355 10.017 22.375 22.375 22.375s22.375-10.02 22.375-22.375c0.009-37.046 15.016-70.481 39.378-94.874 24.393-24.36 57.828-39.369 94.872-39.378 12.358 0 22.375-10.017 22.375-22.373 0-12.357-10.017-22.375-22.375-22.375zM448.876 814.256h134.25c12.355 0 22.375-10.02 22.375-22.375 0-12.358-10.02-22.375-22.375-22.375h-134.25c-12.358 0-22.375 10.017-22.375 22.375 0 12.356 10.017 22.375 22.375 22.375M426.467 724.756h179c12.358 0 22.375-10.02 22.375-22.375 0-12.358-10.017-22.375-22.375-22.375h-179c-12.358 0-22.375 10.017-22.375 22.375 0 12.356 10.018 22.375 22.375 22.375"
        fill={color}
      />
      <path
        d="M516.001 143.004c-148.015 0.056-268.444 120.487-268.5 268.5-0.016 83.423 38.145 157.8 97.604 206.975l0.116 0.094c22.648 18.562 36.561 43.819 36.529 70.828v80.103c-0.029 12.167 4.898 23.617 13.04 31.71 8.093 8.14 19.542 13.069 31.71 13.04h12.034c15.626 26.631 44.37 44.669 77.466 44.75 32.981-0.074 61.764-18.028 77.171-44.75H605.5c12.165 0.029 23.615-4.9 31.708-13.04 8.142-8.093 13.069-19.542 13.04-31.71v-80.103c-0.004-27.233 13.559-52.349 36.082-70.828 59.999-49.209 98.19-123.649 98.168-207.069-0.055-148.013-120.484-268.444-268.497-268.5z m141.976 440.947c-31.128 25.34-52.472 62.867-52.476 105.451v80.103h-42.363l-5.198 15.083c-5.806 16.987-22.659 29.754-41.94 29.667-19.245 0.096-36.263-12.669-42.504-29.991l-5.343-14.759h-41.655v-80.103c-0.031-42.806-21.921-80.196-52.971-105.487l0.116 0.094c-49.728-41.221-81.38-102.887-81.396-172.505 0.009-61.652 25.076-117.469 65.664-158.088 40.617-40.586 96.436-65.655 158.088-65.662 61.652 0.007 117.469 25.076 158.088 65.662 40.586 40.62 65.653 96.436 65.662 158.088-0.02 69.622-31.641 131.223-81.772 172.447z"
        fill={color2}
      />
    </svg>
  );
  
  export default SearchIcon;
  //https://www.svgrepo.com/svg/492013/light-bulb