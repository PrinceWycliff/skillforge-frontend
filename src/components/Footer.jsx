import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        
        {/* Column 1: Brand & Bio */}
        <div style={columnStyle}>
          <div style={brandHeaderStyle}>
            <div style={logoBadgeStyle}>S</div>
            <span style={brandTitleStyle}>SkillForge</span>
          </div>
          <p style={descriptionStyle}>
            Empowering learners worldwide with quality education and professional courses.
          </p>
          <div style={socialIconGroupStyle}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={socialIconStyle}>
              <FaFacebook size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" style={socialIconStyle}>
              <FaTwitter size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={socialIconStyle}>
              <FaLinkedin size={18} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" style={socialIconStyle}>
              <FaYoutube size={18} />
            </a>
          </div>
        </div>

        {/* Column 2: Platform Links */}
        <div style={columnStyle}>
          <h4 style={headingStyle}>Platform</h4>
          <ul style={listStyle}>
            <li><Link to="/courses" style={linkStyle}>Browse Courses</Link></li>
            <li><Link to="/categories" style={linkStyle}>Categories</Link></li>
            <li><Link to="/instructor/register" style={linkStyle}>Become an Instructor</Link></li>
            <li><Link to="/enterprise" style={linkStyle}>Enterprise Solutions</Link></li>
            <li><Link to="/pricing" style={linkStyle}>Pricing</Link></li>
          </ul>
        </div>

        {/* Column 3: Support Links */}
        <div style={columnStyle}>
          <h4 style={headingStyle}>Support</h4>
          <ul style={listStyle}>
            <li><Link to="/help" style={linkStyle}>Help Center</Link></li>
            <li><Link to="/faq" style={linkStyle}>FAQ</Link></li>
            <li><Link to="/contact" style={linkStyle}>Contact Us</Link></li>
            <li><Link to="/community" style={linkStyle}>Community</Link></li>
            <li><Link to="/blog" style={linkStyle}>Blog</Link></li>
          </ul>
        </div>

                {/* Column 4: Legal & Portals */}
            <div style={columnStyle}>
            <h4 style={headingStyle}>Legal</h4>
            <ul style={listStyle}>
                <li><Link to="/terms" style={linkStyle}>Terms of Service</Link></li>
                <li><Link to="/privacy" style={linkStyle}>Privacy Policy</Link></li>
                {/* Internal / Staff Portals */}
                <li><Link to="/instructor/login" style={linkStyle}>Instructor Portal</Link></li>
                <li><Link to="/admin/login" style={linkStyle}>Admin Portal</Link></li>
            </ul>
            </div>
        {/* Column 5: Newsletter */}
        <div style={columnStyle}>
          <h4 style={headingStyle}>Newsletter</h4>
          <p style={descriptionStyle}>
            Subscribe to get updates on new courses and offers
          </p>
          <form onSubmit={handleSubscribe} style={{ marginTop: '1rem' }}>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              {subscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>

      </div>
     

      <div style={bottomBorderStyle}>
        © {new Date().getFullYear()} SkillForge. All rights reserved.
      </div>
    </footer>
  );
};

// Layout & Theme Styles — harmonized to match #0B1130 / #34E0D8 brand used site-wide
const footerStyle = {
  backgroundColor: '#0B1130',
  color: '#94a3b8',
  paddingTop: '3.5rem',
  paddingBottom: '1.5rem',
  borderTop: '1px solid #1e293b',
  fontFamily: 'sans-serif'
};

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1.5rem',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '2.5rem'
};

const columnStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const brandHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginBottom: '1rem'
};

const logoBadgeStyle = {
  backgroundColor: '#2546F0',
  color: '#ffffff',
  width: '38px',
  height: '38px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '1.2rem'
};

const brandTitleStyle = {
  fontSize: '1.4rem',
  fontWeight: 'bold',
  color: '#ffffff'
};

const descriptionStyle = {
  fontSize: '0.9rem',
  lineHeight: '1.5',
  color: '#94a3b8',
  margin: '0 0 1.25rem 0'
};

const socialIconGroupStyle = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center'
};

const socialIconStyle = {
  color: '#34E0D8',
  textDecoration: 'none',
  transition: 'opacity 0.2s',
  opacity: 0.9
};

const headingStyle = {
  color: '#ffffff',
  fontSize: '1.05rem',
  fontWeight: 'bold',
  marginBottom: '1.25rem',
  marginTop: 0
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem'
};

const linkStyle = {
  color: '#94a3b8',
  textDecoration: 'none',
  fontSize: '0.9rem',
  transition: 'color 0.2s'
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '0.375rem',
  border: '1px solid #1e293b',
  backgroundColor: '#131b4d',
  color: '#ffffff',
  fontSize: '0.9rem',
  marginBottom: '0.75rem',
  boxSizing: 'border-box',
  outline: 'none'
};

const buttonStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '0.375rem',
  border: 'none',
  background: 'linear-gradient(135deg, #2546F0 0%, #34E0D8 100%)',
  color: '#0B1130',
  fontWeight: 'bold',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'opacity 0.2s'
};

const bottomBorderStyle = {
  textAlign: 'center',
  fontSize: '0.8rem',
  color: '#475569',
  marginTop: '3rem',
  paddingTop: '1.5rem',
  borderTop: '1px solid #111827'
};

export default Footer;