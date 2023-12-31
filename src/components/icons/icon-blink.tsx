import Icon from "@ant-design/icons";

const BlinkSVG: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill="#000000"
      {...props}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <title>/svg/ic-blink</title> <desc>Created with Sketch.</desc>{" "}
        <defs> </defs>{" "}
        <g
          id="Page-1"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          {" "}
          <g id="ic-blink" fillRule="nonzero" fill="#4A4A4A">
            {" "}
            <path
              d="M12,21 C16.9705627,21 21,16.9705627 21,12 C21,7.02943725 16.9705627,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 Z M12,23 C5.92486775,23 1,18.0751322 1,12 C1,5.92486775 5.92486775,1 12,1 C18.0751322,1 23,5.92486775 23,12 C23,18.0751322 18.0751322,23 12,23 Z M8,12 C6.8954305,12 6,11.1045695 6,10 C6,8.8954305 6.8954305,8 8,8 C9.1045695,8 10,8.8954305 10,10 C10,11.1045695 9.1045695,12 8,12 Z M8.29289322,16.7071068 C7.90236893,16.3165825 7.90236893,15.6834175 8.29289322,15.2928932 C8.68341751,14.9023689 9.31658249,14.9023689 9.70710678,15.2928932 C9.70586437,15.2916508 9.73284413,15.3152581 9.7875,15.35625 C9.89702274,15.4383921 10.0337053,15.5238187 10.1972136,15.6055728 C10.6871488,15.8505404 11.2849871,16 12,16 C12.7150129,16 13.3128512,15.8505404 13.8027864,15.6055728 C13.9662947,15.5238187 14.1029773,15.4383921 14.2125,15.35625 C14.2671559,15.3152581 14.2941356,15.2916508 14.2928932,15.2928932 C14.6834175,14.9023689 15.3165825,14.9023689 15.7071068,15.2928932 C16.0976311,15.6834175 16.0976311,16.3165825 15.7071068,16.7071068 C15.5100371,16.9041765 15.1746812,17.1556934 14.6972136,17.3944272 C13.9371488,17.7744596 13.0349871,18 12,18 C10.9650129,18 10.0628512,17.7744596 9.3027864,17.3944272 C8.82531879,17.1556934 8.48996291,16.9041765 8.29289322,16.7071068 Z M14.2675644,11 C14.0973943,10.7058266 14,10.3642871 14,10 C14,8.8954305 14.8954305,8 16,8 C17.1045695,8 18,8.8954305 18,10 C18,10.3642871 17.9026057,10.7058266 17.7324356,11 C17.3866262,10.4021986 16.7402824,10 16,10 C15.2597176,10 14.6133738,10.4021986 14.2675644,11 L14.2675644,11 Z"
              id="Combined-Shape"
            >
              {" "}
            </path>{" "}
          </g>{" "}
        </g>{" "}
      </g>
    </svg>
  );
};

export const BlinkIcon = (props: React.ComponentProps<typeof Icon>) => (
  <Icon component={BlinkSVG} {...props} />
);
