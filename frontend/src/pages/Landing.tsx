import { Link } from "react-router-dom";
import { FiDownload } from "react-icons/fi";
import { GoThreeBars } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import { BsTwitter, BsInstagram, BsFacebook, BsYoutube } from "react-icons/bs";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  companyLinks,
  links,
  linksMobile,
  policiesLinks,
  productLinks,
  resourcesLinks,
} from "../constants/links";
import { useAppSelector } from "../app/hooks";
import { selectIsAuth } from "../features/auth/auth";

const Landing = () => {
  const [isOpen, setIsOpen] = useState(false);

  const isAuth = useAppSelector(selectIsAuth);

  return (
    <div className={`${isOpen && "h-screen overflow-hidden"}`}>
      <div className={"relative bg-[#404eed] text-white"}>
        <header className="flex justify-center">
          <nav className="container relative z-10 flex h-[80px] items-center py-0  lg:justify-between">
            <Link to="/">
              <img
                src="/logos/small_logo_white_RGB.svg"
                width={124}
                height={36}
              />
            </Link>
            <ul className="hidden items-center font-semibold lg:flex">
              {links.map((link) => (
                <li key={link.title} className="navbar-link">
                  <Link to={link.href}>{link.title}</Link>
                </li>
              ))}
            </ul>
            <Link
              to={isAuth ? "/channels/@me" : "/login"}
              className="hover:shadow-button ml-auto rounded-3xl bg-white px-4 py-2 text-sm font-medium text-d-black transition hover:text-brand lg:ml-0"
            >
              {isAuth ? "Open Discord" : "Login"}
            </Link>
            <div
              onClick={() => setIsOpen(false)}
              className={`absolute top-0 left-0 z-[19] hidden h-screen w-screen bg-black/40 lg:!hidden ${
                isOpen && "!block"
              }`}
            />
            <div
              className={`absolute top-0 bottom-0 right-[-300px] z-[20] flex h-screen flex-col items-start rounded-tl-lg rounded-bl-lg bg-white p-6 py-8 text-d-black transition-all duration-300 ease-out lg:hidden ${
                isOpen && "right-[0px]"
              }`}
            >
              <Link
                to="/"
                className="w-full min-w-[250px] border-b border-gray-200 pb-8"
              >
                <img
                  src="/logos/small_logo_black_RGB.svg"
                  width={124}
                  height={36}
                />
              </Link>
              <ul className="mt-4 flex w-full flex-col">
                <li className="rounded bg-gray-100 p-2 px-4 text-sky-400">
                  <Link className="hover:underline" to="/">
                    Home
                  </Link>
                </li>
                {linksMobile.map((link) => (
                  <li key={link.title} className="rounded px-4 py-2">
                    <Link className="hover:underline" to={link.href}>
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <button className="hover:shadow-button mt-auto flex w-full items-center justify-center rounded-[28px] bg-brand py-2 text-base font-medium text-white transition hover:bg-brand/80">
                <FiDownload className="mr-3 text-xl" />
                Download for Mac
              </button>
              <RxCross2
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-6 cursor-pointer text-2xl"
              />
            </div>
            <GoThreeBars
              onClick={() => setIsOpen(true)}
              className="ml-4 cursor-pointer text-3xl text-white lg:hidden"
            />
          </nav>
        </header>
        <div className="relative z-[5] mx-auto flex max-w-6xl flex-col items-start px-5 pt-12 pb-[300px] md:items-center md:pt-[120px] md:pb-[160px]">
          <h1 className="font-ginto text-2xl font-bold uppercase md:text-[56px]">
            Imagine a place...
          </h1>
          <p className="mt-6 max-w-3xl text-left text-base md:mt-10 md:text-center md:text-xl">
            ...where you can belong to a school club, a gaming group, or a
            worldwide art community. Where just you and a handful of friends can
            spend time together. A place that makes it easy to talk every day
            and hang out more often.
          </p>
          <div className="mt-6 flex w-full flex-col items-start justify-center gap-6 md:flex-row md:items-center">
            <button className="hover:shadow-button flex items-center rounded-[28px] bg-white py-4 px-8 text-xl font-medium text-d-black transition hover:text-brand">
              <FiDownload className="mr-3 text-2xl" />
              Download for Mac
            </button>
            <Link to="/login">
              <button className="hover:shadow-button hover:black-hover rounded-[28px] bg-d-black py-4 px-8 text-xl font-medium text-white transition">
                Open Discord in your browser
              </button>
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 h-full w-full">
          <img
            src="/images/clouds.svg"
            className="absolute bottom-0 left-1/2 top-auto z-0 ml-[-1280px] hidden max-w-[2560px] md:block"
          />
          <img
            src="/images/boot.svg"
            className="absolute bottom-0 z-0 ml-[-80px] md:left-1/2 md:ml-[-1000px]"
          />
          <img
            src="/images/chill.svg"
            className="absolute bottom-0 left-1/2 z-0 ml-[370px]"
          />
        </div>
      </div>
      <main className="text-d-black">
        <div className="flex flex-col items-center">
          <motion.div
            whileInView={{ y: [100, 50, 0], opacity: [0, 0.5, 1] }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="container grid grid-cols-12 gap-5"
          >
            <img
              src="/images/group.svg"
              alt="group"
              className="col-span-12 md:col-span-7"
            />
            <div className="md:weird col-span-12 flex flex-col justify-center">
              <h2 className="text-xl font-extrabold leading-[120%] md:text-[48px]">
                Create an invite-only place where you belong
              </h2>
              <p className="mt-5 text-base leading-[1.625] md:text-xl">
                Discord servers are organized into topic-based channels where
                you can collaborate, share, and just talk about your day without
                clogging up a group chat.
              </p>
            </div>
          </motion.div>
          <motion.div
            whileInView={{ y: [100, 50, 0], opacity: [0, 0.5, 1] }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex w-full flex-col items-center bg-[#f6f6f6]"
          >
            <div className="container  grid grid-cols-12 gap-5">
              <img
                src="/images/voice.svg"
                alt="group"
                className="md:weird-3 order-1 col-span-12 md:order-2"
              />
              <div className="md:weird-2 order-2 col-span-12 flex flex-col justify-center md:order-1">
                <h2 className="text-xl font-extrabold leading-[120%] md:text-[48px]">
                  Where hanging out is easy
                </h2>
                <p className="mt-5 text-base leading-[1.625] md:text-xl">
                  Grab a seat in a voice channel when you’re free. Friends in
                  your server can see you’re around and instantly pop in to talk
                  without having to call.
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            whileInView={{ y: [100, 50, 0], opacity: [0, 0.5, 1] }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="container grid grid-cols-12 gap-5"
          >
            <img
              src="/images/graggle.svg"
              alt="group"
              className="col-span-12 md:col-span-7"
            />
            <div className="md:weird col-span-12 flex flex-col justify-center">
              <h2 className="mt-5 text-xl font-extrabold leading-[120%] md:mt-0 md:text-[48px]">
                From few to a fandom
              </h2>
              <p className="mt-5 text-base leading-[1.625] md:text-xl">
                Get any community running with moderation tools and custom
                member access. Give members special powers, set up private
                channels, and more.
              </p>
            </div>
          </motion.div>
        </div>
        <motion.div
          whileInView={{ y: [100, 50, 0], opacity: [0, 0.5, 1] }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex w-full flex-col items-center bg-[#f6f6f6] text-center"
        >
          <div className="container grid grid-cols-12 pb-[80px]">
            <div className="md:weird-4 col-span-12 flex w-full flex-col items-start md:items-center">
              <h2 className="font-ginto text-left text-2xl font-bold leading-[95%] md:text-center md:text-[40px]">
                RELIABLE TECH FOR STAYING CLOSE
              </h2>
              <p className="font-calc mt-5 text-left leading-[1.625] md:text-center">
                Low-latency voice and video feels like you’re in the same room.
                Wave hello over video, watch friends stream their games, or
                gather up and have a drawing session with screen share.
              </p>
            </div>
            <img
              src="/images/call.svg"
              alt="call"
              className="col-span-12 mt-5 w-full !max-w-[auto] md:mt-0"
            />
          </div>
          <div className="container relative mb-[120px] flex flex-col items-center gap-5 py-5 text-center">
            <div className="absolute top-0 flex w-full justify-center">
              <img src="/images/sparkles.svg" alt="sparkles" />
            </div>
            <h2 className="z-10 text-[32px] font-bold">
              Ready to start your journey?
            </h2>
            <button className="hover:shadow-button mt-4 flex w-full items-center justify-center rounded-[28px] bg-brand py-4 px-8 text-xl font-medium text-white transition hover:bg-brand/90 md:w-auto">
              <FiDownload className="mr-3 text-2xl" />
              Download for Mac
            </button>
          </div>
        </motion.div>
      </main>
      <footer className="flex justify-center bg-d-black">
        <div className="container pb-16">
          <div className="flex flex-col justify-between gap-5 border-b border-brand pb-10 md:flex-row">
            <div className="mr-10 min-w-[240px] space-y-5 uppercase leading-[1] text-brand">
              <h2 className="font-ginto w-full text-[32px] font-bold">
                Imagine a place
              </h2>
              <ul className="flex items-center space-x-4 text-[22px]">
                <li className="cursor-pointer text-white">
                  <BsTwitter />
                </li>
                <li className="cursor-pointer text-white">
                  <BsInstagram />
                </li>
                <li className="cursor-pointer text-white">
                  <BsFacebook />
                </li>
                <li className="cursor-pointer text-white">
                  <BsYoutube />
                </li>
              </ul>
            </div>
            <div className="mt-8 flex w-full flex-wrap justify-between gap-10 text-white md:mt-0 md:gap-5">
              <ul className="flex min-w-[200px] flex-col space-y-2 md:min-w-[150px]">
                <h2 className="text-brand">Product</h2>
                {productLinks.map((link) => (
                  <li key={link.title} className="hover:underline">
                    <Link to={link.href}>{link.title}</Link>
                  </li>
                ))}
              </ul>
              <ul className="flex min-w-[200px] flex-col space-y-2 md:min-w-[150px]">
                <h2 className="text-brand">Company</h2>
                {companyLinks.map((link) => (
                  <li key={link.title} className="hover:underline">
                    <Link to={link.href}>{link.title}</Link>
                  </li>
                ))}
              </ul>
              <ul className="flex min-w-[200px] flex-col space-y-2 md:min-w-[150px]">
                <h2 className="text-brand">Resources</h2>
                {resourcesLinks.map((link) => (
                  <li key={link.title} className="hover:underline">
                    <Link to={link.href}>{link.title}</Link>
                  </li>
                ))}
              </ul>
              <ul className="flex min-w-[200px] flex-col space-y-2 md:min-w-[150px]">
                <h2 className="text-brand">Policies</h2>
                {policiesLinks.map((link) => (
                  <li key={link.title} className="hover:underline">
                    <Link to={link.href}>{link.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 flex items-center justify-between">
            <Link to="/">
              <img
                src="/logos/small_logo_white_RGB.svg"
                width={124}
                height={36}
              />
            </Link>
            <Link
              to="/register"
              className="hover:shadow-button rounded-3xl bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand/90"
            >
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
