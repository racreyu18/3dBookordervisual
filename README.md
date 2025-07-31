# Teacher Management System

A modern, responsive web application for teachers to manage students, payments, and courses efficiently.

## Features

### 🎯 Dashboard Overview
- **Real-time Statistics**: View total students, monthly revenue, active courses, and growth metrics
- **Quick Actions**: Fast access to frequently used features
- **Recent Activities**: Track latest student interactions and updates
- **Achievement Section**: Celebrate milestones and motivate users
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 👥 Student Management
- **Complete CRUD Operations**: Add, edit, delete, and view student records
- **Advanced Search & Filter**: Find students by name, email, course, or status
- **Progress Tracking**: Monitor individual student progress with visual indicators
- **Status Management**: Track active, inactive, and pending students
- **Detailed Profiles**: Store comprehensive student information including contact details

### 💳 Payment Processing
- **Payment History**: Complete transaction records with search and filter capabilities
- **Revenue Analytics**: Track total revenue, pending payments, and success rates
- **Manual Payment Entry**: Process payments and create payment requests
- **Transaction Management**: Detailed transaction IDs and payment methods
- **Export Functionality**: Download payment reports for accounting

### 📚 Course Management
- **Comprehensive CRUD Operations**: Create, read, update, and delete course records
- **Course Overview Stats**: Track total courses, enrolled students, revenue, and average ratings
- **Search & Filter**: Easily find courses by title, category, level, or status
- **Enrollment Tracking**: Monitor student enrollment progress for each course
- **Intuitive Forms**: Streamlined forms for creating and editing course details with improved input focus.

### 🎨 Modern UI/UX
- **Clean Design**: Modern interface following current design trends
- **Responsive Layout**: Mobile-first approach with seamless cross-device experience
- **Smooth Animations**: Subtle transitions and hover effects
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Dark/Light Mode**: Theme switching capability (built-in support)
- **Interactive Navigation**: Functional notification and user profile dropdowns for enhanced usability.

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **Components**: shadcn/ui component library
- **Icons**: Lucide React icons
- **State Management**: React hooks (useState, useEffect)
- **Notifications**: `useToast` for user feedback

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd teacher-management-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
teacher-management-system/
├── app/
│   ├── globals.css          # Global styles and Tailwind CSS
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── ui/                  # shadcn/ui components (e.g., button, card, dialog, dropdown-menu, toast)
│   ├── navigation.tsx       # Top navigation bar with mobile menu, search, notifications, and user profile
│   ├── student-management.tsx # Student CRUD interface
│   ├── payment-interface.tsx  # Payment processing interface
│   ├── course-management.tsx  # Course CRUD interface
│   ├── toaster.tsx          # Toast notifications display
│   └── theme-provider.tsx   # Theme context provider
├── hooks/
│   └── use-toast.ts        # Custom hook for toast notifications
│   └── use-mobile.tsx      # Hook for mobile detection (if used by shadcn components)
├── lib/
│   └── utils.ts            # Utility functions (e.g., cn for class names)
└── public/                 # Static assets (e.g., placeholder images)
\`\`\`

## Key Components

### Dashboard (`app/page.tsx`)
- Main application entry point, orchestrating different sections.
- Displays key statistics, quick action buttons, recent activities, and course progress.
- Manages the active tab state to switch between different management interfaces.

### Navigation (`components/navigation.tsx`)
- Responsive header with a mobile menu for smaller screens.
- Includes a search input, a notification bell (with a badge for unread counts), and a user profile dropdown menu.
- Allows seamless switching between Dashboard, Students, Courses, and Payments sections.

### Student Management (`components/student-management.tsx`)
- Provides a comprehensive interface for managing student records.
- Features include adding new students, editing existing student details, deleting records, and viewing student progress.
- Includes search and filter functionalities to easily navigate through student data.

### Payment Interface (`components/payment-interface.tsx`)
- Facilitates tracking and processing of student payments.
- Offers a payment history view with search and filter options.
- Includes a form for manually processing new payments with validation and user feedback.

### Course Management (`components/course-management.tsx`)
- Enables teachers to create, view, edit, and delete courses.
- Displays an overview of course statistics like total courses, enrolled students, and revenue.
- Features a dedicated form for creating new courses and a dialog for editing existing ones, with improved input focus.

## Features in Detail

### Responsive Design
- **Mobile-First**: Optimized for mobile devices with touch-friendly interfaces.
- **Breakpoint System**: Tailored layouts for mobile, tablet, and desktop.
- **Flexible Grid**: Dynamic grid layouts that adapt to screen size.
- **Touch Interactions**: Optimized for touch devices with proper spacing.

### Accessibility Features
- **Keyboard Navigation**: Full keyboard support for all interactive elements.
- **Screen Reader Support**: Proper ARIA labels and semantic HTML.
- **Color Contrast**: WCAG AA compliant color schemes.
- **Focus Management**: Clear focus indicators and logical tab order, including fixes for form input focus.

### Performance Optimizations
- **Component-Based Architecture**: Modular, reusable components for maintainability.
- **Efficient State Management**: Optimized React state updates to prevent unnecessary re-renders.
- **Lazy Loading**: Components loaded on demand (though not explicitly implemented for all sections, the structure supports it).
- **Optimized Images**: Responsive image handling (using `/placeholder.svg` for now).

## Customization

### Styling
- Modify `app/globals.css` for global style changes.
- Update `tailwind.config.ts` for theme customization (if present).
- Component-specific styles are applied using Tailwind CSS classes directly in JSX.

### Adding Features
- Create new components in the `components/` directory.
- Add new pages in the `app/` directory for new routes.
- Extend existing interfaces for additional data fields and functionalities.

### Theme Customization
- Update CSS custom properties in `globals.css` for light/dark mode colors.
- The `ThemeProvider` in `app/layout.tsx` handles theme switching.

## Deployment

### Vercel (Recommended)
1. **Connect Repository**: Link your GitHub repository to Vercel.
2. **Configure Build**: Vercel automatically detects Next.js projects.
3. **Deploy**: Push to main branch for automatic deployment.
4. **Custom Domain**: Configure custom domain in Vercel dashboard.

### Manual Deployment
1. **Build the project**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Start production server**
   \`\`\`bash
   npm start
   \`\`\`

### Environment Variables
Create a `.env.local` file for environment-specific configurations:
\`\`\`env
NEXT_PUBLIC_APP_NAME="Teacher Management System"
NEXT_PUBLIC_APP_VERSION="1.0.0"
\`\`\`

## Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository.
- Contact the development team.
- Check the documentation for common solutions.

## Roadmap

### Upcoming Features
- [ ] Advanced reporting and analytics.
- [ ] Email notification system (beyond simple toasts).
- [ ] Bulk import/export functionality for students and courses.
- [ ] Calendar integration for scheduling classes/deadlines.
- [ ] Multi-language support.
- [ ] Advanced user roles and permissions.

### Version History
- **v1.0.0**: Initial release with core functionality.
- **v1.1.0**: Enhanced UI/UX and mobile optimization.
- **v1.2.0**: Advanced search and filtering capabilities.
- **v1.3.0**: Implemented Course Management (CRUD), fixed student edit dialog, fixed payment processing, and resolved course form input focus.
- **v1.4.0**: Added functional notification and user profile dropdowns.

# 3D Orderbook Depth Visualizer

A real-time cryptocurrency orderbook visualization tool with intelligent hardware adaptation, featuring both 3D and 2D rendering modes.

## Features

- **Real-time Data**: Live orderbook data from multiple cryptocurrency exchanges
- **3D Visualization**: Interactive 3D orderbook depth charts with WebGL acceleration
- **2D Fallback**: Enhanced 2D visualization for systems without WebGL support
- **Multi-venue Support**: Aggregated data from Binance, Coinbase, Kraken, and more
- **Pressure Zone Analysis**: Intelligent detection of support and resistance levels
- **Order Flow Tracking**: Real-time monitoring of large orders and market sweeps
- **Hardware Adaptation**: Automatic detection and optimization for user's graphics capabilities

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **Components**: shadcn/ui component library
- **Icons**: Lucide React icons
- **State Management**: React hooks (useState, useEffect)
- **Notifications**: `useToast` for user feedback
- **3D Graphics**: React Three Fiber with Three.js
- **State Management**: Zustand
- **WebGL**: Hardware-accelerated 3D rendering

## Getting Started

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/3d-orderbook-visualizer.git
   cd 3d-orderbook-visualizer
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## System Requirements

### For 3D Mode
- Modern browser with WebGL 2.0 support
- Dedicated graphics card recommended
- 4GB+ RAM
- Hardware acceleration enabled

### For 2D Mode
- Any modern browser
- Works on all devices including mobile
- Minimal system requirements

## Browser Compatibility

| Browser | 3D Mode | 2D Mode |
|---------|---------|---------|
| Chrome 90+ | ✅ | ✅ |
| Firefox 88+ | ✅ | ✅ |
| Safari 14+ | ✅ | ✅ |
| Edge 90+ | ✅ | ✅ |

## Features Overview

### 3D Visualization
- Interactive orderbook depth charts
- Real-time pressure zone highlighting
- Multi-venue data overlay
- Mouse controls (rotate, zoom, pan)
- Hardware-accelerated rendering

### 2D Fallback Mode
- Enhanced orderbook tables
- Pressure zone indicators
- Volume analysis charts
- Compatible with all devices
- Optimized performance

### Real-time Features
- Live orderbook updates (100ms intervals)
- Order flow event detection
- Market pressure analysis
- Connection status monitoring
- Automatic reconnection

## Configuration

The application automatically detects your system's capabilities and selects the optimal rendering mode. You can manually switch between modes using the control panel.

## Deployment

### Vercel (Recommended)
\`\`\`bash
npm run build
vercel --prod
\`\`\`

### Other Platforms
\`\`\`bash
npm run build
npm start
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting guide in the app
- Verify WebGL support at [get.webgl.org](https://get.webgl.org/)
