<p align="center">
  <a href="https://clerk.com?utm_source=github&utm_medium=clerk_docs" target="_blank" rel="noopener noreferrer">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./public/light-logo.png">
      <img alt="Clerk Logo for light background" src="./public/dark-logo.png" height="64">
    </picture>
  </a>
  <br />
</p>
<div align="center">
  <h1>
    Finance Tracker – Next.js, Clerk, tRPC, Prisma & TypedSQL
  </h1>
  <a href="https://www.npmjs.com/package/@clerk/clerk-js">
    <img alt="Downloads" src="https://img.shields.io/npm/dm/@clerk/clerk-js" />
  </a>
  <a href="https://discord.com/invite/b5rXHjAg7A">
    <img alt="Discord" src="https://img.shields.io/discord/856971667393609759?color=7389D8&label&logo=discord&logoColor=ffffff" />
  </a>
  <a href="https://twitter.com/clerkdev">
    <img alt="Twitter" src="https://img.shields.io/twitter/url.svg?label=%40clerkdev&style=social&url=https%3A%2F%2Ftwitter.com%2Fclerkdev" />
  </a>
  <br />
  <br />
  <img alt="Finance Tracker Hero Image" src="./public/hero.png">
</div>

## Introduction

This is a **full-stack finance tracker** built with:

- **Next.js App Router** for modern React server components and routing
- **Clerk** for authentication and user management
- **tRPC** for fully type-safe API procedures
- **Prisma** as the ORM layer
- **TypedSQL** for safe, strongly-typed database queries

The app allows users to sign up, log in, and securely track income, expenses, and balances across different categories.

## Features

- 🔑 Authentication and user management with Clerk  
- 📊 Track income, expenses, and categories  
- 💾 Persistent storage with Prisma and PostgreSQL  
- 🔒 End-to-end type safety with tRPC and TypedSQL  
- 🚀 Built with Next.js App Router for scalability  

## Deploy

You can easily deploy this project to Vercel. Don’t forget to set your environment variables in the Vercel dashboard:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`  
- `CLERK_SECRET_KEY`  
- `DATABASE_URL`  

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Running the project locally

```bash
git clone https://github.com/YOUR_USERNAME/finance-tracker
cd finance-tracker
npm install
npm run dev
