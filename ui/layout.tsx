import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FiLogOut, FiUser } from 'react-icons/fi';
import LoginModal from './Models/LoginModal';
import SignInModal from './Models/SignInModal';
import styles from '@/styles/Navbar.module.css';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [user, loading, error] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenLog, setIsOpenLog] = useState(false);
  const router = useRouter();
  const [click, setClick] = useState(false);

  // Navbar.js

  const Navbar = () => {
    return (
      <nav
        className="flex gap-4 items-center mx-auto"
        style={{
          padding: '0.5rem 2.2rem',
          marginTop: '2rem',
          maxWidth: '700px',
          position:"fixed",
          top:"1rem",
          left:"34%",
          borderRadius: '2rem',
          background: 'rgba(158, 159, 159, 0.1)',
          backdropFilter: 'blur(2px)',
          marginRight: '5rem',
        }}
      >
        <Link legacyBehavior href="/about">
          <a className={styles.btn}>About</a>
        </Link>
        <Link legacyBehavior href="/ai-assistant">
          <a className={styles.btn}>AI Assistant</a>
        </Link>
        <Link legacyBehavior href="/newsletter">
          <a className={styles.btn}>Newsletter</a>
        </Link>
        <Link legacyBehavior href="/contact">
          <a className={styles.btn}>Contact</a>
        </Link>
      </nav>
    );
  };

  return (
    <>
      <div
      style={{background: "linear-gradient(180deg, #00272E 0%, #06141F 100%)"}}
      >
        <header className="container top-0 z-40 w-full mx-auto">
          <div className=" py-4 w-full">
            <nav className="md:mx-4 mx-2 md:px-6 px-2 flex md:flex-row flex-col items-center justify-between">
              <Link href="/" id="dsa-navbar-homeRedirectingButton">
                <Image
                  className="mt-8"
                  alt=""
                  height={140}
                  width={140}
                  src="/images/logo.png"
                ></Image>
              </Link>
              {/* <div className="text-lg cursor-pointer">Contact Us</div> */}
              <div className="flex gap-3 md:mt-0 mt-3 items-center">
                <Navbar />
                {user ? (
                  <>
                    <div
                      className="flex gap-2 items-center py-1 px-4 cursor-pointer"
                      onClick={() => setClick(!click)}
                      id="dsa-navbar-userDropDownButton"
                    >
                      <div className="">
                        <img
                          src={`${user.photoURL ?? '/images/profile.png'}`}
                          className="w-10 h-10 rounded-full"
                        />
                      </div>
                      <div className="md:text-xl text-center text-sm font-semibold">
                        {user.displayName}
                      </div>
                    </div>
                    {click && (
                      <>
                        <div className="bg-white border-[#ffd000] border-2 w-80 rounded-xl fixed top-[70px] shadow-lg">
                          <Link
                            href="/account"
                            id="dsa-navbar-userDropDown-RedirectingAccount"
                          >
                            <div className="md:text-xl cursor-pointer text-sm font-medium border-[1.5px] border-[#ffd000]  px-4 py-2 rounded-t-lg hover:text-white hover:bg-[#3a0035] transition-all duration-300 flex gap-4 items-center">
                              <FiUser className="text-2xl" />
                              My Account
                            </div>
                          </Link>
                          <div
                            className="md:text-xl cursor-pointer text-sm font-medium border-[1.5px] border-[#ffd000]  px-4 py-2 rounded-b-lg hover:text-white hover:bg-[#3a0035] transition-all duration-300 flex gap-4 items-center"
                            onClick={() => {
                              signOut(auth);
                              router.push('/');
                            }}
                            id="dsa-navbar-userDropDown-logoutButton"
                          >
                            <FiLogOut className="text-2xl" />
                            Logout
                          </div>
                        </div>
                      </>
                    )}
                    <Link href="/projects" className="text-black">
                      <button
                        id="dsa-navbar-aiAssistant-PageRedirect"
                        className="md:text-xl text-sm font-semibold border-[1.5px] bg-[#ffd000] px-4 py-2 rounded-lg hover:text-white hover:bg-[#3a0035] transition-all duration-300"
                      >
                        AI Assistants
                      </button>
                    </Link>
                  </>
                ) : (
                  <div
                    className={`flex gap-4 items-center mx-auto`}
                    style={{
                      padding: '0.5rem 2rem',
                      marginTop: '2rem',
                      maxWidth: '500px',
                      borderRadius: '2rem',
                      background: 'rgba(158, 159, 159, 0.1)',
                      backdropFilter: 'blur(2px)',
                    }}
                  >
                    <button
                      className={styles.btn}
                      onClick={() => setIsOpen(!isOpen)}
                      id="dsa-navbar-signUpButton"
                    >
                      Sign Up
                    </button>
                    <button
                      className={styles.btn}
                      onClick={() => setIsOpenLog(!isOpen)}
                      id="dsa-navbar-loginButton"
                    >
                      Login
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </header>
        <div>
          <main className="flex w-full flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
      <SignInModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <LoginModal isOpen={isOpenLog} setIsOpen={setIsOpenLog} />
    </>
  );
}
