\# Product Requirements Document (PRD)



\## 1. Project Title



Centralized Beneficiary Management System for NGOs



\## 2. Project Name



ImpactFlow



\## 3. Overview



ImpactFlow is a web-based beneficiary management system designed to help Non-Governmental Organizations (NGOs) maintain beneficiary information in a centralized digital system.



NGOs may manage beneficiary information using paper records, spreadsheets, or disconnected systems. This can make it difficult to maintain accurate records, search for information, update beneficiary details, and understand program participation.



ImpactFlow provides a centralized application for managing beneficiary records and improving the efficiency, organization, and accessibility of beneficiary information.



\## 4. Problem Statement



NGOs often maintain beneficiary information using manual records or spreadsheets. These approaches can make data management difficult as the number of beneficiaries increases.



The main problems include:



\- Beneficiary information being stored in different places.

\- Difficulty searching and filtering beneficiary records.

\- Time-consuming manual data updates.

\- Difficulty maintaining consistent beneficiary information.

\- Limited access control for application resources.

\- Difficulty managing beneficiary information associated with NGO programs.

\- Difficulty handling supporting file uploads.



\## 5. Target Users



\### NGO Staff



NGO staff can use the application to view, add, update, and manage beneficiary information.



\### NGO Administrators



Administrators can manage application access and beneficiary-related information.



\## 6. Project Goals



The primary goals of ImpactFlow are:



\- Centralize beneficiary information.

\- Provide CRUD operations for beneficiary records.

\- Make beneficiary information easier to search and manage.

\- Provide authentication and authorization.

\- Establish relationships between NGOs and beneficiaries.

\- Support file uploads.

\- Provide a structured and user-friendly interface.

\- Improve the efficiency of beneficiary data management.



\## 7. Functional Requirements



\### 7.1 User Authentication



The system should allow users to:



\- Register using username and password.

\- Log in using username and password.

\- Authenticate using Google.

\- Receive authentication tokens for protected resources.



\### 7.2 Beneficiary Management



The system should allow authorized users to:



\- Create beneficiary records.

\- View beneficiary records.

\- Update beneficiary information.

\- Delete beneficiary records.

\- View individual beneficiary details.



Beneficiary information includes:



\- Name

\- Age

\- Location

\- Phone

\- Program

\- Status



\### 7.3 NGO and Beneficiary Relationship



The system should support a relationship between NGOs and their beneficiaries.



A beneficiary can be associated with an NGO using the database relationship implemented in the backend.



\### 7.4 File Upload



The application should support uploading files through the backend file-upload functionality.



\### 7.5 Protected API Access



Protected backend resources should require valid authentication credentials.



JWT-based authorization is used to protect authorized API operations.



\## 8. Non-Functional Requirements



\### Security



\- Passwords should not be stored as plain text.

\- Password authentication should use password hashing.

\- Protected APIs should use authentication and authorization.

\- Sensitive environment variables should not be committed to the repository.



\### Performance



The application should provide responsive API operations for normal beneficiary-management workloads.



\### Maintainability



The application should use separate frontend, backend, model, route, and authentication components where appropriate.



\### Usability



The user interface should provide clear navigation and understandable beneficiary-management workflows.



\### Scalability



The system architecture should allow additional NGO, beneficiary, program, reporting, and authentication functionality to be added in the future.



\## 9. Major Features



The current application includes:



\- Beneficiary CRUD operations.

\- MongoDB database integration.

\- Node.js and Express backend.

\- React frontend.

\- Username/password authentication.

\- JWT authorization.

\- Google authentication.

\- NGO-beneficiary relationship.

\- File upload functionality.

\- Mock UX and user-flow documentation.



\## 10. User Flow



\### Authentication Flow



User

→ Login/Register

→ Authentication

→ Application Dashboard



\### Beneficiary Management Flow



Dashboard

→ Beneficiary List

→ View Beneficiary

→ Add / Edit / Delete

→ Updated Beneficiary Information



\### Upload Flow



Dashboard

→ Upload Data

→ Select File

→ Upload

→ Server Processes Upload



\## 11. API Requirements



The backend provides REST-style API endpoints for application functionality.



The beneficiary API supports operations for:



\- Retrieving beneficiary records.

\- Creating beneficiary records.

\- Updating beneficiary records.

\- Deleting beneficiary records.



Authentication-related APIs support:



\- User registration.

\- User login.

\- Google authentication.



\## 12. Data Requirements



The system stores beneficiary information in MongoDB.



The Beneficiary entity contains:



\- name

\- age

\- location

\- phone

\- program

\- status

\- NGO relationship

\- timestamps



The system also maintains user and NGO-related data.



\## 13. Assumptions



\- Users have access to a modern web browser.

\- The backend has access to the configured MongoDB database.

\- Authentication configuration is correctly provided through environment variables.

\- Users have appropriate permissions to perform protected operations.

\- Uploaded files comply with the application's supported upload requirements.



\## 14. Project Scope



\### In Scope



\- Beneficiary management.

\- Authentication.

\- Authorization.

\- NGO-beneficiary relationships.

\- File uploads.

\- Frontend interface.

\- Backend APIs.

\- MongoDB database integration.



\### Future Scope



Potential future enhancements include:



\- Advanced reporting dashboards.

\- Beneficiary analytics.

\- Exporting reports.

\- Role-based access control.

\- Notifications.

\- Advanced search and filtering.

\- Cloud file storage.

\- Deployment and monitoring improvements.



\## 15. Success Criteria



The project is considered successful when:



\- Users can authenticate successfully.

\- Beneficiary records can be created and retrieved.

\- Beneficiary records can be updated and deleted.

\- Protected resources require valid authorization.

\- NGO-beneficiary relationships are maintained.

\- Files can be uploaded through the application.

\- The frontend communicates successfully with the backend.

\- Beneficiary information can be managed through a centralized application.



\## 16. Conclusion



ImpactFlow provides a centralized platform for managing NGO beneficiary information. The system combines a React frontend, Node.js and Express backend, MongoDB database, authentication, authorization, relationships, and file-upload functionality into a single application.

