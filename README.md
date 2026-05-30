# Loan Management System

Full-stack loan management platform built with MERN + Next.js.

## Tech Stack
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Backend: Node.js + Express.js + TypeScript
- Database: MongoDB Atlas
- Auth: JWT + bcrypt

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Server
cd server
npm install
cp .env.example .env   # fill in your values
npm run seed           # creates all 6 role accounts
npm run dev

### Client
cd client
npm install
cp .env.example .env.local   # fill in your values
npm run dev

## Login Credentials (after seed)
| Role         | Email                | Password     |
|--------------|----------------------|--------------|
| Admin        | admin@lms.com        | Admin@123    |
| Sales        | sales@lms.com        | Sales@123    |
| Sanction     | sanction@lms.com     | Sanction@123 |
| Disbursement | disburse@lms.com     | Disburse@123 |
| Collection   | collect@lms.com      | Collect@123  |
| Borrower     | borrower@lms.com     | Borrower@123 |

## Live Demo
- Frontend: [Vercel link]
- Backend: [Render link]

## Assignment
MERN + Next.js · Loan Management System
