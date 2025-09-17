# BM Dictionary - Bishnupriya Manipuri to English Dictionary

<div align="center">
  <h3>🌟 A modern web application for preserving and exploring Bishnupriya Manipuri language 🌟</h3>
  
  [![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF.svg)](https://vitejs.dev/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

---

## 📖 About

BM Dictionary is a comprehensive digital dictionary that translates Bishnupriya Manipuri words to English. Built with modern web technologies, it serves as both a practical translation tool and a contribution to preserving the rich linguistic heritage of the Bishnupriya Manipuri community.

This project is based on the scholarly work "Bishnupriya Manipuri to English Dictionary" by **Dr. Kali Prasad Sinha**, making this valuable linguistic resource accessible to a global digital audience.

## ✨ Features

### 🔍 **Intelligent Search**
- **Live suggestions** with up to 50 matching results as you type
- **Dual script support** - Works with both Bengali script (অইচা) and romanized text (Aicā)
- **Smart subsequence matching** - Finds words even with non-consecutive letter matches
- **Diacritic normalization** - Handles accented characters seamlessly
- **First-letter priority** matching for more relevant results

### 🎨 **Modern User Interface**
- **Light & Dark themes** with system preference detection
- **Responsive design** - Works perfectly on desktop, tablet, and mobile
- **Smooth animations** and transitions throughout the app
- **Accessibility support** with ARIA attributes and keyboard navigation
- **Professional gradient backgrounds** with subtle animations

### 📚 **Rich Word Information**
- **Detailed definitions** with etymological information
- **Part of speech** classifications (noun, verb, adjective, etc.)
- **Modal word detail panel** for focused reading
- **Highlighted search matches** in suggestions

### ⌨️ **Keyboard Navigation**
- **Arrow keys** to navigate suggestions
- **Enter** to select highlighted suggestion or search
- **Escape** to close suggestions
- **Tab navigation** throughout the interface

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 22.x or higher)
- **npm** or **yarn** package manager
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ringku1/dictionary-web.git
   cd dictionary-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the app in action!

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist/` directory, ready for deployment.

## 🏗️ Project Structure

```
dictionary-web/
├── public/
│   ├── wordnet.json          # Dictionary data (~40,000+ entries)
│   └── vite.svg             # App favicon
├── src/
│   ├── components/
│   │   ├── App.jsx          # Main application component
│   │   ├── SearchBar.jsx    # Search interface with live suggestions
│   │   └── WordDetail.jsx   # Word information modal
│   ├── styles/
│   │   ├── App.css          # Global styles and theming
│   │   ├── SearchBar.css    # Search component styles
│   │   └── WordDetail.css   # Modal styles
│   └── main.jsx             # Application entry point
├── dictionary.txt           # Raw dictionary data
├── package.json             # Project dependencies
└── README.md               # This file
```

## 🔧 Technology Stack

- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Styling**: CSS3 with CSS Variables for theming
- **Language**: Modern JavaScript (ES2022+)
- **Development**: ESLint for code quality
- **Data Format**: JSON for dictionary entries

## 📊 Dictionary Data

The dictionary contains **40,000+ entries** with the following structure:

```json
{
  "word": "অইচা",
  "pos": "noun",
  "definition": "অইচা Aicā - Profit (N.). মে. ওইজবা oijabā."
}
```

- **word**: The Bishnupriya Manipuri term (in Bengali script or romanized)
- **pos**: Part of speech (noun, verb, adjective, etc.)
- **definition**: Detailed English definition with etymology

## 🤝 Contributing

Contributions to improve the BM Dictionary are welcome! Here's how you can help:

### Ways to Contribute

1. **Report bugs** or suggest features via [GitHub Issues](https://github.com/ringku1/dictionary-web/issues)
2. **Fix typos** or improve definitions in the dictionary data
3. **Enhance the UI/UX** with better designs or animations
4. **Add new features** like audio pronunciations or word favorites
5. **Improve documentation** and help others understand the project

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request with a clear description

### Code Style

- Use **ESLint** for code formatting
- Write **clear, descriptive commit messages**
- **Test your changes** thoroughly before submitting
- Follow **React best practices** and hooks patterns

## 📚 Data Source & Attribution

This dictionary is based on the academic work:

**"Bishnupriya Manipuri to English Dictionary"**  
*by Dr. Kali Prasad Sinha*

📖 **Original Source**: Available on [Internet Archive](https://archive.org/details/bishupriya-manipuri-to-english-dictionary-dr.-kali-prasad-sinha/page/n7/mode/2up)

We are grateful to Dr. Sinha for his scholarly contribution to preserving the Bishnupriya Manipuri language.

## 🌍 Cultural Impact

The Bishnupriya Manipuri language is spoken by communities in:
- **Bangladesh** (Sylhet region)
- **India** (Assam, Tripura, Manipur)
- **Myanmar** (some communities)

This digital dictionary helps:
- **Preserve** an endangered language for future generations
- **Connect** diaspora communities with their linguistic heritage
- **Facilitate** language learning and research
- **Digitize** traditional scholarly resources

## 🚀 Future Enhancements

- [ ] **Audio pronunciations** for words
- [ ] **Favorite words** bookmarking system
- [ ] **Search history** and recent lookups
- [ ] **Offline support** with service workers
- [ ] **Mobile app** versions (iOS/Android)
- [ ] **Community contributions** for definitions and corrections
- [ ] **Advanced search** filters (by part of speech, etymology)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 About the Developer

Hi, I'm **Ringku** - an engineer passionate about preserving and promoting Bishnupriya Manipuri literature through technology. This project reflects my commitment to using modern web development skills for cultural preservation.

### Connect with me:

- 📧 **Email**: [ringkuxinha@gmail.com](mailto:ringkuxinha@gmail.com)
- 🐙 **GitHub**: [@ringku1](https://github.com/ringku1)
- 💼 **LinkedIn**: [ringku1](https://linkedin.com/in/ringku1)
- 📘 **Facebook**: [Ringku Singha](https://www.facebook.com/ringku.singha.794/)

---

<div align="center">
  <p><strong>Made with ❤️ for the Bishnupriya Manipuri community</strong></p>
  <p>If this project helps you or your community, please consider giving it a ⭐!</p>
</div>
