type ToggleMobileMenuProps = {
  isOpen: boolean;
};
export default function ToggleMobileMenu({ isOpen }: ToggleMobileMenuProps) {
  return (
    <>
      {!isOpen && (
        <svg
          className="w-5 h-5 text-gray-900 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      )}
      {isOpen && (
        <svg
          className="w-5 h-5 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 17"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M2 2l13 13M15 2L2 15"
          />
        </svg>
      )}
    </>
  );
}
