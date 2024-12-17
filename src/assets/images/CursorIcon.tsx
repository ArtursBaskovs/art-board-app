const CursorIcon = ({ color1 = "#5ac9d1", color2 ='#ada4d1', size = 30, strokeWidth = 1.7 }) => (
    <svg
      width={`${size}px`}
      height={`${size}px`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.4933 2.84436H6.50649C4.48389 2.84436 2.84424 4.48401 2.84424 6.50662V17.4934C2.84424 19.516 4.48389 21.1556 6.50649 21.1556H17.4933C19.5159 21.1556 21.1555 19.516 21.1555 17.4934V6.50662C21.1555 4.48401 19.5159 2.84436 17.4933 2.84436Z"
        stroke={color1}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M13.3073 14.1626L11.0172 15.7239C10.3894 16.1519 9.53312 15.7454 9.46788 14.9884L8.98242 9.35577C8.91591 8.58399 9.71909 8.03644 10.4132 8.38037L15.4789 10.8905C16.1597 11.2278 16.2252 12.1734 15.5974 12.6014L13.3073 14.1626ZM13.3073 14.1626L14.7062 16.2146"
        stroke={color2}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
  
  export default CursorIcon;
  //https://www.svgrepo.com/svg/474663/click