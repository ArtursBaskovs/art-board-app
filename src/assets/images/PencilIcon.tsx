const PencilIcon = ({ color = "#ada4d1", color2 = "#5ac9d1", size = 30, strokeWidth = 40 }) => (
  <svg
    width={`${size}px`}
    height={`${size}px`}
    viewBox="0 0 1024 1024"
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M321.29 567.215L442.535 688.46c6.689 6.687 17.531 6.687 24.22 0 6.687-6.689 6.687-17.531 0-24.22L345.509 542.995c-6.689-6.687-17.531-6.687-24.22 0-6.687 6.689-6.687 17.531 0.001 24.22M637.761 251.085L758.664 371.99c6.687 6.687 17.529 6.687 24.218 0 6.687-6.689 6.687-17.531 0-24.218L661.979 226.867c-6.689-6.687-17.531-6.687-24.218 0-6.687 6.689-6.687 17.531 0 24.218M296.972 688.46l24.318 24.318c6.689 6.687 17.531 6.687 24.22 0 6.687-6.689 6.687-17.531 0-24.22l-24.318-24.318c-6.689-6.687-17.531-6.687-24.22 0-6.687 6.689-6.687 17.531 0 24.22M570.972 317.875l120.902 120.902c6.689 6.687 17.531 6.687 24.22 0 6.687-6.689 6.687-17.531 0-24.22L595.192 293.655c-6.689-6.687-17.531-6.687-24.22 0-6.687 6.689-6.687 17.531 0 24.22"
      fill={color}
      stroke={color} // добавлен stroke для изменения толщины линий
      strokeWidth={strokeWidth}
    />
    <path
      d="M816.497 302.168c0.019-21.865-8.369-43.898-25.05-60.571l-0.086-0.084-24.316-23.982-0.015 0.015c-16.63-16.764-38.622-25.256-60.474-25.235a85.056 85.056 0 0 0-60.652 25.379l-0.615 0.658-7.895 8.881-66.421 66.43L321.3 542.981l-4.37 7.425-48.293 169.544a17.093 17.093 0 0 0 4.36 16.801 17.088 17.088 0 0 0 16.801 4.36l169.539-48.298 7.427-4.369 249.34-249.684 66.777-66.769 0.457-0.476 8.563-9.247-0.04-0.036a85.47 85.47 0 0 0 24.636-60.064z m-49.272 36.361l-0.456 0.473-8.348 9.016-66.541 66.534-246.206 246.542-135.668 38.648 38.644-135.673 246.535-246.186 66.794-66.803 0.69-0.731 7.727-8.693c10.051-10.1 23.023-15.073 36.159-15.096 13.183 0.022 26.213 5.019 36.279 15.197l0.159 0.159 24.232 23.9c10.034 10.042 15.003 23.11 15.022 36.351-0.018 13.24-4.989 26.313-15.022 36.362z"
      fill={color2}
      stroke={color2} // добавлен stroke для изменения толщины линий
      strokeWidth={strokeWidth}
    />
  </svg>
);

export default PencilIcon;
//https://www.svgrepo.com/svg/492019/pencil


