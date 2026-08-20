# RentHive – Community Marketplace

A modern, mobile-first community marketplace web application built with vanilla HTML, CSS, and JavaScript. Deploy instantly on GitHub Pages.

![RentHive](https://img.shields.io/badge/RentHive-Marketplace-3478F6?style=for-the-badge)

## 🚀 Features

- **10 Complete Screens**: Splash, Login, Home, Product Details, Sell Product, Wishlist, Chat, Profile, My Ads, Admin Dashboard
- **Responsive Design**: Mobile-first approach with phone-frame layout on desktop
- **Interactive Chat**: Real-time message sending with timestamps
- **Smooth Navigation**: Animated screen transitions
- **Zero Dependencies**: Pure HTML, CSS, and JavaScript (external fonts & icons via CDN)

## 📱 Screens

| Screen | Description |
|--------|-------------|
| Splash | Brand logo with "Get Started" button |
| Login | Email/password form with remember me |
| Home | Search, categories, featured ads grid |
| Product Details | Full product info with chat/call actions |
| Sell Product | Upload photos and product details form |
| Wishlist | Favorited items list |
| Chat | Real-time messaging interface |
| Profile | User info and settings menu |
| My Ads | Active/Sold/Expired ad management |
| Admin Dashboard | Stats overview and reported ads |

## 🛠️ Deploy on GitHub Pages

1. Create a new GitHub repository
2. Push all files to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - RentHive Marketplace"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/renthive.git
   git push -u origin main
   ```
3. Go to **Settings** → **Pages** → Select **main** branch → **Save**
4. Your site will be live at `https://YOUR_USERNAME.github.io/renthive/`

## 📂 Project Structure

```
renthive-app/
├── index.html          # Main HTML (all 10 screens)
├── css/
│   └── styles.css      # Complete stylesheet
├── js/
│   └── app.js          # Navigation & interactions
└── README.md           # This file
```

## 🎨 Design System

- **Primary Color**: `#3478F6`
- **Font**: Inter (Google Fonts)
- **Icons**: Font Awesome 6
- **Border Radius**: 10-14px for cards, 50px for buttons

## License

MIT
