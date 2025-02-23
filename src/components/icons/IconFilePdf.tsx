import React from "react";
import { IconProps } from "./BaseIconWrapper";
import { IconWrapper } from "./BaseIconWrapper";

type IconFilePdfProps = Omit<IconProps, "children">;

const IconFilePdf = React.forwardRef<SVGSVGElement, IconFilePdfProps>(
  ({ className, color, screenReaderText, size, ...props }, ref) => {
    return (
      <IconWrapper className={className} color={color} size={size} screenReaderText={screenReaderText}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          fill="none"
          viewBox="0 0 16 16"
          ref={ref}
          {...props}
        >
          <g
            fill="currentColor"
            clipPath="url(#a)"
          >
            <path
              fillRule="evenodd"
              d="M3 9.99512V13.9951H4V12.9951H4.5C5.32843 12.9951 6 12.3235 6 11.4951 6 10.6667 5.32843 9.99512 4.5 9.99512H3ZM4.5 11.9951H4V10.9951H4.5C4.77614 10.9951 5 11.219 5 11.4951 5 11.7713 4.77614 11.9951 4.5 11.9951ZM7 9.99512H8.5C9.32843 9.99512 10 10.6667 10 11.4951V12.4951C10 13.3235 9.32843 13.9951 8.5 13.9951H7V9.99512ZM8 12.9951H8.5C8.77614 12.9951 9 12.7713 9 12.4951V11.4951C9 11.219 8.77614 10.9951 8.5 10.9951H8V12.9951Z"
              clipRule="evenodd"
            />
            <path d="M11 9.99512V13.9951H12V12.9951H13V11.9951H12V10.9951H13V9.99512H11Z" />
            <path
              fillRule="evenodd"
              d="M3 0H9.2L14 4.96563V8.00468L14.9999 8.00488C15.5521 8.00488 15.9999 8.4526 15.9999 9.00488V15.0002C15.9999 15.5525 15.5521 16.0002 14.9999 16.0002H1C0.447716 16.0002 0 15.5525 0 15.0002V9.00488C0 8.4526 0.447715 8.00488 1 8.00488H2V1C2 0.447717 2.44772 0 3 0ZM13 8.00468H3L3 1H7.99902V4.50928C7.99902 5.3377 8.6706 6.00928 9.49902 6.00928H13V8.00468ZM12.6514 5.00928L8.99902 1.23091V4.50928C8.99902 4.78542 9.22288 5.00928 9.49902 5.00928H12.6514ZM14.9999 9.00488H1V15.0002H14.9999V9.00488Z"
              clipRule="evenodd"
            />
          </g>
          <defs>
            <clipPath id="a">
              <path
                fill="#fff"
                d="M0 0H16V16H0z"
              />
            </clipPath>
          </defs>
        </svg>
      </IconWrapper>
    );
  },
);

IconFilePdf.displayName = "IconFilePdf";
export default IconFilePdf;
