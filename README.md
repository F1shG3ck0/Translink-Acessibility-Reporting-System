# Translink-Acessibility-Reporting-System

## Overview
This project was developed as part of the Data Driven Systems module at Queen's University Belfast.
The system was designed to support the management and analysis of accessibility information across a public transport network. It combines a relational database, web-based CRUD functionality, SQL reporting, and data visualisation to help identify accessibility trends and areas for improvement.

---

## Running

Requirements

- Docker
- Docker Compose

Run:

docker compose up

The application will be available at:

http://localhost:8080

---

# Project Features
## Database Design

- Relational database containing routes, stops, vehicles, operators, trips, tickets, complaints, and accessibility features.
- Primary keys, foreign keys and composite keys used to maintain data integrity.
- Validation implemented through constraints, ENUMs and business rules.

## CRUD Functionality

The system provides functionality to:

- Create routes, stops, operators and vehicles.
- Update routes, stops and operators.
- Manage accessibility features associated with stops and vehicles.
- Remove invalid feature and route-stop relationships.

## Reporting and Analytics

Reports include:

- Routes serving hospitals.
- Accessibility features available at each stop.
- Percentage of wheelchair-accessible vehicles.
- Accessibility complaint analysis.
- Accessibility coverage across transport routes.

## Data Visualisation

- Interactive data tables.
- Accessibility dashboards.
- Chart-based reporting using aggregated transport data.

---

## My Contributions
I was responsible for several components of the project, including:

### Database Development
- Implemented tblTrip, tblOperator, and tblValidTicket.
- Created database integrity constraints using ENUM values and composite keys.
- Generated realistic test data for operators and trips.

### CRUD Functionality
Developed:
- Create Stop
- Create Route Stop
- Update Stop
- Delete Feature

using HTML, JavaScript, SQL and database validation rules.

###SQL Reporting
Created reports answering:

- How many transport routes include hospital-serving stops?
- What accessibility-related features are available at each stop?
- What percentage of vehicles provide wheelchair accessibility?

using JOINs, aggregate functions and SQL views.

### Front-End Development

- Implemented website footer using HTML and CSS.
- Developed interactive reporting pages and visualisations. 

---

## Technologies Used
```text
SQL
MySQL
HTML
CSS
JavaScript
Chart.js
Git
GitHub
```

---

## Key Learning Outcomes
Through this project I developed experience in:
- Relational database design
- Database normalisation
- SQL reporting and analytics
- Database constraints and integrity management
- Data visualisation
- Collaborative software development
- Technical documentation and requirements analysis

---

Repository Structure
```text

database/
├── create_tables.sql
├── insert_test_data.sql
└── reports.sql

website/
├── html/
├── css/
└── js/

documentation/
├── Database_Technical_Documentation.pdf
└── Work_Breakdown_Table.pdf

screenshots/
└── project-images

```

### Future Improvements
- User authentication and role-based access control.
- Enhanced reporting dashboard functionality.
- Additional data visualisations.
- Integration with real-time transport datasets.

--- 

## Screenshots

ER Diagram:
...
report page:
...
chart:
...
CRUD page:
...

These massively improve recruiter engagement
