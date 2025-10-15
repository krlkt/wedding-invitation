"use client";

import Head from "next/head";
import { motion } from "framer-motion";
import logo from "../public/images/logo/oial.png";
import hero1 from "@/public/images/hero/hero-1.jpg";
import hero2 from "@/public/images/hero/hero-2.webp";
import hero3 from "@/public/images/hero/hero-3.jpeg";
import heroBackground from "@/public/images/hero/hero-background.webp";
import React from "react";

  const features = [
    {
      title: "Fully Customizable",
      desc: "Change colors, fonts, and layouts to make your invitation truly yours.",
    },
    {
      title: "Share Digitally",
      desc: "Send your invitations online effortlessly. No printing needed, eco-friendly.",
    },
    {
      title: "Beautiful Templates",
      desc: "Choose from a collection of elegant, professionally designed templates.",
    },
  ];

  const steps = [
    { emoji: "🎨", title: "Design", desc: "Pick a template and customize it with our intuitive editor." },
    { emoji: "💌", title: "Send", desc: "Share your invitation digitally via email, WhatsApp, or social media." },
    { emoji: "✨", title: "Celebrate", desc: "Enjoy the big day while your guests RSVP easily online." },
  ];

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>OIAL - Once In A Lifetime Wedding Invitations</title>
        <meta
          name="description"
          content="Create beautiful, customizable digital wedding invitations with OIAL."
        />
      </Head>

      <main className="font-sans">
        {/* HERO SECTION */}
        <section
          className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden"
          style={{
            backgroundImage: `url('${heroBackground.src}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Hero Images */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotate: -6 }}
            animate={{ opacity: 0.80, x: 0, rotate: -6 }}
            transition={{ duration: 1 }}
            className="hidden md:block absolute left-8 top-1/4 w-48 lg:w-80 opacity-85 drop-shadow-lg"
          >
            <motion.img
              src={hero1.src}
              alt="Decorative left"
              className="rounded-2xl w-full h-auto"
              whileHover={{ scale: 1.05, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, rotate: -2 }}
            animate={{ opacity: 0.80, x: 0, rotate: -2 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden md:block absolute right-6 top-8 w-48 lg:w-80 opacity-85 drop-shadow-md"
          >
            <motion.img
              src={hero3.src}
              alt="Decorative right"
              className="rounded-2xl w-full h-auto"
              whileHover={{ scale: 1.05, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 3 }}
            animate={{ opacity: 0.80, x: 0, rotate: 3 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden md:block absolute right-10 bottom-10 w-56 lg:w-96 opacity-75 drop-shadow-lg"
          >
            <motion.img
              src={hero2.src}
              alt="Decorative right lower"
              className="rounded-2xl w-full h-auto"
              whileHover={{ scale: 1.05, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
          </motion.div>

          {/* Central Hero Content */}
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="w-64 lg:w-96 mb-6"
            >
              <img src={logo.src} alt="OIAL Logo" className="w-full h-full object-contain" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="bg-white/30 backdrop-blur-md rounded-3xl p-8 md:p-10 max-w-4xl shadow-md"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight"
              >
                Your Once In A Lifetime <br /> Wedding Invitation
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-md md:text-lg text-gray-700 mb-6"
              >
                Create stunning digital wedding invitations that your guests will remember forever.
                Fully customizable, easy to share, and beautifully crafted to capture your story.
              </motion.p>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#customize"
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all"
              >
                Customize Yours
              </motion.a>
            </motion.div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-20 bg-white text-gray-800">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold mb-12"
            >
              Why Choose OIAL
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-10">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                  className="bg-gray-50 p-8 rounded-xl shadow hover:shadow-lg transition"
                >
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p>{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="relative py-24 bg-gradient-to-br from-pink-200 via-rose-100 to-white text-gray-800 overflow-hidden">
          <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold mb-16 text-gray-900"
            >
              How It Works
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-10">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.2 }}
                  className="bg-white/50 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/30 hover:shadow-2xl transition-all"
                >
                  <div className="text-6xl mb-4">{step.emoji}</div>
                  <h3 className="text-2xl font-semibold mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-gray-700">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CREATE INVITATION SECTION */}
        <section id="customize" className="py-20 bg-white text-gray-800">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center px-6"
          >
            <h2 className="text-4xl font-bold mb-6">Start Your Invitation Now</h2>
            <p className="text-lg mb-8">
              Make your wedding invitation a memory your guests will cherish forever.
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/admin"
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all"
            >
              Create Invitation
            </motion.a>
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p>© {new Date().getFullYear()} OIAL. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Home;
