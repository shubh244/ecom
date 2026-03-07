# Setup Instructions

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
furniture/
├── app/                    # Next.js app directory
│   ├── category/          # Category pages
│   ├── product/           # Product detail pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Footer component
│   ├── Hero.tsx           # Hero section
│   ├── ProductCard.tsx    # Product card component
│   └── ...
├── context/               # React context providers
│   └── CartContext.tsx    # Shopping cart context
├── lib/                   # Utilities and data
│   └── data.ts            # Product and category data
└── public/                # Static assets (images, etc.)
```

## Features Implemented

✅ Responsive design matching woodstate.co layout
✅ Product categories and subcategories
✅ Product listing pages
✅ Product detail pages
✅ Shopping cart functionality
✅ Search functionality (UI ready)
✅ Wishlist functionality (UI ready)
✅ Category navigation with dropdown
✅ Featured products section
✅ Top picks section
✅ Hero slider
✅ Footer with company information

## Customization

### Adding Products
Edit `lib/data.ts` to add more products to the `products` array.

### Adding Categories
Edit `lib/data.ts` to modify the `categories` array.

### Styling
- Global styles: `app/globals.css`
- Tailwind config: `tailwind.config.js`
- Component-specific styles are inline using Tailwind classes

### Images
Place product images in the `public/` directory and update image paths in `lib/data.ts`.

## Build for Production

```bash
npm run build
npm start
```

## Notes

- Product images are currently using placeholder paths. Replace with actual images.
- The cart functionality is implemented but cart page/view needs to be added.
- Search functionality UI is ready but needs backend integration.
- All product data is currently static in `lib/data.ts`.

