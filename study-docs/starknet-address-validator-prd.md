# PRD: Starknet Address Validator Tool

**Version:** 1.0  
**Date:** January 2025  
**Status:** Draft  
**Owner:** Community Contributor  
**Stakeholders:** Starknet developers, wallet teams, dApp developers  

## Executive Summary

The Starknet Address Validator Tool is a web-based utility that validates and parses Starknet addresses across multiple formats (legacy hex, SNIP-42 Bech32m, and SNIP-43 unified addresses). Built on proven Bitcoin Bech32m libraries, it provides immediate feedback on address validity and detailed parsing information to support SNIP-42/43 adoption in the Starknet ecosystem.

## Problem Statement

### Current Pain Points
- **No standardized validation**: Developers lack a reliable tool to test SNIP-42/43 address formats
- **Format confusion**: Multiple address formats (hex, strk, strkx, strku) with different validation rules
- **Implementation uncertainty**: Teams need reference validation to ensure their implementations are correct
- **Testing gap**: No easy way to generate test vectors or validate edge cases
- **Developer friction**: High barrier to understanding and implementing new address formats

### Target Users
1. **Starknet developers** implementing SNIP-42/43 in their applications
2. **Wallet teams** adding support for new address formats
3. **dApp developers** needing to validate user address inputs
4. **SNIP contributors** testing implementations and creating test vectors
5. **Community members** learning about new address formats

## Goals & Success Metrics

### Primary Goals
- **Validation accuracy**: 100% correct validation for all defined address formats
- **Developer adoption**: Tool becomes the reference validation for SNIP-42/43 implementations
- **Educational value**: Helps developers understand address format differences
- **Testing support**: Enables comprehensive test vector creation

### Success Metrics
- **Usage**: 50+ unique users in first month
- **Accuracy**: Zero false positives/negatives for valid test cases
- **Community feedback**: Positive reception in SNIP discussion threads
- **Integration**: Referenced by at least 3 implementation teams
- **Ecosystem impact**: Accelerates SNIP-42/43 adoption

## User Stories & Requirements

### Core User Stories

**As a Starknet developer implementing SNIP-43:**
- I want to validate addresses my users input
- I need to understand what makes an address valid or invalid
- I want to see parsed components of unified addresses
- I need test cases for my validation logic

**As a wallet developer:**
- I want to test my address generation is correct
- I need to validate user-entered addresses before transactions
- I want to understand receiver selection logic for unified addresses
- I need reference behavior for edge cases

**As a dApp developer:**
- I want to validate addresses users paste into my interface
- I need clear error messages for invalid addresses
- I want to support both legacy and new formats seamlessly
- I need confidence my validation matches ecosystem standards

### Functional Requirements

**Input Handling:**
- Accept any text string as input
- Support paste/clear/copy operations
- Handle whitespace gracefully (trim)
- Process input in real-time (no submit button needed)

**Validation Logic:**
- Validate legacy hex addresses (0x... format)
- Validate SNIP-42 public addresses (strk1... format)
- Validate SNIP-42 shielded addresses (strkx1... format)
- Validate SNIP-43 unified addresses (strku1... format)
- Enforce all SNIP-specified rules (length, checksum, format)
- Provide detailed error messages for invalid addresses

**Output Information:**
- Validation status (✓ Valid / ✗ Invalid)
- Address format type identification
- Parsed components (version, HRP, payload, etc.)
- For unified addresses: list of contained receivers
- For invalid addresses: specific error explanation
- Technical details in expandable sections

**Additional Features:**
- Generate test vectors (random valid addresses)
- Copy parsed information to clipboard
- Export validation results as JSON
- Link to relevant SNIP documentation
- Mobile-responsive design

### Non-Functional Requirements

**Performance:**
- Instant validation feedback (<100ms)
- Works offline (no server dependencies)
- Minimal bundle size (<500KB total)

**Reliability:**
- 100% uptime (static hosting)
- No data loss (client-side only)
- Graceful error handling

**Usability:**
- Intuitive interface requiring no documentation
- Clear visual feedback for validation states
- Accessible (WCAG 2.1 AA compliance)
- Works on mobile and desktop

**Security:**
- No data transmission (fully client-side)
- No address storage or logging
- Safe to use with real addresses

## Technical Specifications

### Technology Stack

**Core Dependencies:**
- **bech32** (npm): Proven Bitcoin Bech32m implementation
- **Vanilla JavaScript**: No framework dependencies for simplicity
- **HTML5/CSS3**: Modern web standards
- **GitHub Pages**: Free, reliable hosting

**Architecture:**
```
User Input → Input Validation → Format Detection → 
Format-Specific Parsing → Result Display → Action Buttons
```

**Key Modules:**
1. **Input Handler**: Text processing and real-time validation
2. **Format Detector**: Identifies address format from input
3. **Legacy Validator**: Handles 0x... hex addresses
4. **Bech32m Validator**: Wraps npm bech32 library
5. **TLV Parser**: Handles unified address receiver lists
6. **UI Controller**: Manages display and user interactions

### Implementation Details

**Address Format Detection:**
```javascript
function detectAddressFormat(input) {
  if (input.startsWith('0x')) return 'legacy';
  if (input.startsWith('strk1')) return 'public';
  if (input.startsWith('strkx1')) return 'shielded';  
  if (input.startsWith('strku1')) return 'unified';
  return 'unknown';
}
```

**Validation Strategy:**
- Use npm `bech32` library for all Bech32m operations
- Add Starknet-specific validation layers
- Implement felt252 constraint checking (< 2^251)
- Parse TLV data for unified addresses
- Provide detailed error context

**Error Handling:**
- Catch and categorize all validation errors
- Provide user-friendly error messages
- Link to documentation for complex errors
- Suggest fixes where possible

### Data Structures

**Validation Result:**
```javascript
{
  isValid: boolean,
  format: 'legacy' | 'public' | 'shielded' | 'unified' | 'unknown',
  error?: string,
  parsed?: {
    hrp?: string,
    version?: number,
    payload?: Uint8Array,
    receivers?: Receiver[], // for unified addresses
    felt252?: string // canonical representation
  }
}
```

## Design Specifications

### User Interface Layout

**Header Section:**
- Tool title and SNIP reference links
- Brief description of supported formats

**Input Section:**
- Large text area for address input
- Paste/Clear buttons
- Character count display

**Validation Section:**
- Prominent valid/invalid indicator
- Format type badge
- Detailed parsing information
- Expandable technical details

**Action Section:**
- Copy buttons for parsed data
- Generate test vector button
- Export JSON button

**Footer Section:**
- Links to SNIP documentation
- GitHub repository link
- Feedback/issues link

### Visual Design

**Color Scheme:**
- Valid: Green (#10B981)
- Invalid: Red (#EF4444)
- Neutral: Gray (#6B7280)
- Background: White/Light gray

**Typography:**
- Headers: Inter/system font
- Code/addresses: Monospace font
- Body: System font stack

**Responsive Behavior:**
- Mobile-first design
- Collapsible sections on small screens
- Touch-friendly buttons
- Horizontal scrolling for long addresses

## Implementation Plan

### Phase 1: Core Functionality (Week 1-2)
- [ ] Set up project structure and dependencies
- [ ] Implement basic input handling
- [ ] Add bech32 library integration
- [ ] Create legacy hex validation
- [ ] Build basic UI layout

### Phase 2: SNIP-42 Support (Week 2-3)
- [ ] Implement strk1 (public) address validation
- [ ] Add strkx1 (shielded) address validation
- [ ] Create felt252 constraint checking
- [ ] Add detailed error messaging
- [ ] Implement test vector generation

### Phase 3: SNIP-43 Support (Week 3-4)
- [ ] Build TLV parser for unified addresses
- [ ] Implement receiver list parsing
- [ ] Add receiver type identification
- [ ] Create unified address validation
- [ ] Add copy/export functionality

### Phase 4: Polish & Deploy (Week 4)
- [ ] Comprehensive testing with edge cases
- [ ] Mobile responsiveness optimization
- [ ] Documentation and help text
- [ ] Deploy to GitHub Pages
- [ ] Community feedback collection

### Testing Strategy
- Unit tests for all validation functions
- Integration tests with existing SNIP test vectors
- Cross-browser compatibility testing
- Mobile device testing
- Accessibility testing

## Success Criteria

### Technical Criteria
- [ ] Validates all SNIP-42/43 address formats correctly
- [ ] Handles all edge cases defined in specifications
- [ ] Performance under 100ms for all operations
- [ ] Zero security vulnerabilities
- [ ] 100% client-side operation

### User Experience Criteria
- [ ] Intuitive interface requiring no documentation
- [ ] Clear feedback for all validation states
- [ ] Mobile-friendly responsive design
- [ ] Accessible to users with disabilities

### Community Criteria
- [ ] Positive feedback from SNIP discussion participants
- [ ] Adoption by implementation teams for testing
- [ ] Reference usage in community discussions
- [ ] Contribution to SNIP specification refinement

## Future Considerations

### Potential Enhancements
- **Batch validation**: Upload file of addresses for bulk validation
- **API endpoint**: Programmatic access to validation logic
- **Browser extension**: Validate addresses on any webpage
- **QR code scanning**: Camera-based address input
- **Address book**: Save and manage validated addresses

### Integration Opportunities
- **Wallet integration**: Embed validation widget
- **Explorer integration**: Add validation to block explorers
- **SDK examples**: Reference implementation for developers
- **CLI version**: Command-line tool for automation

### Maintenance Considerations
- Monitor SNIP specification changes
- Update validation rules as needed
- Maintain compatibility with bech32 library updates
- Community feedback incorporation
- Performance optimization

## Appendix

### Related Documents
- [SNIP-42: Bech32m Address Encoding](../SNIPS/snip-42.md)
- [SNIP-43: Unified Bech32m Addresses](../SNIPS/snip-43.md)
- [Community Discussion Thread](https://community.starknet.io/t/snip-43-unified-bech32m-addresses-and-viewing-keys-for-starknet/116001)

### Risk Assessment
- **Technical Risk**: Low (building on proven libraries)
- **Adoption Risk**: Medium (depends on SNIP adoption)
- **Maintenance Risk**: Low (minimal dependencies)
- **Security Risk**: Very Low (client-side only)

---

*This PRD will be updated as requirements evolve and community feedback is incorporated.*