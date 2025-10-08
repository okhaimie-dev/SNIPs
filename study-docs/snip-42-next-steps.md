# SNIP-43: Next Steps for Community Contributors

A practical guide for developers looking to contribute to the Unified Bech32m Addresses and Viewing Keys proposal for Starknet.

## 🎯 Quick Context

**SNIP-43** proposes unified address formats (`strk`, `strkx`, `strku`) and viewing keys to prepare Starknet for future privacy features. This is an **Interface-only** proposal - no protocol changes required, making it accessible for community implementation.

## 🤔 Critical Questions to Explore

### Technical Implementation

**Address Format & Validation:**
- Are the 90-character limits for `strk`/`strkx` addresses practical for real UX?
- How should wallets handle malformed TLV encoding in unified addresses?
- Should there be canonical ordering rules for receivers within UAs?
- What happens when a UA contains only unsupported receiver types?

**Cross-Platform Compatibility:**
- How do we ensure consistent Bech32m parsing across JavaScript, Python, Rust, etc.?
- What's the best approach for handling long unified addresses in QR codes?
- Should mobile wallets truncate/wrap addresses differently than desktop?

**Edge Cases & Error Handling:**
- How should applications gracefully handle unknown receiver types (future-proofing)?
- What validation rules should apply when importing viewing keys?
- How do we prevent UI spoofing with similar-looking prefixes?

### User Experience

**Adoption & Migration:**
- What's the expected timeline for wallet ecosystem adoption?
- How do we handle the transition period when only some wallets support new formats?
- Should there be "compatibility badges" showing what address types each wallet supports?

**Education & Onboarding:**
- How do we educate users about when to share which type of address?
- What UI patterns work best for displaying/copying different address formats?
- Should wallets maintain "address books" with user-specified privacy preferences?

## 🛠️ Ways to Contribute

### 1. Reference Implementations

**High Priority Languages:**
- **JavaScript/TypeScript** - Critical for web wallet adoption
- **Python** - Backend services, tooling, and Starknet.py integration  
- **Rust** - Performance-critical applications and infrastructure
- **Go** - CLI tools and backend services

**What to Build:**
```typescript
// Example API for reference implementation
interface Bech32mAddressUtils {
  encodePublic(address: felt252): string;          // -> strk1...
  encodeShielded(payload: Uint8Array): string;     // -> strkx1...
  encodeUnified(receivers: Receiver[]): string;    // -> strku1...
  
  parseAddress(address: string): ParsedAddress;
  selectReceiver(ua: UnifiedAddress, capabilities: Capability[]): Receiver;
}
```

### 2. Developer Tools & Testing

**Essential Tools:**
- **Address validator/converter** - Web tool for testing different formats
- **QR code generator** - Handle long unified addresses elegantly  
- **CLI utility** - Generate test vectors and validate implementations
- **Browser extension** - Detect and convert addresses on web pages
- **Integration testing framework** - Cross-language compatibility testing

**Test Vector Creation:**
- Edge cases (minimum/maximum lengths, boundary conditions)
- Invalid address examples for negative testing
- Cross-platform round-trip testing
- Malformed TLV data handling
- Unicode/internationalization edge cases

### 3. Integration Examples

**Ecosystem Integration Guides:**
- Starknet.js integration patterns
- Starknet.py wallet adapter examples
- RPC endpoint implementation examples  
- Explorer/indexer integration patterns
- Sample wallet UI mockups and flows

**Practical Code Examples:**
```python
# Example: Adding SNIP-43 support to existing tools
class StarknetAddressHandler:
    def __init__(self):
        self.bech32m = Bech32mCodec()
    
    def normalize_address(self, addr_input: str) -> NormalizedAddress:
        if addr_input.startswith('0x'):
            return self.handle_legacy_hex(addr_input)
        elif addr_input.startswith('strk1'):
            return self.handle_public_bech32m(addr_input)
        # ... handle other formats
```

### 4. Documentation & Education

**Community Resources:**
- **"SNIP-43 for Developers"** - Technical implementation guide
- **Migration guide** - How existing dApps can add support
- **Security best practices** - Address validation, UI considerations
- **FAQ document** - Common questions and edge cases
- **Video tutorials** - Visual guides for implementation

### 5. Community Coordination

**Forum Discussion Topics:**
- Implementation timeline coordination between wallets
- Shared test vector repository maintenance
- Regular implementation sync calls
- Language-specific working groups

## 🏃 Immediate Action Items (This Week)

### Engage in Community Discussion
1. **Comment** on the [community forum thread](https://community.starknet.io/t/snip-43-unified-bech32m-addresses-and-viewing-keys-for-starknet/116001)
2. **Ask clarifying questions** about edge cases and implementation details
3. **Share your perspective** as a developer (not wallet provider)
4. **Connect** with other developers showing interest

### Start a Small Project
Pick one to begin with:

**Option A: Validator Tool**
```bash
# Build a simple web tool
- Input: Any address format  
- Output: Parsed details + validation status
- Technologies: HTML + JavaScript, deploy on GitHub Pages
```

**Option B: Test Vectors**
```bash
# Create comprehensive test cases
- Valid addresses for each format
- Invalid addresses (should fail)  
- Edge cases and boundary conditions
- Cross-language compatibility tests
```

**Option C: Educational Content**
```bash
# Write a developer guide
- "Understanding SNIP-43 Address Formats"
- Code examples in multiple languages
- Common pitfalls and how to avoid them
```

## 🎯 Medium-Term Opportunities (Next Month)

### Reference Implementation
- Pick your strongest programming language
- Build complete, well-tested library with full SNIP-43 support
- Include comprehensive documentation and examples
- Coordinate with others to avoid duplicate work

### Integration Testing
- Help existing tools (block explorers, wallet SDKs) test integration
- Create compatibility matrices showing what works with what
- Build automated testing pipelines

### Developer Experience
- Create tools that make SNIP-43 adoption easier for other devs
- Focus on reducing friction and preventing common mistakes
- Build debugging and troubleshooting utilities

## 🌟 Your Unique Advantage

As a mid-level developer (not a wallet provider), you have unique value:

✅ **Focus on developer experience** without business constraints  
✅ **Build ecosystem-wide tools** that serve everyone  
✅ **Ask practical questions** that wallet teams might miss  
✅ **Create educational content** from a learner's perspective  
✅ **Test real-world edge cases** that matter to individual developers  
✅ **Bridge** between technical specs and practical implementation  

## 📞 Getting Help

**Resources:**
- [SNIP-43 Discussion Thread](https://community.starknet.io/t/snip-43-unified-bech32m-addresses-and-viewing-keys-for-starknet/116001)
- [Starknet Developer Discord](https://discord.gg/starknet) - #developer-chat
- [Starknet GitHub](https://github.com/starkware-libs) - Existing implementations for reference

**Questions to Ask:**
- "Has anyone started working on [language] implementation?"
- "What's the priority order for reference implementations?"
- "Are there specific integration patterns we should focus on?"
- "Who's coordinating the test vector repository?"

## 🚀 Impact Potential

Your contributions could:
- **Accelerate adoption** by making implementation easier for other developers
- **Improve security** by identifying edge cases and potential vulnerabilities early
- **Enhance UX** by thinking through real-world usage patterns
- **Build community** by coordinating between different implementation efforts
- **Shape the standard** by providing feedback during the draft phase

The best part: you don't need to be a wallet provider to make meaningful contributions. Some of the most valuable work happens in tooling, testing, documentation, and developer experience!

---

*This guide will be updated as SNIP-43 evolves. Last updated: January 2025*