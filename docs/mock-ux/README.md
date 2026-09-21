# Mock UX & User Flow Design

## Project

**Centralized Beneficiary Management System for NGOs**

The Mock UX demonstrates the main workflow of the system before final development. It focuses on beneficiary management, dashboard monitoring, data upload, and clear user actions.

## Design Tool

**Figma:** https://www.figma.com/design/abDiVIgDpDZX8MgRlv9wHB/ImpactFlow-Mock-UX?node-id=0-1&p=f&t=kvYg6v1Irx9EKKWF-0

---

## Primary User

NGO staff and administrators who manage beneficiary information, monitor program participation, and review impact-related data.

## Main User Goal

The user should be able to:

1. Log in to the system.
2. View beneficiary and program information.
3. Search and filter beneficiaries.
4. Add, edit, and delete beneficiary records.
5. Upload beneficiary data.
6. Review beneficiary details.
7. Identify empty or error states and take the appropriate action.

---

# Mock UX Screens

## 1. Login Screen

The Login screen provides the entry point to the system. The user enters their credentials and signs in to access the beneficiary management dashboard.

**Main elements:**

* Username/email field
* Password field
* Login button
* Error message for invalid credentials

**Purpose:** Provide a simple and clear authentication entry point.

---

## 2. Dashboard

The Dashboard provides a quick overview of the NGO's beneficiary data.

**Main elements:**

* Navigation sidebar
* KPI cards:

  * Total Beneficiaries
  * Active Beneficiaries
  * New Beneficiaries
  * Programs
* Date filter
* Program filter
* Status filter
* Beneficiary/program chart
* Recent beneficiary table

**Purpose:** Show important information first so users can understand the current situation before investigating individual records.

---

## 3. Beneficiary List

The Beneficiary List allows users to find and manage individual beneficiary records.

**Main elements:**

* Search bar
* Program filter
* Status filter
* Add Beneficiary button
* Export CSV button
* Beneficiary table
* View action
* Edit action
* Delete action
* Pagination

**Purpose:** Make it easy to search, filter, and manage beneficiary records without navigating through unnecessary screens.

---

## 4. Add Beneficiary

The Add Beneficiary screen allows NGO staff to create a new beneficiary record.

**Fields:**

* Full Name
* Age
* Gender
* Phone
* Address
* Program
* Status

**Actions:**

* Save
* Cancel

**Purpose:** Provide a structured form for adding complete beneficiary information.

---

## 5. Beneficiary Details

The Beneficiary Details screen displays complete information about one beneficiary.

**Main elements:**

* Personal information
* Program information
* Current status
* Participation history
* Edit button
* Delete button

**Purpose:** Allow users to investigate an individual record and perform relevant actions.

---

## 6. Upload Data

The Upload Data screen allows users to add multiple beneficiary records through a file.

**Main elements:**

* File upload area
* Choose File button
* Supported file types: CSV/XLSX
* Upload button
* Upload progress/status
* Success message
* Error message

**Purpose:** Reduce manual data entry when beneficiary information is already available in a spreadsheet or structured file format.

---

## 7. Empty State

The Empty State is displayed when there are no beneficiary records or when filters return no matching records.

**Main elements:**

* Clear message explaining that no records were found
* Add Beneficiary button
* Clear Filters button when applicable

**Purpose:** Explain why no data is displayed and provide the user with a clear next action.

---

## 8. Error State

The Error State is displayed when an operation cannot be completed.

**Examples:**

* Invalid uploaded file
* Data source unavailable
* Permission error
* Failed data operation

**Main elements:**

* Clear error message
* Retry button
* Return/Back action where appropriate

**Purpose:** Explain what went wrong and provide the user with a recovery action.

---

# User Flow

```text
Login
  |
  v
Dashboard
  |
  +----------------------+ 
  |                      |
  v                      v
Beneficiary List       Upload Data
  |                      |
  |                      +----> Success
  |                      |
  |                      +----> Error State
  |
  +----> Add Beneficiary
  |          |
  |          v
  |       Save
  |
  +----> Beneficiary Details
             |
             +----> Edit
             |
             +----> Delete
             |
             v
          Dashboard
```

---

# Navigation Structure

```text
Login
  |
  v
Dashboard
  |
  +-- Dashboard
  |
  +-- Beneficiaries
  |      |
  |      +-- Beneficiary List
  |      +-- Add Beneficiary
  |      +-- Beneficiary Details
  |
  +-- Upload Data
  |
  +-- Logout
```

---

# Design Reasoning

The Dashboard places KPIs and important information above detailed records so users can understand the current beneficiary situation quickly.

Filters are placed near the dashboard and beneficiary table because NGO staff may need to narrow information by date, program, or status.

The Beneficiary List uses a table because users need to compare multiple records and perform actions such as viewing, editing, and deleting.

The Upload Data screen supports the project's goal of reducing manual work when beneficiary information already exists in spreadsheets or structured files.

Empty and error states are included so users understand what happened when data is unavailable, filters return no results, or an operation fails.

The overall workflow follows a simple pattern:

**Overview -> Explore -> Investigate -> Take Action**

This supports the project goal of improving transparency and efficiency in beneficiary management.
