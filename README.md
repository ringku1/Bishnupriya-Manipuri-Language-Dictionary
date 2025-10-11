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

### 🔍 **Advanced Diacritic-Aware Search**
- **Live suggestions** with up to 50 matching results as you type
- **Cross-script compatibility** - Search "Aicā" and find "আইচা" (and vice versa)
- **Comprehensive diacritic support** - Works with 1,284+ character variants (á, ā, à, â, etc.)
- **Multi-tier search system** - Exact matching, prefix matching, and fuzzy search with Fuse.js
- **Smart character normalization** - "café" matches "cafe" automatically
- **Intelligent caching** - LRU cache system for lightning-fast repeated searches

### 🎨 **Modern User Interface**
- **Light & Dark themes** with system preference detection and persistence
- **Fully responsive design** - Optimized for desktop, tablet, and mobile devices
- **Mobile-first approach** - Touch-friendly interface with proper spacing
- **Smooth animations** and micro-interactions throughout the app
- **Professional accessibility** - ARIA attributes, keyboard navigation, and screen reader support
- **Modern glassmorphism design** - Subtle blur effects and gradient backgrounds

### 📚 **Rich Word Information**
- **Detailed definitions** with etymological information
- **Part of speech** classifications (noun, verb, adjective, etc.)
- **Modal word detail panel** for focused reading
- **Highlighted search matches** in suggestions

### ⌨️ **Advanced Keyboard Navigation**
- **Arrow keys** (↑↓) to navigate through suggestions
- **Enter** to select highlighted suggestion or perform search
- **Escape** to close suggestions and modals
- **Ctrl/Cmd + K** to focus search input (like GitHub/Discord)
- **Ctrl/Cmd + Backspace** to clear search input
- **Tab navigation** throughout the entire interface
- **Space/Enter** for button activation

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
│   ├── wordnet.json          # Dictionary data (40,000+ entries)
│   └── vite.svg             # App favicon
├── src/
│   ├── App.jsx              # Main application component
│   ├── App.css              # Global styles and responsive theming
│   ├── SearchBar.jsx        # Advanced search with diacritic support
│   ├── SearchBar.css        # Search component styles and animations
│   ├── WordDetail.jsx       # Word information modal
│   ├── WordDetail.css       # Modal styles
│   ├── LetterVarient.js     # Diacritic mapping and normalization utilities
│   └── main.jsx             # Application entry point
├── package.json             # Project dependencies and scripts
├── vite.config.js           # Vite build configuration
├── eslint.config.js         # ESLint configuration
└── README.md               # This documentation
```

## 🔧 Technology Stack

### **Core Technologies**
- **Frontend Framework**: React 19.1.1 (Latest with concurrent features)
- **Build Tool**: Vite 7.1.2 (Lightning-fast HMR and optimized builds)
- **Search Engine**: Fuse.js 7.1.0 (Advanced fuzzy search capabilities)
- **Language**: Modern JavaScript (ES2022+) with JSX

### **Styling & Design**
- **CSS3** with CSS Custom Properties for theming
- **Responsive design** with mobile-first approach
- **CSS Grid & Flexbox** for layout management
- **CSS Animations & Transitions** for smooth interactions

### **Development & Quality**
- **ESLint 9.33.0** with React-specific rules
- **Vite Plugin Ecosystem** for optimized development
- **Modern ES Modules** with tree-shaking
- **Hot Module Replacement** for instant feedback

### **Data & Performance**
- **JSON format** for 40,000+ dictionary entries
- **LRU caching system** for search optimization
- **Character normalization** for 1,284+ diacritic variants
- **Efficient regex patterns** for cross-script matching

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

## 🚀 Technical Features

### **Advanced Search Architecture**
- **3-Tier Search System**:
  - **Tier 1**: Exact & Prefix Matching (<1ms)
  - **Tier 2**: Fuzzy Search with Fuse.js (2-10ms)
  - **Tier 3**: Fallback Definition Search (5-15ms)
- **Smart Query Routing** based on result availability
- **Performance Monitoring** with built-in timing metrics

### **Diacritic Processing Engine**
- **1,284 Character Mappings** covering all Latin variants
- **Bidirectional Normalization** (accented ↔ base characters)
- **Regex Pattern Generation** for flexible matching
- **Unicode-Aware Processing** for international characters

### **Performance Optimizations**
- **LRU Cache** with 100-item limit and automatic cleanup
- **Debounced Search** to prevent excessive API calls
- **Memoized Components** for efficient re-rendering
- **Bundle Splitting** for optimized loading

### **Cross-Browser Compatibility**
- **Modern browsers** (Chrome, Firefox, Safari, Edge)
- **Mobile browsers** (iOS Safari, Chrome Mobile)
- **Graceful fallbacks** for older browser versions
- **Progressive enhancement** approach

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

## 📊 Performance Benchmarks

### **Search Performance** (40,000+ entries)
- **Exact Match**: <1ms (immediate response)
- **Prefix Match**: 1-3ms (near-instantaneous)
- **Fuzzy Search**: 2-10ms (excellent responsiveness)
- **Cache Hit**: <0.1ms (lightning fast)
- **Bundle Size**: ~85KB gzipped (compact and efficient)

### **Mobile Performance**
- **First Contentful Paint**: ~300ms
- **Time to Interactive**: ~800ms
- **Lighthouse Score**: 95+ (Performance, Accessibility, SEO)
- **Mobile Usability**: Touch-optimized with proper spacing

## 📋 Recent Updates

### **v2.1.0** - Advanced Diacritic Support
- ✨ **NEW**: Comprehensive diacritic-aware search with 1,284 character variants
- ✨ **NEW**: Cross-script compatibility (Bengali ↔ Latin)
- ✨ **IMPROVED**: 3-tier search architecture for better performance
- ✨ **IMPROVED**: Mobile-responsive theme toggle positioning
- 🐛 **FIXED**: Search mode toggle complexity removed for cleaner UX
- 🐛 **FIXED**: Highlighting accuracy with normalized string matching

### **v2.0.0** - Modern React Architecture
- ✨ **NEW**: Upgraded to React 19.1.1 with latest features
- ✨ **NEW**: Vite 7.1.2 for lightning-fast development
- ✨ **NEW**: Advanced keyboard navigation (Ctrl+K, arrow keys)
- ✨ **IMPROVED**: Responsive design with mobile-first approach
- ✨ **IMPROVED**: Dark mode with system preference detection

## 🚀 Future Enhancements

### **Search & Discovery**
- [ ] **Bengali script support** - Full diacritic mapping for Bengali characters
- [ ] **Audio pronunciations** with native speaker recordings
- [ ] **Advanced filters** - Search by part of speech, etymology, word length
- [ ] **Related words** suggestions based on semantic similarity
- [ ] **Search analytics** and popular word tracking

### **User Experience**
- [ ] **Favorite words** bookmarking with local storage
- [ ] **Search history** with quick access to recent lookups
- [ ] **Word of the day** feature with notifications
- [ ] **Copy to clipboard** functionality for definitions
- [ ] **Social sharing** for interesting word discoveries

### **Technical Improvements**
- [ ] **Offline-first architecture** with service workers
- [ ] **Progressive Web App** (PWA) with installability
- [ ] **Voice search** integration for hands-free lookup
- [ ] **API endpoints** for third-party integrations
- [ ] **Database migration** from JSON to efficient search database

### **Community & Content**
- [ ] **Mobile app** versions (iOS/Android)
- [ ] **Community contributions** system for corrections
- [ ] **Etymology visualizations** and word relationship graphs
- [ ] **Learning modules** for language students
- [ ] **Bulk export** functionality for researchers

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
