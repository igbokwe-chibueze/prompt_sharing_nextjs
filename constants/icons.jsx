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



