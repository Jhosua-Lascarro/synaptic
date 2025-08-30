# SynapTic

This a an aplication for scheduling, managing, and tracking medical appointments with ease. Built with a user-friendly interface for both patients and healthcare providers.
Implementing information organization and structuring in a database. The backend is built with **Node.js** and **Express**, and the database is managed with **Supabase** with motor postgrest.

---

## Technologies used

- Node.js
- HTML, CSS, JavaScript (Frontend)
- vite
- Express.js
- cors
- bcrypt
- Supabase
- dotenv
- TailwindCSS
- Biome
  
---

## Project structure

```bash
SynapTic
 ┣ docs
 ┃ ┣ CHANGELOG.md
 ┃ ┗ CONTRIBUTING.md
 ┣ src
 ┃ ┣ auth
 ┃ ┃ ┣ calendarApi.js
 ┃ ┃ ┣ login.js
 ┃ ┃ ┗ registerApi.js
 ┃ ┣ db
 ┃ ┃ ┣ conection_db.js
 ┃ ┃ ┗ endpoints_conection.js
 ┃ ┣ js
 ┃ ┃ ┣ calendar.css
 ┃ ┃ ┣ calendar.js
 ┃ ┃ ┣ guards.js
 ┃ ┃ ┣ setupDashboard.js
 ┃ ┃ ┣ setupDashboardDoctor.js
 ┃ ┃ ┣ setupLogin.js
 ┃ ┃ ┗ setupRegister.js
 ┃ ┣ views
 ┃ ┃ ┣ 404.html
 ┃ ┃ ┣ dashboard.html
 ┃ ┃ ┣ dashboardDoctor.html
 ┃ ┃ ┣ login.html
 ┃ ┃ ┗ register.html
 ┃ ┣ app.js
 ┃ ┣ index.html
 ┃ ┗ style.css
 ┣ .env
 ┣ .gitignore
 ┣ biome.json
 ┣ ISSUES.md
 ┣ jsconfig.json
 ┣ package-lock.json
 ┣ package.json
 ┣ README.md
 ┣ router.js
 ┗ vite.config.js
```

## Installation and execution

Clone the repository, install dependencies and initialize the program:

```bash
git clone https://github.com/Jhosua-Lascarro/SynapTic.git
npm install
npm run start # Run frontend and backend

```
## .env
```bash
SUPABASE_URL="url"
SUPABASE_KEY="apiKey"
SUPABASE_PORT="4321"
```

## Endpoints available

| method | route             | Descriptions      |
| ------ | ----------------- | ----------------- |
| GET    | /api/v1/users     | Get all the users |
| POST   | /api/v1/users     | Create a new user |
| PUT    | /api/v1/users/:id | Update user by id |
| DELETE | /api/v1/users/:id | delete user by id |
  
## Endpoints specials
  

| method | route                                                      | Descriptions                                     |
| ------ | ---------------------------------------------------------- | ------------------------------------------------ |
| GET    | /api/v1/users/:userId                                      | details of a user by their ID                    |
| POST   | /api/v1/doctors                                            | Create Doctor                                    |
| POST   | /api/v1/patiens                                            | Create patient                                   |
| GET    | /api/v1/patients/user/:userId                              | Get the patient_id of a user                     |
| GET    | /api/v1/doctors/user/:userId                               | Get the doctor_id of a user                      |
| GET    | /api/v1/appointments                                       | Get all appointments with patient details        |
| GET    | /api/v1/appointments/patient/:id                           | Get a patient's appointment by ID                |
| PATCH  | /api/v1/appointments/:id                                   | Update an appointment (partially) by ID          |
| GET    | /api/v1/appointments/fecha                                 | Get appointments by date in the doctor view      |
| GET    | /api/v1/appointments/patient/:patientId/month/:year/:month | Get a patient's appointments for a specific MMYY |
| GET    | /api/v1/appointments/doctor/:doctorId/month/:year/:month   | Get a doctor appointments for a specific MMYY    |
| POST   | /api/v1/login                                              | Post for login                                   |
| GET    | /api/v1/patients/appointments/:id                          | Get all of a patient's appointments with details |
| GET    | /api/v1/appointments/fecha"                                | Get appointments by specific date                |


## Database documentation

### Database name

`Synaptic`

---

### Main tables

#### **users**

| Field          | Data type       | constraints |
| -------------- | --------------- | ----------- |
| id             | int primary key | not null    |
| full_name      | varchar         | not null    |
| email          | varchar         | not null    |
| identification | varchar         | not null    |
| role           | int             | not null    |
| password_hash  | varchar         | not null    |
| birthdate      | date            | not null    |
| phone          | varchar         | not null    |
| sexo           | varchar         | not null    |


#### **appointments**
| Field            | Data type       | constraints |
| ---------------- | --------------- | ----------- |
| id               | int primary key | not null    |
| patient_id       | int             | not null    |
| doctor_id        | int             | not null    |
| appointment_date | timestamp       | not null    |
| status_id        | int             | not null    |
| reason           | text            |             |
| notes            | text            |             |


## API Endpoins Documentation

All API requests use the base URL: `(http://localhost:3000)`

## Answer main postman

**response 200:**
**URL:** GET `/users`
**Description:**
**request body example:**

```json
    {
        "id": 19,
        "fullname": "jose",
        "email": "ftryytjuvghj.doe@database.sh",
        "identification": "124449112",
        "role": 2,
        "password_hash": "@jonedow.",
        "birthdate": "2025-08-25",
        "phone": "1234567890",
        "sexo": "femenino"
    }
```

**response 201 :** 
**URL:** POST `/users` 
**request body :**

```json
{
    "message": "Registro exitoso",
    "user": {
        "id": 49,
        "fullname": "daniel",
        "email": "fvnfsj.doe@database.sh",
        "identification": "1569743",
        "role": 2,
        "password_hash": "$2b$10$OE2iDj4.qCnFvxO6t2mTM.VXSQIIsAvlCp8J1UjcLMLVMxqkv3y0W",
        "birthdate": "2025-08-25",
        "phone": "300556699",
        "sexo": "masculino"
    }
}
```
**response 200 example:**
**URL:** PUT `/users/51`
**request body :**

```json
{
    "id": 51,
    "fullname": "daniel",
    "email": "fvnfsj.doe@database.sh",
    "identification": "1569743",
    "role": 2,
    "password_hash": "$2b$10$tBEzdFVqd8sdzmH/fj136OQYNQgctOZmVe9CtvAlIISIq1YYerh1C",
    "birthdate": "2025-08-25",
    "phone": "2226666444",
    "sexo": "masculino"
}
```
**response 200 example:**
**URL:** DELETE `/users/51`
**request body :**

```json
{
    "id": 51,
    "fullname": "daniel",
    "email": "fvnfsj.doe@database.sh",
    "identification": "1569743",
    "role": 2,
    "password_hash": "$2b$10$tBEzdFVqd8sdzmH/fj136OQYNQgctOZmVe9CtvAlIISIq1YYerh1C",
    "birthdate": "2025-08-25",
    "phone": "2226666444",
    "sexo": "masculino"
}
```