import React from 'react';
import { FaUsers, FaAward, FaBuilding, FaChartLine } from 'react-icons/fa';

const TrustedSection = () => {
  const stats = [
    {
      id: 1,
      number: '10,000+',
      label: 'Active Students',
      icon: <FaUsers size={24} className="text-white" />,
      gradient: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
    },
    {
      id: 2,
      number: '500+',
      label: 'Courses Available',
      icon: <FaAward size={24} className="text-white" />,
      gradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    },
    {
      id: 3,
      number: '50+',
      label: 'Partner Institutions',
      icon: <FaBuilding size={24} className="text-white" />,
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    },
    {
      id: 4,
      number: '95%',
      label: 'Success Rate',
      icon: <FaChartLine size={24} className="text-white" />,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
  ];

  const partners = [
    { name: 'Harvard', category: 'University' },
    { name: 'MIT', category: 'University' },
    { name: 'Stanford', category: 'University' },
    { name: 'Google', category: 'Company' },
    { name: 'Microsoft', category: 'Company' },
    { name: 'Amazon', category: 'Company' },
    { name: 'IBM', category: 'Company' },
    { name: 'Meta', category: 'Company' },
  ];

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        
        {/* Top Metric Cards */}
        <div style={statsGridStyle}>
          {stats.map((item) => (
            <div key={item.id} style={statCardStyle}>
              <div style={{ ...iconBadgeStyle, background: item.gradient }}>
                {item.icon}
              </div>
              <h3 style={statNumberStyle}>{item.number}</h3>
              <p style={statLabelStyle}>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Heading Section */}
        <div style={headerWrapperStyle}>
          <div style={pillBadgeStyle}>
            <span style={{ marginRight: '6px' }}>✨</span> Trusted Worldwide
          </div>
          <h2 style={headlineStyle}>
            Trusted by Leading Institutions
          </h2>
          <p style={subheadingStyle}>
            Learn from world-class universities and industry-leading companies
          </p>
        </div>

        {/* Brand Logos Row */}
        <div style={partnerGridStyle}>
          {partners.map((partner, index) => (
            <div key={index} style={partnerCardStyle}>
              <div style={partnerNameStyle}>{partner.name}</div>
              <div style={partnerCategoryStyle}>{partner.category}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

// Dark-theme styles matching #0B1130 background & purple brand accents
const sectionStyle = {
  backgroundColor: '#0B1130',
  padding: '4rem 1.5rem',
  fontFamily: 'sans-serif',
  color: '#ffffff',
  borderTop: '1px solid #1e293b',
  borderBottom: '1px solid #1e293b',
};

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
};

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '1.5rem',
  marginBottom: '4rem',
};

const statCardStyle = {
  backgroundColor: '#131b4d',
  borderRadius: '1.25rem',
  padding: '2rem 1.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  border: '1px solid #1e295d',
};

const iconBadgeStyle = {
  width: '56px',
  height: '56px',
  borderRadius: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1rem',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
};

const statNumberStyle = {
  fontSize: '2.25rem',
  fontWeight: '800',
  color: '#ffffff',
  margin: '0 0 0.25rem 0',
};

const statLabelStyle = {
  fontSize: '0.9rem',
  color: '#94a3b8',
  fontWeight: '600',
  margin: 0,
};

const headerWrapperStyle = {
  textAlign: 'center',
  marginBottom: '3rem',
};

const pillBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.4rem 1.1rem',
  borderRadius: '9999px',
  backgroundColor: '#1e1b4b',
  border: '1px solid #3b0764',
  color: '#c084fc',
  fontSize: '0.85rem',
  fontWeight: '700',
  marginBottom: '1rem',
};

const headlineStyle = {
  fontSize: '2.5rem',
  fontWeight: '900',
  letterSpacing: '-0.025em',
  background: 'linear-gradient(135deg, #ffffff 0%, #c084fc 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  margin: '0 0 0.75rem 0',
};

const subheadingStyle = {
  fontSize: '1.1rem',
  color: '#94a3b8',
  margin: 0,
};

const partnerGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
  gap: '1rem',
};

const partnerCardStyle = {
  backgroundColor: '#131b4d',
  borderRadius: '0.85rem',
  padding: '1.25rem 1rem',
  textAlign: 'center',
  border: '1px solid #1e295d',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
};

const partnerNameStyle = {
  fontSize: '1.1rem',
  fontWeight: '800',
  color: '#f8fafc',
  marginBottom: '0.2rem',
};

const partnerCategoryStyle = {
  fontSize: '0.75rem',
  color: '#64748b',
  fontWeight: '500',
};

export default TrustedSection;