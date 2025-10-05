# 🧪 How to Test Cart Functionality - Step by Step

## 🚀 **Quick Start**

### **1. Make Sure Servers Are Running**

**Backend:**
```bash
cd server
npm run dev
```
Should see: `Server running on port 5000`

**Frontend:**
```bash
npm run dev
```
Should see: `Local: http://localhost:5174/`

---

## ✅ **Test 1: Add Single Product to Cart**

### **Steps:**
1. Open browser: `http://localhost:5174/`
2. Scroll down to the product grid
3. Find any product (e.g., "Wireless Headphones")
4. Click the **"+ Add to Cart"** button

### **Expected Results:**
- ✅ Alert popup: "✅ Wireless Headphones added to cart!"
- ✅ Cart icon in navigation shows badge with "1"
- ✅ Console log: "✅ Added Wireless Headphones to cart"
- ✅ Console log: "🛒 ADD_TO_CART action: {...}"

### **Screenshot Checklist:**
- [ ] Alert message appears
- [ ] Cart badge shows "1"
- [ ] Console shows success logs

---

## ✅ **Test 2: View Cart Items**

### **Steps:**
1. After adding a product, click the **cart icon** in the top navigation
2. Cart sidebar should slide in from the right

### **Expected Results:**
- ✅ Cart sidebar opens
- ✅ Product image displays
- ✅ Product name displays
- ✅ Product price displays (₹299.99)
- ✅ Quantity shows "1"
- ✅ Total price shows at bottom
- ✅ "Proceed to Checkout" button is visible

### **Screenshot Checklist:**
- [ ] Cart sidebar is open
- [ ] Product details are visible
- [ ] Quantity controls (-, 1, +) are visible
- [ ] Total price is correct

---

## ✅ **Test 3: Update Quantity**

### **Steps:**
1. In the cart sidebar, find the quantity controls
2. Click the **"+"** button to increase quantity
3. Click the **"-"** button to decrease quantity

### **Expected Results:**
- ✅ Quantity increases when clicking "+"
- ✅ Quantity decreases when clicking "-"
- ✅ Total price updates automatically
- ✅ If quantity reaches 0, item is removed from cart

### **Screenshot Checklist:**
- [ ] Quantity changes in real-time
- [ ] Total price updates correctly
- [ ] Item removes when quantity = 0

---

## ✅ **Test 4: Add Multiple Products**

### **Steps:**
1. Close the cart sidebar
2. Add a different product (e.g., "Smart Watch")
3. Add another product (e.g., "Yoga Mat")
4. Open cart sidebar

### **Expected Results:**
- ✅ Cart badge shows "3" (or total quantity)
- ✅ All 3 products appear in cart
- ✅ Each product has its own quantity
- ✅ Total price is sum of all items

### **Screenshot Checklist:**
- [ ] Multiple products visible in cart
- [ ] Each has correct image and details
- [ ] Total price is accurate

---

## ✅ **Test 5: Add Same Product Twice**

### **Steps:**
1. Add "Wireless Headphones" to cart
2. Add "Wireless Headphones" again
3. Open cart sidebar

### **Expected Results:**
- ✅ Only ONE entry for "Wireless Headphones"
- ✅ Quantity shows "2" (not two separate items)
- ✅ Price is multiplied by quantity

### **Screenshot Checklist:**
- [ ] No duplicate products
- [ ] Quantity increased instead

---

## ✅ **Test 6: Cart Persistence**

### **Steps:**
1. Add several products to cart
2. Note the items and quantities
3. **Refresh the page** (F5 or Ctrl+R)
4. Open cart sidebar

### **Expected Results:**
- ✅ All cart items are still there
- ✅ Quantities are preserved
- ✅ Total price is correct

### **Screenshot Checklist:**
- [ ] Cart items persist after refresh
- [ ] No data loss

---

## ✅ **Test 7: Empty Cart**

### **Steps:**
1. Remove all items from cart (decrease quantity to 0)
2. Cart should be empty

### **Expected Results:**
- ✅ Cart shows "Your cart is empty" message
- ✅ Shopping bag icon displayed
- ✅ "Add some amazing products to get started!" text
- ✅ Cart badge disappears or shows "0"

### **Screenshot Checklist:**
- [ ] Empty cart message displays
- [ ] No products visible

---

## ✅ **Test 8: Checkout (Not Logged In)**

### **Steps:**
1. Add products to cart
2. Open cart sidebar
3. Click **"Proceed to Checkout"** button

### **Expected Results:**
- ✅ Button shows "🔐 Login to Checkout"
- ✅ Button is disabled (grayed out)
- ✅ Alert: "Please login to proceed with checkout"

### **Screenshot Checklist:**
- [ ] Checkout button is disabled
- [ ] Login message appears

---

## ✅ **Test 9: Checkout (Logged In)**

### **Steps:**
1. Login with test account:
   - Email: `user@example.com`
   - Password: `user123`
2. Add products to cart
3. Open cart sidebar
4. Click **"🛒 Proceed to Checkout"** button

### **Expected Results:**
- ✅ Button is enabled (colorful)
- ✅ Checkout modal opens
- ✅ Can proceed with order

### **Screenshot Checklist:**
- [ ] Checkout button is enabled
- [ ] Checkout modal opens

---

## ✅ **Test 10: Cart After Logout**

### **Steps:**
1. Login and add products to cart
2. Logout
3. Check cart

### **Expected Results:**
- ✅ Cart is cleared
- ✅ Cart shows empty state
- ✅ Cart badge shows "0" or disappears

### **Screenshot Checklist:**
- [ ] Cart is empty after logout
- [ ] No items remain

---

## 🐛 **Debugging Guide**

### **If "Add to Cart" Does Nothing:**

1. **Open Browser Console (F12)**
   - Look for JavaScript errors (red text)
   - Check if `handleAddToCart` is defined

2. **Check Console Logs:**
   - Should see: "✅ Added [Product] to cart"
   - Should see: "🛒 ADD_TO_CART action: {...}"
   - If not, the function isn't being called

3. **Verify ProductGrid has onAdd prop:**
   ```javascript
   // In browser console:
   console.log(document.querySelector('.add-btn'));
   ```

### **If Cart Shows Empty But Items Were Added:**

1. **Check localStorage:**
   ```javascript
   // In browser console:
   console.log(JSON.parse(localStorage.getItem('elitestore_cart')));
   ```

2. **Check product IDs match:**
   ```javascript
   // In browser console:
   const cart = JSON.parse(localStorage.getItem('elitestore_cart'));
   console.log('Cart product IDs:', cart.map(item => item.productId));
   
   // Then check products
   console.log('Available products:', window.__REACT_DEVTOOLS_GLOBAL_HOOK__);
   ```

3. **Look for warning in console:**
   - "⚠️ Product not found for cart item: [ID]"
   - This means ID mismatch

### **If Quantities Don't Update:**

1. **Check if dispatch is working:**
   ```javascript
   // In browser console:
   localStorage.getItem('elitestore_cart');
   ```

2. **Clear cache and try again:**
   ```javascript
   localStorage.clear();
   location.reload();
   ```

### **If Total Price is Wrong:**

1. **Check product prices:**
   - Verify prices in database match frontend
   - Check if price is a number, not string

2. **Check calculation:**
   ```javascript
   // In Cart.jsx, getTotalPrice function
   // Should multiply price * quantity for each item
   ```

---

## 📊 **Expected Console Output**

### **When Adding Product:**
```
✅ Products loaded from MongoDB: 8
✅ Added Wireless Headphones to cart
🛒 ADD_TO_CART action: {
  productId: "68e1f61655a3018ab5651571",
  quantity: 1,
  existingItem: undefined,
  productFound: true,
  currentCartLength: 0
}
🛒 New cart length: 1
```

### **When Opening Cart:**
```
(No errors)
(Products should render)
```

### **If Product Not Found:**
```
⚠️ Product not found for cart item: 68e1f61655a3018ab5651571
Available product IDs: ["68e1f61655a3018ab5651571", "68e1f61655a3018ab5651572", ...]
```

---

## 🎯 **Success Checklist**

After testing, you should be able to:

- [x] Click "Add to Cart" and see success message
- [x] View cart items in sidebar
- [x] See product images, names, and prices
- [x] Increase/decrease quantities
- [x] Add multiple different products
- [x] Add same product multiple times (quantity increases)
- [x] See correct total price
- [x] Cart persists after page refresh
- [x] Cart clears after logout
- [x] Checkout button works (when logged in)
- [x] Empty cart shows appropriate message

---

## 🎉 **All Tests Passed?**

**Congratulations! Your cart is fully functional!** 🎊

You can now:
- Browse products
- Add to cart
- Manage quantities
- Proceed to checkout
- Complete orders

---

## 📸 **Screenshot Guide**

Take screenshots of:
1. Product grid with "Add to Cart" buttons
2. Alert message after adding product
3. Cart sidebar with items
4. Quantity controls
5. Multiple products in cart
6. Total price calculation
7. Empty cart state
8. Checkout button (logged in vs logged out)

---

## 🔗 **Quick Links**

- **Frontend:** http://localhost:5174/
- **Database Test:** http://localhost:5174/db-test
- **Backend API:** http://localhost:5000/api/products
- **API Health:** http://localhost:5000/api/health

---

**Happy Testing! 🚀**