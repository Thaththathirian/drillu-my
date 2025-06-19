import React from "react";
import {
  BookOpen,
  Award,
  Users,
  ArrowRight,
  Code,
  ChevronRight,
  Trophy,
  Check,
  Star,
  Briefcase,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./DrilluStudentPortal.scss";
import DrilluLogo from "components/DrilluLogo";
import { ReactComponent as Logo } from "../../assets/drillu-cover.svg";

const DrillUStudentPortal = () => {
  return (
    <div className="drillu-portal">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <DrilluLogo
              width="150px"
              height="auto"
              className="portal-logo"
              style={{
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))",
              }}
            />
          </div>
          <nav className="nav">
            {/* <ul className="nav-list">
              <li className="nav-item"><span>About</span></li>
              <li className="nav-item"><span>Services</span></li>
              <li className="nav-item"><span>Success Stories</span></li>
              <li className="nav-item"><span>Contact</span></li>
              <li className="nav-item"><Link to="/" className="btn btn-login">Login</Link></li>
            </ul> */}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
     <section className="hero">
  <div className="container">
    <div className="hero-content mb-0">
      <h1 className="hero-title mb-5 leading-relaxed md:text-6xl md:leading-normal text-center">
        Prepare. Grow. Succeed.
      </h1>
      <p className="hero-subtitle">
        Your comprehensive platform for campus interview preparation and
        career success
      </p>
      <div className="hero-statistics mb-3">
        <div className="stat">
          <span className="stat-number">95%</span>
          <span className="stat-label">Placement Success</span>
        </div>
        <div className="stat">
          <span className="stat-number">5000+</span>
          <span className="stat-label">Students Trained</span>
        </div>
        <div className="stat">
          <span className="stat-number">100+</span>
          <span className="stat-label">Partner Companies</span>
        </div>
      </div>
    </div>
    <div className="hero-image">
      {/* Apply the enhanced-animation class for more dynamic effect */}
      <Logo className="enhanced-animation" />
      <div className="placeholder-image"></div>
    </div>
  </div>
</section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">About DrillU</h2>
            <p className="section-subtitle">Your partner in career success</p>
          </div>
          <div className="about-content">
            <div className="about-text">
              <p>
                DrillU is a powerful platform designed to help students prepare
                for campus interviews and build their careers with confidence.
                It provides personalized support and tools to ensure students
                achieve their professional goals.
              </p>
              <p>
                Created by a team of 20 experienced placement professionals,
                along with corporate trainers and academicians, DrillU offers
                real-world insights and practical training that match industry
                needs.
              </p>
              <p>
                With expert-designed question banks, mock interviews,
                mentorship, and placement opportunities, DrillU supports
                students, placement officers, and colleges in achieving
                placement success.
              </p>
              <div className="about-highlight">
                <p>
                  DrillU is more than just a preparation tool—it's a partner in
                  every student's career journey, helping them prepare, grow,
                  and succeed in today's competitive job market.
                </p>
              </div>
            </div>
            <div className="about-features">
              <div className="feature">
                <div className="feature-icon">
                  <Users size={24} />
                </div>
                <div className="feature-text">
                  <h3>Expert-Led</h3>
                  <p>
                    Created by 20+ placement professionals and corporate
                    trainers
                  </p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <Trophy size={24} />
                </div>
                <div className="feature-text">
                  <h3>Proven Success</h3>
                  <p>
                    95% placement rate and 5000+ successfully trained students
                  </p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <Briefcase size={24} />
                </div>
                <div className="feature-text">
                  <h3>Industry Connected</h3>
                  <p>
                    Partnerships with 100+ top companies for direct placement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Portal Section */}
      <section className="portals">
        <div className="container">
          <div className="portals-grid">
            {/* Assessment Portal Card */}
            <div className="portal-card assessment">
              <div className="card-header">
                <div className="card-icon">
                  <BookOpen size={32} />
                </div>
                <h3 className="card-title">Assessment Portal</h3>
              </div>
              <p className="card-description">
                Track your progress with comprehensive evaluations tailored for
                campus interviews
              </p>
              <ul className="card-features">
                <li>
                  <Check size={16} /> Technical & Aptitude Assessments
                </li>
                <li>
                  <Check size={16} /> 30,000+ Questions from 100+ Companies
                </li>
                <li>
                  <Check size={16} /> Real-time Performance Tracking
                </li>
                <li>
                  <Check size={16} /> Detailed Score Reports & Analysis
                </li>
              </ul>
              {/* <Link to="/" className="btn btn-card">
                Access Assessment Portal <ChevronRight size={18} />
              </Link> */}
            </div>

            {/* Placement Training Card */}
            <div className="portal-card training">
              <div className="card-header">
                <div className="card-icon">
                  <Award size={32} />
                </div>
                <h3 className="card-title">Placement Training</h3>
              </div>
              <p className="card-description">
                Prepare for your dream career with industry-focused training and
                resources
              </p>
              <ul className="card-features">
                <li>
                  <Check size={16} /> Mock Interviews & Feedback Sessions
                </li>
                <li>
                  <Check size={16} /> Resume Building & Profile Enhancement
                </li>
                <li>
                  <Check size={16} /> Industry Expert Mentorship
                </li>
                <li>
                  <Check size={16} /> Campus Drive Notifications
                </li>
              </ul>
              {/* <Link to="/" className="btn btn-card">
                Start Placement Training <ChevronRight size={18} />
              </Link> */}
            </div>

            {/* Coding Portal Card */}
            <div className="portal-card coding">
              <div className="card-header">
                <div className="card-icon">
                  <Code size={32} />
                </div>
                <h3 className="card-title">Coding Challenges</h3>
              </div>
              <p className="card-description">
                Enhance your programming skills with regular challenges and
                competitions
              </p>
              <ul className="card-features">
                <li>
                  <Check size={16} /> Regular Coding Competitions
                </li>
                <li>
                  <Check size={16} /> Prizes and Placement Opportunities
                </li>
                <li>
                  <Check size={16} /> In-depth Solutions & Explanations
                </li>
                <li>
                  <Check size={16} /> Practice with Real Interview Problems
                </li>
              </ul>
              {/* <Link to="/" className="btn btn-card">
                Explore Coding Challenges <ChevronRight size={18} />
              </Link> */}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose DrillU?</h2>
            <p className="section-subtitle">
              Comprehensive career preparation services
            </p>
          </div>
          <div className="container mx-auto px-4 sm:px-8 lg:px-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="service-item gap-1">
                <div className="service-icon">
                  <FileText size={24} />
                </div>
                <h3 className="service-title font-bold pt-1">
                  Extensive Practice Resources
                </h3>
                <p className="service-description">
                  Access to question papers from 100+ top companies and 30,000+
                  questions tailored for campus interviews.
                </p>
              </div>
              <div className="service-item gap-1">
                <div className="service-icon">
                  <Star size={24} />
                </div>
                <h3 className="service-title font-bold pt-1">
                  Insightful Dashboards
                </h3>
                <p className="service-description">
                  Track progress with student dashboards showing your growth
                  curve and comprehensive quantitative analysis.
                </p>
              </div>
              <div className="service-item gap-1">
                <div className="service-icon">
                  <Users size={24} />
                </div>
                <h3 className="service-title font-bold pt-1">
                  In-Depth Learning Support
                </h3>
                <p className="service-description">
                  Get textual explanations, coding solutions, and dedicated
                  mentorship from industry experts.
                </p>
              </div>
              <div className="service-item gap-1">
                <div className="service-icon">
                  <Code size={24} />
                </div>
                <h3 className="service-title font-bold pt-1">
                  Coding Challenges
                </h3>
                <p className="service-description">
                  Participate in regular coding competitions with prizes and
                  placement opportunities.
                </p>
              </div>
              <div className="service-item gap-1">
                <div className="service-icon">
                  <Briefcase size={24} />
                </div>
                <h3 className="service-title font-bold pt-1">
                  Job Portal Integration
                </h3>
                <p className="service-description">
                  Apply directly to companies recruiting through campus drives
                  with our integrated job portal.
                </p>
              </div>
              <div className="service-item gap-1">
                <div className="service-icon">
                  <Trophy size={24} />
                </div>
                <h3 className="service-title font-bold pt-1">
                  Placement Opportunities
                </h3>
                <p className="service-description">
                  Access placement opportunities for up to one year and
                  participate in annual HR conclaves.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section id="testimonials" className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Success Stories</h2>
            <p className="section-subtitle">
              See what our students have achieved
            </p>
          </div>
          <div className="testimonial-slider">
            {/* Would be a carousel in real implementation */}
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  "With DrillU's comprehensive preparation, I secured a position
                  at my dream tech company. The practice questions were exactly
                  what came in my interview!"
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">{/* Avatar placeholder */}</div>
                <div className="author-info">
                  <h4 className="author-name">Priya Sharma</h4>
                  <p className="author-position">
                    Software Engineer at TechCorp
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to accelerate your career?</h2>
            <p className="cta-text">
              Join over 5000+ students who have successfully transformed their
              career journey with DrillU
            </p>
            <div className="cta-buttons">
              {/* <Link to="/" className="btn btn-primary btn-large">
                Start Your Journey Today <ArrowRight size={18} />
              </Link> */}
              <a
                to="/"
                href="mailto:info@drillu.in"
                className="btn btn-secondary btn-large"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* footer simple */}
      <div className="py-3 flex justify-center bg-gradient-to-r from-green-100 to-teal-200 text-white">
        <p className="">
          © {new Date().getFullYear()} DrillU Career Success Platform. All
          rights reserved.
        </p>
      </div>
      {/* Footer */}
      {/* <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <DrilluLogo 
                width="120px" 
                height="auto"
                className="footer-logo-svg"
                style={{
                  filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.1))"
                }}
              />
              <p className="footer-tagline">Empowering students to excel in academics and career</p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Platform</h4>
                <ul>
                  <li><span>Assessment Portal</span></li>
                  <li><span>Placement Training</span></li>
                  <li><span>Coding Challenges</span></li>
                  <li><span>Mentorship</span></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Company</h4>
                <ul>
                  <li><span>About Us</span></li>
                  <li><span>Our Team</span></li>
                  <li><span>Partner Companies</span></li>
                  <li><span>Contact Us</span></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Resources</h4>
                <ul>
                  <li><span>Blog</span></li>
                  <li><span>FAQs</span></li>
                  <li><span>Testimonials</span></li>
                  <li><span>Support</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="flex justify-center">

            <p className="copyright">© 2025 DrillU Career Success Platform. All rights reserved.</p>
            </div>
            <div className="footer-social">
              Social icons would go here
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default DrillUStudentPortal;
