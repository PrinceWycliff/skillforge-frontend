import React from 'react';
import { FaUsers, FaAward, FaBuilding, FaChartLine } from 'react-icons/fa';

const TrustedSection = () => {
  const stats = [
    {
      id: 1,
      number: '10,000+',
      label: 'Active Students',
      icon: <FaUsers size={24} color="#ffffff" />,
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    },
    {
      id: 2,
      number: '500+',
      label: 'Courses Available',
      icon: <FaAward size={24} color="#ffffff" />,
      gradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    },
    {
      id: 3,
      number: '50+',
      label: 'Partner Institutions',
      icon: <FaBuilding size={24} color="#ffffff" />,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    {
      id: 4,
      number: '95%',
      label: 'Success Rate',
      icon: <FaChartLine size={24} color="#ffffff" />,
      gradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
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

// Component Styles matching light/purple gradient marketing aesthetic
const sectionStyle = {
  background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #faf5ff 100%)',
  padding: '4rem 1.5rem',
  fontFamily: 'sans-serif',
  color: '#0f172a',
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
  backgroundColor: '#ffffff',
  borderRadius: '1.25rem',
  padding: '2rem 1.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
  border: '1px solid rgba(226, 232, 240, 0.8)',
};

const iconBadgeStyle = {
  width: '56px',
  height: '56px',
  borderRadius: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
};

const statNumberStyle = {
  fontSize: '2.25rem',
  fontWeight: '800',
  color: '#0f172a',
  margin: '0 0 0.25rem 0',
};

const statLabelStyle = {
  fontSize: '0.9rem',
  color: '#64748b',
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
  padding: '0.4rem 1rem',
  borderRadius: '9999px',
  backgroundColor: '#ffffff',
  border: '1px solid #e9d5ff',
  color: '#7e22ce',
  fontSize: '0.85rem',
  fontWeight: '700',
  marginBottom: '1rem',
  boxShadow: '0 2px 6px rgba(126, 34, 206, 0.08)',
};

const headlineStyle = {
  fontSize: '2.5rem',
  fontWeight: '900',
  letterSpacing: '-0.025em',
  background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  margin: '0 0 0.75rem 0',
};

const subheadingStyle = {
  fontSize: '1.1rem',
  color: '#64748b',
  margin: 0,
};

const partnerGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
  gap: '1rem',
};

const partnerCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '0.85rem',
  padding: '1.25rem 1rem',
  textAlign: 'center',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
  border: '1px solid #f1f5f9',
};

const partnerNameStyle = {
  fontSize: '1.1rem',
  fontWeight: '800',
  color: '#1e293b',
  marginBottom: '0.2rem',
};

const partnerCategoryStyle = {
  fontSize: '0.75rem',
  color: '#94a3b8',
  fontWeight: '500',
};

export default TrustedSection;