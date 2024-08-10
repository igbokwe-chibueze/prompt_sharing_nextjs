export const MenuIcon = ({ className, ...rest }) => (
    <svg 
      viewBox="0 0 17 14" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
      className={`w-5 h-5 ${className}`}
    >
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
    </svg>
);

export const CloseIcon = ({ className, ...rest }) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
      className={`w-6 h-6 ${className}`}
    >
      <path fillRule="evenodd" 
        d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 
        5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" 
      />
    </svg>
);

export const HeartIcon = ({ className, ...rest }) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
      className={`w-6 h-6 ${className}`}
    >
        <path 
            stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
        />
    </svg>
);

export const HeartFilledIcon = ({ className, ...rest }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
    className={`w-6 h-6 ${className}`}
  >
      <path 
          d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 
          1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 
          7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z"
      />
  </svg>
);


export const BookmarkFilledIcon = ({ className, ...rest }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
    className={`w-6 h-6 ${className}`}
  >
    <path 
      d="M7.833 2c-.507 0-.98.216-1.318.576A1.92 1.92 0 0 0 6 3.89V21a1 1 0 0 0 1.625.78L12 18.28l4.375 3.5A1 1 0 0 0 18 
      21V3.889c0-.481-.178-.954-.515-1.313A1.808 1.808 0 0 0 16.167 2H7.833Z"
    />
  </svg>
);

export const BookmarkIcon = ({ className, ...rest }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
    className={`w-6 h-6 ${className}`}
  >
    <path 
      stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
      d="m17 21-5-4-5 4V3.889a.92.92 0 0 1 .244-.629.808.808 0 0 1 .59-.26h8.333a.81.81 0 0 1 .589.26.92.92 0 0 1 .244.63V21Z"
    />
  </svg>
);

export const StarFilledIcon = ({ className, ...rest }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
    className={`w-6 h-6 ${className}`}
  >
    <path 
      d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 
      1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 
      2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"
    />
  </svg>
);

export const StarIcon = ({ className, ...rest }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
    className={`w-6 h-6 ${className}`}
  >
    <path 
      stroke="currentColor" stroke-width="2" 
      d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 
      1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 
      1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z"
    />
  </svg>
);

export const StarHalfFilledIcon = ({ className, ...rest }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
    className={`w-6 h-6 ${className}`}
  >
    <path 
      fill-rule="evenodd" 
      d="M13 4.024v-.005c0-.053.002-.353-.217-.632a1.013 1.013 0 0 0-1.176-.315c-.192.076-.315.193-.35.225-.052.05-.094.1-.122.134a4.358 
      4.358 0 0 0-.31.457c-.207.343-.484.84-.773 1.375a168.719 168.719 0 0 0-1.606 3.074h-.002l-4.599.367c-1.775.14-2.495 2.339-1.143 3.488L6.17 
      15.14l-1.06 4.406c-.412 1.72 1.472 3.078 2.992 2.157l3.94-2.388c.592-.359.958-.996.958-1.692v-13.6Zm-2.002 0v.025-.025Z" 
      clip-rule="evenodd"
    />
  </svg>
);

export const CloseFilledIcon = ({ className, ...rest }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
    className={`w-6 h-6 ${className}`}
  >
    <path 
      fill-rule="evenodd" 
      d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 
      0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" 
      clip-rule="evenodd"
    />
  </svg>
);



