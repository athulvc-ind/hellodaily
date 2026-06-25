# HelloDaily

HelloDaily is a restaurant management and customer self-ordering platform. Customers can book tables, scan QR menus, place orders, pay, and track preparation status while staff, kitchen teams, and admins manage operations from role-specific dashboards.

## Stack

- React, React Router, Tailwind CSS, Axios
- Node.js, Express, JWT, bcrypt
- MongoDB/Mongoose model definitions with an in-memory demo store for local development
- Cloudinary-ready image fields

## Quick Start

```bash
npm install
npm run dev
```

- Client: http://localhost:4173
- API: http://localhost:5050/api/health

## Demo Accounts

All seeded accounts use `password123`.

- `customer@hellodaily.dev`
- `staff@hellodaily.dev`
- `kitchen@hellodaily.dev`
- `admin@hellodaily.dev`

## Environment

Copy `.env.example` to `.env` and set `JWT_SECRET`. Add `MONGODB_URI` when you are ready to switch from the demo store to Atlas-backed persistence.
# hellodaily
