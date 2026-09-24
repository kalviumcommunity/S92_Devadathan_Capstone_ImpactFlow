\# High-Level Design (HLD)



\## 1. Project Title



Centralized Beneficiary Management System for NGOs



\## 2. Project Name



ImpactFlow



\## 3. System Overview



ImpactFlow is a web-based MERN application for centralized NGO beneficiary management.



The system follows a layered architecture consisting of:



\- React frontend

\- Node.js and Express backend

\- MongoDB database

\- Authentication and authorization services

\- File upload functionality



The frontend communicates with the backend through HTTP APIs.



\## 4. High-Level Architecture



```text

&#x20;                   User

&#x20;                    |

&#x20;                    v

&#x20;            React Frontend

&#x20;                    |

&#x20;                    | HTTP Requests

&#x20;                    v

&#x20;         Node.js / Express Server

&#x20;                    |

&#x20;         +----------+----------+

&#x20;         |          |          |

&#x20;         v          v          v

&#x20;     API Routes  Auth Layer  Upload

&#x20;         |          |          |

&#x20;         +----------+----------+

&#x20;                    |

&#x20;                    v

&#x20;                Mongoose

&#x20;                    |

&#x20;                    v

&#x20;                 MongoDB

