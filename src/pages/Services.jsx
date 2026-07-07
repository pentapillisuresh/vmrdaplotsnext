import React from 'react';
import { motion } from 'framer-motion';

function Services() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ paddingTop: '100px', minHeight: '80vh' }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h1 className="section-title">Our Services</h1>
          <p className="section-subtitle">
            Comprehensive real estate services tailored to your needs
          </p>
          <div style={{ 
            background: '#F9FAFB', 
            padding: '3rem', 
            borderRadius: '15px',
            marginTop: '2rem'
          }}>
            <h3 style={{ color: '#059669', marginBottom: '1rem' }}>Full Service Details</h3>
            <p style={{ color: '#6B7280' }}>
              Detailed service information and booking functionality coming soon. 
              Visit our home page to see our service overview.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Services;