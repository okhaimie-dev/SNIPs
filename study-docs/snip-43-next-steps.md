# SNIP-43: Next Steps for Community Contributors

A practical guide for developers looking to contribute to the Unified Bech32m Addresses and Viewing Keys proposal for Starknet.

## 🎯 Quick Context

**SNIP-43** proposes unified address formats (`strk`, `strkx`, `strku`) and viewing keys to prepare Starknet for future privacy features. This is an **Interface-only** proposal - no protocol changes required, making it accessible for community implementation.

## 🔍 Leveraging the Existing Bech32m Ecosystem

**Important Discovery**: Bech32m was originally created for Bitcoin SegWit addresses and has a **mature, battle-tested ecosystem** of libraries across multiple languages. You don't need to build Bech32m encoding from scratch!

### Existing Libraries You Can Build Upon:

**JavaScript/TypeScript:**
- [`bech32`](https://www.npmjs.com/package/bech32) - 1,619+ dependents, widely used in Bitcoin ecosystem
- [`@scure/base`](https://www.npmjs.com/package/@scure/base) - Audited, tree-shakeable, includes Bech32m support

**Python:**
- [`bech32`](https://pypi.org/project/bech32/) - Reference implementation from Bitcoin ecosystem

**Rust:**
- [`rust-bech32`](https://github.com/rust-bitcoin/rust-bech32) - Part of rust-bitcoin ecosystem

**What This Means for SNIP-43:**
Instead of implementing Bech32m from scratch, focus on:
1. **Adapting existing libraries** for Starknet-specific HRPs (`strk`, `strkx`, `strku`)
2. **Building the Starknet-specific logic** (TLV parsing, receiver selection, felt252 handling)
3. **Creating integration layers** that connect existing Bech32m libraries to Starknet tooling

## 🎓 Learning from Bitcoin Bech32m Implementations

**Study Successful Patterns**: The Bitcoin ecosystem has solved many problems you'll encounter with SNIP-43.

### Key Resources to Study:

**Bitcoin Address Format Evolution:**
- **BIP-173** (Bech32): Original specification - understand the design decisions
- **BIP-350** (Bech32m): The "m" improvement - why it was needed and how it differs
- **Real implementations**: Look at how major Bitcoin wallets handle address format transitions

### Specific Lessons to Apply:

**Address Validation Patterns:**
```javascript
// Bitcoin pattern you can adapt:
// 1. Use existing bech32m library for core encoding
// 2. Add network/format-specific validation on top
// 3. Handle edge cases they've already discovered

// Study how Bitcoin handles:
// - Mixed case rejection
// - Length limits (90 chars vs longer for Lightning)
// - HRP validation and network separation
// - Error messaging for invalid addresses
```

**User Experience Patterns:**
- How Bitcoin wallets display both legacy and Bech32 addresses during transition
- Copy/paste UX patterns for different address formats
- QR code handling for longer addresses
- Address book management with multiple formats per contact

**Testing Strategies:**
- Bitcoin's comprehensive test vector approach
- Cross-implementation compatibility testing
- Edge case discovery (they've found the weird bugs already!)

### Questions to Research:
- How did Bitcoin handle the legacy → Bech32 → Bech32m transitions?
- What UX patterns worked well for Bitcoin address format adoption?
- Which edge cases and validation errors occur most frequently?
- How do Bitcoin explorers handle dual address indexing?
- What performance optimizations exist for Bech32m encoding/decoding?

### Repositories to Study:
- [`bitcoinjs/bech32`](https://github.com/bitcoinjs/bech32) - Reference JavaScript implementation
- [`rust-bitcoin/rust-bech32`](https://github.com/rust-bitcoin/rust-bech32) - Production Rust implementation
- [`sipa/bech32`](https://github.com/sipa/bech32) - Original reference implementations
- Major Bitcoin wallets (Electrum, Bitcoin Core) - Real-world usage patterns

## 🎯 How to Contribute More Effectively

**Coordinate, Don't Duplicate**: The key to effective contribution is building on existing work and coordinating with others.

### Discovery Phase (Do This First!)

**Map What Already Exists:**
1. **Search for existing Starknet + Bech32 efforts**:
   - GitHub search: `"starknet" AND ("bech32" OR "bech32m")`
   - Discord/forum search for related discussions
   - Check if any wallet teams have started SNIP-42/43 work

2. **Test existing libraries with Starknet requirements**:
   ```bash
   # Example research tasks:
   npm install bech32
   # Can it handle 'strk' HRP? ✓
   # Does it support custom length limits? ✓
   # Can it handle the specific felt252 constraints? Test needed
   ```

3. **Study the SNIP discussion thread**: Look for:
   - Who's already expressed interest in implementing
   - Technical questions that need answers
   - Coordination efforts already underway

### Contribution Strategy Matrix

**High-Impact, Low-Duplication Opportunities:**

| Area | Approach | Why It's Effective |
|------|----------|-------------------|
| **Language-specific adapters** | Wrap existing Bech32m libs | Leverages proven code, fills specific gaps |
| **Cross-language test vectors** | Extend Bitcoin test patterns | Ensures compatibility, prevents bugs |
| **Integration examples** | Real wallet/app examples | Shows practical usage, accelerates adoption |
| **Developer tooling** | Address validators, converters | Reduces friction for other developers |
| **Documentation** | Migration guides, FAQs | Answers questions before they're asked |

**Lower-Impact (Still Valuable):**
- Building Bech32m from scratch (when good libraries exist)
- Creating isolated tools without ecosystem integration
- Working on areas others are already actively developing

### Community Engagement Best Practices

**In Forum Discussions:**
- Ask before building: "Has anyone started work on [specific area]?"
- Share your research: "I tested library X with Starknet HRPs, here are the results"
- Propose coordination: "I'm building Y, would anyone like to collaborate?"
- Document your progress: Regular updates prevent duplicate work

**When Contributing to Existing Projects:**
- **Upstream contributions**: Can you add Starknet support to existing Bech32m libraries?
- **Issue reporting**: Test libraries with SNIP-43 requirements, report gaps
- **Documentation**: Add examples showing how existing tools work with Starknet

**Starting New Projects:**
- **Announce early**: Share your plans before building
- **Build incrementally**: Release small, useful pieces quickly
- **Stay connected**: Regular updates to the community
- **Document everything**: Make it easy for others to build on your work

### Avoiding Common Pitfalls

**Don't:**
- Build in isolation without checking what exists
- Recreate well-established libraries from scratch
- Work on the same thing someone else just announced
- Create tools that only work for your specific use case

**Do:**
- Research thoroughly before starting
- Build on proven foundations when possible
- Coordinate with others working in similar areas
- Create reusable, well-documented solutions
- Ask questions early and often

### Finding Collaboration Opportunities

**Look for:**
- Developers asking questions you can answer
- Missing pieces in others' implementations
- Cross-language compatibility needs
- Integration gaps between existing tools

**Offer:**
- Testing and feedback on others' implementations
- Documentation and examples for technical work
- Coordination help between different efforts
- Specific technical expertise in your strongest areas

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

### 1. Starknet-Specific Implementations (Building on Existing Bech32m Libraries)

**Strategy:** Build Starknet address logic on top of existing, proven Bech32m implementations.

**High Priority Languages:**
- **JavaScript/TypeScript** - Critical for web wallet adoption
- **Python** - Backend services, tooling, and Starknet.py integration
- **Rust** - Performance-critical applications and infrastructure

**What to Build:**
```typescript
// Example: Starknet wrapper around existing bech32 library
import { bech32m } from 'bech32'; // Use existing library!

interface StarknetAddressUtils {
  // Core address encoding (leverages existing bech32m)
  encodePublic(address: felt252): string;          // -> strk1...
  encodeShielded(payload: Uint8Array): string;     // -> strkx1...
  encodeUnified(receivers: Receiver[]): string;    // -> strku1...

  // Starknet-specific logic (this is what you need to build)
  parseAddress(address: string): ParsedAddress;
  selectReceiver(ua: UnifiedAddress, capabilities: Capability[]): Receiver;
  validateFelt252(address: string): boolean;       // Starknet 251-bit validation
  parseTLV(data: Uint8Array): Receiver[];         // TLV parsing for unified addresses
}
```

**Research Phase:**
Before building, investigate:
- Which existing Bech32m library has the best API for your target language?
- Are there any Starknet-specific requirements the existing library doesn't handle?
- Can you contribute Starknet support upstream to existing libraries?

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

**Option A: Ecosystem Research & Mapping**
```bash
# Research existing Bech32m implementations
- Test existing libraries with Starknet HRPs (strk, strkx, strku)
- Document compatibility and gaps
- Create comparison matrix of existing libraries
- Identify which ones work out-of-the-box vs need adaptation
```

**Option B: Simple Validator Tool**
```bash
# Build a web tool using existing bech32m library
- Use npm's 'bech32' package as foundation
- Add Starknet-specific validation (felt252, TLV parsing)
- Input: Any address format
- Output: Parsed details + validation status
- Technologies: HTML + JavaScript + existing bech32 library
```

**Option C: Library Wrapper/Adapter**
```bash
# Create Starknet wrapper around existing library
- Pick one existing library (e.g., npm 'bech32' package)
- Add Starknet HRP support (strk, strkx, strku)
- Add felt252 validation logic
- Create simple test cases
- Publish as utility package
```

**Option D: Test Vector Creation**
```bash
# Create comprehensive test cases
- Use existing Bitcoin test vectors as reference
- Generate Starknet-specific test cases
- Cross-language compatibility tests using existing libraries
- Edge cases and boundary conditions
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

## 📞 Getting Help

**Resources:**
- [SNIP-43 Discussion Thread](https://community.starknet.io/t/snip-43-unified-bech32m-addresses-and-viewing-keys-for-starknet/116001)
- [Starknet Developer Discord](https://discord.gg/starknet) - #developer-chat
- [Starknet GitHub](https://github.com/starkware-libs) - Existing implementations for reference

## 🚀 Impact Potential

Your contributions could:
- **Accelerate adoption** by making implementation easier for other developers
- **Improve security** by identifying edge cases and potential vulnerabilities early
- **Enhance UX** by thinking through real-world usage patterns
- **Build community** by coordinating between different implementation efforts
- **Shape the standard** by providing feedback during the draft phase

The best part: you don't need to be a wallet provider to make meaningful contributions. Some of the most valuable work happens in tooling, testing, documentation, and developer experience!

---

*This guide will be updated as SNIP-43 evolves. Last updated: October 2025*
