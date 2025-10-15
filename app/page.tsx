"use client";

import Head from "next/head";
import { motion } from "framer-motion";
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
        <section className="bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 min-h-screen flex flex-col justify-center items-center text-center px-6">
          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-6xl font-bold text-gray-800 mb-4"
          >
            Your Once In A Lifetime <br/> Wedding Invitation
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl"
          >
            Create stunning digital wedding invitations that your guests will remember forever. Fully customizable, easy to share, and beautiful.
          </motion.p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#customize"
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all"
          >
            Customize Yours
          </motion.a>
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
        <section className="py-20 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 text-gray-800">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-4xl font-bold text-center mb-12"
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
                <motion.div key={idx} variants={fadeInUp}>
                  <div className="text-6xl mb-4">{step.emoji}</div>
                  <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                  <p>{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
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
