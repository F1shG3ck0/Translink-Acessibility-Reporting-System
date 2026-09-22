# Translink-Acessibility-Reporting-System

## Overview
 
The Translink Accessibility Reporting System was developed as part of the Data Driven Systems module during the first year at Queen's University Belfast.
 
The system was designed to support the management and analysis of accessibility information across a public transport network. It combines a relational database, web-based CRUD functionality, SQL reporting, and data visualisation to help identify accessibility trends and areas for improvement.
 
---
 
## Project Context
 
This project was developed collaboratively within a team of five students.
 
The system was designed to demonstrate database design principles, SQL reporting, data visualisation, and web-based database interaction. The **My Contributions** section outlines the components for which I was primarily responsible.
 
---

## Running the Project
 
This repository contains the database scripts and web application components developed for the project.
 
The project is not intended to run as a standalone application and requires a suitable MySQL database environment for deployment.

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
- Data summaries to support accessibility analysis.

---

## My Contributions
I was responsible for several key components of the project.

### Database Development

- Implemented `tblTrip`, `tblOperator`, and `tblValidTicket`.
- Created database integrity constraints using ENUM values and composite keys.
- Generated realistic test data for operators and trips.
- Contributed to database validation and consistency requirements.

### CRUD Functionality

Developed the following features using HTML, CSS, JavaScript, SQL, and database validation rules:

- Create Stop
- Create Route Stop
- Update Stop
- Delete Feature

### SQL Reporting

Created reports answering the following business questions:

- How many transport routes include hospital-serving stops?
- What accessibility-related features are available at each stop?
- What percentage of vehicles provide wheelchair accessibility?

Implemented these reports using:
 
- SQL JOINs
- Aggregate functions
- Views
- Filtering and grouping operations

### Front-End Development

- Implemented the website footer using HTML and CSS.
- Developed interactive reporting pages.
- Created data visualisations using Chart.js.

---

## Technologies Used
 
- MySQL
- SQL
- HTML
- CSS
- JavaScript
- Chart.js
- Git
- GitHub

---

## Key Learning Outcomes

Through this project I developed experience in:

- Relational database design
- Database normalisation
- Database constraints and integrity management
- CRUD application development
- SQL reporting and analytics
- Data visualisation
- Technical documentation
- Requirements analysis
- Collaborative software development using Git

---

## Repository Structure

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
├── er-diagram.png
├── report-page.png
├── chart-dashboard.png
└── crud-page.png
```
---

## Project Outcome
 
- Successfully developed a transport accessibility reporting system as part of a first-year university team project.
- Implemented relational database design, CRUD functionality, SQL reporting, and data visualisation features.
- Presented the completed solution to academic staff through video form.

---

### Future Improvements

- User authentication and role-based access control.
- Additional reporting dashboards.
- More advanced data visualisations.
- Integration with real-time transport datasets.
- Export functionality for reports and analytics.
- Mobile-responsive user interface improvements.

--- 

## Screenshots

### Entity Relationship Diagram
 
screenshots/er-diagram.png

### Reporting Dashboard
 
screenshots/report-page.png

### Accessibility Analytics
 
screenshots/chart-dashboard.png

### CRUD Interface
 
screenshots/crud-page.png
 
---

## Academic Note
 
This project was completed as part of university coursework. The repository is intended to demonstrate database design, SQL development, reporting, data visualisation, and collaborative software development skills.

---

## Acknowledgements

This project was developed collaboratively as part of a university group project. I would like to thank my fellow team members for their contributions to the design, development and testing of the system.

by F1shG3ck0
