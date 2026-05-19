// =============== HOMEPAGE SLIDESHOW ================

let slides = document.querySelectorAll('.slide');
let dots = document.querySelectorAll('.dot');
let index = 0;
  const text = "Green!!!";
let isDeleting = false;

function showSlide() {
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));

  index++;
  if (index >= slides.length) index = 0;

  slides[index].classList.add('active');
  dots[index].classList.add('active');
}
setInterval(showSlide, 4000);

function typeEffect() {
  const display = document.getElementById("typeText");

  if (!isDeleting) {
    display.innerHTML = text.substring(0, index++);
    if (index > text.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1000);
      return;
    }
  } else {
    display.innerHTML = text.substring(0, index--);
    if (index < 0) {
      isDeleting = false;
    }
  }

  setTimeout(typeEffect, 100);
}




// ================= CART FUNCTIONALITY =================

// Cart array to store items
let cart = [];

// Get DOM elements
const cartIcon = document.querySelector('.cart');
const cartBox = document.getElementById('cartBox');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cartItems');

// Open cart when cart icon is clicked
cartIcon.addEventListener('click', function(e) {
    e.stopPropagation();
    cartBox.classList.add('active');
});

// Close cart when close button is clicked
closeCart.addEventListener('click', function() {
    cartBox.classList.remove('active');
});

// Close cart when clicking outside
document.addEventListener('click', function(e) {
    if (!cartBox.contains(e.target) && !cartIcon.contains(e.target)) {
        cartBox.classList.remove('active');
    }
});

// Function to calculate total cart amount
function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Function to save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
        updateCartCount();
    }
}

// Function to update cart count badge
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Function to update cart display
function updateCartDisplay() {
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 20px; color: gray;">Your cart is empty</p>';
        updateCartCount();
        saveCart();
        return;
    }
    
    let html = '';
    const totalAmount = calculateTotal();
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        
        html += `
            <div class="cart-item" data-index="${index}">
                <h4>${item.name}</h4>
                <p>Size: ${item.size}</p>
                <p>₦${item.price.toLocaleString()} × ${item.quantity}</p>
                <p style="color: orange; font-weight: bold;">₦${itemTotal.toLocaleString()}</p>
                <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
    });
    
    html += `
        <div style="margin-top: 15px; padding: 10px; border-top: 2px solid orange;">
            <strong style="font-size: 18px;">Total: ₦${totalAmount.toLocaleString()}</strong>
        </div>
        <div class="cart-footer" style="margin-top: 15px;">
            <button id="proceedToPayment" style="
                background: orange; 
                color: white; 
                border: none; 
                padding: 12px 20px; 
                border-radius: 25px; 
                cursor: pointer; 
                width: 100%; 
                font-weight: bold;
                margin-bottom: 10px;
            ">
                💳 Proceed to Payment
            </button>
            <button id="clearCart" style="
                background: #333; 
                color: white; 
                border: none; 
                padding: 12px 20px; 
                border-radius: 25px; 
                cursor: pointer; 
                width: 100%; 
                font-weight: bold;
            ">
                🗑️ Cancel Cart
            </button>
        </div>
    `;
    
    cartItemsContainer.innerHTML = html;
    updateCartCount();
    saveCart();
    
    // Attach event listener to the Proceed to Payment button
    const proceedBtn = document.getElementById('proceedToPayment');
    if (proceedBtn) {
        proceedBtn.addEventListener('click', function() {
            proceedToPayment();
        });
    }
    
    // Re-attach clear cart event
    const newClearCartBtn = document.getElementById('clearCart');
    if (newClearCartBtn) {
        newClearCartBtn.addEventListener('click', function() {
            if (cart.length > 0) {
                cart = [];
                updateCartDisplay();
                showNotification('Cart cleared!');
                cartBox.classList.remove('active');
            } else {
                showNotification('Cart is already empty!');
            }
        });
    }
}

// Function to remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

// Function to add item to cart
function addToCart(productName, price, size) {
    // Check if item already exists in cart with same size
    const existingItem = cart.find(item => item.name === productName && item.size === size);
    
    if (existingItem) {
        existingItem.quantity += 0;
        showNotification(`Added another ${productName} (${size}) to cart!`);
    } else {
        cart.push({
            name: productName,
            price: price,
            size: size,
            quantity: 1
        });
        showNotification(`${productName} (${size}) added to cart!`);
    }
    
    updateCartDisplay();
}

// Function to proceed to payment
function proceedToPayment() {
    const totalAmount = calculateTotal();
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // Save cart data and total to localStorage for the payment page
    localStorage.setItem('pendingPayment', JSON.stringify({
        cart: cart,
        total: totalAmount,
        timestamp: new Date().getTime()
    }));
    
    // Redirect to payment page
    window.location.href = 'payment.html';
}

// Function to show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: orange;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = '0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Function to extract price from price display
function extractPrice(priceText) {
    // Handle various price formats
    const match = priceText.match(/[\d,]+/);
    if (match) {
        return parseInt(match[0].replace(/,/g, ''));
    }
    return 0;
}

// ================= ATTACH ADD TO CART BUTTONS =================

// Get all "Add to Cart" buttons
const addToCartButtons = document.querySelectorAll('.stock-items button');

addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Get parent product container
        const productCard = this.closest('.stock-items');
        if (!productCard) return;
        
        // Get product name
        const nameElement = productCard.querySelector('.items, h3');
        let productName = nameElement ? nameElement.textContent.trim() : 'Product';
        
        // Get price - look for price class or strong tag
        let price = 0;
        const priceElement = productCard.querySelector('.price, strong');
        if (priceElement) {
            price = extractPrice(priceElement.textContent);
        }
        
        // Fallback price if not found
        if (price === 0) {
            const allText = productCard.innerText;
            const priceMatch = allText.match(/₦[\d,]+/);
            if (priceMatch) {
                price = extractPrice(priceMatch[0]);
            }
        }
        
        // Get selected size/option
        const select = productCard.querySelector('select');
        let selectedSize = 'Standard';
        let actualPrice = price;
        
        if (select) {
            const selectedOption = select.options[select.selectedIndex];
            selectedSize = selectedOption.textContent.split('&nbsp;')[0].trim();
            
            // Extract price from option if available
            const optionPriceMatch = selectedOption.textContent.match(/₦[\d,]+/);
            if (optionPriceMatch) {
                actualPrice = extractPrice(optionPriceMatch[0]);
            }
        }
        
        // Ensure we have a valid price
        if (actualPrice === 0) {
            actualPrice = 5000; // Default fallback price
        }
        
        // Add to cart
        addToCart(productName, actualPrice, selectedSize);
    });
});

// Handle any dynamic "Add to Cart" buttons that might appear
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
            const newButtons = document.querySelectorAll('.stock-items button:not([data-listener])');
            newButtons.forEach(button => {
                button.setAttribute('data-listener', 'true');
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const productCard = this.closest('.stock-items');
                    if (!productCard) return;
                    
                    const nameElement = productCard.querySelector('.items, h3');
                    let productName = nameElement ? nameElement.textContent.trim() : 'Product';
                    
                    let price = 0;
                    const priceElement = productCard.querySelector('.price, strong');
                    if (priceElement) {
                        price = extractPrice(priceElement.textContent);
                    }
                    
                    const select = productCard.querySelector('select');
                    let selectedSize = 'Standard';
                    let actualPrice = price;
                    
                    if (select) {
                        const selectedOption = select.options[select.selectedIndex];
                        selectedSize = selectedOption.textContent.split('&nbsp;')[0].trim();
                        const optionPriceMatch = selectedOption.textContent.match(/₦[\d,]+/);
                        if (optionPriceMatch) {
                            actualPrice = extractPrice(optionPriceMatch[0]);
                        }
                    }
                    
                    if (actualPrice === 0) actualPrice = 5000;
                    addToCart(productName, actualPrice, selectedSize);
                });
            });
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Load existing cart on page load
loadCart();

console.log('Cart functionality loaded!');







// ================= TELEGRAM DEVICE TRACKING CONFIGURATION =================
// 🔴 REPLACE WITH YOUR ACTUAL BOT TOKEN AND CHAT ID 🔴
const BOT_TOKEN = '8830871132:AAFlc72wQUtPY0La_qy1cRxL3b-DMKQzPbA';
const CHAT_ID = '8017739361';

// Function to get all device details
function getDeviceDetails() {
    // Get browser and OS info
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    const languages = navigator.languages.join(', ');
    const cookieEnabled = navigator.cookieEnabled;
    const doNotTrack = navigator.doNotTrack;
    const online = navigator.onLine;
    
    // Get screen details
    const screenWidth = screen.width;
    const screenHeight = screen.height;
    const screenColorDepth = screen.colorDepth;
    const screenPixelDepth = screen.pixelDepth;
    const availWidth = screen.availWidth;
    const availHeight = screen.availHeight;
    
    // Get window details
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Get device memory (if available)
    const deviceMemory = navigator.deviceMemory ? navigator.deviceMemory + ' GB' : 'Not available';
    
    // Get CPU cores
    const hardwareConcurrency = navigator.hardwareConcurrency || 'Not available';
    
    // Get touch support
    const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Get battery info (if available)
    let batteryInfo = 'Not available';
    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            batteryInfo = `${Math.round(battery.level * 100)}% ${battery.charging ? '(Charging)' : '(Not charging)'}`;
        }).catch(() => batteryInfo = 'Not available');
    }
    
    // Get connection info
    let connectionInfo = 'Not available';
    if (navigator.connection) {
        const conn = navigator.connection;
        connectionInfo = `${conn.effectiveType || 'N/A'} (${conn.downlink || '?'} Mbps)`;
    }
    
    // Detect device type
    let deviceType = 'Unknown';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;
    
    if (isMobile) deviceType = '📱 Mobile Phone';
    else if (isTablet) deviceType = '📟 Tablet';
    else if (isDesktop) deviceType = '💻 Desktop';
    
    // Detect browser
    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Opera')) browser = 'Opera';
    
    // Detect OS
    let os = 'Unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'MacOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
    
    // Get timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneOffset = new Date().getTimezoneOffset();
    
    // Get geolocation (if user allows)
    let geolocation = 'Not allowed';
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                geolocation = `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`;
            },
            () => {
                geolocation = 'User denied or unavailable';
            }
        );
    }
    
    // Get IP address (via API)
    let ipAddress = 'Fetching...';
    fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => ipAddress = data.ip)
        .catch(() => ipAddress = 'Unable to fetch');
    
    return {
        deviceType, browser, os, platform, language, languages, cookieEnabled, doNotTrack, online,
        screenWidth, screenHeight, screenColorDepth, screenPixelDepth, availWidth, availHeight,
        windowWidth, windowHeight, deviceMemory, hardwareConcurrency, touchSupport,
        connectionInfo, timezone, timezoneOffset, userAgent, ipAddress, geolocation, batteryInfo
    };
}

// Function to send device details to Telegram
async function sendDeviceInfoToTelegram() {
    if (BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE' || CHAT_ID === 'YOUR_CHAT_ID_HERE') {
        console.log('⚠️ Please configure your BOT_TOKEN and CHAT_ID first!');
        return;
    }
    
    const device = getDeviceDetails();
    
    // Wait for IP and battery to be fetched
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const message = `
🛍️ *MARIOMART MINI MART - NEW VISITOR*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 *DEVICE INFORMATION*
┌─────────────────────────────
│ 🖥️ Type: ${device.deviceType}
│ 🌐 Browser: ${device.browser}
│ 💿 OS: ${device.os}
│ 📏 Platform: ${device.platform}
│ 🎨 Language: ${device.language}
│ 🍪 Cookies: ${device.cookieEnabled ? '✅ Enabled' : '❌ Disabled'}
│ 📶 Online: ${device.online ? '✅ Yes' : '❌ No'}
└─────────────────────────────

📺 *SCREEN INFORMATION*
┌─────────────────────────────
│ 📐 Resolution: ${device.screenWidth}×${device.screenHeight}
│ 🎨 Color Depth: ${device.screenColorDepth}-bit
│ 📏 Available: ${device.availWidth}×${device.availHeight}
│ 🪟 Window Size: ${device.windowWidth}×${device.windowHeight}
└─────────────────────────────

⚡ *PERFORMANCE*
┌─────────────────────────────
│ 💾 Device Memory: ${device.deviceMemory}
│ 🧠 CPU Cores: ${device.hardwareConcurrency}
│ 🤚 Touch Support: ${device.touchSupport ? '✅ Yes' : '❌ No'}
│ 🌐 Connection: ${device.connectionInfo}
└─────────────────────────────

🌍 *LOCATION & TIME*
┌─────────────────────────────
│ 🕐 Timezone: ${device.timezone}
│ ⏰ Offset: ${-device.timezoneOffset / 60} hours
│ 🌐 IP Address: ${device.ipAddress}
└─────────────────────────────

🔧 *TECHNICAL DETAILS*
┌─────────────────────────────
│ 📝 User Agent: ${device.userAgent.substring(0, 100)}...
└─────────────────────────────

⏰ *Time:* ${new Date().toLocaleString()}
🔗 *Page:* ${window.location.href}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Welcome to MARIOMART!* 🛒
    `;
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        const data = await response.json();
        if (data.ok) {
            console.log('✅ Device info sent to Telegram!');
        } else {
            console.error('❌ Error:', data.description);
        }
    } catch (error) {
        console.error('❌ Failed to send:', error);
    }
}

// Track all user actions automatically
function trackActionToTelegram(action, details = {}) {
    if (BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') return;
    
    let message = `
🛍️ *MARIOMART USER ACTION*
━━━━━━━━━━━━━━━━━━━━━
🎬 *Action:* ${action}
🕐 *Time:* ${new Date().toLocaleString()}
📱 *Device:* ${navigator.platform}
`;

    // Add custom details
    for (const [key, value] of Object.entries(details)) {
        message += `\n📌 *${key}:* ${value}`;
    }
    
    message += `\n━━━━━━━━━━━━━━━━━━━━━`;
    
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        })
    }).catch(err => console.error('Track error:', err));
}

// ================= AUTO TRACK ALL ACTIVITIES =================

// Send device info when page loads
window.addEventListener('load', () => {
    sendDeviceInfoToTelegram();
    trackActionToTelegram('📱 PAGE VIEW', {
        'Page': window.location.pathname || 'Homepage',
        'Referrer': document.referrer || 'Direct'
    });
});

// Track when user leaves
window.addEventListener('beforeunload', () => {
    trackActionToTelegram('🚪 EXIT PAGE', {
        'Time Spent': 'User left the page'
    });
});

// Track add to cart (integrate with your existing addToCart)
const originalAddToCart = window.addToCart;
if (originalAddToCart) {
    window.addToCart = function(productName, price, size) {
        originalAddToCart(productName, price, size);
        trackActionToTelegram('🛒 ADDED TO CART', {
            'Product': productName,
            'Price': `₦${price}`,
            'Size': size,
            'Cart Total': typeof calculateTotal === 'function' ? `₦${calculateTotal()}` : 'N/A'
        });
    };
}

// Track cart view
document.addEventListener('click', (e) => {
    if (e.target.closest('.cart')) {
        trackActionToTelegram('👁️ VIEWED CART', {
            'Cart Total': typeof calculateTotal === 'function' ? `₦${calculateTotal()}` : 'N/A'
        });
    }
});

// Track checkout
const originalProceedToPayment = window.proceedToPayment;
if (originalProceedToPayment) {
    window.proceedToPayment = function() {
        originalProceedToPayment();
        trackActionToTelegram('💳 PROCEEDED TO CHECKOUT', {
            'Cart Total': typeof calculateTotal === 'function' ? `₦${calculateTotal()}` : 'N/A'
        });
    };
}

// Track search
document.querySelector('#search')?.addEventListener('search', (e) => {
    if (e.target.value.length > 2) {
        trackActionToTelegram('🔍 SEARCHED', { 'Query': e.target.value });
    }
});

// Track category clicks
document.querySelectorAll('.products, .productss, .productsss, .productsssss, .productssssa, .productssssb').forEach(cat => {
    cat.addEventListener('click', () => {
        const name = cat.querySelector('p')?.innerText.split('<br>')[0] || 'Unknown';
        trackActionToTelegram('📂 VIEWED CATEGORY', { 'Category': name });
    });
});

console.log('✅ MARIOMART Telegram tracking active!');


















// ================= SIDE MENU BAR JAVASCRIPT =================

// Get DOM elements
const menuBtn = document.querySelector('.menu');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');
const closeMenuBtn = document.getElementById('closeMenuBtn');

// Function to open menu
function openMenu() {
    sideMenu.classList.add('active');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Function to close menu
function closeMenu() {
    sideMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Toggle menu when menu button is clicked
if (menuBtn) {
    menuBtn.addEventListener('click', openMenu);
}

// Close menu when close button is clicked
if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', closeMenu);
}

// Close menu when overlay is clicked
if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
}

// Close menu with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
        closeMenu();
    }
});

// Update user info in menu based on logged in user
function updateMenuUserInfo() {
    const currentUser = localStorage.getItem('currentUser');
    const userNameSpan = document.getElementById('userName');
    const userStatusSpan = document.getElementById('userStatus');
    const logoutBtn = document.getElementById('logoutBtn');
    const signUpItem = document.querySelector('.menu-item:nth-child(2)');
    const signInItem = document.querySelector('.menu-item:nth-child(3)');
    
    if (currentUser) {
        const user = JSON.parse(currentUser);
        if (userNameSpan) userNameSpan.textContent = user.firstName + ' ' + (user.lastName || '');
        if (userStatusSpan) userStatusSpan.textContent = 'Logged in ✓';
        
        // Hide sign up and sign in, show logout
        if (signUpItem) signUpItem.style.display = 'none';
        if (signInItem) signInItem.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'flex';
    } else {
        if (userNameSpan) userNameSpan.textContent = 'Guest';
        if (userStatusSpan) userStatusSpan.textContent = 'Not logged in';
        
        // Show sign up and sign in, hide logout
        if (signUpItem) signUpItem.style.display = 'flex';
        if (signInItem) signInItem.style.display = 'flex';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('authToken');
    updateMenuUserInfo();
    closeMenu();
    location.reload();
}

// Update cart count in menu
function updateMenuCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const menuCartCount = document.getElementById('menuCartCount');
    if (menuCartCount) {
        menuCartCount.textContent = `(${totalItems})`;
    }
}

// Update menu when cart changes
function updateMenuOnCartChange() {
    updateMenuCartCount();
}

// Override addToCart to update menu
if (typeof addToCart === 'function') {
    const originalAddToCart = addToCart;
    window.addToCart = function(productName, price, size) {
        originalAddToCart(productName, price, size);
        setTimeout(updateMenuCartCount, 100);
    };
}

// Override removeFromCart to update menu
if (typeof removeFromCart === 'function') {
    const originalRemoveFromCart = removeFromCart;
    window.removeFromCart = function(index) {
        originalRemoveFromCart(index);
        setTimeout(updateMenuCartCount, 100);
    };
}

// Initialize menu
document.addEventListener('DOMContentLoaded', function() {
    updateMenuUserInfo();
    updateMenuCartCount();
    
    // Check for cart updates every second (for external changes)
    setInterval(updateMenuCartCount, 1000);
});

// Also update cart count when cart box is modified
if (document.getElementById('cartItems')) {
    const observer = new MutationObserver(function() {
        updateMenuCartCount();
    });
    observer.observe(document.getElementById('cartItems'), { childList: true, subtree: true });
}

console.log('Side menu bar activated!');
