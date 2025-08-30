# VoteWave – Frontend

This is the **frontend** of the Polling App, built with **React + Vite**.  
It connects to the backend (AWS Lambda + API Gateway + DynamoDB) and uses **Amazon Cognito** for authentication.

---

## 🚀 Getting Started

### 1. Backend Requirement
Before running the frontend, make sure you have the **backend up and running**.  
You can find the backend repository here: [Polling App Backend](https://github.com/elmerjani/polls-app-backend)  

The backend provides:
- REST API (poll management)  
- WebSocket API (real-time voting updates)  
- Authentication integration with Cognito  

---

### 2. Prerequisites
- [Node.js](https://nodejs.org/) 
- Backend running (see link above)  
- An **Amazon Cognito User Pool** + App Client  

---

### 3. Setup Environment Variables
Copy the example environment file and fill it with your configuration:  

```bash
cp .env.example .env.local
```
Then edit `.env.local` and provide your values:
```bash
VITE_COGNITO_AUTHORITY=
VITE_COGNITO_CLIENT_ID=
VITE_COGNITO_REDIRECT_URI=
VITE_COGNITO_SCOPE=
VITE_COGNITO_RESPONSE_TYPE=
VITE_COGNITO_DOMAIN=
VITE_API_ENDPOINT=
VITE_WEBSOCKET_URL=
```
## 3. Install & Run
```bash
npm install
npm run dev
```
The app will start on http://localhost:5173.