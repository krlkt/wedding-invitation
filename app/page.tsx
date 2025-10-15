"use client";

import Head from "next/head";
import { motion } from "framer-motion";
import logo from "../public/images/logo/oial.png";
import React from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

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
        {/* Hero Section */}
        <section
          className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden"
          style={{
            backgroundImage:
              "url('https://thumbs.dreamstime.com/b/pastel-glowing-wedding-blurred-light-bokeh-background-soft-white-pink-lights-elegant-minimalist-design-festive-404021679.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Images on Hero Section */}
          <img
            src="https://briannakirkphotography.com/wp-content/uploads/2023/03/Ana-and-Jonah-Forden-Wedding-8.20.21-Cover-Pic-BKIRK-1-1.jpg"
            alt="Decorative left"
            className="hidden md:block absolute left-0 top-1/4 w-48 lg:w-80 opacity-80 -rotate-6 drop-shadow-lg"
          />
          <img
            src="https://images.squarespace-cdn.com/content/v1/629514d41b98ed0d3651ae61/86c7fd92-bbc5-4cf4-a44b-bf9c601476f6/8A5A2231+copy.jpg"
            alt="Decorative right"
            className="hidden md:block absolute right-0 top-1/6 w-48 lg:w-80 opacity-85 rotate-6 drop-shadow-md"
          />
          <img
            src="https://images.pexels.com/photos/1024068/pexels-photo-1024068.jpeg"
            alt="Decorative right lower"
            className="hidden md:block absolute right-10 bottom-10 w-56 lg:w-96 opacity-70 rotate-3 drop-shadow-lg"
          />

          {/* Central content */}
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
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight"
              >
                Your Once In A Lifetime <br /> Wedding Invitation
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
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

        {/* Features Section */}
        <section className="py-20 bg-white text-gray-800">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-4xl font-bold text-center mb-12"
            >
              Why Choose OIAL
            </motion.h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-10"
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-50 p-8 rounded-xl shadow hover:shadow-lg transition"
                >
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p>{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="relative py-24 bg-gradient-to-br from-pink-200 via-rose-100 to-white text-gray-800 overflow-hidden">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "url('https://thumbs.dreamstime.com/b/pastel-glowing-wedding-blurred-light-bokeh-background-soft-white-pink-lights-elegant-minimalist-design-festive-404021679.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>

          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 drop-shadow-sm"
            >
              How It Works
            </motion.h2>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-10 text-center"
            >
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/50 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/30 hover:shadow-2xl transition-all"
                >
                  <div className="text-6xl mb-4">{step.emoji}</div>
                  <h3 className="text-2xl font-semibold mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-gray-700">{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Create Invitation Section */}
        <section id="customize" className="py-20 bg-white text-gray-800">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
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

        {/* Footer */}
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
