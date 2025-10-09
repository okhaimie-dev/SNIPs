# Test Locally - Starknet Address Validator

This guide helps you test the Starknet Address Validator locally to verify that all functionality works correctly, especially the **fixed test vector generation**.

## 🚀 Quick Test Setup

### 1. Start the Application

```bash
cd SNIPs/starknet-address-validator

# Install dependencies (if not done)
npm install

# Option A: Development server (if Node.js 20.19+)
npm run dev

# Option B: Preview built version
npm run build
npm run preview

# Option C: Simple HTTP server (any directory)
cd dist
python -m http.server 8000
# or
npx serve .
```

### 2. Open in Browser

- Development: `http://localhost:5173`
- Preview: `http://localhost:4173` 
- HTTP server: `http://localhost:8000`

## ✅ Test Cases to Verify

### **Fixed Issue: Test Vector Generation**

**Before Fix**: Generated placeholder addresses like:
- `strk1test...` ❌
- `strkx1test...` ❌ 
- `strku1test...` ❌

**After Fix**: Generates valid Bech32m encoded addresses like:
- `strk1qp5x7w8y...` ✅
- `strkx1qq2h4k9m...` ✅
- `strku1qqs8f6v2...` ✅

### **Test Steps**

1. **Click "Generate" buttons** in the "Supported Address Formats" section
2. **Verify each generates a VALID address** (green checkmark ✅)
3. **Check format detection** works correctly
4. **Test multiple generations** to ensure randomness

### **Expected Results**

| Format | Generated Prefix | Validation Status | Format Detection |
|--------|-----------------|-------------------|------------------|
| Legacy | `0x...` | ✅ Valid | `legacy` |
| Public | `strk1...` | ✅ Valid | `public` |
| Shielded | `strkx1...` | ✅ Valid | `shielded` |
| Unified | `strku1...` | ✅ Valid | `unified` |

## 🧪 Comprehensive Test Suite

### 1. **Address Format Detection**

Test these addresses to verify format detection:

```
Input: 0x1234567890abcdef
Expected: Format = "legacy"

Input: strk1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqfc6h6a
Expected: Format = "public"

Input: strkx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq7cs4az
Expected: Format = "shielded"

Input: strku1qqqqqsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqh9k5w4
Expected: Format = "unified"

Input: invalid-address
Expected: Format = "unknown"
```

### 2. **Validation Logic**

#### **Valid Legacy Address**
```
Input: 0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
Expected: ✅ Valid
- Format: legacy
- Canonical: 0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
```

#### **Invalid Legacy Addresses**
```
Input: 0x
Expected: ❌ Invalid - "Address cannot be empty after 0x"

Input: 0xgg
Expected: ❌ Invalid - "Address contains invalid hexadecimal characters"

Input: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123
Expected: ❌ Invalid - "Address is too long (max 64 hex characters)"
```

#### **Generated SNIP Addresses**
Click each "Generate" button and verify:
- ✅ Shows "Valid" status
- ✅ Displays correct format type
- ✅ Shows parsed components (HRP, version, payload)
- ✅ Copy buttons work
- ✅ Technical details expand properly

### 3. **User Interface Testing**

#### **Input Component**
- [ ] Paste button works
- [ ] Clear button works
- [ ] Character count displays
- [ ] Real-time validation
- [ ] Mobile responsive

#### **Results Component**
- [ ] Valid/Invalid status clear
- [ ] Format badges display correctly
- [ ] Error messages are helpful
- [ ] Copy buttons work
- [ ] Technical details expandable
- [ ] JSON export works

#### **Responsive Design**
Test on different screen sizes:
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### 4. **Copy Functionality**

Test all copy buttons:
- [ ] Copy Address
- [ ] Copy Canonical Address (legacy)
- [ ] Copy HRP (SNIP formats)
- [ ] Copy Raw Payload
- [ ] Copy JSON
- [ ] Copy confirmation appears

## 🔍 Debug Information

### **Browser Console**

Open browser dev tools (F12) and check for:
- ❌ No JavaScript errors
- ❌ No failed network requests
- ❌ No warning messages

### **Generated Address Analysis**

For each generated address, verify in the UI:

**Public Address Example:**
```
Format: public
HRP: strk
Version: 1
Canonical Address: 0x...
Payload size: 33 bytes (1 version + 32 address)
```

**Unified Address Example:**
```
Format: unified  
HRP: strku
Version: 1
Receivers: 1
- Type 0: Public key receiver
Payload size: 35 bytes (1 version + 1 type + 1 length + 32 data)
```

## 🐛 Troubleshooting

### **Common Issues**

1. **"Invalid" results for generated addresses**
   - ✅ **FIXED**: Test vector generation now creates valid Bech32m addresses
   - Verify you're using the updated code

2. **Build errors**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

3. **Dev server not starting**
   - Upgrade Node.js to 20.19+ or use `npm run preview`

4. **Copy buttons not working**
   - Try HTTPS (clipboard API requires secure context)
   - Check browser permissions

### **Performance Verification**

- [ ] Validation completes in <100ms
- [ ] No lag when typing
- [ ] Smooth animations
- [ ] Fast copy operations

## ✨ Success Criteria

Your local test is successful if:

1. **✅ All generated test vectors are VALID**
2. **✅ Format detection works correctly**  
3. **✅ Copy functionality works**
4. **✅ Mobile interface is usable**
5. **✅ No console errors**
6. **✅ Real-time validation is responsive**

## 📊 Test Results Template

Use this template to document your test results:

```
## Test Results - [Date]

### Test Vector Generation
- Legacy: ✅/❌ [Generated address]
- Public: ✅/❌ [Generated address] 
- Shielded: ✅/❌ [Generated address]
- Unified: ✅/❌ [Generated address]

### Format Detection  
- Legacy detection: ✅/❌
- Public detection: ✅/❌
- Shielded detection: ✅/❌
- Unified detection: ✅/❌
- Unknown detection: ✅/❌

### User Interface
- Input component: ✅/❌
- Results display: ✅/❌
- Copy functionality: ✅/❌
- Mobile responsive: ✅/❌

### Performance
- Validation speed: ✅/❌ (<100ms)
- No console errors: ✅/❌
- Smooth interactions: ✅/❌

### Overall Status: ✅ PASS / ❌ FAIL
```

## 🎯 Key Fix Verification

**The main issue was**: Test vector generation created placeholder addresses (`strk1test...`) that failed validation.

**The fix implemented**: Real Bech32m encoding with:
- Proper version bytes
- Valid payload construction
- Felt252 constraint compliance
- Correct TLV structure for unified addresses

**To verify the fix works**:
1. Click any "Generate" button
2. Confirm the result shows ✅ "Valid" 
3. Check that format detection works
4. Verify all parsed components display correctly

If you see ❌ "Invalid" for generated addresses, the fix hasn't been applied correctly.

---

**🎉 Happy Testing!**

This comprehensive test suite ensures the Starknet Address Validator works correctly and that the test vector generation issue has been resolved.