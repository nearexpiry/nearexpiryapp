# Graduation Project Report Writing Instructions

## Overview
You are tasked with writing a comprehensive graduation project report for the "Near Expiry" web application platform. This document provides all the necessary instructions, context, and guidelines to complete this task.

## Task Description
Write a complete graduation project report following the template structure provided in `report_template.docx` in the main directory. The report should be professional, academically rigorous, and comprehensive, documenting all aspects of the Near Expiry platform project.

## Project Summary
**Near Expiry** is a full-stack web platform designed to reduce food waste while helping customers save money. It connects restaurants selling near-expiry products at discounted prices with environmentally-conscious customers.

## Important Guidelines

### 1. Writing Style & Format
- **Academic Tone**: Use formal, professional language appropriate for a university graduation project
- **Length**: Aim for 40-60 pages total (excluding appendices)
- **Citation Style**: Use IEEE citation format throughout
- **Consistency**: Maintain consistent terminology, formatting, and style
- **Technical Depth**: Balance technical detail with accessibility - explain concepts clearly
- **Present Tense**: Use present tense when describing the system ("The system provides..." not "The system provided...")

### 2. Output Format
- Write the report in **Microsoft Word (.docx)** format
- Save the final file as `graduation_project_report.docx` in the main directory
- Maintain the exact section structure from the template
- Include proper page numbers, table of contents, and formatting

### 3. Content Requirements

#### Must Include:
- **System Architecture Diagrams**: Create clear diagrams showing:
  - High-level system architecture (frontend, backend, database, services)
  - Database schema/ER diagram
  - API architecture
  - User flow diagrams for key features
  - Deployment architecture (Docker containers)

- **Screenshots**: Include screenshots of:
  - Client interface (browsing products, cart, checkout)
  - Restaurant dashboard (products, orders, analytics)
  - Admin panel (user management, statistics)
  - Restaurant map view

- **Tables**: Create tables for:
  - Technology stack comparison
  - Database tables description
  - API endpoints listing
  - Design considerations
  - Project timeline/Gantt chart
  - Cost estimation
  - Risk assessment

- **Code Snippets**: Include relevant code examples for:
  - Authentication implementation (JWT)
  - Key API endpoints
  - Database queries
  - Frontend components (where illustrative)

- **References**: Cite at least 15-20 references including:
  - Academic papers on food waste reduction
  - Technical documentation (React, Node.js, PostgreSQL)
  - Web development best practices
  - Software engineering methodologies
  - Standards and regulations

### 4. Section-by-Section Guidelines

#### Abstract (150-300 words)
Write a compelling abstract covering:
- The problem of food waste and economic challenges
- The Near Expiry solution concept
- Key technologies used (React, Node.js, PostgreSQL, Docker)
- Main features (client shopping, restaurant management, admin oversight)
- Development timeline and methodology
- Key outcomes and deliverables
- **Keywords**: Food waste reduction, Near-expiry products, Web platform, E-commerce, Sustainability, React, Node.js

#### Chapter 1: Introduction (3-5 pages)
Include:
- **Problem Statement**: Food waste statistics, environmental impact, economic loss for restaurants, customer demand for affordable food
- **Motivation**: Why this project matters - environmental, economic, social aspects
- **Background**: Brief context on food waste, existing solutions
- **Aims and Objectives**:
  - Primary: Create a platform connecting restaurants with customers
  - Secondary: Reduce food waste, increase restaurant revenue, provide affordable options
- **Current Solutions**: Mention apps like Too Good To Go, OLIO, Flashfood (brief comparison)
- **Proposed Solution**: The Near Expiry platform with its unique features
- **Key Technical Details**: Three-tier architecture, RESTful API, responsive web design, Docker deployment
- **Evaluation**: How you validated the solution (testing, functionality verification)
- **Contributions**:
  - Full-stack web platform development
  - Email notification system
  - Interactive restaurant mapping
  - Commission-based business model
  - Dockerized deployment solution
- **System Overview Diagram**: High-level architecture showing Client App → API → Database → External Services
- **Report Structure**: Briefly describe what each chapter covers

#### Chapter 2: Background (4-6 pages)
Cover:
- **Food Waste Problem**:
  - Global statistics (1.3 billion tons annually - FAO)
  - Environmental impact (greenhouse gases, resource waste)
  - Economic losses for food industry
  - Jordan/regional context
- **Near-Expiry Products**: Define what qualifies, safety considerations, quality aspects
- **Target Market**:
  - Primary: Budget-conscious consumers, environmentally aware customers
  - Secondary: Restaurants, cafes, bakeries with perishable inventory
  - Market needs: affordability, convenience, sustainability
- **Related Work**: Discuss existing solutions:
  - **Too Good To Go**: European app, features, business model
  - **OLIO**: Community food sharing
  - **Flashfood**: North American grocery stores
  - **Karma**: Swedish app
  - Compare approaches: auction-based, fixed discounts, community sharing
- **Technology Background**:
  - Web application architectures (MVC, three-tier)
  - RESTful API design principles
  - Database design for e-commerce
  - Cloud services and containerization
- **Ethical Considerations**:
  - Food safety and expiry date transparency
  - Fair pricing for restaurants and customers
  - Data privacy and security
- **Environmental Considerations**: Carbon footprint reduction, resource conservation

#### Chapter 3: Design (10-15 pages)
This is a critical chapter - be very detailed:

##### Design Overview:
- **System Architecture**: Detailed explanation of three-tier architecture
  - **Presentation Layer**: React SPA, responsive design, component-based architecture
  - **Application Layer**: Express.js REST API, middleware, authentication
  - **Data Layer**: PostgreSQL relational database
- **External Services Integration**: Cloudinary (images), Nodemailer (email), OpenStreetMap (geocoding/mapping)
- **Detailed Architecture Diagram**: Show all components and their interactions
- **User Scenarios**:
  - **Scenario 1**: Client discovers restaurant on map, browses products, adds to cart, places order for pickup
  - **Scenario 2**: Restaurant adds new expiring products, receives order, updates status, views sales analytics

##### Design Details:

**A. Design Specifications**:
- **Functional Requirements**:
  - User authentication and authorization (3 roles)
  - Product catalog with filtering, search, sorting
  - Shopping cart with order management
  - Restaurant profile and inventory management
  - Real-time order status tracking
  - Sales analytics and reporting
  - Admin system controls
- **Non-Functional Requirements**:
  - **Performance**: API response time < 500ms, page load < 3s
  - **Scalability**: Support 100+ concurrent users, 1000+ products
  - **Security**: JWT authentication, password hashing, SQL injection prevention
  - **Usability**: Responsive design, intuitive navigation, accessibility
  - **Reliability**: 99% uptime, database backups, error handling
  - **Maintainability**: Modular code, documentation, version control

**B. Design Process**:
- **Database Design**:
  - **ER Diagram**: Show all tables and relationships
  - **Table Descriptions**: Detail each table's purpose and key fields
  - **Normalization**: Explain 3NF compliance
  - **Indexing Strategy**: Performance optimization
  - **Constraints**: Foreign keys, check constraints, unique constraints
- **API Design**:
  - **RESTful Principles**: Resource-based URLs, HTTP methods, stateless
  - **Endpoint Organization**: Group by domain (auth, products, orders, etc.)
  - **Request/Response Format**: JSON structure
  - **Error Handling**: Standardized error responses
  - **Authentication Flow**: JWT token generation and validation
- **Frontend Design**:
  - **Component Architecture**: Reusable components, page components
  - **State Management**: React Context for auth and cart
  - **Routing Strategy**: React Router with protected routes
  - **Responsive Design**: Mobile-first approach, CSS Grid/Flexbox
  - **User Interface**: Wireframes or mockups for key pages
- **Third-Party Integration Design**:
  - **Image Management**: Cloudinary upload flow, optimization strategy
  - **Email System**: Nodemailer configuration, template design
  - **Geocoding**: Address to coordinates conversion
  - **Mapping**: Leaflet integration for interactive maps

**C. Legal Aspects**:
- **Data Protection**: GDPR-like principles (though Jordan-specific may vary)
- **Food Safety Regulations**: Compliance with expiry date labeling
- **E-commerce Laws**: Online transaction regulations in Jordan
- **Intellectual Property**: Use of open-source licenses (MIT, etc.)
- **Terms of Service**: User agreements, liability limitations

**D. Design Constraints**:
- **Technical Constraints**:
  - Browser compatibility requirements
  - Database size and performance limits
  - API rate limits for third-party services (Cloudinary, geocoding)
  - Docker container resource allocation
- **Business Constraints**:
  - Commission-based revenue model (configurable percentage)
  - Single restaurant per order limitation
  - Manual order status updates (no automation)
- **Development Constraints**:
  - Team size and skill set
  - Development timeline
  - Budget limitations (free-tier services)
- **Security Constraints**:
  - Password complexity requirements
  - Token expiration policies
  - HTTPS requirement for production
- **Regulatory Constraints**:
  - Food safety disclosure requirements
  - Local business licensing
  - Data retention policies

**E. Design Standards**:
List and explain adherence to:
- **IEEE Standards**: Software engineering practices
- **W3C Standards**: HTML5, CSS3, Web Accessibility (WCAG)
- **REST API Standards**: HTTP/1.1, JSON format
- **Database Standards**: SQL:2016, ACID properties
- **Security Standards**: OWASP Top 10 mitigation
- **Code Quality Standards**: ESLint, Prettier configurations
- **Documentation Standards**: JSDoc, README structure

**F. Design Alternatives**:
Discuss alternative approaches and justify choices:
1. **Frontend Framework**:
   - Alternatives: Vue.js, Angular, Svelte
   - Choice: React - large ecosystem, component reusability, team familiarity
2. **Backend Framework**:
   - Alternatives: Django, Spring Boot, Laravel
   - Choice: Express.js - JavaScript full-stack, lightweight, large community
3. **Database**:
   - Alternatives: MySQL, MongoDB, Firebase
   - Choice: PostgreSQL - ACID compliance, advanced features, open-source
4. **Authentication**:
   - Alternatives: OAuth, Session-based, Firebase Auth
   - Choice: JWT - stateless, scalable, standard
5. **Image Storage**:
   - Alternatives: Local storage, AWS S3, Firebase Storage
   - Choice: Cloudinary - free tier, automatic optimization, CDN
6. **Deployment**:
   - Alternatives: Heroku, AWS EC2, DigitalOcean, bare metal
   - Choice: Docker - portability, consistency, easy scaling

**G. Safety Considerations**:
- **User Safety**:
  - Food safety: Clear expiry date display, disclaimer about product inspection
  - Data security: Encrypted passwords, secure token storage
  - Transaction safety: Order confirmation, status tracking
- **Development Team Safety**:
  - Version control: No direct production access
  - Code reviews: Peer validation before deployment
  - Testing environments: Separate dev/staging/production
- **System Safety**:
  - Input validation: Prevent SQL injection, XSS attacks
  - Error handling: Graceful degradation, user-friendly messages
  - Backup strategy: Database backups, disaster recovery
  - Monitoring: Health checks, error logging

**H. Design Considerations Table**:

| Design Consideration | Project Application | Relevant Location in Report |
|---------------------|---------------------|----------------------------|
| **Performance** | API response times under 500ms; Database indexing on frequently queried fields; Image optimization via Cloudinary; Pagination for large datasets | Chapter 3: Design Specifications; Chapter 4: Implementation |
| **Serviceability** | Modular architecture for easy maintenance; Docker containers for deployment consistency; Database migration scripts; Comprehensive error logging | Chapter 3: Design Process; Chapter 7: Project Management |
| **Economic** | Free-tier services (Cloudinary, SendGrid); Open-source technologies; Commission-based revenue model (10% default); Low hosting costs via Docker | Chapter 6: Cost Estimation; Chapter 3: Design Constraints |
| **Environmental** | Primary goal: Reduce food waste; Secondary: Lower carbon footprint from food production/disposal; Digital platform reduces physical marketing waste | Chapter 1: Introduction; Chapter 2: Background; Chapter 6: Environmental Considerations |
| **Environmental Sustainability** | Core mission of preventing food from landfills; Promotes sustainable consumption; Uses energy-efficient cloud services; Encourages local pickup to reduce transportation | Chapter 2: Background; Chapter 6: Environmental Considerations |
| **Manufacturability** | Software deployment via Docker ensures reproducible builds; CI/CD potential for automated deployment; Scalable architecture for growth | Chapter 4: Implementation; Chapter 3: Design Alternatives |
| **Ethical** | Transparent expiry date display; Fair commission model; Privacy-focused (minimal data collection); Honest product representation; Food safety disclaimers | Chapter 2: Ethical Considerations; Chapter 3: Legal Aspects; Chapter 6: Ethics |
| **Health and Safety** | Clear food expiry information; User authentication protects accounts; Data encryption (passwords); Input validation prevents security vulnerabilities; Secure payment handling design | Chapter 3: Safety Considerations; Chapter 4: Security Implementation |
| **Social** | Benefits low-income consumers with affordable food; Reduces environmental guilt; Supports local businesses; Creates community awareness about waste | Chapter 1: Motivation; Chapter 2: Target Market; Chapter 6: Social Impact |
| **Political** | Aligns with Jordan's sustainability goals; Complies with local food safety regulations; Supports local economy; All services can be hosted domestically | Chapter 2: Regional Context; Chapter 3: Legal Aspects; Chapter 6: Regional Relevance |

#### Chapter 4: Implementation (8-12 pages)
Provide detailed implementation information:

##### Technology Stack:
Create a comprehensive table:

| Layer | Technology | Version | Purpose/Rationale |
|-------|-----------|---------|-------------------|
| Frontend Framework | React | 19.2.3 | Component-based UI, virtual DOM performance |
| Frontend Routing | React Router | 7.10.1 | Client-side navigation, protected routes |
| HTTP Client | Axios | 1.13.2 | Promise-based API requests, interceptors |
| Mapping | Leaflet + React-Leaflet | 1.9.4 / 5.0.0 | Interactive maps, open-source |
| Charts | Recharts | 3.6.0 | Data visualization, React integration |
| Backend Runtime | Node.js | 20.x | JavaScript runtime, non-blocking I/O |
| Backend Framework | Express.js | 5.2.1 | Minimalist web framework, middleware |
| Database | PostgreSQL | 15 | ACID compliance, advanced features |
| Database Client | pg (node-postgres) | 8.16.3 | PostgreSQL driver for Node.js |
| Authentication | JWT + bcryptjs | 9.0.3 / 3.0.3 | Stateless auth, password security |
| File Upload | Multer | 2.0.2 | Multipart form-data handling |
| Image Storage | Cloudinary | 2.8.0 | Cloud CDN, auto-optimization |
| Email Service | Nodemailer | 7.0.11 | SMTP email sending |
| Containerization | Docker + Docker Compose | Latest | Deployment consistency, orchestration |
| Web Server | Nginx | Alpine | Static file serving, reverse proxy |

##### Implementation Details:

**A. Backend Implementation**:
- **Server Setup**: Express.js configuration, middleware stack (CORS, JSON parsing, error handling)
- **Database Connection**: PostgreSQL pool configuration, connection management
- **Code Example**: Show the Express server initialization
```javascript
// Example structure (adapt from actual code)
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
// ... routes, error handling
```

- **Authentication Implementation**:
  - JWT token generation process
  - Password hashing with bcryptjs
  - Middleware for token verification
  - Role-based access control
  - Code Example: Token generation and verification functions

- **API Structure**: Explain the controller-route pattern
  - Controllers contain business logic
  - Routes define endpoints and middleware
  - Middleware handles cross-cutting concerns

- **Database Implementation**:
  - Schema initialization scripts
  - Migration strategy
  - Seed data for development
  - Query examples for key operations

**B. Frontend Implementation**:
- **Project Structure**: Describe the folder organization (pages, components, context)
- **Routing Implementation**: Protected routes, role-based rendering
- **State Management**:
  - AuthContext for user authentication state
  - CartContext for shopping cart management
  - Code Example: Context provider setup
- **API Integration**:
  - Axios configuration with base URL
  - Request/response interceptors
  - Error handling strategy
- **Component Examples**:
  - Product listing with filters
  - Shopping cart functionality
  - Order management flow

**C. Third-Party Integration Implementation**:
- **Cloudinary Setup**:
  - Configuration with API credentials
  - Upload flow: Multer → Memory → Cloudinary
  - Image optimization settings
  - Delete functionality
- **Email Service**:
  - Nodemailer configuration for different providers (Gmail, SendGrid)
  - Email template structure
  - Sending flow for password reset and order notifications
- **Geocoding Service**:
  - Nominatim API integration
  - Address to coordinates conversion
  - Error handling for geocoding failures
- **Mapping**:
  - Leaflet map initialization
  - Marker placement for restaurants
  - Interactive features (zoom, pan, popups)

**D. Deployment Implementation**:
- **Docker Configuration**:
  - Multi-stage build for frontend (Node.js build → Nginx serve)
  - Backend Dockerfile explanation
  - Docker Compose orchestration
  - Service dependencies and health checks
  - Volume management for database persistence
- **Nginx Configuration**:
  - Static file serving
  - SPA routing support (fallback to index.html)
  - Proxy configuration if applicable
- **Environment Configuration**:
  - Required environment variables
  - Configuration management across environments
  - Security considerations (secrets handling)

**E. Infrastructure Dependencies**:
- **External Services**:
  - Cloudinary: Image CDN and storage
  - Email providers: Gmail (dev), SendGrid (production option)
  - OpenStreetMap: Map tiles and geocoding
- **Internal Services**:
  - PostgreSQL database
  - Node.js backend API
  - Nginx web server
- **Dependency Diagram**: Show service interconnections

**F. Trade-offs and Decisions**:
- **Single Restaurant Cart**: Simplified checkout vs. multi-restaurant complexity
- **Manual Order Status**: Simple implementation vs. automated workflows
- **Email Service Choice**: Free tier limitations vs. reliability
- **Image Storage**: Cloud (Cloudinary) vs. local storage - chose cloud for scalability
- **Deployment**: Docker complexity vs. deployment consistency - chose consistency

**G. Implementation Assumptions**:
- Users have modern web browsers (Chrome, Firefox, Safari, Edge)
- Restaurants will manually manage inventory and order status
- Internet connectivity is available for all users
- Email providers allow SMTP access (app passwords for Gmail)
- Cloudinary free tier is sufficient for image storage
- PostgreSQL database will be hosted on reliable infrastructure

#### Chapter 5: Results and Discussion (5-8 pages)

##### Functional Results:
Test and document each feature:

**A. Authentication System**:
- User registration: Successfully creates accounts for clients and restaurants
- Login: JWT tokens generated and validated correctly
- Password reset: Email sent with secure token, password update successful
- Role-based access: Proper redirection and authorization enforcement
- **Screenshot**: Login page, password reset flow

**B. Client Features**:
- Product browsing: All products displayed with correct information
- Search and filtering: Working by category, price range, search term
- Sorting: By price (low-to-high, high-to-low), expiry date
- Shopping cart: Add/remove items, quantity adjustment, total calculation
- Order placement: Successful order creation with pickup/delivery options
- Order history: Display past orders with status
- **Screenshots**: Product listing, cart, checkout, order history

**C. Restaurant Features**:
- Profile management: Create/update profile with address geocoding
- Product management: CRUD operations functioning correctly
- Image uploads: Logo and product images successfully uploaded to Cloudinary
- Order management: View incoming orders, update status
- Sales analytics: Charts showing revenue by period (today, week, month, all)
- Open/closed toggle: Status updates correctly
- **Screenshots**: Restaurant dashboard, product management, order list, analytics

**D. Admin Features**:
- User management: View all users, activate/deactivate accounts
- System statistics: Total users, restaurants, products, orders
- Commission management: View and update percentage
- Analytics: System-wide sales data
- **Screenshots**: Admin dashboard, user management

**E. Map Feature**:
- Restaurant locations: All restaurants plotted correctly on map
- Interactive map: Zoom, pan, click markers for details
- Address geocoding: Converts addresses to accurate coordinates
- **Screenshot**: Map view with multiple restaurant markers

**F. Email Notifications**:
- Password reset emails: Sent successfully with valid links
- Order confirmation: Clients receive order details
- Order status updates: Notifications for status changes
- **Screenshot**: Sample email templates

##### Performance Results:
- **API Response Times**: Measure key endpoints (product listing, order creation)
  - Target: < 500ms
  - Actual results: Document actual measurements
- **Page Load Times**: Measure initial load and navigation
  - Target: < 3 seconds
  - Actual results: Document findings
- **Database Performance**: Query execution times for complex queries
- **Image Loading**: Cloudinary CDN performance

##### Testing Results:
- **Functional Testing**: All major user flows tested manually
- **Cross-browser Testing**: Tested on Chrome, Firefox, Safari, Edge
- **Responsive Testing**: Mobile, tablet, desktop layouts
- **Security Testing**: Input validation, SQL injection prevention, XSS protection
- **Error Handling**: Graceful degradation when services fail

##### Discussion:

**Strengths**:
1. **Comprehensive Feature Set**: Covers all key user needs (browse, order, manage)
2. **Clean Architecture**: Separation of concerns, modular design
3. **User Experience**: Intuitive navigation, responsive design
4. **Scalability**: Docker deployment, database optimization
5. **Security**: JWT authentication, password hashing, input validation
6. **Third-Party Integration**: Effective use of Cloudinary, email, mapping services
7. **Environmental Impact**: Directly addresses food waste problem

**Weaknesses/Limitations**:
1. **Single Restaurant Cart**: Users can't order from multiple restaurants at once
2. **No Payment Integration**: Payment processing not implemented (future work)
3. **Manual Processes**: Order status updates are manual, not automated
4. **Limited Testing**: Minimal automated test coverage
5. **No Real-time Features**: No WebSocket implementation for live updates
6. **Email Limitations**: Free tier restrictions on email volume
7. **Geocoding Accuracy**: Depends on address quality and Nominatim service

**Challenges Faced and Solutions**:
1. **CORS Issues**: Solved by proper Express.js CORS configuration
2. **PostgreSQL SSL in Development**: Configured to reject unauthorized in dev
3. **Image Upload Size**: Implemented 5MB limit with proper error messages
4. **Cart State Management**: Used React Context for global state
5. **Docker Networking**: Configured service dependencies and health checks
6. **Environment Variables**: Created comprehensive setup wizard

**Validation of Design Decisions**:
- React choice validated by component reusability and development speed
- PostgreSQL proven reliable for relational data with complex queries
- JWT authentication effective for stateless API
- Docker deployment ensures consistency across environments
- Cloudinary integration reduces server load and provides CDN benefits

#### Chapter 6: Economical, Ethic, and Contemporary Issues (5-7 pages)

##### A. Preliminary Cost Estimation and Justification:

**Development Costs** (assuming student/academic project):
| Item | Cost | Notes |
|------|------|-------|
| Development time | 0 (student project) | ~400-500 hours over semester |
| Software licenses | $0 | All open-source technologies |
| Domain name (optional) | $10-15/year | .com domain registration |
| Development tools | $0 | VS Code, Git, Docker (all free) |
| **Total Development** | **~$15** | Primarily time investment |

**Operational Costs** (monthly estimates):
| Service | Free Tier | Paid Tier (if needed) |
|---------|-----------|----------------------|
| Hosting (VPS) | N/A | $5-20/month (DigitalOcean, AWS) |
| Database | Included in VPS | Or $15/month (managed PostgreSQL) |
| Cloudinary | 25GB storage, 25GB bandwidth | $89/month for more |
| Email (SendGrid) | 100 emails/day | $15/month for 40K emails |
| Domain & SSL | $1-2/month | Free SSL via Let's Encrypt |
| **Total Monthly** | **$6-22** (minimal) | **$50-150** (growth phase) |

**Revenue Model**:
- Commission on each order (default: 10% configurable)
- Example: If restaurant sells $100 in orders, platform earns $10
- Breakeven analysis: Need $500-1500 in monthly order volume to cover costs
- Scalability: Costs grow slowly, revenue grows with order volume

**Justification**:
- Low barrier to entry: Minimal upfront investment
- Open-source stack: No vendor lock-in, community support
- Scalable pricing: Starts cheap, costs grow with usage
- Free tiers: Allow validation before spending

##### B. Relevant Codes of Ethics and Moral Frameworks:

**ACM Code of Ethics**:
1. **Contribute to society and well-being**: Platform reduces food waste, helps environment
2. **Avoid harm**: Ensure food safety through expiry date transparency
3. **Be honest and trustworthy**: Accurate product representation, clear pricing
4. **Be fair and non-discriminatory**: Equal access for all users
5. **Respect privacy**: Minimal data collection, secure storage
6. **Honor confidentiality**: Protect user data, secure passwords

**IEEE Code of Ethics**:
1. **Public safety and welfare**: Food safety disclosures, secure platform
2. **Honest and realistic claims**: Accurate system capabilities
3. **Reject bribery**: Fair treatment of all restaurants
4. **Improve understanding of technology**: Clear documentation, user manual

**Software Engineering Code of Ethics**:
- **Public interest**: Environmental benefit, social good
- **Client and employer**: Serve restaurant and customer needs fairly
- **Product quality**: Robust, tested, secure software
- **Judgment**: Maintain professional integrity in design decisions
- **Management**: Ethical project management practices

##### C. Ethical Dilemmas and Justification:

**Dilemma 1: Expiry Date Liability**
- **Issue**: What if customer gets sick from near-expiry product?
- **Solution**:
  - Clear disclaimers about inspecting products before purchase
  - Restaurants responsible for accurate expiry dates
  - Platform is marketplace, not seller
  - Encourage "best before" vs. "use by" education
- **Justification**: Transparency and user responsibility, following marketplace model

**Dilemma 2: Restaurant Commission**
- **Issue**: Is 10% commission fair? Could it be exploitative?
- **Solution**:
  - Configurable percentage (admin can adjust)
  - Lower than typical delivery apps (20-30%)
  - Restaurants set own prices and decide participation
  - Value provided: customer access, order management, marketing
- **Justification**: Fair market rate, voluntary participation, value exchange

**Dilemma 3: Data Privacy**
- **Issue**: Collecting user data (emails, addresses, order history)
- **Solution**:
  - Minimal data collection (only what's necessary)
  - Secure password storage (bcrypt hashing)
  - No data selling or third-party sharing
  - Potential GDPR-like privacy policy
- **Justification**: User trust, legal compliance, ethical data handling

**Dilemma 4: Product Quality Representation**
- **Issue**: How to ensure restaurant photos match actual products?
- **Solution**:
  - User reviews (future feature)
  - Restaurant reputation system
  - Clear return/refund policy
  - Admin oversight and restaurant deactivation for abuse
- **Justification**: Self-regulation, accountability, trust building

##### D. Environmental Considerations:

**Positive Environmental Impact**:
1. **Food Waste Reduction**: Primary goal - prevent edible food from landfills
   - Global food waste: 1.3 billion tons/year (FAO)
   - Landfill decomposition produces methane (greenhouse gas)
   - Platform can save tons of food annually at scale
2. **Carbon Footprint**: Less food production needed = less emissions
   - Agriculture accounts for ~26% of global emissions
   - Wasted food = wasted water, energy, fertilizers
3. **Resource Conservation**: Water and land used for food production
4. **Local Focus**: Pickup option reduces transportation emissions vs. long-distance food transport

**Negative Environmental Considerations**:
1. **Energy Use**: Servers, data centers for hosting
   - Mitigation: Use energy-efficient cloud providers, optimize code
2. **Delivery Emissions**: If users choose delivery option
   - Mitigation: Encourage pickup, support bike/walking delivery
3. **Device Manufacturing**: Users need devices to access platform
   - Minimal concern: Not creating new device demand, using existing

**Sustainability Measures**:
- Digital platform: No physical waste (vs. printed flyers)
- Long-term use: Software doesn't degrade like physical products
- Open-source: Knowledge sharing benefits broader community

##### E. Relevance to Jordan and Region:

**Social Relevance**:
- **Economic Stress**: Jordan faces economic challenges, affordable food helps
- **Refugee Population**: Large refugee community benefits from cheaper food
- **Food Security**: Platform improves access without increasing production
- **Community Building**: Connects local businesses with local consumers

**Cultural Relevance**:
- **Hospitality**: Jordanian culture values sharing and reducing waste
- **Religious Values**: Islamic teachings discourage waste (israf)
- **Family Economics**: Large families benefit from bulk discounts on near-expiry items
- **Local Business Support**: Platform empowers small restaurants and bakeries

**Political Relevance**:
- **National Sustainability Goals**: Aligns with Jordan's environmental initiatives
- **Economic Development**: Supports local business growth
- **Import Reduction**: Keeps food economy local
- **Innovation**: Demonstrates Jordan's tech capability

**Regional Expansion Potential**:
- Arabic language support (future enhancement)
- Similar challenges across MENA region
- Cultural acceptance of bargain shopping
- Growing tech adoption in Arab world

##### F. Other Issues and Constraints:

**Accessibility**:
- Web platform accessible on any device with browser
- Future consideration: Screen reader support, WCAG compliance
- Language: Currently English, Arabic translation needed for wider reach

**Digital Divide**:
- Requires internet access and device
- May exclude lowest-income populations
- Mitigation: Simple UI, low data usage, mobile-responsive

**Food Safety Regulations**:
- Jordan food safety laws apply
- Restaurant licensing requirements
- Platform disclaimers and liability limits
- Compliance with local health ministry standards

**Competition and Market Entry**:
- Low barriers to entry: Others could copy
- Differentiation: Local focus, features, user experience
- Network effects: More restaurants = more value

**Scalability Challenges**:
- Technical: Database size, API load, image storage
- Operational: Customer support, restaurant onboarding, quality control
- Financial: Infrastructure costs grow with user base

#### Chapter 7: Project Management (5-7 pages)

##### A. Schedule and Time Management:

**Project Timeline** (Semester-based):
Create a Gantt chart showing:

**Phase 1: Planning and Research (Weeks 1-2)**
- Problem identification and research
- Requirement gathering
- Technology stack selection
- Project proposal documentation

**Phase 2: Design (Weeks 3-4)**
- System architecture design
- Database schema design
- API endpoint planning
- UI/UX wireframing
- Design document preparation

**Phase 3: Development - Backend (Weeks 5-7)**
- Database setup and initialization
- Express.js server configuration
- Authentication system implementation
- API endpoints development
- Third-party service integration (Cloudinary, email, geocoding)

**Phase 4: Development - Frontend (Weeks 8-10)**
- React app setup
- Component development
- Page implementations (client, restaurant, admin)
- State management (Context API)
- API integration
- Responsive design implementation

**Phase 5: Integration and Testing (Weeks 11-12)**
- Frontend-backend integration
- End-to-end testing
- Bug fixes
- Cross-browser testing
- Security testing

**Phase 6: Deployment (Week 13)**
- Docker configuration
- Docker Compose setup
- Deployment testing
- Documentation writing

**Phase 7: Finalization (Weeks 14-15)**
- User manual creation
- Report writing
- Presentation preparation
- Final testing and refinement

**Time Management Strategies**:
- Weekly milestones and deliverables
- Daily standups (if team project)
- Version control with Git for tracking progress
- Issue tracking for bug management
- Regular supervisor meetings for guidance

##### B. Resource and Cost Management:

**Human Resources**:
| Role | Responsibilities | Time Allocation |
|------|-----------------|----------------|
| Full-stack Developer | Complete system development | 400-500 hours |
| Database Administrator | Schema design, optimization | Included above |
| UI/UX Designer | Interface design, user flows | Included above |
| Project Manager | Planning, tracking, reporting | Included above |
| QA Tester | Testing, bug reporting | Included above |

**Technical Resources**:
| Resource | Purpose | Cost |
|----------|---------|------|
| Development laptop | Coding, testing | $0 (existing) |
| Git/GitHub | Version control, collaboration | $0 |
| VS Code | IDE | $0 |
| Docker Desktop | Local development | $0 |
| PostgreSQL | Database | $0 |
| Postman | API testing | $0 |
| Cloudinary | Image storage (free tier) | $0 |
| Email service | Notifications (free tier) | $0 |

**Knowledge Resources**:
- Documentation: React, Node.js, PostgreSQL, Docker
- Online tutorials and courses
- Stack Overflow community
- University library resources
- Supervisor guidance

**Resource Allocation Strategy**:
- Use free/open-source tools wherever possible
- Leverage student/educational accounts
- Start with free tiers, plan for paid upgrade path
- Time is the primary investment

##### C. Quality Management:

**Code Quality Standards**:
- **Linting**: ESLint for JavaScript code consistency
- **Formatting**: Prettier for code formatting
- **Code Reviews**: Self-review and supervisor feedback
- **Documentation**: Comments for complex logic, README files
- **Version Control**: Meaningful commit messages, feature branches

**Testing Strategy**:
- **Unit Testing**: Individual function testing (limited implementation)
- **Integration Testing**: API endpoint testing with Postman
- **Functional Testing**: Manual testing of user flows
- **Performance Testing**: Load testing for key endpoints
- **Security Testing**: Input validation, authentication testing
- **Cross-browser Testing**: Chrome, Firefox, Safari, Edge
- **Responsive Testing**: Mobile, tablet, desktop viewports

**Quality Metrics**:
- Code coverage (target: >60% for critical paths)
- Bug count and resolution time
- API response time (target: <500ms)
- Page load time (target: <3s)
- User acceptance criteria completion

**Quality Assurance Process**:
1. Development with best practices
2. Self-testing during development
3. Code review (if team project)
4. Integration testing
5. User acceptance testing
6. Bug fixing iterations
7. Final validation before release

##### D. Risk Management:

**Risk Assessment Table**:

| Risk | Probability | Impact | Severity | Mitigation Strategy | Contingency Plan |
|------|------------|--------|----------|-------------------|-----------------|
| **Technical Risks** |
| Third-party service downtime (Cloudinary, email) | Medium | High | High | Use reliable services, implement error handling, cache where possible | Have backup services ready, graceful degradation |
| Database data loss | Low | Critical | Critical | Regular backups, transaction management, data validation | Restore from backups, database replication in production |
| Security breach (unauthorized access) | Medium | High | High | JWT authentication, input validation, password hashing, HTTPS | Incident response plan, password resets, monitoring |
| Performance issues (slow response) | Medium | Medium | Medium | Database indexing, query optimization, pagination, caching | Performance profiling, optimization, scaling infrastructure |
| Browser compatibility issues | Low | Medium | Low | Test on major browsers, use standard web APIs, polyfills | Progressive enhancement, browser detection |
| **Development Risks** |
| Scope creep (feature bloat) | High | Medium | Medium | Clear requirements document, prioritization, MVP approach | Remove non-essential features, phase 2 planning |
| Technology learning curve | Medium | Medium | Medium | Online tutorials, documentation, practice projects | Allocate extra time, seek help, choose familiar alternatives |
| Integration challenges | Medium | High | High | API documentation, early integration testing, modular design | Simplify integration, use adapters, fallback options |
| **Project Management Risks** |
| Timeline delays | High | High | High | Realistic scheduling, buffer time, weekly tracking | Adjust scope, extend timeline, prioritize core features |
| Requirement changes | Medium | Medium | Medium | Clear initial requirements, change control process | Impact analysis, timeline adjustment |
| Insufficient testing time | Medium | High | High | Continuous testing during development, automated tests | Focus on critical paths, manual testing |
| **External Risks** |
| Free tier limitations exceeded | Low | Medium | Low | Monitor usage, optimize resource usage | Upgrade to paid tier, switch providers |
| API rate limits hit | Low | Medium | Low | Implement caching, rate limiting awareness | Request higher limits, use alternative APIs |
| Hosting issues | Low | High | Medium | Choose reliable hosting, Docker for portability | Quick migration to different host |

**Risk Monitoring**:
- Weekly risk review
- Track identified risks
- Update mitigation strategies as needed
- Document lessons learned

##### E. Project Procurement:

**Software and Services Acquisition**:
| Item | Source | License/Terms | Cost |
|------|--------|---------------|------|
| Node.js | nodejs.org | MIT License | Free |
| React | facebook/react | MIT License | Free |
| PostgreSQL | postgresql.org | PostgreSQL License | Free |
| Express.js | npm | MIT License | Free |
| Docker | docker.com | Apache 2.0 | Free (Desktop) |
| Cloudinary | cloudinary.com | Terms of Service | Free tier |
| SendGrid (optional) | sendgrid.com | Terms of Service | Free tier |
| GitHub | github.com | Terms of Service | Free |
| VS Code | microsoft.com | MIT License | Free |

**Procurement Process**:
1. **Identification**: Identify needed tools/services
2. **Evaluation**: Compare alternatives (features, cost, license)
3. **Selection**: Choose based on project needs and constraints
4. **Acquisition**: Sign up, download, configure
5. **Integration**: Implement into project
6. **Management**: Monitor usage, ensure compliance

**Open Source Compliance**:
- All selected tools use permissive licenses (MIT, Apache)
- No viral licenses (GPL) that would require open-sourcing entire project
- Proper attribution in documentation
- Compliance with terms of service for SaaS products

**Vendor Management** (for third-party services):
- Cloudinary: Monitor storage and bandwidth usage
- Email provider: Track email volume
- Map services: Stay within API rate limits
- Regular review of service status and updates

#### Chapter 8: Conclusion and Future Work (3-5 pages)

##### Main Contributions:

**Summary of Work**:
This project successfully developed a comprehensive web platform called "Near Expiry" that addresses the critical problem of food waste while providing economic benefits to both restaurants and consumers. The platform demonstrates the effective use of modern web technologies to create a full-stack, production-ready application.

**Key Contributions**:
1. **Food Waste Reduction Solution**: Created a functional marketplace connecting restaurants with surplus near-expiry products to cost-conscious, environmentally aware consumers
2. **Complete Full-Stack Platform**: Developed both frontend (React) and backend (Node.js/Express) with proper architecture and separation of concerns
3. **Multi-Role System**: Implemented distinct interfaces and functionalities for three user types (clients, restaurants, administrators)
4. **Secure Authentication System**: Built JWT-based authentication with role-based access control and password recovery
5. **Database Design**: Created normalized relational database schema with proper constraints, indexes, and relationships
6. **Third-Party Integration**: Successfully integrated multiple external services (Cloudinary for images, Nodemailer for emails, OpenStreetMap for geocoding/mapping)
7. **Interactive Features**: Implemented shopping cart, order management, sales analytics, and interactive restaurant mapping
8. **Deployment Solution**: Containerized the entire application using Docker for consistent, portable deployment
9. **Commission-Based Business Model**: Designed and implemented configurable commission system for platform sustainability
10. **Documentation**: Comprehensive setup guides, user manual, and technical documentation

**Technical Achievements**:
- RESTful API with 30+ endpoints
- 8 database tables with complex relationships
- Responsive web design compatible with mobile, tablet, and desktop
- Real-time order status tracking
- Sales analytics with data visualization
- Email notification system
- Geocoding and interactive mapping
- Image upload and optimization

**Impact**:
- **Environmental**: Provides tool to reduce food waste, lowering greenhouse gas emissions
- **Economic**: Helps restaurants recover costs, provides affordable food to consumers
- **Social**: Raises awareness about food waste, supports community sustainability
- **Educational**: Demonstrates full-stack development skills, project management, and problem-solving

##### Future Work:

**Short-term Enhancements (Next 3-6 months)**:
1. **Payment Integration**:
   - Integrate payment gateway (Stripe, PayPal, local Jordanian options)
   - Secure transaction processing
   - Automatic commission calculation and transfer
   - Refund management

2. **Mobile Application**:
   - React Native mobile app for iOS and Android
   - Push notifications for order updates
   - Better mobile user experience
   - Camera integration for easier product photo uploads

3. **Review and Rating System**:
   - Customer reviews for products and restaurants
   - Star ratings
   - Review moderation by admins
   - Trust building through transparency

4. **Advanced Search**:
   - Geolocation-based search (nearest restaurants)
   - Distance calculation and sorting
   - Dietary filters (vegetarian, vegan, gluten-free, halal)
   - Allergen information

5. **Automated Testing**:
   - Comprehensive unit tests for backend
   - Frontend component tests
   - End-to-end testing with Cypress or Selenium
   - Continuous integration pipeline

**Medium-term Enhancements (6-12 months)**:
1. **Real-time Features**:
   - WebSocket integration for live order updates
   - Real-time inventory updates
   - Live chat support between customers and restaurants
   - Instant notifications

2. **Analytics Dashboard**:
   - Advanced restaurant analytics (best-selling products, peak hours)
   - Customer analytics (purchase patterns, preferences)
   - Environmental impact tracking (food saved, carbon reduction)
   - Predictive analytics for inventory management

3. **Recommendation Engine**:
   - Machine learning-based product recommendations
   - Personalized suggestions based on purchase history
   - Popular products in user's area
   - Expiry-based urgency recommendations

4. **Multi-language Support**:
   - Arabic language interface
   - English/Arabic toggle
   - Right-to-left (RTL) layout support
   - Localized content

5. **Subscription Model**:
   - Premium membership for customers (no commission, priority support)
   - Restaurant subscription tiers (featured listings, advanced analytics)
   - Loyalty programs and rewards

**Long-term Vision (1-2+ years)**:
1. **AI-Powered Features**:
   - Smart pricing suggestions based on expiry date and demand
   - Automated product categorization from images
   - Chatbot for customer support
   - Demand forecasting for restaurants

2. **Regional Expansion**:
   - Multi-city support within Jordan
   - Expansion to neighboring countries (Palestine, Lebanon, etc.)
   - Multi-currency support
   - Regional partnerships

3. **Marketplace Features**:
   - Allow individual sellers (not just restaurants)
   - Farmer's market integration
   - Grocery store partnerships
   - Food rescue partnerships with NGOs

4. **Sustainability Tracking**:
   - Carbon footprint calculator
   - Waste reduction metrics dashboard
   - Environmental impact certificates
   - Partnership with environmental organizations

5. **B2B Features**:
   - Wholesale near-expiry products for catering companies
   - Restaurant-to-restaurant surplus exchange
   - Supply chain integration
   - Bulk order management

6. **Advanced Logistics**:
   - Delivery partner integration (Uber Eats, local delivery services)
   - Route optimization for deliveries
   - Scheduled pickup time slots
   - Delivery tracking

**Research Opportunities**:
- Study platform's actual impact on food waste reduction
- User behavior analysis (price sensitivity, environmental consciousness)
- Restaurant adoption barriers and solutions
- Optimal pricing strategies for near-expiry products
- Public policy recommendations for food waste reduction

##### Lessons Learned:

**Technical Lessons**:
1. **Importance of Planning**: Proper database design and API planning saved significant refactoring time
2. **Docker Benefits**: Containerization simplified deployment and environment consistency
3. **Third-party Services**: Leveraging existing services (Cloudinary, geocoding) faster than building from scratch
4. **Context API Sufficiency**: React Context was adequate for this scale; Redux not needed
5. **Error Handling**: Comprehensive error handling crucial for debugging and user experience
6. **Security First**: Implementing security from the start easier than retrofitting

**Project Management Lessons**:
1. **MVP Approach**: Focusing on core features first, then enhancing was effective
2. **Version Control**: Git commits and branches essential for tracking changes and recovery
3. **Documentation**: Writing documentation alongside development saves time later
4. **Time Estimation**: Always buffer time estimates; unexpected challenges arise
5. **Testing Importance**: Manual testing caught many issues; automated tests would catch more

**Soft Skills**:
1. **Problem Solving**: Breaking complex problems into smaller, manageable tasks
2. **Continuous Learning**: Learned new technologies and tools throughout project
3. **Attention to Detail**: Small bugs can have large impacts; thoroughness matters
4. **Adaptability**: Adjusted plans when facing technical constraints or new requirements
5. **Communication**: Clear documentation and communication crucial (with supervisor, future users)

**Domain-Specific Lessons**:
1. **Food Waste Complexity**: Problem is multifaceted - technical solution is only part
2. **User Psychology**: Balancing bargain-hunting with quality perception
3. **Restaurant Needs**: Simple, fast tools preferred; minimal training required
4. **Trust Building**: Transparency and clear policies essential for marketplace

**What Would Be Done Differently**:
1. **Earlier Testing**: Implement automated tests from the beginning
2. **API Documentation**: Use Swagger/OpenAPI from day one
3. **More User Research**: Interview potential restaurant and customer users earlier
4. **Iterative UI**: Get user feedback on UI earlier in development
5. **Performance Planning**: Consider performance optimization earlier

**Final Reflection**:
The Near Expiry platform demonstrates that technology can be a powerful tool for addressing environmental and social issues. This project provided hands-on experience in full-stack development, system design, project management, and thinking about real-world impact. While the current implementation is a solid foundation, the future work outlined shows the vast potential for growth and enhancement. The most rewarding aspect was creating something that has the potential to make a positive impact on food waste reduction while helping both businesses and consumers.

#### References

**Requirements**: At least 15-20 references in IEEE format

**Categories to Include**:

**1. Food Waste and Sustainability**:
- FAO (Food and Agriculture Organization) reports on global food waste
- Studies on environmental impact of food waste
- Research on consumer behavior regarding near-expiry products
- Economic impact of food waste on businesses

**2. Technical Documentation**:
- React documentation (reactjs.org)
- Node.js official documentation
- Express.js guide
- PostgreSQL documentation
- Docker documentation
- JWT specification (RFC 7519)

**3. Web Development Best Practices**:
- RESTful API design principles
- Web security (OWASP)
- Responsive web design
- Database normalization

**4. Academic Papers**:
- Food waste reduction strategies
- E-commerce platform design
- Software engineering methodologies
- Sustainability in technology

**5. Similar Platforms/Case Studies**:
- Too Good To Go case studies
- Food sharing platforms research
- Marketplace platform design patterns

**IEEE Citation Format Example**:
```
[1] J. Gustavsson, C. Cederberg, U. Sonesson, R. van Otterdijk, and A. Meybeck, "Global food losses and food waste," Food and Agriculture Organization of the United Nations, Rome, 2011.

[2] "React – A JavaScript library for building user interfaces," Facebook Inc. [Online]. Available: https://reactjs.org. [Accessed: Jan. 15, 2024].

[3] M. Masse, REST API Design Rulebook. O'Reilly Media, Inc., 2011.

[4] "Express - Node.js web application framework," [Online]. Available: https://expressjs.com. [Accessed: Jan. 15, 2024].

[5] "PostgreSQL: The world's most advanced open source database," [Online]. Available: https://www.postgresql.org. [Accessed: Jan. 15, 2024].
```

**Citation Management**:
- Use citation numbers [1], [2], etc. in order of first appearance
- Include all URLs with access dates
- Cite any code examples or algorithms adapted from external sources
- Acknowledge all third-party libraries and frameworks

#### APPENDIX A: User Manual

**Structure**:
1. **Introduction**
   - Overview of the platform
   - System requirements
   - How to access the platform

2. **For Clients**:
   - Creating an account
   - Logging in
   - Browsing products (with screenshots)
   - Using filters and search
   - Viewing restaurant locations on map
   - Adding items to cart (with screenshots)
   - Checkout process (pickup vs delivery)
   - Viewing order history
   - Tracking order status
   - Password reset process

3. **For Restaurants**:
   - Creating a restaurant account
   - Setting up restaurant profile (with screenshots)
   - Uploading logo
   - Adding products (with screenshots)
   - Uploading product images
   - Managing inventory (editing, deleting products)
   - Managing orders (viewing, updating status)
   - Viewing sales analytics (with screenshots)
   - Toggling restaurant open/closed status

4. **For Administrators**:
   - Accessing admin panel
   - Viewing system statistics
   - Managing users (activating/deactivating)
   - Configuring commission percentage
   - Viewing system-wide analytics

5. **Troubleshooting**:
   - Common issues and solutions
   - FAQ section
   - Contact information for support

**User Manual Guidelines**:
- Include 20-30 screenshots showing actual application screens
- Use numbered steps for processes (Step 1, Step 2, etc.)
- Highlight important buttons or fields in screenshots
- Use clear, non-technical language
- Include tips and best practices
- Provide examples for clarity

---

## Writing Process Instructions

### Step 1: Set Up Your Environment
1. Read this entire instruction document thoroughly
2. Access the `report_template.docx` file in the main directory
3. Familiarize yourself with the codebase structure
4. Review the codebase exploration summary above

### Step 2: Research and Preparation
1. **Read Template Structure**: Extract and understand the exact template structure
2. **Explore Codebase**: Review key files:
   - `/backend/server.js` - Main backend entry
   - `/backend/db/init.sql` - Database schema
   - `/backend/routes/*.js` - API endpoints
   - `/frontend/src/App.js` - Main frontend routing
   - `/frontend/src/pages/**/*` - Key pages
   - `docker-compose.yml` - Deployment setup
3. **Gather References**: Search for and compile references on:
   - Food waste statistics (use WebSearch)
   - Technical documentation (use WebFetch for official docs)
   - Similar platforms and academic papers
4. **Take Screenshots**: You'll need to examine existing screenshots or create descriptions of what should be shown

### Step 3: Create Diagrams
Before writing, prepare diagrams (you can describe them or use ASCII art, then refine):
1. **System Architecture Diagram**: Show frontend → API → database → external services
2. **Database ER Diagram**: Show all tables and relationships
3. **User Flow Diagrams**: Key user journeys (client ordering, restaurant managing)
4. **Deployment Architecture**: Docker containers and their connections

### Step 4: Write Section by Section
Write in this recommended order:
1. **Chapter 4 (Implementation)** - Start here; it's most straightforward from code
2. **Chapter 3 (Design)** - Design decisions will be clear after implementation review
3. **Chapter 5 (Results)** - Describe what was implemented
4. **Chapter 2 (Background)** - Research-heavy, can be done independently
5. **Chapter 1 (Introduction)** - Easier to write after other chapters
6. **Chapter 7 (Project Management)** - Estimate based on project scope
7. **Chapter 6 (Economics/Ethics)** - Analysis based on complete understanding
8. **Chapter 8 (Conclusion)** - Summarize all work
9. **Abstract** - Write last, summarizing entire report
10. **Appendix A (User Manual)** - Final step with screenshots
11. **References** - Compile throughout, finalize at end
12. **Lists (Tables/Figures)** - Auto-generate or create at very end

### Step 5: Quality Checks
After completing each chapter:
1. **Completeness**: Does it address all template requirements?
2. **Accuracy**: Are technical details correct per codebase?
3. **Clarity**: Is it understandable to someone unfamiliar with project?
4. **Academic Tone**: Is language formal and professional?
5. **Citations**: Are all external information sources cited?
6. **Formatting**: Does it match template style?

### Step 6: Finalization
1. **Proofread** entire document for grammar, spelling, consistency
2. **Verify Citations**: Ensure all references are properly formatted and numbered
3. **Check Figures/Tables**: Ensure all are numbered, captioned, and listed
4. **Page Numbers**: Add page numbers throughout
5. **Table of Contents**: Update with actual page numbers
6. **Final Review**: Read through as if you're a professor grading it

### Step 7: Delivery
1. Save final document as `graduation_project_report.docx`
2. Ensure it's in the main project directory
3. Verify file opens correctly and formatting is preserved

---

## Important Reminders

### DO:
✅ Use actual code examples from the codebase
✅ Cite all external sources properly
✅ Maintain academic formality throughout
✅ Include detailed technical explanations
✅ Create professional diagrams and screenshots
✅ Follow the template structure exactly
✅ Use IEEE citation format consistently
✅ Write in present tense for system description
✅ Explain abbreviations/acronyms on first use
✅ Cross-reference sections (e.g., "as discussed in Chapter 3")
✅ Use tables and figures to organize information
✅ Include both high-level and detailed explanations

### DON'T:
❌ Invent features that don't exist in the codebase
❌ Skip template sections (address everything)
❌ Use informal language or slang
❌ Include code without explanation
❌ Copy-paste without citation (plagiarism)
❌ Make unsupported claims
❌ Use "I" or "we" excessively (prefer passive voice or "the system")
❌ Leave placeholder text like "TODO" or "TBD"
❌ Include broken references or dead links
❌ Forget to explain technical terms
❌ Mix citation styles (stick to IEEE)

---

## Tools and Resources Available

### For Writing:
- **Read tool**: Access all code files
- **Glob tool**: Find files by pattern
- **Grep tool**: Search code for specific implementations
- **WebSearch**: Find academic references, statistics
- **WebFetch**: Access technical documentation
- **Task tool**: Launch specialized agents if needed for research

### For Research:
- Official documentation websites
- Academic paper databases (Google Scholar, IEEE Xplore)
- Food waste statistics (FAO, UNEP reports)
- Technology comparison sites

### Codebase Files to Reference:
- `/backend/**/*.js` - All backend code
- `/frontend/src/**/*` - All frontend code
- `/backend/db/*.sql` - Database structure
- `docker-compose.yml` - Deployment configuration
- `package.json` files - Dependencies and scripts
- `/README.md` files - Setup documentation

---

## Expected Output Quality

Your final report should:
- Be **40-60 pages** in length (excluding appendices)
- Include **20-30 screenshots** of the actual application
- Contain **15-20 properly formatted references**
- Have **8-12 figures** (diagrams, charts, architecture)
- Include **5-8 tables** (comparison, specifications, timeline)
- Demonstrate **deep understanding** of both the problem and solution
- Show **professional academic writing** quality
- Be **technically accurate** based on actual codebase
- Present **clear value proposition** and impact
- Include **realistic** cost estimates and timelines

---

## Timeline Suggestion

If you have time constraints, prioritize:
1. **Day 1**: Template analysis, codebase exploration, diagram creation (3-4 hours)
2. **Day 2**: Chapters 4 & 3 - Implementation and Design (4-5 hours)
3. **Day 3**: Chapters 5, 2, & 1 - Results, Background, Introduction (4-5 hours)
4. **Day 4**: Chapters 7, 6, & 8 - Management, Ethics, Conclusion (3-4 hours)
5. **Day 5**: Abstract, References, User Manual, Lists (3-4 hours)
6. **Day 6**: Final review, proofreading, formatting (2-3 hours)

**Total estimated time**: 20-25 hours of focused writing

---

## Success Criteria

Your report is complete when:
✅ All template sections are fully addressed
✅ Every technical claim is supported by code evidence or references
✅ Diagrams clearly illustrate system architecture
✅ Screenshots demonstrate all major features
✅ Writing is clear, professional, and grammatically correct
✅ Citations are complete and properly formatted
✅ Document formatting matches template requirements
✅ File is saved as `.docx` in the main directory
✅ Content is comprehensive yet concise (no unnecessary fluff)
✅ It reads as a professional graduation project report worthy of high marks

---

## Final Notes

This is a significant academic document representing the culmination of a full-stack development project. Take pride in the work, be thorough in documentation, and ensure technical accuracy. The Near Expiry platform demonstrates real-world problem-solving with modern technologies - let the report reflect that achievement.

The report should tell the complete story: the problem (food waste), the solution (the platform), the implementation (technical details), the results (what works), the management (how it was built), the impact (environmental/economic/social), and the future (what comes next).

Write with confidence, support with evidence, and create a report that serves as both documentation of the work completed and a guide for future enhancements.

Good luck with the report writing!
