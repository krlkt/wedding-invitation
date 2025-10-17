'use client'

import Head from 'next/head'
import { motion } from 'framer-motion'
import logo from '../public/images/logo/oial.png'
import hero1 from '@/public/images/hero/hero-1.jpg'
import hero2 from '@/public/images/hero/hero-2.webp'
import hero3 from '@/public/images/hero/hero-3.jpeg'
import heroBackground from '@/public/images/hero/hero-background.webp'
import React from 'react'
import Image from 'next/image'

const features = [
  {
    title: 'Fully Customizable',
    desc: 'Change colors, fonts, and layouts to make your invitation truly yours.',
  },
  {
    title: 'Share Digitally',
    desc: 'Send your invitations online effortlessly. No printing needed, eco-friendly.',
  },
  {
    title: 'Beautiful Templates',
    desc: 'Choose from a collection of elegant, professionally designed templates.',
  },
]

const steps = [
  {
    emoji: '🎨',
    title: 'Design',
    desc: 'Pick a template and customize it with our intuitive editor.',
  },
  {
    emoji: '💌',
    title: 'Send',
    desc: 'Share your invitation digitally via email, WhatsApp, or social media.',
  },
  {
    emoji: '✨',
    title: 'Celebrate',
    desc: 'Enjoy the big day while your guests RSVP easily online.',
  },
]

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
          className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-center"
          style={{
            backgroundImage: `url('${heroBackground.src}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Hero Images */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotate: -6 }}
            animate={{ opacity: 0.8, x: 0, rotate: -6 }}
            transition={{ duration: 1 }}
            className="absolute left-8 top-1/4 hidden w-48 opacity-85 drop-shadow-lg md:block lg:w-80"
          >
            <motion.img
              src={hero1.src}
              alt="Decorative left"
              className="h-auto w-full rounded-2xl"
              whileHover={{ scale: 1.05, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, rotate: -2 }}
            animate={{ opacity: 0.8, x: 0, rotate: -2 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute right-6 top-8 hidden w-48 opacity-85 drop-shadow-md md:block lg:w-80"
          >
            <motion.img
              src={hero3.src}
              alt="Decorative right"
              className="h-auto w-full rounded-2xl"
              whileHover={{ scale: 1.05, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 3 }}
            animate={{ opacity: 0.8, x: 0, rotate: 3 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute bottom-10 right-10 hidden w-56 opacity-75 drop-shadow-lg md:block lg:w-96"
          >
            <motion.img
              src={hero2.src}
              alt="Decorative right lower"
              className="h-auto w-full rounded-2xl"
              whileHover={{ scale: 1.05, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            />
          </motion.div>

          {/* Central Hero Content */}
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-6 w-64 lg:w-96"
            >
              <Image src={logo} alt="OIAL Logo" className="h-full w-full object-contain" priority />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="max-w-4xl rounded-3xl bg-white/30 p-8 shadow-md backdrop-blur-md md:p-10"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-5xl"
              >
                Your Once In A Lifetime <br /> Wedding Invitation
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-md mb-6 text-gray-700 md:text-lg"
              >
                Create stunning digital wedding invitations that your guests will remember forever.
                Fully customizable, easy to share, and beautifully crafted to capture your story.
              </motion.p>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#customize"
                className="rounded-full bg-pink-500 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:bg-pink-600"
              >
                Customize Yours
              </motion.a>
            </motion.div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="bg-white py-20 text-gray-800">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-12 text-4xl font-bold"
            >
              Why Choose OIAL
            </motion.h2>

            <div className="grid gap-10 md:grid-cols-3">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                  className="rounded-xl bg-gray-50 p-8 shadow transition hover:shadow-lg"
                >
                  <h3 className="mb-4 text-2xl font-semibold">{feature.title}</h3>
                  <p>{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="relative overflow-hidden bg-gradient-to-br from-pink-200 via-rose-100 to-white py-24 text-gray-800">
          <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16 text-4xl font-bold text-gray-900 md:text-5xl"
            >
              How It Works
            </motion.h2>

            <div className="grid gap-10 md:grid-cols-3">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.2 }}
                  className="rounded-3xl border border-white/30 bg-white/50 p-8 shadow-lg backdrop-blur-md transition-all hover:shadow-2xl"
                >
                  <div className="mb-4 text-6xl">{step.emoji}</div>
                  <h3 className="mb-2 text-2xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-gray-700">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CREATE INVITATION SECTION */}
        <section id="customize" className="bg-white py-20 text-gray-800">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl px-6 text-center"
          >
            <h2 className="mb-6 text-4xl font-bold">Start Your Invitation Now</h2>
            <p className="mb-8 text-lg">
              Make your wedding invitation a memory your guests will cherish forever.
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/admin"
              className="rounded-full bg-pink-500 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:bg-pink-600"
            >
              Create Invitation
            </motion.a>
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer className="bg-gray-800 py-8 text-white">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <p>© {new Date().getFullYear()} OIAL. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  )
}

export default Home
