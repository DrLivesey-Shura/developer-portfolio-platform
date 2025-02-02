# DevFolio - Portfolio Builder for Developers

A modern, customizable portfolio platform built specifically for developers to showcase their work, skills, and professional journey.

## 🚀 Features

- **Customizable Templates**: Choose from a variety of professional templates designed specifically for developers
- **Project Showcase**: Highlight your best work with detailed project pages including:
  - Technologies used
  - Live demo links
  - GitHub repository links
  - Project screenshots and descriptions
- **Blog Integration**: Share your knowledge and experiences through an integrated blog platform
- **Real-time Preview**: See changes as you make them with our live preview feature
- **Mobile Responsive**: All portfolios are fully responsive and optimized for all devices
- **SEO Optimization**: Built-in SEO tools to help your portfolio rank better in search results

## 🛠️ Tech Stack

- **Frontend**: Next.js
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/DrLivesey-Shura/developer-portfolio-platform.git
cd developer-portfolio-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Fill in your environment variables in `.env.local`

4. Start the development server:
```bash
npm run dev
```

## 🔧 Configuration

### Environment Variables

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### Database Setup

1. Create a MongoDB database
2. Add your connection string to `.env.local`
3. Run database migrations:
```bash
npm run migrate
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request


## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB team for the robust database
- All contributors who help improve this project

## 📧 Contact

If you have any questions or suggestions, please open an issue or contact us at [merahalaeddine02@gmail.com](mailto:merahalaeddine02@gmail.com)

---

Made with ❤️ by Merah Alaeddine
