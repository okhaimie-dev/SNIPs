# Starknet Address Validator

A web-based tool for validating and parsing Starknet addresses across multiple formats, including legacy hex addresses, SNIP-42 Bech32m addresses, and SNIP-43 unified addresses.

![Starknet Address Validator](https://img.shields.io/badge/Starknet-Address%20Validator-orange)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

### Address Format Support
- **Legacy Addresses** (`0x...`) - Traditional hex format with felt252 validation
- **SNIP-42 Public Addresses** (`strk1...`) - Bech32m encoded public addresses
- **SNIP-42 Shielded Addresses** (`strkx1...`) - Bech32m encoded shielded addresses
- **SNIP-43 Unified Addresses** (`strku1...`) - Multi-receiver unified addresses with TLV parsing

### Core Functionality
- **Real-time Validation** - Instant feedback as you type
- **Detailed Parsing** - Shows all components of valid addresses
- **Error Reporting** - Clear, specific error messages for invalid addresses
- **Copy to Clipboard** - Easy copying of addresses and parsed data
- **JSON Export** - Export validation results as structured JSON
- **Test Vector Generation** - Generate sample addresses for testing

### User Experience
- **Mobile Responsive** - Works seamlessly on desktop and mobile
- **Accessibility** - WCAG 2.1 AA compliant interface
- **Dark/Light Mode** - Automatic theme detection
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
   Navigate to `http://localhost:5173`

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

### Basic Validation

1. **Enter an address** in the input field
2. **View results** instantly - the tool shows:
   - ✅ Valid or ❌ Invalid status
   - Address format type (legacy, public, shielded, unified)
   - Detailed error messages for invalid addresses
   - Parsed components for valid addresses

### Advanced Features

- **Copy Functions**: Click copy buttons to copy addresses, components, or full JSON
- **Technical Details**: Expand sections to see raw payload data and byte information
- **Test Vectors**: Use the "Generate" buttons to create sample addresses
- **Format Examples**: Try the quick-start examples for each address type

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Starknet Community** - For SNIP specifications and feedback
- **Bitcoin Developers** - For the proven Bech32 implementation
- **shadcn/ui** - For the beautiful UI component library
- **Tailwind CSS** - For the utility-first CSS framework

---

**Built with ❤️ for the Starknet ecosystem**

For questions, issues, or contributions, please visit our [GitHub repository](https://github.com/starknet-io/SNIPs) or join the [Starknet community discussions](https://community.starknet.io/).