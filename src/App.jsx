import React from 'react'
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Service from './components/Services';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Calendar from './components/Calendar';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <section><Hero /></section>
      <section><About /></section>
      <section><Service /></section>
      <section><Gallery /></section>
      <section><Testimonials /></section>
      <section><Calendar /></section>
      <section><Contact /></section>
      <section><Footer /></section>
    </>
  )
}

export default App
