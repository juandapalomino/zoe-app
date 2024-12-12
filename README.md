# Project Readme: Initial Delivery

## Introduction

This document introduces the first delivery of the test project for Zoe Financial. While the core structure and foundational features are implemented, the project is still a work in progress, with several functionalities and polish tasks remaining. Below is a summary of the completed and pending tasks to provide clarity on the project's current state.

---

## *Implemented Features*

1. **Styling**
   - Start page, advisors page, single advisor page, and edit modal styling completed (final polish ongoing).  

2. **Validation** 
   - 5-digit validation for query input on the start page and advisors page, including edge case handling for invalid income values.  

3. **Database Integration**  
   - Dynamic population of the advisors' table with connection to the database.  

4. **Filtering**  
   - Filtering functionality for advisors based on income.  

5. **Advisor Details**  
   - "Details" button with animation for enhanced user experience.  

6. **Single Advisor Page**  
   - Data fetching from a JSON API to display advisor details.  

7. **Edit Modal**  
   - Created with responsive design for mobile devices and basic support integrated.  

---

## *Pending Tasks*

1. **Functionality Enhancements**  
   - Implement delete functionality for advisors.  
   - Complete the functionality of the edit modal.  

2. **Data Refinement**  
   - Revisit advisor object fields and finalize which ones should remain.  
   - Polish JSON file to address broken image issues and add additional data.  

3. **Table Features**  
   - Add sorting functionality for the advisors' table.  
   - Implement search functionality on the main page.  
   - Add pagination logic and styles.  

4. **Additional Features**  
   - Add support for creating a new advisor.  

5. **Code Quality**  
   - Clean up styles and polish code.  
   - Create shared components for better reusability.  
   - Improve overall code structure and quality.  

---

## *Suggestions and Ideas Implemented*

1. Placeholder added to the start page input for improved usability.  
2. Hover states designed to enhance clarity for interactive elements.  
3. Displaying the quantity of advisors found and the range of income used for filtering.  
4. Header and navbar maintain padding for consistent layout across the site.  
5. Edit modal transitions added for a smoother user experience.  

---

## Notes

While the project has a solid foundation, there are several aspects requiring further development and refinement. Feedback is welcome as we continue to improve and expand the functionality.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
