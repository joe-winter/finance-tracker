import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MobileNavBar from "./MobileNavBar";
import NavBar from "./NavBar";

type MobileNavBarProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function NavBarSwitcher({ isOpen, setIsOpen }: MobileNavBarProps) {

  const [isMobile, setIsMobile] = useState(window.innerWidth < 769);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 769);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
    {isMobile && <MobileNavBar isOpen={isOpen}setIsOpen={setIsOpen}/>}
    {!isMobile && <NavBar/>}
    </>
  );
}
