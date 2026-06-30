# E-Commerce Product Page

A modern, interactive product page for an e-commerce site built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### Core Features
- Product image gallery with zoom functionality
- Color/size variant selection with real-time updates
- Add to cart functionality with quantity selector
- Product description with expandable sections
- Responsive design that works on all devices

### Advanced Feature
- Custom image lazy loading solution with blur-up technique
  - Implemented in the `useBlurImage` hook
  - Provides a smooth loading experience with SVG placeholders

### Additional Features
- Dark/light mode toggle
- Keyboard navigation support
- Accessible UI components
- Unit tests for critical components
- Analytics tracking
- Error logging

## Technical Implementation

### Technologies Used
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui for UI components
- Jest and React Testing Library for testing

### Key Technical Decisions

1. **State Management**
   - Used React Context for cart state management
   - Implemented local storage persistence for cart items

2. **Image Optimization**
   - Custom blur-up technique for image loading
   - Used Next.js Image component for automatic optimization
   - Added loading states and error handling for images

3. **Accessibility**
   - Implemented proper ARIA attributes
   - Keyboard navigation support
   - Screen reader friendly content
   - Focus management

4. **Performance Optimization**
   - Lazy loading of images
   - Component-based architecture for better code splitting
   - Optimized rendering with conditional logic
   - Proper error boundaries and loading states

## Project Setup

### Prerequisites
- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/ecommerce-product-page.git
cd ecommerce-product-page
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Running Tests

\`\`\`bash
npm test
# or
yarn test
\`\`\`

## Performance Considerations

- Implemented image optimization to reduce page load time
- Used Next.js App Router for improved routing performance
- Optimized component re-renders with proper state management
- Implemented code splitting for better initial load time
- Added proper loading states for better user experience

## Accessibility Features

- Proper heading hierarchy
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance
- Screen reader announcements for dynamic content
- Focus management for interactive elements.
