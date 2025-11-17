# Design Guidelines: Interactive AI Education Platform for Children

## Design Approach

**Reference-Based Approach** drawing inspiration from successful educational platforms:
- **Primary References**: Duolingo (gamification), Khan Academy Kids (child-friendly UI), Prodigy Math (engaging practice)
- **Core Principles**: Playful engagement, clear visual feedback, reward-driven progression, age-appropriate complexity

## Typography

**Font Families**:
- Headlines/Titles: Rounded sans-serif (e.g., "Fredoka" or "Baloo 2" from Google Fonts) - friendly, approachable
- Body Text: Clean sans-serif (e.g., "Inter" or "Nunito") - highly readable for children
- Numbers/Math: Tabular numerals enabled for alignment

**Hierarchy**:
- Hero Headlines: text-5xl to text-7xl, font-bold
- Section Headers: text-3xl to text-4xl, font-semibold
- Card Titles: text-xl to text-2xl, font-semibold
- Body Text: text-base to text-lg for easy reading
- Buttons/CTAs: text-lg, font-semibold

## Layout System

**Spacing Primitives**: Use Tailwind units of 3, 4, 6, 8, 12, 16
- Tight spacing: p-3, gap-4 (within cards)
- Standard spacing: p-6, gap-6 (between elements)
- Section spacing: py-12, py-16 (between major sections)
- Large spacing: p-8, gap-8 (dashboard layouts)

**Grid Structures**:
- Dashboard: 12-column responsive grid
- Practice Cards: 2 columns (tablet), 3-4 columns (desktop), 1 column (mobile)
- Content Areas: max-w-7xl containers with generous padding

## Component Library

### Navigation & Dashboard
**Main Navigation**: 
- Top navigation bar with logo (left), level selector (center), profile/points display (right)
- Sticky position with subtle shadow
- Child-friendly icon navigation for mobile

**Dashboard Layout**:
- Welcome banner with student name and encouraging message
- Subject cards (Maths/English) with progress rings and "Continue Learning" CTAs
- Recent achievements carousel showcasing earned badges
- Weekly progress chart with colorful bars
- Quick practice buttons for each curriculum level

### Interactive Practice Components
**Question Cards**:
- Large, centered question area with ample whitespace
- Rounded corners (rounded-2xl) with soft shadows
- Answer input area with large touch targets (min 48px height)
- AI mascot character positioned to the side providing hints
- Submit button with celebration animation on correct answers

**Feedback System**:
- Immediate visual feedback: green checkmarks for correct, encouraging messages for incorrect
- AI-generated explanations appear in speech bubbles from mascot character
- "Try Again" encouragement rather than harsh error states
- Progress indicator showing questions completed in session

### Gamification Elements
**Achievement Badges**:
- Circular badge designs with vibrant gradients
- Animation on earn: scale-up with sparkle effects
- Badge wall display in profile showing locked/unlocked states
- Tooltips explaining how to earn each badge

**Points & Rewards**:
- Animated point counter in header
- Star ratings (1-3 stars) for practice sessions
- Level-up celebrations with confetti animations
- Streak tracker encouraging daily practice

**Progress Visualizations**:
- Circular progress rings for subject mastery
- Skill trees showing topic progression
- Color-coded difficulty levels (easy/medium/hard)
- Completion percentages with encouraging milestones

### Forms & Inputs
**Authentication**:
- Welcoming login screen with platform mascot illustration
- Large, friendly buttons for social login options
- Simplified parent/student role selection with icons
- Registration wizard with clear step indicators

**Profile Management**:
- Avatar selector with fun, diverse character options
- Large form fields with clear labels
- Grade level selector matching NZ curriculum (Years 1-8)
- Parent dashboard for monitoring progress

### Data Displays
**Analytics Cards**:
- Weekly practice time visualization with bar charts
- Accuracy trends with line graphs
- Most practiced topics with horizontal bars
- Comparison to previous weeks with up/down indicators

**Session History**:
- Timeline view of completed practice sessions
- Session cards showing: date, subject, questions attempted, accuracy, time spent
- Filter controls for subject and date range
- "Review Mistakes" functionality

## Images

**Hero Section**: 
- Large, colorful illustration of diverse children learning with AI mascot character
- Positioned full-width at top of landing page
- Bright, educational theme with books, numbers, and letters floating around
- Overlay text with blurred-background buttons for "Start Learning" and "Parent Login"

**Dashboard Graphics**:
- Subject cards feature custom illustrations (maths with numbers/shapes, English with books/letters)
- Achievement badge icons are colorful, child-appropriate designs
- AI mascot character appears throughout as a friendly guide (robot, animal, or fantasy creature)

**Practice Screens**:
- Supportive background patterns (subtle, non-distracting geometric shapes)
- Celebration graphics for correct answers (stars, confetti, thumbs up)
- Contextual illustrations for word problems and reading comprehension

## Accessibility & Child-Friendly Design

- High contrast text (WCAG AAA compliant)
- Large touch targets (minimum 48x48px)
- Clear visual hierarchy with spacing and size
- Error states use encouraging language and gentle colors
- Keyboard navigation fully supported
- Screen reader friendly labels for all interactive elements
- Consistent button states with clear hover/active feedback

## Page-Specific Layouts

**Landing Page**: Hero with mascot illustration, three-column feature showcase (AI-powered, curriculum-aligned, gamified), social proof section with parent testimonials, pricing/signup CTA

**Dashboard**: Welcome banner, subject selection cards (2-column grid), progress overview (charts), achievements carousel, quick actions sidebar

**Practice Session**: Fixed header with progress bar, centered question card, answer submission area, AI mascot sidebar for hints, results modal with celebration

**Progress Report**: Timeline selector, multi-metric dashboard (circular progress, bar charts, skill breakdown), detailed session history table, export/share functionality