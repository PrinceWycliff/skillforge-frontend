import React from 'react';
import { Link } from 'react-router-dom';
import { FaLaptopCode, FaServer, FaDatabase, FaNetworkWired, FaShieldAlt } from 'react-icons/fa';

const TrustedSection = () => {
  // Real course categories — matches exactly what's selectable in Instructor Studio
  const tracks = [
    {
      id: 1,
      name: 'Web Development',
      description: 'Build modern, full-stack applications from the ground up.',
      icon: <FaLaptopCode size={26} className="text-white" />,
      gradient: 'linear-gradient(135deg, #2546F0 0%, #1e293b 100%)',
    },
    {
      id: 2,
      name: 'Systems Administration',
      description: 'Manage servers, infrastructure, and enterprise environments.',
      icon: <FaServer size={26} className="text-white" />,
      gradient: 'linear-gradient(135deg, #34E0D8 0%, #0f766e 100%)',
    },
    {
      id: 3,
      name: 'Database Engineering',
      description: 'Design, query, and optimize real-world data systems.',
      icon: <FaDatabase size={26} className="text-white" />,
      gradient: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
    },
    {
      id: 4,
      name: 'Networking',
      description: 'Understand the protocols and infrastructure connecting it all.',
      icon: <FaNetworkWired size={26} className="text-white" />,
      gradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    },
    {
      id: 5,
      name: 'Cyber Security',
      description: 'Learn to defend systems and think like an attacker.',
      icon: <FaShieldAlt size={26} className="text-white" />,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
  ];

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>

        {/* Heading Section */}
        <div style={headerWrapperStyle}>
          <div style={pillBadgeStyle}>
            <span style={{ marginRight: '6px' }}>✨</span> What You'll Learn
          </div>
          <h2 style={headlineStyle}>
            Popular Skill Tracks
          </h2>
          <p style={subheadingStyle}>
            Hands-on, practical courses across the tracks employers actually hire for
          </p>
        </div>

        {/* Skill Track Cards */}
        <div style={trackGridStyle}>
          {tracks.map((track) => (
            <Link key={track.id} to="/catalog" style={trackCardStyle}>
              <div style={{ ...iconBadgeStyle, background: track.gradient }}>
                {track.icon}
              </div>
              <h3 style={trackNameStyle}>{track.name}</h3>
              <p style={trackDescStyle}>{track.description}</p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

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

const headerWrapperStyle = {
  textAlign: 'center',
  marginBottom: '3rem',
};

const pillBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.4rem 1.1rem',
  borderRadius: '9999px',
  backgroundColor: '#0f1e4d',
  border: '1px solid #2546F0',
  color: '#34E0D8',
  fontSize: '0.85rem',
  fontWeight: '700',
  marginBottom: '1rem',
};

const headlineStyle = {
  fontSize: '2.5rem',
  fontWeight: '900',
  letterSpacing: '-0.025em',
  background: 'linear-gradient(135deg, #ffffff 0%, #34E0D8 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  margin: '0 0 0.75rem 0',
};

const subheadingStyle = {
  fontSize: '1.1rem',
  color: '#94a3b8',
  margin: 0,
};

const trackGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '1.5rem',
};

const trackCardStyle = {
  backgroundColor: '#131b4d',
  borderRadius: '1.25rem',
  padding: '2rem 1.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  border: '1px solid #1e295d',
  textDecoration: 'none',
  transition: 'transform 0.2s, border-color 0.2s',
};

const iconBadgeStyle = {
  width: '56px',
  height: '56px',
  borderRadius: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1.25rem',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
};

const trackNameStyle = {
  fontSize: '1.15rem',
  fontWeight: '800',
  color: '#ffffff',
  margin: '0 0 0.5rem 0',
};

const trackDescStyle = {
  fontSize: '0.9rem',
  color: '#94a3b8',
  margin: 0,
  lineHeight: '1.5',
};

export default TrustedSection;