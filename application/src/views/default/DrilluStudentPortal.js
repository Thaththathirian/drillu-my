import React, { useEffect, useRef } from "react";
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
  const observerRef = useRef();
  const statsRef = useRef();

  useEffect(() => {
    // Intersection Observer for reveal animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    // Observe all elements with reveal class
    document.querySelectorAll('.reveal').forEach(el => observerRef.current.observe(el));

    // Progressive number counting animation
    const animateNumbers = () => {
      const counters = document.querySelectorAll('.stat-number');
      counters.forEach(counter => {
        const target = parseInt(counter.innerText.replace(/[^\d]/g, ''));
        const suffix = counter.innerText.replace(/[\d]/g, '');
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.innerText = Math.floor(current) + suffix;
        }, 20);
      });
    };

    // Trigger number animation when stats come into view
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateNumbers();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    if (statsRef.current) {
      statsObserver.observe(statsRef.current);
    }

    // Add sparkle effect function
    const createSparkle = (x, y) => {
      const sparkle = document.createElement('div');
      sparkle.style.position = 'absolute';
      sparkle.style.left = x + 'px';
      sparkle.style.top = y + 'px';
      sparkle.style.width = '4px';
      sparkle.style.height = '4px';
      sparkle.style.background = 'white';
      sparkle.style.borderRadius = '50%';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.animation = 'sparkle 0.6s ease-out forwards';
      document.body.appendChild(sparkle);
      
      setTimeout(() => sparkle.remove(), 600);
    };

    // Add sparkle keyframe
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
      @keyframes sparkle {
        0% {
          transform: scale(0) rotate(0deg);
          opacity: 1;
        }
        50% {
          transform: scale(1) rotate(180deg);
          opacity: 1;
        }
        100% {
          transform: scale(0) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(sparkleStyle);

    // Add mouse follow effect for cards
    document.querySelectorAll('.portal-card, .service-item').forEach(card => {
      const handleMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      };
      
      const handleMouseLeave = () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    });

    // Add ripple effect
    const createRipple = (event) => {
      const button = event.currentTarget;
      const circle = document.createElement('span');
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
      circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
      circle.classList.add('ripple');

      const ripple = button.getElementsByClassName('ripple')[0];
      if (ripple) {
        ripple.remove();
      }

      button.appendChild(circle);
    };

    // Add ripple style
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: rippleEffect 0.6s linear;
        pointer-events: none;
      }
      
      @keyframes rippleEffect {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(rippleStyle);

    // Apply effects to buttons
    document.querySelectorAll('.btn, .portal-card, .service-item').forEach(el => {
      el.style.position = 'relative';
      el.style.overflow = 'hidden';
      el.addEventListener('click', createRipple);
    });

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      statsObserver.disconnect();
    };
  }, []);

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
          <div className="hero-content mb-0 fade-in-left">
            <h1 className="hero-title mb-5 leading-relaxed md:text-6xl md:leading-normal text-center">
              Prepare. Grow. Succeed.
            </h1>
            <p className="hero-subtitle fade-in-up stagger-1">
              Your comprehensive platform for campus interview preparation and
              career success
            </p>
            <div className="hero-statistics mb-3" ref={statsRef}>
              <div className="stat scale-in stagger-1 glow-effect">
                <span className="stat-number">95%</span>
                <span className="stat-label">Placement Success</span>
              </div>
              <div className="stat scale-in stagger-2 glow-effect">
                <span className="stat-number">5000+</span>
                <span className="stat-label">Students Trained</span>
              </div>
              <div className="stat scale-in stagger-3 glow-effect">
                <span className="stat-number">100+</span>
                <span className="stat-label">Partner Companies</span>
              </div>
            </div>
          </div>
          <div className="hero-image fade-in-right">
            <Logo className="enhanced-animation shine-effect" />
            <div className="placeholder-image"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-header reveal">
            <h2 className="section-title">About DrillU</h2>
            <p className="section-subtitle">Your partner in career success</p>
          </div>
          <div className="about-content">
            <div className="about-text reveal">
              <p className="fade-in-up stagger-1">
                DrillU is a powerful platform designed to help students prepare
                for campus interviews and build their careers with confidence.
                It provides personalized support and tools to ensure students
                achieve their professional goals.
              </p>
              <p className="fade-in-up stagger-2">
                Created by a team of 20 experienced placement professionals,
                along with corporate trainers and academicians, DrillU offers
                real-world insights and practical training that match industry
                needs.
              </p>
              <p className="fade-in-up stagger-3">
                With expert-designed question banks, mock interviews,
                mentorship, and placement opportunities, DrillU supports
                students, placement officers, and colleges in achieving
                placement success.
              </p>
              <div className="about-highlight scale-in stagger-4">
                <p>
                  DrillU is more than just a preparation tool—it's a partner in
                  every student's career journey, helping them prepare, grow,
                  and succeed in today's competitive job market.
                </p>
              </div>
            </div>
            <div className="about-features reveal">
              <div className="feature fade-in-right stagger-1">
                <div className="feature-icon floating">
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
              <div className="feature fade-in-right stagger-2">
                <div className="feature-icon floating">
                  <Trophy size={24} />
                </div>
                <div className="feature-text">
                  <h3>Proven Success</h3>
                  <p>
                    95% placement rate and 5000+ successfully trained students
                  </p>
                </div>
              </div>
              <div className="feature fade-in-right stagger-3">
                <div className="feature-icon floating">
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
            <div className="portal-card assessment reveal glow-effect">
              <div className="card-header">
                <div className="card-icon floating">
                  <BookOpen size={32} />
                </div>
                <h3 className="card-title">Assessment Portal</h3>
              </div>
              <p className="card-description">
                Track your progress with comprehensive evaluations tailored for
                campus interviews
              </p>
              <ul className="card-features">
                <li className="fade-in-up stagger-1">
                  <Check size={16} /> Technical & Aptitude Assessments
                </li>
                <li className="fade-in-up stagger-2">
                  <Check size={16} /> 30,000+ Questions from 100+ Companies
                </li>
                <li className="fade-in-up stagger-3">
                  <Check size={16} /> Real-time Performance Tracking
                </li>
                <li className="fade-in-up stagger-4">
                  <Check size={16} /> Detailed Score Reports & Analysis
                </li>
              </ul>
            </div>

            {/* Placement Training Card */}
            <div className="portal-card training reveal glow-effect">
              <div className="card-header">
                <div className="card-icon floating">
                  <Award size={32} />
                </div>
                <h3 className="card-title">Placement Training</h3>
              </div>
              <p className="card-description">
                Prepare for your dream career with industry-focused training and
                resources
              </p>
              <ul className="card-features">
                <li className="fade-in-up stagger-1">
                  <Check size={16} /> Mock Interviews & Feedback Sessions
                </li>
                <li className="fade-in-up stagger-2">
                  <Check size={16} /> Resume Building & Profile Enhancement
                </li>
                <li className="fade-in-up stagger-3">
                  <Check size={16} /> Industry Expert Mentorship
                </li>
                <li className="fade-in-up stagger-4">
                  <Check size={16} /> Campus Drive Notifications
                </li>
              </ul>
            </div>

            {/* Coding Portal Card */}
            <div className="portal-card coding reveal glow-effect">
              <div className="card-header">
                <div className="card-icon floating">
                  <Code size={32} />
                </div>
                <h3 className="card-title">Coding Challenges</h3>
              </div>
              <p className="card-description">
                Enhance your programming skills with regular challenges and
                competitions
              </p>
              <ul className="card-features">
                <li className="fade-in-up stagger-1">
                  <Check size={16} /> Regular Coding Competitions
                </li>
                <li className="fade-in-up stagger-2">
                  <Check size={16} /> Prizes and Placement Opportunities
                </li>
                <li className="fade-in-up stagger-3">
                  <Check size={16} /> In-depth Solutions & Explanations
                </li>
                <li className="fade-in-up stagger-4">
                  <Check size={16} /> Practice with Real Interview Problems
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
          <div className="section-header reveal">
            <h2 className="section-title">Why Choose DrillU?</h2>
            <p className="section-subtitle">
              Comprehensive career preparation services
            </p>
          </div>
          <div className="container mx-auto px-4 sm:px-8 lg:px-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="service-item gap-1 reveal shine-effect">
                <div className="service-icon floating">
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
              <div className="service-item gap-1 reveal shine-effect">
                <div className="service-icon floating">
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
              <div className="service-item gap-1 reveal shine-effect">
                <div className="service-icon floating">
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
              <div className="service-item gap-1 reveal shine-effect">
                <div className="service-icon floating">
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
              <div className="service-item gap-1 reveal shine-effect">
                <div className="service-icon floating">
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
              <div className="service-item gap-1 reveal shine-effect">
                <div className="service-icon floating">
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
          <div className="section-header reveal">
            <h2 className="section-title">Success Stories</h2>
            <p className="section-subtitle">
              See what our students have achieved
            </p>
          </div>
          <div className="testimonial-slider">
            <div className="testimonial-card reveal glass">
              <div className="testimonial-content">
                <p>
                  "With DrillU's comprehensive preparation, I secured a position
                  at my dream tech company. The practice questions were exactly
                  what came in my interview!"
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
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
          <div className="cta-content reveal">
            <h2 className="cta-title fade-in-up">Ready to accelerate your career?</h2>
            <p className="cta-text fade-in-up stagger-1">
              Join over 5000+ students who have successfully transformed their
              career journey with DrillU
            </p>
            <div className="cta-buttons">
              <a
                to="/"
                href="mailto:info@drillu.in"
                className="btn btn-secondary btn-large scale-in stagger-2 shine-effect"
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
    </div>
  );
};

export default DrillUStudentPortal;