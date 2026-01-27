# Diagram Codes for Graduation Report

This file contains Mermaid code for all diagrams in the graduation report.
Use https://mermaid.live/ to generate the diagrams.

## How to Use:
1. Go to https://mermaid.live/
2. Copy the code for each diagram below
3. Paste it into the Mermaid Live Editor
4. The diagram will generate automatically
5. Download as PNG or SVG
6. Replace the text-based diagrams in your report with the generated images

---

## DIAGRAM 1: High-Level System Architecture
**Location:** Chapter 1.6 - System Overview (Figure 1)
**Type:** Flowchart / Architecture Diagram

```mermaid
graph TB
    subgraph CLIENT["CLIENT LAYER"]
        CI[Client Interface<br/>React]
        RD[Restaurant Dashboard<br/>React]
        AD[Admin Dashboard<br/>React]
    end

    subgraph APP["APPLICATION LAYER"]
        API[Express.js REST API Server<br/>Authentication | Products | Orders | Sales]
    end

    subgraph DATA["DATA LAYER"]
        DB[(PostgreSQL Database<br/>Users | Restaurants | Products | Orders)]
    end

    subgraph EXT["EXTERNAL SERVICES"]
        CL[Cloudinary<br/>Image CDN]
        SMTP[SMTP<br/>Email]
        NOM[Nominatim/<br/>OpenStreetMap]
    end

    CI --> API
    RD --> API
    AD --> API
    API --> DB
    API -.-> CL
    API -.-> SMTP
    API -.-> NOM

    style CLIENT fill:#e1f5ff
    style APP fill:#fff4e1
    style DATA fill:#f0ffe1
    style EXT fill:#ffe1f5
```

**Instructions:**
- Copy the code above into Mermaid Live Editor
- Download as PNG (recommended 1200px width)
- Replace the text diagram in Chapter 1.6

---

## DIAGRAM 2: Project Timeline (Gantt Chart)
**Location:** Chapter 7.1.1 - Project Timeline (Figure 9)
**Type:** Gantt Chart

```mermaid
gantt
    title Near Expiry Platform Development Timeline
    dateFormat YYYY-MM-DD

    section Phase 1
    Planning & Research           :p1, 2024-09-01, 14d

    section Phase 2
    System Design                 :p2, 2024-09-15, 14d

    section Phase 3
    Backend Development           :p3, 2024-09-29, 21d

    section Phase 4
    Frontend Development          :p4, 2024-10-20, 21d

    section Phase 5
    Integration & Testing         :p5, 2024-11-10, 14d

    section Phase 6
    Deployment                    :p6, 2024-11-24, 7d

    section Phase 7
    Documentation & Finalization  :p7, 2024-12-01, 14d
```

**Instructions:**
- Copy the code above into Mermaid Live Editor
- Download as PNG (recommended 1400px width)
- Replace the text timeline in Chapter 7.1.1

---

## DIAGRAM 3: Database Entity-Relationship Diagram
**Location:** Chapter 3 - Design (Database Schema)
**Type:** ER Diagram

```mermaid
erDiagram
    USERS ||--o{ RESTAURANTS : "creates"
    USERS ||--o{ ORDERS : "places"
    RESTAURANTS ||--o{ PRODUCTS : "lists"
    RESTAURANTS ||--o{ ORDERS : "receives"
    PRODUCTS }o--|| CATEGORIES : "belongs_to"
    ORDERS ||--o{ ORDER_ITEMS : "contains"
    PRODUCTS ||--o{ ORDER_ITEMS : "included_in"
    USERS ||--o{ PASSWORD_RESET_TOKENS : "generates"

    USERS {
        uuid id PK
        string email UK
        string password_hash
        enum role
        boolean is_active
        timestamp created_at
    }

    RESTAURANTS {
        uuid id PK
        uuid user_id FK
        string name
        text description
        string address
        decimal latitude
        decimal longitude
        string phone
        string logo_url
        boolean is_open
        timestamp created_at
    }

    PRODUCTS {
        uuid id PK
        uuid restaurant_id FK
        uuid category_id FK
        string name
        text description
        decimal price
        integer quantity
        date expiry_date
        string image_url
        boolean is_active
        timestamp created_at
    }

    CATEGORIES {
        uuid id PK
        string name UK
    }

    ORDERS {
        uuid id PK
        uuid client_id FK
        uuid restaurant_id FK
        enum status
        decimal total_amount
        decimal commission_amount
        enum order_type
        string delivery_address
        string delivery_phone
        timestamp created_at
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        integer quantity
        decimal price_at_purchase
    }

    PASSWORD_RESET_TOKENS {
        uuid id PK
        uuid user_id FK
        string token UK
        timestamp expires_at
        timestamp created_at
    }

    SETTINGS {
        uuid id PK
        string key UK
        string value
    }
```

**Instructions:**
- Copy the code above into Mermaid Live Editor
- Download as PNG (recommended 1600px width for readability)
- Insert in Chapter 3 Database Design section

---

## DIAGRAM 4: User Flow - Client Journey
**Location:** Chapter 1.6 - System Overview (Client Flow)
**Type:** Flowchart

```mermaid
flowchart TD
    Start([Client Starts]) --> Browse[Browse Products<br/>on Homepage or Map]
    Browse --> Filter[Filter by Category,<br/>Restaurant, Price]
    Filter --> AddCart[Add Products to Cart]
    AddCart --> SingleRest{Same<br/>Restaurant?}
    SingleRest -->|No| Warning[Warning: Clear<br/>Cart First]
    Warning --> AddCart
    SingleRest -->|Yes| Checkout[Checkout]
    Checkout --> OrderType{Order Type?}
    OrderType -->|Pickup| PlaceOrder[Place Order]
    OrderType -->|Delivery| EnterAddress[Enter Address<br/>& Phone]
    EnterAddress --> PlaceOrder
    PlaceOrder --> Confirm[Receive Email<br/>Confirmation]
    Confirm --> Track[Track Order<br/>Status]
    Track --> Pickup[Pick Up or<br/>Receive Delivery]
    Pickup --> End([Order Complete])

    style Start fill:#90EE90
    style End fill:#FFB6C1
    style Warning fill:#FFD700
```

**Instructions:**
- Copy the code above into Mermaid Live Editor
- Download as PNG (recommended 1000px width)
- Can be inserted in Chapter 1.6 or Chapter 3

---

## DIAGRAM 5: User Flow - Restaurant Journey
**Location:** Chapter 1.6 - System Overview (Restaurant Flow)
**Type:** Flowchart

```mermaid
flowchart TD
    Start([Restaurant Starts]) --> Register[Register<br/>Restaurant Account]
    Register --> Profile[Complete Profile<br/>with Address]
    Profile --> Geocode[Address Geocoded<br/>to Coordinates]
    Geocode --> Upload[Upload Products<br/>with Images, Prices,<br/>Expiry Dates]
    Upload --> Wait[Wait for Orders]
    Wait --> Receive[Receive Order<br/>Notification]
    Receive --> Preparing[Update Status:<br/>Preparing]
    Preparing --> Ready[Update Status:<br/>Ready]
    Ready --> Complete[Update Status:<br/>Completed]
    Complete --> Analytics[View Sales<br/>Analytics]
    Analytics --> Decision{More<br/>Products?}
    Decision -->|Yes| Upload
    Decision -->|No| End([Continue Operating])

    style Start fill:#90EE90
    style End fill:#FFB6C1
```

**Instructions:**
- Copy the code above into Mermaid Live Editor
- Download as PNG (recommended 800px width)
- Can be inserted in Chapter 1.6 or Chapter 3

---

## DIAGRAM 6: User Flow - Admin Journey
**Location:** Chapter 1.6 - System Overview (Admin Flow)
**Type:** Flowchart

```mermaid
flowchart TD
    Start([Admin Starts]) --> Login[Log in to<br/>Admin Panel]
    Login --> Dashboard[View System<br/>Statistics]
    Dashboard --> Choice{Action?}
    Choice -->|Manage| Users[View/Activate/<br/>Deactivate Users]
    Choice -->|Configure| Commission[Set Commission<br/>Percentage]
    Choice -->|Monitor| Analytics[View Platform<br/>Analytics]
    Users --> Dashboard
    Commission --> Dashboard
    Analytics --> Dashboard
    Dashboard --> End([Continue<br/>Monitoring])

    style Start fill:#90EE90
    style End fill:#FFB6C1
```

**Instructions:**
- Copy the code above into Mermaid Live Editor
- Download as PNG (recommended 600px width)
- Can be inserted in Chapter 1.6 or Chapter 3

---

## DIAGRAM 7: API Architecture
**Location:** Chapter 4 - Implementation
**Type:** Component Diagram

```mermaid
graph TB
    subgraph Frontend["Frontend (React)"]
        Pages[Pages/<br/>Components]
        Context[Context<br/>Auth & Cart]
        API_Client[API Client<br/>Axios]
    end

    subgraph Backend["Backend (Express.js)"]
        Routes[Routes]
        Controllers[Controllers]
        Services[Services]
        Middleware[Middleware<br/>Auth/CORS/Error]
    end

    subgraph Database["Database Layer"]
        Pool[Connection<br/>Pool]
        PG[(PostgreSQL)]
    end

    subgraph External["External Services"]
        Cloud[Cloudinary]
        Email[Nodemailer]
        Geo[Nominatim]
    end

    Pages --> Context
    Context --> API_Client
    API_Client -->|HTTP/JSON| Routes
    Routes --> Middleware
    Middleware --> Controllers
    Controllers --> Services
    Services --> Pool
    Pool --> PG
    Controllers -.-> Cloud
    Controllers -.-> Email
    Controllers -.-> Geo

    style Frontend fill:#e1f5ff
    style Backend fill:#fff4e1
    style Database fill:#f0ffe1
    style External fill:#ffe1f5
```

**Instructions:**
- Copy the code above into Mermaid Live Editor
- Download as PNG (recommended 1200px width)
- Insert in Chapter 4.2 Backend Architecture

---

## DIAGRAM 8: Authentication Flow
**Location:** Chapter 4 - Implementation (Authentication)
**Type:** Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant DB
    participant JWT

    User->>Frontend: Enter Email & Password
    Frontend->>API: POST /api/auth/login
    API->>DB: Query User by Email
    DB-->>API: User Record
    API->>API: bcrypt.compare(password, hash)
    alt Password Valid
        API->>JWT: Generate Token (7 days)
        JWT-->>API: JWT Token
        API-->>Frontend: {token, user}
        Frontend->>Frontend: Store Token in localStorage
        Frontend-->>User: Redirect to Dashboard
    else Password Invalid
        API-->>Frontend: 401 Unauthorized
        Frontend-->>User: Show Error Message
    end
```

**Instructions:**
- Copy the code above into Mermaid Live Editor
- Download as PNG (recommended 1000px width)
- Insert in Chapter 4.2.3 Authentication

---

## DIAGRAM 9: Order Processing Flow
**Location:** Chapter 4 - Implementation (Order Processing)
**Type:** Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Frontend
    participant API
    participant DB
    participant Email

    Client->>Frontend: Place Order
    Frontend->>API: POST /api/client/orders
    API->>DB: BEGIN Transaction
    API->>DB: INSERT into orders
    DB-->>API: order_id
    loop For each cart item
        API->>DB: INSERT into order_items
    end
    API->>DB: Calculate commission
    API->>DB: COMMIT Transaction
    DB-->>API: Success
    API->>Email: Send Order Confirmation
    Email-->>Client: Email Received
    API-->>Frontend: {order_id, confirmation}
    Frontend->>Frontend: Clear Cart
    Frontend-->>Client: Show Confirmation
```

**Instructions:**
- Copy the code above into Mermaid Live Editor
- Download as PNG (recommended 1200px width)
- Insert in Chapter 4.2.5 Order Processing

---

## DIAGRAM 10: Docker Deployment Architecture
**Location:** Chapter 4.5 - Docker Deployment
**Type:** Component Diagram

```mermaid
graph TB
    subgraph Docker["Docker Compose Environment"]
        subgraph FrontendC["Frontend Container"]
            Nginx[Nginx Server]
            React[React Build<br/>Static Files]
        end

        subgraph BackendC["Backend Container"]
            Node[Node.js<br/>Express Server]
            Port[Port 5000]
        end

        subgraph DatabaseC["Database Container"]
            PostgreSQL[(PostgreSQL<br/>Database)]
            Volume[Docker Volume<br/>Persistent Storage]
        end
    end

    Client[Web Browser] -->|Port 8080| Nginx
    Nginx --> React
    Nginx -->|API Proxy /api/*| Node
    Node --> PostgreSQL
    PostgreSQL --> Volume

    Node -.->|External| Cloud[Cloudinary]
    Node -.->|External| SMTP[Gmail SMTP]
    Node -.->|External| Nominatim[Nominatim API]

    style FrontendC fill:#e1f5ff
    style BackendC fill:#fff4e1
    style DatabaseC fill:#f0ffe1
```

**Instructions:**
- Copy the code above into Mermaid Live Editor
- Download as PNG (recommended 1200px width)
- Insert in Chapter 4.5 Docker Deployment

---

## DIAGRAM 11: System Testing Pyramid
**Location:** Chapter 5.3 - Testing Results
**Type:** Flowchart/Pyramid

```mermaid
graph TB
    subgraph Testing["Testing Pyramid"]
        E2E[End-to-End Testing<br/>Manual User Flows]
        Integration[Integration Testing<br/>API Endpoints with Postman]
        Unit[Unit Testing<br/>Individual Functions]
    end

    E2E --> Integration
    Integration --> Unit

    style E2E fill:#FFB6C1
    style Integration fill:#FFD700
    style Unit fill:#90EE90
```

**Instructions:**
- Copy the code above into Mermaid Live Editor
- Download as PNG (recommended 600px width)
- Insert in Chapter 5.3 Testing Results

---

## DIAGRAM 12: Risk Management Matrix (Visual)
**Location:** Chapter 7.4 - Risk Management
**Type:** Quadrant Chart

```mermaid
quadrantChart
    title Risk Assessment Matrix
    x-axis Low Impact --> High Impact
    y-axis Low Probability --> High Probability
    quadrant-1 Monitor Closely
    quadrant-2 Immediate Action
    quadrant-3 Low Priority
    quadrant-4 Medium Priority

    Third-party downtime: [0.7, 0.5]
    Database loss: [0.9, 0.2]
    Security breach: [0.8, 0.5]
    Performance issues: [0.5, 0.5]
    Scope creep: [0.5, 0.8]
    Learning curve: [0.5, 0.5]
    Development delays: [0.8, 0.8]
    Testing time: [0.7, 0.5]
    Free tier limits: [0.4, 0.2]
    API rate limits: [0.4, 0.2]
```

**Instructions:**
- Copy the code above into Mermaid Live Editor
- Download as PNG (recommended 800px width)
- Insert in Chapter 7.4.1 Risk Assessment Matrix

---

## ALTERNATIVE: Use draw.io for Complex Diagrams

If you want more customization, you can also use:
- **draw.io** (https://app.diagrams.net/)
- Just import the Mermaid code or create manually

## Tips for Best Results:

1. **Mermaid Live Editor Settings:**
   - Use PNG format for Word/PDF documents
   - Set width to at least 1200px for clarity
   - Use SVG if inserting into web/markdown

2. **Color Customization:**
   - The `style` commands in the code set colors
   - Modify hex colors as needed (e.g., `fill:#e1f5ff`)

3. **Font Size:**
   - Mermaid auto-scales fonts
   - For larger diagrams, download at higher resolution

4. **Replacing in Report:**
   - After generating PNG images, insert them in place of text diagrams
   - Keep original text as alt-text for accessibility

---

**Total Diagrams:** 12
**Status:** ✅ All diagram codes ready
**Next Step:** Generate images at https://mermaid.live/ and insert into report
