"use client";
import BaseLayout from "@/components/layout/BaseLayout";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useTranslation } from "react-i18next";
import Matter, { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint, Body } from "matter-js";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaGithub, FaLinkedin, FaEnvelope, FaGraduationCap, FaTwitter } from "react-icons/fa";
import BottomComponent from "@/components/page_components/landing_page/BottomComponent";

// Team member data
interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  links: {
    github?: string;
    linkedin?: string;
    email?: string;
    portfolio?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: "Riw - Awirut Phoosaensaart",
    role: "Lead Developer",
    bio: "Full-stack developer with expertise in interactive visualizations and AI algorithms. Passionate about creating educational tools that make complex concepts accessible.",
    image: "/team/profile1.webp", // Changed to WebP for performance
    links: {
      github: "https://github.com/RiwRiwara",
    },
  },
  {
    name: "Gunn - Jittapat Chanyarungroj",
    role: "Algorithm Specialist",
    bio: "Computer science researcher specializing in algorithm optimization and data structures. Contributes to the pathfinding and sorting visualizations.",
    image: "/team/profile2.webp",
    links: {
      github: "https://github.com/Gjittapat",
    },
  },
  {
    name: "Yayee - Punnapa Thianchai",
    role: "Frontend Developer",
    bio: "Creative designer focused on crafting intuitive and accessible user experiences. Responsible for the visual identity and interactive elements of the platform.",
    image: "/team/profile3.webp",
    links: {
      github: "https://github.com/SEPIAZY",
    },
  },
];

// SEO is handled in metadata.ts file

export default function About() {
  const { t, i18n } = useTranslation("common");
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const runnerRef = useRef<Runner | null>(null);
  const [activeTab, setActiveTab] = useState<"about" | "team" | "mission">("about");



  useEffect(() => {
    if (!sceneRef.current) return;

    // Create engine with light gravity
    const engine = Engine.create({
      gravity: { y: 0.1, x: 0 },
    });
    engineRef.current = engine;

    // Create renderer with transparent background
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: "transparent",
        wireframes: false,
        showAngleIndicator: false,
        showCollisions: false,
        showVelocity: false,
      },
    });

    // Create invisible boundaries
    const boundaries = [
      Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 50, {
        isStatic: true,
        render: { fillStyle: "transparent", visible: false },
      }), // Top
      Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 50, {
        isStatic: true,
        render: { fillStyle: "transparent", visible: false },
      }), // Bottom
      Bodies.rectangle(0, window.innerHeight / 2, 50, window.innerHeight, {
        isStatic: true,
        render: { fillStyle: "transparent", visible: false },
      }), // Left
      Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 50, window.innerHeight, {
        isStatic: true,
        render: { fillStyle: "transparent", visible: false },
      }), // Right
    ];

    // Optimize circle count for mobile
    const circleCount = window.innerWidth < 768 ? 10 : 15; // Reduced from 20
    const circles = Array.from({ length: circleCount }, (_, index) => {
      return Bodies.circle(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 20, {
        restitution: 0.8,
        friction: 0.001,
        frictionAir: 0.001,
        render: {
          fillStyle: "rgba(99, 102, 241, 0.5)",
        },
        label: `circle-${index}`,
      });
    });

    // Add a bouncing square
    const square = Bodies.rectangle(
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight,
      40,
      40,
      {
        restitution: 0.7,
        friction: 0.002,
        frictionAir: 0.002,
        render: {
          fillStyle: "rgba(251, 146, 60, 0.8)",
        },
        label: "special-square",
      }
    );

    // Add all bodies to world
    World.add(engine.world, [...circles, square, ...boundaries]);

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Simulate bird-like movement
    Matter.Events.on(engine, "beforeUpdate", () => {
      circles.forEach((circle) => {
        if (Math.random() < 0.05) {
          const forceMagnitude = 0.001;
          Body.applyForce(circle, circle.position, {
            x: (Math.random() - 0.5) * forceMagnitude,
            y: (Math.random() - 0.5) * forceMagnitude,
          });
        }
      });
    });

    // Hover effect for scaling circles
    let lastHovered: Matter.Body | null = null;
    let lastScale = 1;
    const scaleUp = 1.4;

    function handleMouseMove(event: MouseEvent) {
      const rect = render.canvas.getBoundingClientRect();
      const mousePos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      const found = Matter.Query.point(circles, mousePos)[0] || null;
      if (found !== lastHovered) {
        if (lastHovered && lastScale !== 1) {
          Matter.Body.scale(lastHovered, 1 / lastScale, 1 / lastScale);
        }
        if (found) {
          Matter.Body.scale(found, scaleUp, scaleUp);
          render.canvas.style.cursor = "grab";
          lastScale = scaleUp;
        } else {
          render.canvas.style.cursor = "default";
          lastScale = 1;
        }
        lastHovered = found;
      }
    }

    render.canvas.addEventListener("mousemove", handleMouseMove);
    render.canvas.addEventListener("mouseleave", () => {
      if (lastHovered && lastScale !== 1) {
        Matter.Body.scale(lastHovered, 1 / lastScale, 1 / lastScale);
        lastHovered = null;
        lastScale = 1;
      }
      render.canvas.style.cursor = "default";
    });

    // Create and run runner
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Run renderer
    Render.run(render);

    // Pause animation when out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (runnerRef.current) {
          if (entry.isIntersecting) {
            // Use Runner.run instead of Runner.start
            if (runnerRef.current.enabled === false) {
              runnerRef.current.enabled = true;
            }
          } else {
            if (runnerRef.current.enabled === true) {
              runnerRef.current.enabled = false;
            }
          }
        }
      },
      { threshold: 0 }
    );
    observer.observe(sceneRef.current);

    // Cleanup
    return () => {
      observer.disconnect();
      Render.stop(render);
      Runner.stop(runner);
      World.clear(engine.world, true);
      Engine.clear(engine);
      render.canvas.remove();
      World.remove(engine.world, mouseConstraint);
      render.canvas.removeEventListener("mousemove", handleMouseMove);
      render.canvas.removeEventListener("mouseleave", () => { });
    };
  }, []);

  return (
    <BaseLayout>

      {/* Interactive background */}
      <div ref={sceneRef} className="absolute inset-0 pointer-events-auto z-0" aria-hidden="true" />

      {/* Main content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 relative min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb navigation */}
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: t("HOME", "Home"), href: "/" },
                { label: t("ABOUT_TITLE", "About Us") },
              ]}
            />
          </div>

          {/* Header section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl mb-12 bg-gradient-to-r from-[#83AFC9] to-sky-600 text-white"
          >
            <div className="absolute inset-0 bg-pattern opacity-10" />
            <div className="relative z-10 px-8 py-16 md:py-20 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t("ABOUT_TITLE", "About Visual Right: AI Playground")}
              </h1>
              <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
                {t(
                  "ABOUT_SUBTITLE",
                  "Exploring the fascinating world of AI algorithms through interactive visualizations and simulations"
                )}
              </p>
            </div>
          </motion.div>

          {/* Tab navigation */}
          <div className="flex justify-center mb-8 overflow-x-auto pb-2">
            <div className="inline-flex p-1 rounded-lg bg-gray-100 shadow-sm">
              {["about", "team", "mission"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as "about" | "team" | "mission")}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab ? "bg-white text-primary-500 shadow-sm" : "text-gray-600 hover:text-gray-800"
                    }`}
                  aria-current={activeTab === tab ? "page" : undefined}
                >
                  {t(tab.toUpperCase(), tab.charAt(0).toUpperCase() + tab.slice(1))}
                </button>
              ))}
            </div>
          </div>

          {/* Content container */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden z-10 relative"
          >
            {/* About tab content */}
            {activeTab === "about" && (
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-primary-500 mb-6">
                      {t("OUR_PROJECT", "Our Project: Interactive AI Visualizations")}
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                      <p>
                        {t(
                          "ABOUT_PROJECT",
                          "Visual Right: AI Playground is an interactive educational platform designed to make complex algorithms and AI concepts accessible through hands-on visualizations and simulations."
                        )}
                      </p>
                      <p>
                        {t(
                          "ABOUT_FEATURES",
                          "Our platform features interactive demonstrations of pathfinding algorithms, sorting visualizations, physics simulations, and image processing tools, all designed with a focus on learning through exploration. Check out our "
                        )}
                        <a href="/simulations" className="text-primary-500 hover:underline">
                          simulations
                        </a>
                        .
                      </p>
                      <p>
                        {t(
                          "ABOUT_GOAL",
                          "Our goal is to bridge the gap between theoretical knowledge and practical understanding, making computer science and AI concepts more intuitive and engaging for students, educators, and enthusiasts alike."
                        )}
                      </p>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-4">
                      <a
                        href="https://github.com/RiwRiwara/ptojext.git"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-[#83AFC9] text-primary-500 rounded-lg hover:bg-[#83AFC9] hover:text-white transition-colors"
                        aria-label="View Visual Right on GitHub"
                      >
                        <FaGithub className="mr-2" /> View on GitHub
                      </a>
                      <a
                        href="/simulations"
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#83AFC9] to-sky-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                        aria-label="Explore Learning Resources"
                      >
                        <FaGraduationCap className="mr-2" /> Learning Resources
                      </a>
                    </div>
                  </div>
                  <div className="relative rounded-xl overflow-hidden shadow-lg h-[400px]">
                    <Image
                      src="/about/showcase.png"
                      alt="Interactive AI visualizations in Visual Right platform"
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-xl"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Technologies section */}
                <div className="mt-16">
                  <h2 className="text-2xl font-bold text-primary-500 mb-6">
                    {t("TECHNOLOGIES", "Technologies We Use")}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { name: "React & Next.js", icon: "/tech/react.svg", desc: "Frontend framework" },
                      { name: "TypeScript", icon: "/tech/typescript.svg", desc: "Type-safe JavaScript" },
                      { name: "Tailwind CSS", icon: "/tech/tailwind.svg", desc: "Utility-first CSS" },
                      { name: "Framer Motion", icon: "/tech/framer.svg", desc: "Animation library" },
                      { name: "Matter.js", icon: "/tech/matter.svg", desc: "Physics engine" },
                      { name: "Canvas API", icon: "/tech/canvas.svg", desc: "Graphics rendering" },
                      { name: "WebGL", icon: "/tech/webgl.svg", desc: "3D graphics" },
                      { name: "i18next", icon: "/tech/i18n.svg", desc: "Internationalization" },
                    ].map((tech, index) => (
                      <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-gray-50 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow"
                      >
                        <div className="w-12 h-12 mb-3 flex items-center justify-center">
                          <Image
                            src={tech.icon}
                            alt={`${tech.name} icon`}
                            width={40}
                            height={40}
                            loading="lazy"
                          />
                        </div>
                        <h3 className="font-medium text-gray-900">{tech.name}</h3>
                        <p className="text-sm text-gray-500">{tech.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Team tab content */}
            {activeTab === "team" && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-primary-500 mb-8 text-center">
                  {t("MEET_OUR_TEAM", "Meet Our Team")}
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {teamMembers.map((member, index) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="h-48 relative">
                        <Image
                          src={member.image}
                          alt={`${member.name}, ${member.role} at Visual Right`}
                          fill
                          style={{ objectFit: "cover"}}
                          loading="lazy"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                        <p className="text-primary-500 font-medium mb-3">{member.role}</p>
                        <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                        <div className="flex space-x-3">
                          {member.links.github && (
                            <a
                              href={member.links.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-primary-500 transition-colors"
                              aria-label={`Visit ${member.name}'s GitHub profile`}
                            >
                              <FaGithub size={18} />
                            </a>
                          )}
                          {member.links.linkedin && (
                            <a
                              href={member.links.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-primary-500 transition-colors"
                              aria-label={`Visit ${member.name}'s LinkedIn profile`}
                            >
                              <FaLinkedin size={18} />
                            </a>
                          )}
                          {member.links.email && (
                            <a
                              href={`mailto:${member.links.email}`}
                              className="text-gray-500 hover:text-primary-500 transition-colors"
                              aria-label={`Email ${member.name}`}
                            >
                              <FaEnvelope size={18} />
                            </a>
                          )}
                          {member.links.portfolio && (
                            <a
                              href={member.links.portfolio}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-primary-500 transition-colors"
                              aria-label={`Visit ${member.name}'s portfolio`}
                            >
                              <FaGraduationCap size={18} />
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-12 bg-gray-50 rounded-xl p-8 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {t("SUPPORT_OUR_TEAM", "Support Our Team")}
                  </h3>
                  <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                    {t(
                      "SUPPORT_TEXT",
                      "If you find this project helpful, consider supporting us!"
                    )}
                  </p>
                  <a
                    href="mailto:contact@visualright.ai"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#83AFC9] to-sky-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                    aria-label="Contact Visual Right"
                  >
                    Get in Touch
                  </a>
                </div>
              </div>
            )}

            {/* Mission tab content */}
            {activeTab === "mission" && (
              <div className="p-8">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl font-bold text-primary-500 mb-6 text-center">
                    {t("OUR_MISSION_VISION", "Our Mission & Vision")}
                  </h2>
                  <div className="prose prose-lg max-w-none text-gray-700 mb-12">
                    <h3 className="text-xl font-bold text-primary-500 mb-1 mt-4">{t("MISSION", "Mission")}</h3>
                    <p>
                      {t(
                        "MISSION_TEXT",
                        "Our mission is to democratize access to AI and computer science education through interactive, visual learning experiences. We believe that complex concepts become intuitive when you can see them in action and interact with them directly."
                      )}
                    </p>
                    <h3 className="text-xl font-bold text-primary-500 mb-1 mt-4">{t("VISION", "Vision")}</h3>
                    <p>
                      {t(
                        "VISION_TEXT",
                        "We envision a world where anyone, regardless of their background or prior knowledge, can understand and engage with the fundamental concepts that power modern technology. By making these concepts accessible and enjoyable to learn, we aim to inspire the next generation of innovators and problem-solvers."
                      )}
                    </p>
                    <h3 className="text-xl font-bold text-primary-500 mb-1 mt-4">{t("VALUES", "Values")}</h3>
                    <ul>
                      <li>
                        <strong className="text-primary text-lg">{t("ACCESSIBILITY", "Accessibility")}</strong>:{" "}
                        {t("ACCESSIBILITY_TEXT", "Making complex concepts understandable to everyone")}
                      </li>
                      <li>
                        <strong className="text-primary text-lg">{t("INTERACTIVITY", "Interactivity")}</strong>:{" "}
                        {t("INTERACTIVITY_TEXT", "Learning through hands-on exploration and experimentation")}
                      </li>
                      <li>
                        <strong className="text-primary text-lg">{t("INNOVATION", "Innovation")}</strong>:{" "}
                        {t("INNOVATION_TEXT", "Continuously improving our visualizations and simulations")}
                      </li>
                      <li>
                        <strong className="text-primary text-lg">{t("COMMUNITY", "Community")}</strong>:{" "}
                        {t("COMMUNITY_TEXT", "Building a supportive environment for learners and contributors")}
                      </li>
                      <li>
                        <strong className="text-primary text-lg">{t("OPEN_SOURCE", "Open Source")}</strong>:{" "}
                        {t("OPEN_SOURCE_TEXT", "Sharing knowledge and code with the world")}
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-[#83AFC9]/10 to-sky-600/10 rounded-xl p-8 border border-[#83AFC9]/20">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {t("OUR_IMPACT", "Our Impact")}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                      {[
                        { metric: "0K+", label: t("MONTHLY_USERS", "Monthly Users") },
                        { metric: "0+", label: t("INTERACTIVE_DEMOS", "Interactive Demos") },
                        { metric: "0+", label: t("EDUCATIONAL_INSTITUTIONS", "Educational Institutions") },
                        { metric: "0+", label: t("COUNTRIES", "Countries") },
                      ].map((stat) => (
                        <div key={stat.label}>
                          <p className="text-3xl font-bold text-primary-500">{stat.metric}</p>
                          <p className="text-gray-600">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <BottomComponent />
    </BaseLayout>
  );
}