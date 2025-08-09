BariBaba Website - Deployment Instructions
-----------------------------------------

1) Replace logo:
   - Put your logo image at: assets/logo.png
   - Recommended: 400x400 PNG

2) Formspree setup (Contact form):
   - Current site uses mailto() links and a Formspree-ready form placeholder.
   - To use Formspree with a form, create a form at https://formspree.io/
   - Replace the placeholder form action URL in the contact form (if added) with:
     https://formspree.io/f/your-form-id

3) Upload to hosting:
   Option A - cPanel/Shared Hosting:
     - Zip all files and upload via File Manager to public_html (or desired subfolder).
     - Extract ZIP.
     - Visit your domain (https://baribaba.com)

   Option B - Netlify:
     - Sign up at netlify.com -> Drag & drop the folder -> Deploy site
     - Point your domain DNS A record to Netlify (see Netlify docs)

   Option C - GitHub Pages (static):
     - Create repo, push files to gh-pages branch or set main to deploy
     - If using Formspree, ensure action URL is set.

4) Change brand color:
   - Edit css/style.css: change --brand variable to your desired hex.

5) Replacing placeholder listings:
   - Edit listings.html and the individual detail pages (flat-rent.html, flat-sale.html, plot.html, pg.html)
   - Replace image src in assets/ and update titles/prices/text.

6) Google Maps:
   - If you want a live map on contact section, generate an embed code from Google Maps and paste into appropriate page.

7) Support:
   - If you want me to configure Formspree and test submissions, share the Formspree form ID or verify your email in Formspree yourself.

Enjoy! — BariBaba dev
