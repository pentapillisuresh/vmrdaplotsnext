'use client';

import React, { useEffect, useState, Suspense } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import PropertyCategories from "../components/PropertyCategories";
import FeaturedProperties from "../components/FeaturedProperties";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import LocationsSection from "../components/LocationsSection";
import Footer from "../components/Footer";
import CommercialAdSection from "../components/CommercialAdSection";
import ViewedProperties from "../components/ViewedProperties";
import AreaSelector from '../components/AreaSelector';
import AOS from "aos";
import "aos/dist/aos.css";
import ApiService from "../hooks/ApiService";
import RecentViewProperties from "../components/RecentViewProperties";
import FeaturedProjects from "../components/FeaturedProjects";
import AboutVMRDA from "../components/AboutVMRDA";

function HomeContent() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cityLocalities, setCityLocalities] = useState([]);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loginStatus = localStorage.getItem("isLogin");
      setIsLogin(loginStatus === 'true');
    }
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const getDashBoardData = async () => {
    setLoading(true);
    try {
      const response = await ApiService.get(`/dashboard`);
      console.log("dashboard response:", response.status);
      const dashboardData = response.data;
      setCategories(dashboardData?.categories);
      setCityLocalities(dashboardData?.cityLocalities);
    } catch (err) {
      console.error("dashboard data error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashBoardData();
  }, []);

  return (
    <div className="min-h-screen">
      <Hero />
      <PropertyCategories categories={categories} />
      <FeaturedProjects />
      <FeaturedProperties />
      <AboutVMRDA />
      <ViewedProperties />
      <CommercialAdSection />
      {isLogin && <RecentViewProperties />}
      <Testimonials />
      <LocationsSection cityLocalities={cityLocalities} />
      <AreaSelector />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}