"use client";

import React, { useState, useEffect } from 'react';
import BaseLayout from '@/components/layout/BaseLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiClock, FiCalendar, FiGithub, FiArrowRight, FiStar } from 'react-icons/fi';
import { Tabs, Tab, Card, CardBody } from '@heroui/react';
import Breadcrumb from '@/components/common/Breadcrumb';
import { useInView } from 'react-intersection-observer';

// Define types for roadmap and changelog items
interface RoadmapItem {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'in-progress' | 'planned';
    targetDate?: string;
    category: string;
}

interface ChangelogItem {
    id: string;
    version: string;
    date: string;
    highlights: string[];
    details: {
        added?: string[];
        fixed?: string[];
        improved?: string[];
        removed?: string[];
    };
}

// Sample data for roadmap
const roadmapItems: RoadmapItem[] = [
    {
        id: '1',
        title: 'Interactive Sorting Visualizations',
        description: 'Implement interactive visualizations for common sorting algorithms like Bubble Sort, Quick Sort, and Merge Sort.',
        status: 'completed',
        category: 'Algorithms'
    },
    {
        id: '2',
        title: 'Image Processing Tools',
        description: 'Add tools for basic image processing operations like filtering, edge detection, and histogram equalization.',
        status: 'completed',
        category: 'Image Processing'
    },
    {
        id: '3',
        title: 'Pathfinding Algorithm Visualizations',
        description: 'Implement visualizations for A* and Dijkstra pathfinding algorithms with interactive grids.',
        status: 'completed',
        category: 'Algorithms'
    },
    {
        id: '4',
        title: 'Image Enhancement Quiz',
        description: 'Create an interactive quiz for image enhancement techniques with real-world medical imaging examples.',
        status: 'completed',
        category: 'Education'
    },
    {
        id: '5',
        title: 'Advanced Data Structures Visualization',
        description: 'Add visualizations for advanced data structures like AVL trees, Red-Black trees, and Graphs.',
        status: 'in-progress',
        targetDate: 'Q3 2025',
        category: 'Data Structures'
    },
    {
        id: '6',
        title: 'Machine Learning Playground',
        description: 'Interactive visualization of basic machine learning algorithms and concepts.',
        status: 'in-progress',
        targetDate: 'Q4 2025',
        category: 'Machine Learning'
    },
    {
        id: '7',
        title: 'User Authentication and Profiles',
        description: 'Implement user accounts to save progress and customize learning paths.',
        status: 'planned',
        targetDate: 'Q1 2026',
        category: 'Platform'
    },
    {
        id: '8',
        title: 'Mobile App Version',
        description: 'Develop a mobile application version for iOS and Android platforms.',
        status: 'planned',
        targetDate: 'Q2 2026',
        category: 'Platform'
    },
    {
        id: '9',
        title: 'Community Contributions',
        description: 'Allow community members to submit their own visualizations and educational content.',
        status: 'planned',
        targetDate: 'Q3 2026',
        category: 'Community'
    }
];

// Sample data for changelog
const changelogItems: ChangelogItem[] = [
    {
        id: '1',
        version: 'v1.0.0',
        date: 'May 1, 2025',
        highlights: [
            'Initial release with sorting algorithm visualizations',
            'Basic image processing tools'
        ],
        details: {
            added: [
                'Bubble Sort, Quick Sort, Merge Sort, and Insertion Sort visualizations',
                'Image filtering and edge detection tools',
                'Basic landing page and navigation'
            ]
        }
    },
    {
        id: '2',
        version: 'v1.1.0',
        date: 'May 15, 2025',
        highlights: [
            'Added pathfinding algorithm visualizations',
            'Improved UI/UX across the platform'
        ],
        details: {
            added: [
                'A* and Dijkstra pathfinding algorithm visualizations',
                'Interactive grid for pathfinding demos'
            ],
            improved: [
                'Enhanced mobile responsiveness',
                'Better color schemes for visualizations',
                'Optimized performance for large datasets'
            ],
            fixed: [
                'Fixed layout issues on smaller screens',
                'Corrected algorithm step explanations'
            ]
        }
    },
    {
        id: '3',
        version: 'v1.2.0',
        date: 'June 5, 2025',
        highlights: [
            'Launched Image Enhancement Quiz feature',
            'Added dark mode support'
        ],
        details: {
            added: [
                'Interactive quiz for image enhancement techniques',
                'Real-world medical imaging examples',
                'Dark mode support across the platform',
                'Progress tracking for quizzes'
            ],
            improved: [
                'Faster loading times for image processing tools',
                'More detailed explanations for algorithms'
            ],
            fixed: [
                'Fixed histogram equalization bugs',
                'Corrected quiz scoring system'
            ]
        }
    }
];

// Animated particles background effect
const ParticleBackground = () => {
    useEffect(() => {
        // ignore eslint    
        // eslint-disable-next-line
        const particles: any[] = [];
        const colors = ['#4CC9F0', '#4361EE', '#3A0CA3', '#7209B7', '#F72585'];
        const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight * 2;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Define the Particle class
        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            color: string;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 5 + 1;
                this.speedX = Math.random() * 3 - 1.5;
                this.speedY = Math.random() * 3 - 1.5;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.size > 0.2) this.size -= 0.01;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
            }
        }

        const init = () => {
            for (let i = 0; i < 100; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Create connections between particles that are close
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = particles[i].color;
                        ctx.lineWidth = 0.2;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }

            requestAnimationFrame(animate);
        };

        init();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return <canvas id="particle-canvas" className="fixed inset-0 -z-10 opacity-60" />;
};

// Reveal section animation
const RevealSection = ({ children }: { children: React.ReactNode }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};

export default function RoadmapPage() {
    const [filter, setFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('roadmap');

    // Filter roadmap items based on status
    const filteredRoadmapItems = filter === 'all'
        ? roadmapItems
        : roadmapItems.filter(item => item.status === filter);

    return (
        <BaseLayout>
            <div className="relative">
                <ParticleBackground />
                <motion.div
                    className="fixed inset-0 bg-gradient-to-b from-transparent to-white/30 pointer-events-none -z-10"
                    animate={{
                        background: [
                            'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))',
                            'linear-gradient(to bottom, transparent, rgba(235,245,255,0.3))',
                            'linear-gradient(to bottom, transparent, rgba(245,235,255,0.3))',
                            'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))'
                        ]
                    }}
                    transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
                />
                <motion.div
                    className="fixed inset-0 opacity-30 pointer-events-none -z-5"
                    style={{
                        backgroundImage: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0, rgba(99, 102, 241, 0) 70%)'
                    }}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Breadcrumb
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Roadmap', href: '/roadmap' },
                        ]}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-600 to-indigo-600">Project Roadmap & Changelog</h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Follow our journey as we build and improve Visual Right, your platform for algorithm and AI visualizations.
                        </p>
                    </motion.div>

                    <Tabs aria-label="Roadmap and Changelog" className="w-full" variant="underlined" color="primary" size="lg">
                        <Tab key="roadmap" title="Roadmap">
                            <Card className="border-none  bg-white/80 backdrop-blur-sm">
                                <CardBody>
                                    <RevealSection>
                                        <div className="flex flex-wrap gap-3 mb-8 justify-center">
                                            <button
                                                onClick={() => setFilter('all')}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === 'all' ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                            >
                                                All
                                            </button>
                                            <button
                                                onClick={() => setFilter('completed')}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                            >
                                                Completed
                                            </button>
                                            <button
                                                onClick={() => setFilter('in-progress')}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === 'in-progress' ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                            >
                                                In Progress
                                            </button>
                                            <button
                                                onClick={() => setFilter('planned')}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === 'planned' ? 'bg-gradient-to-r from-primary-500 to-violet-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                            >
                                                Planned
                                            </button>
                                        </div>
                                    </RevealSection>

                                    <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary-400 before:via-primary-500 before:to-indigo-500">
                                        {filteredRoadmapItems.map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                                className="relative flex items-center md:justify-center"
                                            >
                                                <div className="absolute left-0 md:left-auto md:right-1/2 h-5 w-5 rounded-full bg-gradient-to-r from-primary-500 to-indigo-500 -translate-x-1/2 md:translate-x-1/2 z-10 shadow-md flex items-center justify-center">
                                                    {item.status === 'completed' && <FiCheckCircle className="text-white text-xs" />}
                                                    {item.status === 'in-progress' && <FiClock className="text-white text-xs" />}
                                                    {item.status === 'planned' && <FiStar className="text-white text-xs" />}
                                                </div>
                                                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 w-full md:w-5/12 md:ml-8 border-l-4 border-primary-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                                    <div className="flex items-center mb-2">
                                                        <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">{item.title}</h3>
                                                    </div>
                                                    <p className="text-gray-600 mb-4">{item.description}</p>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <div className="flex items-center text-gray-500 bg-gray-50 px-3 py-1 rounded-full text-sm">
                                                            <FiCalendar className="mr-2" />
                                                            <span>{item.targetDate || 'Completed'}</span>
                                                        </div>
                                                        <span className="inline-block px-3 py-1 text-sm rounded-full bg-primary-100 text-primary-800">{item.category}</span>
                                                        <span className={`inline-block px-3 py-1 text-sm rounded-full ${item.status === 'completed' ? 'bg-green-100 text-green-800' : item.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-primary-100 text-primary-800'}`}>
                                                            {item.status === 'completed' ? 'Completed' : item.status === 'in-progress' ? 'In Progress' : 'Planned'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="mt-16 text-center">
                                        <a
                                            href="https://github.com/RiwRiwara/ptojext"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <FiGithub className="mr-2" />
                                            View on GitHub
                                        </a>
                                    </div>
                                </CardBody>
                            </Card>
                        </Tab>

                        <Tab key="changelog" title="Changelog">
                            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardBody>
                                    <div className="space-y-16">
                                        {changelogItems.map((item, index) => (
                                            <RevealSection key={item.id}>
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                                    className="relative"
                                                >
                                                    <div className="flex items-center mb-4">
                                                        <div className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md">
                                                            {item.version}
                                                        </div>
                                                        <div className="ml-4 flex items-center text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                                                            <FiCalendar className="mr-2" />
                                                            <span>{item.date}</span>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 ml-8 border-l-4 border-indigo-500 hover:shadow-xl transition-all duration-300">
                                                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 mb-4">Highlights</h3>
                                                        <ul className="mb-6 space-y-2">
                                                            {item.highlights.map((highlight, i) => (
                                                                <li key={i} className="flex items-start">
                                                                    <FiArrowRight className="text-primary-500 mt-1 mr-2 shrink-0" />
                                                                    <span className="text-gray-700">{highlight}</span>
                                                                </li>
                                                            ))}
                                                        </ul>

                                                        <div className="space-y-6">
                                                            {item.details.added && (
                                                                <div className="bg-green-50 p-4 rounded-lg">
                                                                    <h4 className="text-md font-semibold text-green-600 mb-2 flex items-center">
                                                                        <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">+</span>
                                                                        Added
                                                                    </h4>
                                                                    <ul className="pl-5 space-y-1">
                                                                        {item.details.added.map((text, i) => (
                                                                            <li key={i} className="text-gray-600 list-disc">{text}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}

                                                            {item.details.improved && (
                                                                <div className="bg-primary-50 p-4 rounded-lg">
                                                                    <h4 className="text-md font-semibold text-primary-600 mb-2 flex items-center">
                                                                        <span className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center mr-2">↑</span>
                                                                        Improved
                                                                    </h4>
                                                                    <ul className="pl-5 space-y-1">
                                                                        {item.details.improved.map((text, i) => (
                                                                            <li key={i} className="text-gray-600 list-disc">{text}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}

                                                            {item.details.fixed && (
                                                                <div className="bg-yellow-50 p-4 rounded-lg">
                                                                    <h4 className="text-md font-semibold text-yellow-600 mb-2 flex items-center">
                                                                        <span className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center mr-2">✓</span>
                                                                        Fixed
                                                                    </h4>
                                                                    <ul className="pl-5 space-y-1">
                                                                        {item.details.fixed.map((text, i) => (
                                                                            <li key={i} className="text-gray-600 list-disc">{text}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}

                                                            {item.details.removed && (
                                                                <div className="bg-red-50 p-4 rounded-lg">
                                                                    <h4 className="text-md font-semibold text-red-600 mb-2 flex items-center">
                                                                        <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-2">-</span>
                                                                        Removed
                                                                    </h4>
                                                                    <ul className="pl-5 space-y-1">
                                                                        {item.details.removed.map((text, i) => (
                                                                            <li key={i} className="text-gray-600 list-disc">{text}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </RevealSection>
                                        ))}
                                    </div>

                                    <div className="mt-16 text-center">
                                        <a
                                            href="https://github.com/RiwRiwara/ptojext"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <FiGithub className="mr-2" />
                                            View on GitHub
                                        </a>
                                    </div>
                                </CardBody>
                            </Card>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </BaseLayout>
    );
}