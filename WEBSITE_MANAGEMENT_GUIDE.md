# Website Management Guide

This guide explains how to manage the content (text, images, and branding) of your **ABHINANDAN PROMPTS · GRAPHICS · AI** website.

There are two main ways to change content:

1.  **Admin Dashboard (Easy)**: For managing dynamic content like Services, Properties, Store items, and the Dynamic Gallery.
2.  **Code Editing (Advanced)**: For changing fixed content like the Home Page hero section, Background Slideshows, Portfolio details, and specific text headlines.

---

## 1. Using the Admin Dashboard (No Code Required)

The Admin Dashboard is the easiest way to manage your content. You can access it by logging into your website.

**URL:** `/admin` (e.g., `http://localhost:5173/admin` or your live URL)

It allows you to manage:

### **A. Services**
- **Navigate to:** Admin Console -> Services
- **What you can do:** Add new services, edit descriptions, change icons, and upload demo videos/images.
- **Where it appears:** On the `/services` page ("CORE CAPABILITIES").

### **B. Featured Properties**
- **Navigate to:** Admin Console -> Properties
- **What you can do:** Add new property listings with prices, locations, and images.
- **Where it appears:** On the Home page "Featured Properties" section.

### **C. Gallery & Trail Effects**
- **Navigate to:** Admin Console -> Gallery
- **What you can do:** Upload new images/videos.
    - **Important:** If you set `is_trail` to `TRUE`, the image will appear in the **mouse/touch trail effect** on the Home page.
- **Where it appears:** Home page trail effect (mobile & desktop) and potentially other gallery sections.

### **D. Vault/Store**
- **Navigate to:** Admin Console -> Vault/Store
- **What you can do:** Add digital assets for sale.
- **Where it appears:** On the `/assets` page ("THE VAULT").

### **E. Inquiries**
- **Navigate to:** Admin Console -> Inquiries
- **What you can do:** View messages sent from the Contact form.

---

## 2. Editing Website Code (For Static Content)

Some parts of the website are "hardcoded" to ensure maximum performance and specific design layouts. To change these, you need to edit the code files directly.

**Tools Needed:** VS Code (or any text editor).

### **A. Home Page Content (`pages/Home.tsx`)**

Open the file: `pages/Home.tsx`

| Section | What to Search For (Ctrl+F) | How to Change |
| :--- | :--- | :--- |
| **Hero Title** | `ABHINANDAN` | Change the main text. Note: `PROMPTS · GRAPHICS · AI` is below it in a separate span. |
| **Hero Background** | `backgroundImage: url` | Line ~94. Change the URL inside the quotes. |
| **Creative Horizon** | `const defaultTrail = [` | Line ~6. These images act as the fallback for the trail AND appear in the "Creative Horizon" infinite scroll. |
| **Infinite Scroll** | `Creative Horizon` | Line ~117. Text headers for the slideshow section. |
| **Featured Properties** | `Featured Properties.` | Line ~135. Change the section title. |
| **Visual Engineering** | `Visual Engineering` | Line ~165. Change the sub-headlines. |
| **Impact Images** | `const impactImages = [` | Line ~12. Update URLs for the images in the "Visuals that Convert" section. |
| **Background Sides** | `const sectionBgImages = [` | Line ~19. Update images that fade in/out in the background of lower sections. |

### **B. Portfolio Page Content (`pages/Portfolio.tsx`)**

Open the file: `pages/Portfolio.tsx`

| Section | What to Search For (Ctrl+F) | How to Change |
| :--- | :--- | :--- |
| **Profile Picture** | `const profileImg =` | Line ~17. Replace the URL with your new profile photo URL. |
| **Name Header** | `ABHINANDAN` | Line ~63. Update your First Name. |
| **Surname** | `Pandey` | Line ~65. Update your Last Name (smaller text). |
| **Bio / Stats** | `DoB:`, `Address:` | Line ~68. Update personal details. |
| **Timeline** | `const timeline = [` | Line ~19. Edit `year`, `title`, and `detail` for Education/Experience. |
| **Skills** | `const skills = [` | Line ~26. Add/Remove skills (e.g., "AI Coding"). |
| **Visual Archive** | `const galleryImages = [` | Line ~31. Update the grid of images at the bottom of the page. |

### **C. Global Branding (Navbar & Footer)**

Open the file: `App.tsx`

| Section | What to Search For (Ctrl+F) | How to Change |
| :--- | :--- | :--- |
| **Navbar Logo** | `ABHINANDAN` | Line ~37. Update top-left logo text. |
| **Footer Text** | `vibeai.creative` | Update email addresses or copyright text at the bottom. |
| **Social Links** | `['instagram', 'x-twitter'` | Line ~87. Update social media links. |

### **D. Digital Assets Page (`pages/DigitalAssets.tsx`)**

Open the file: `pages/DigitalAssets.tsx`

| Section | What to Search For (Ctrl+F) | How to Change |
| :--- | :--- | :--- |
| **Page Title** | `THE VAULT.` | Line ~21. Change the page heading. |
| **Intro Text** | `Unlock the tools of` | Line ~22. Update the sub-heading description. |

---

## 3. How to Update Images

1.  **Host Your Image**: Upload your image to Supabase Storage (via Admin Dashboard) or use a free host like GitHub, Imgur, or Unsplash.
2.  **Get the URL**: Copy the "Direct Link" (must end in .jpg, .png, .webp).
3.  **Paste in Code**: detailed above, replace existing URLs (e.g., `"https://..."`) with your new one.

## Troubleshooting

-   **Mobile Trail Effect**: The trail effect on mobile uses `touchmove`. If it feels unresponsive, ensure you are touching separate parts of the screen, as rapid taps might be interpreted as clicks.
-   **Images not showing?** Ensure the URL is correct and publicly accessible.
-   **Changes not appearing?**
    -   **Local**: Save the file (Ctrl+S).
    -   **Live**: You must redeploy your code (e.g., `git push` if using GitHub/Netlify/Vercel).



How and Where to Add/Change Logos: You can customize these in 
App.tsx
 (around line 90). The code looks like this:
tsx
{['instagram', 'x-twitter', 'linkedin', 'whatsapp'].map(s => (...))}
To Add a New Logo: Simply add the name of the icon to the list.
Example: To add YouTube: ['instagram', 'x-twitter', 'linkedin', 'whatsapp', 'youtube'].
To Remove a Logo: Delete the name from the list.
To Add a Link: You need to change the code slightly to support URLs. currently, href="#" is a placeholder.
How to use Custom Images instead
If you want to use your own custom logo images instead of the standard icons:

Go to 
App.tsx
.
Replace the <i> tag with an <img> tag inside the loop, or manually write out the links like this:
tsx
<a href="https://instagram.com/yourprofile" className="...">
   <img src="/path/to/your-logo.png" className="w-5 h-5" />
</a>
For now, the X logo should be visible without you doing anything else!


