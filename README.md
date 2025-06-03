# Visual Right - AI Interactive Playground

## Project Overview
Visual Right is an interactive learning platform designed to enhance the understanding of Artificial Intelligence (AI), data structures, and algorithms. By leveraging visualization and simulation techniques, this platform enables users to engage with and explore AI concepts through hands-on experimentation.

---

## Team Members
- **Ms. Punnapa Thianchai** (Student ID: 64090500405)
- **Mr. Awirut Phusaensaart** (Student ID: 64090500409)
- **Mr. Jittapat Chanyarungroj** (Student ID: 64090500426)

## Project Advisor
- **Dr. Wittawin Susutti**

---

## Keywords
- Artificial Intelligence (AI)
- Visualization
- Simulation
- Interactive Learning
- Data Structure
- Algorithms

---

## Background and Significance
Artificial Intelligence (AI) has revolutionized industries by enabling machines to simulate human intelligence, making complex decisions, and efficiently processing data. As AI continues to grow in prominence, understanding its principles is essential for students and professionals alike.

Interactive visual simulations have been shown to enhance the learning experience by providing users with tangible ways to experiment with systems and observe outcomes. According to research by Mouhib Alnoukari et al., such simulations help students better grasp technical content and improve their problem-solving accuracy.

This project proposes an interactive AI learning playground where users can explore AI concepts, data structures, and algorithms through visual simulations. The platform aims to bridge the gap between theoretical knowledge and practical application.

---

## Setup and Running the Project

### Prerequisites
- Node.js (version 18 or higher)
- Yarn package manager

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd ptojext
   ```

2. Install dependencies using Yarn
   ```bash
   yarn install
   ```

3. Development mode
   ```bash
   yarn dev
   ```
   This will start the development server with Turbopack at `http://localhost:3000`

4. Build for production
   ```bash
   yarn build
   ```

5. Run production build
   ```bash
   yarn start
   ```

### Project Structure
- `/src/app` - Next.js application routes and pages
- `/src/components` - Reusable UI components
- `/src/simulations` - Interactive simulation components
- `/public` - Static assets

### Technologies Used
- **Frontend Framework**: Next.js with TypeScript
- **UI Libraries**: 
  - TailwindCSS for styling
  - Shadcn UI components (`npx shadcn@latest add [component name]`)
  - HeroUI components
  - Framer Motion for animations
- **Visualization**: Three.js, Pixi.js, Matter.js
- **State Management**: Zustand
- **Mathematics**: KaTeX for mathematical formulas
- **Charts**: Chart.js with React-ChartJS-2

---

## Objectives
1. Develop an interactive AI learning platform.
2. Enable users to visualize and understand the functioning of AI, data structures, and algorithms step-by-step.

---

## Expected Benefits
- A functional and user-friendly interactive learning platform for AI concepts.
- Enhanced comprehension of AI, data structures, and algorithms through real-time visualizations and interactions.

---

## Key Features
1. **Interactive Simulations**: Users can manipulate inputs and parameters to see how AI algorithms respond.
2. **Visualization Tools**: Step-by-step breakdown of data structures and algorithms in action.
3. **Experiential Learning**: Hands-on environment for experimenting with AI models and their outcomes.
