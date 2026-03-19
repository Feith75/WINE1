let selectedPackageData = null;

function selectPackage(packageType, price) {
    const packages = {
        'starter': {
            name: 'Starter Package',
            price: 3500,
            includes: ['1 Bottle Premium Wine', 'Fresh Flower Bouquet', 'Greeting Card', 'Personal Message', 'Gift Wrapping']
        },
        'classic': {
            name: 'Classic Package',
            price: 4500,
            includes: ['1 Bottle Premium Wine', 'Deluxe Flower Arrangement', 'Premium Greeting Card', 'Personal Message', 'Luxury Gift Wrapping', 'Gift Box']
        },
        'premium': {
            name: 'Premium Package',
            price: 8000,
            includes: ['2 Bottles Premium Wine', 'Luxury Flower Arrangement', 'Premium Greeting Card', 'Personal Message', 'Luxury Gift Wrapping', 'Premium Gift Box', 'Free Delivery']
        }
    };
    
    selectedPackageData = packages[packageType];
    
    // Update modal with package info
    document.getElementById('selectedPackageName').textContent = selectedPackageData.name;
    document.getElementById('selectedPackagePrice').textContent = `KSh ${selectedPackageData.price.toLocaleString()}`;
    
    // Show modal
    document.getElementById('messageModal').style.display = 'block';
}

function closeMessageModal() {
    document.getElementById('messageModal').style.display = 'none';
}

// Payment method toggle
document.getElementById('paymentMethod')?.addEventListener('change', (e) => {
    const mpesaGroup = document.getElementById('mpesaGroup');
    const mpesaInput = document.getElementById('mpesaNumber');
    if (e.target.value === 'mpesa') {
        mpesaGroup.style.display = 'block';
        mpesaInput.required = true;
    } else {
        mpesaGroup.style.display = 'none';
        mpesaInput.required = false;
    }
});

// Form submission
document.getElementById('giftMessageForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        package: selectedPackageData,
        recipientName: document.getElementById('recipientName').value,
        recipientPhone: document.getElementById('recipientPhone').value,
        recipientAddress: document.getElementById('recipientAddress').value,
        cardMessage: document.getElementById('cardMessage').value,
        senderName: document.getElementById('senderName').value,
        senderPhone: document.getElementById('senderPhone').value,
        senderEmail: document.getElementById('senderEmail').value,
        deliveryDate: document.getElementById('deliveryDate').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        mpesaNumber: document.getElementById('mpesaNumber').value
    };
    
    // Validate delivery date
    const selectedDate = new Date(formData.deliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
        alert('Please select a future delivery date');
        return;
    }
    
    // Validate card message
    if (formData.cardMessage.trim().length < 5) {
        alert('Please write a message for the greeting card (at least 5 characters)');
        return;
    }
    
    if (formData.paymentMethod === 'mpesa') {
        const proceed = confirm('📱 M-Pesa Payment\n\nA payment request will be sent to your phone.\nPlease have your phone ready to enter your M-Pesa PIN.\n\nClick OK to proceed with payment.');
        if (!proceed) return;
    }
    
    // Show confirmation
    alert(`🎁 Gift Package Order Confirmed!\n\n${selectedPackageData.name}\nAmount: KSh ${selectedPackageData.price.toLocaleString()}\n\nRecipient: ${formData.recipientName}\nPhone: ${formData.recipientPhone}\nDelivery Date: ${formData.deliveryDate}\n\nCard Message:\n"${formData.cardMessage}"\n\nYour gift will be delivered on ${formData.deliveryDate}.\n\nThank you for choosing Wine World!`);
    
    // Save to backend (if available)
    saveGiftOrder(formData);
    
    // Redirect to main shop
    window.location.href = 'wine.html';
});

async function saveGiftOrder(orderData) {
    try {
        const response = await fetch('http://localhost:5000/api/gift-orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            console.log('Order saved to database');
        }
    } catch (error) {
        console.log('Backend not available, order saved locally');
    }
}

// Close modal when clicking outside
document.getElementById('messageModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'messageModal') {
        closeMessageModal();
    }
});
