# Starknet Address Validator

A comprehensive educational tool and validator for Starknet addresses across multiple formats, including legacy hex addresses, SNIP-42 Bech32m addresses, and SNIP-43 unified addresses. Learn about address formats, validation processes, and SNIP specifications through interactive examples and step-by-step analysis.

![Starknet Address Validator](https://img.shields.io/badge/Starknet-Address%20Validator-orange)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

### 🎓 Educational Content
- **Interactive Learning Modules** - Beginner to advanced level explanations
- **Address Format Breakdown** - Visual structure analysis with examples
- **SNIP-42/43 Deep Dives** - Comprehensive coverage of new address standards
- **Bech32m Encoding Tutorial** - Step-by-step encoding process explanation
- **TLV Structure Analysis** - Detailed unified address parsing education
- **Privacy Concepts** - Understanding public vs. shielded vs. unified addresses

### 🔍 Step-by-Step Validation
- **Process Visualization** - See every validation step in real-time
- **Educational Timing** - Deliberate pacing to understand each check
- **Error Analysis** - Learn why addresses fail at specific steps
- **Technical Insights** - Understand felt252 constraints and Bech32m checksums
- **Interactive Examples** - Try validation with guided explanations

### 🛠 Address Validation Tools
- **Real-time Validation** - Instant feedback as you type
- **Multi-format Support** - Legacy, SNIP-42, and SNIP-43 addresses
- **Detailed Parsing** - Shows all components of valid addresses
- **Error Reporting** - Clear, specific error messages for invalid addresses
- **Test Vector Generation** - Generate valid sample addresses for testing
- **Copy & Export** - Easy copying of addresses and JSON export

### 💻 User Experience
- **Three Learning Modes** - Validator, Educational Guide, Step-by-Step Analysis
- **Mobile Responsive** - Works seamlessly on desktop and mobile
- **Accessibility** - WCAG 2.1 AA compliant interface
- **No Data Storage** - Fully client-side, privacy-focused
- **Offline Capable** - Works without internet connection

## 🚀 Quick Start

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd starknet-address-validator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` and explore the three main sections:
   - **Validator**: Quick address validation and testing
   - **Learn**: Comprehensive educational content
   - **Step-by-Step**: Interactive validation process analysis

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## 🛠 Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3 with shadcn/ui components
- **Address Validation**: Bitcoin Bech32 library
- **Icons**: Lucide React
- **Type Safety**: Full TypeScript coverage

## 📚 Usage Guide

### 🎓 Learning Mode (Recommended for New Users)

1. **Click the "Learn" tab** to access educational content
2. **Select your level**: Beginner, Intermediate, Advanced, or All
3. **Explore interactive sections**:
   - What are Starknet Addresses?
   - Legacy vs Modern Address Formats
   - Understanding Bech32m Encoding
   - SNIP-43 Unified Addresses Deep Dive
   - Validation Process Explained
   - Privacy and Address Types
4. **Try interactive examples** directly from educational content

### 👁 Step-by-Step Analysis

1. **Click the "Step-by-Step" tab**
2. **Enter any address** to analyze
3. **Watch the validation process** unfold in real-time:
   - Format Detection
   - Structure Validation
   - Checksum Verification (for Bech32m)
   - Felt252 Constraint Check
   - Format-Specific Validation
4. **Learn from failures** - see exactly where and why addresses fail

### ⚡ Quick Validation

1. **Use the "Validator" tab** for fast validation
2. **Enter addresses** for instant results
3. **Generate test vectors** with the lightning bolt buttons
4. **Copy results** in various formats (address, JSON, components)

### Advanced Features

- **Educational Tooltips**: Hover over terms for quick explanations
- **Interactive Examples**: Click examples in educational content to test them
- **Comprehensive Parsing**: View all address components and metadata
- **Error Learning**: Understand why addresses fail validation

### Supported Address Examples

```javascript
// Legacy (hex format)
0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7

// SNIP-42 Public (strk1...)
strk1...example...

// SNIP-42 Shielded (strkx1...)
strkx1...example...

// SNIP-43 Unified (strku1...)
strku1...example...
```

## 🧪 Development

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui base components
│   ├── AddressInput.tsx    # Address input component
│   └── ValidationResult.tsx # Results display component
├── lib/                # Core logic
│   ├── starknet-validator.ts # Address validation logic
│   └── utils.ts        # Utility functions
├── index.css           # Global styles and Tailwind
└── App.tsx            # Main application component
```

### Key Components

- **`starknet-validator.ts`** - Core validation logic for all address formats
- **`AddressInput`** - Input component with paste/clear functionality
- **`ValidationResult`** - Results display with detailed parsing information

### Running Tests

```bash
npm run test        # Run test suite
npm run test:watch  # Run tests in watch mode
npm run lint        # Check code quality
```

### Code Quality

The project uses:
- **ESLint** for code linting
- **TypeScript** for type safety
- **Prettier** for code formatting

## 🌐 Deployment

### Static Hosting

This project builds to static files and can be deployed to any static hosting service:

- **GitHub Pages**
- **Vercel**
- **Netlify**
- **AWS S3 + CloudFront**

### Build Command

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📖 Related Documentation

- [SNIP-42: Bech32m Address Encoding for Starknet](https://github.com/starknet-io/SNIPs/blob/main/SNIPS/snip-42.md)
- [SNIP-43: Unified Bech32m Addresses](https://community.starknet.io/t/snip-43-unified-bech32m-addresses-and-viewing-keys-for-starknet/116001)
- [Starknet Documentation](https://docs.starknet.io/)
- [Bitcoin Bech32 Specification](https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki)

## 🔒 Security & Privacy

- **Client-side Only** - All validation happens in your browser
- **No Data Transmission** - Addresses are never sent to external servers
- **No Storage** - No addresses or data are stored locally
- **Open Source** - Full transparency of validation logic

## 📊 Validation Features

### Address Format Detection
Automatically detects address format based on prefix:
- `0x` → Legacy hex format
- `strk1` → SNIP-42 public address
- `strkx1` → SNIP-42 shielded address
- `strku1` → SNIP-43 unified address

### Validation Rules
- **Felt252 Constraints** - Ensures addresses don't exceed 2^251 - 1
- **Checksum Verification** - Uses Bech32m checksums for error detection
- **Length Validation** - Enforces correct payload lengths
- **TLV Parsing** - Parses unified address receiver lists

## 🐛 Known Issues & Limitations

- **Node.js Version** - Requires Node.js 20.19+ for development
- **Test Vector Generation** - Currently generates placeholder addresses
- **Bech32m Implementation** - Uses Bitcoin library (battle-tested but not Starknet-specific)

## 📈 Roadmap

- [ ] **Enhanced Test Vectors** - Generate valid Bech32m test addresses
- [ ] **Batch Validation** - Validate multiple addresses at once
- [ ] **API Endpoint** - Optional server-side validation API
- [ ] **Browser Extension** - Validate addresses on any webpage
- [ ] **Mobile App** - React Native mobile application

## 🎯 Educational Impact

This tool has transformed from a simple validator into a comprehensive educational platform that:

- **Accelerates Learning**: Interactive examples make complex concepts accessible
- **Supports SNIP Adoption**: Practical understanding drives implementation confidence
- **Builds Community**: Shared reference for discussing address format evolution
- **Enables Innovation**: Deep technical understanding enables better tooling and applications

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Starknet Community** - For SNIP specifications and feedback
- **Bitcoin Developers** - For the proven Bech32 implementation
- **shadcn/ui** - For the beautiful UI component library
- **Tailwind CSS** - For the utility-first CSS framework
- **Educational Design** - Inspired by interactive learning principles

---

**Built with ❤️ for learning and the Starknet ecosystem**

This educational tool bridges the gap between specification and understanding, making advanced cryptographic concepts accessible to developers at all levels. 

For questions, issues, or contributions, please visit our [GitHub repository](https://github.com/starknet-io/SNIPs) or join the [Starknet community discussions](https://community.starknet.io/).