// Get Directions function
function getDirections() {
    const destination = '9 St Patrick Street, Edinburgh, EH8 9HB, UK';
    const encodedDestination = encodeURIComponent(destination);
    
    // Open Google Maps with directions from user's current location
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`;
    window.open(mapsUrl, '_blank');
}

// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dot');
const totalSlides = slides.length;
let autoPlayInterval;

function showSlide(n, direction = 'next') {
    // Remove all classes from current slide
    slides[currentSlide].classList.remove('active', 'prev');
    dots[currentSlide].classList.remove('active');
    
    // Calculate new slide index with proper wrapping
    if (n >= totalSlides) {
        currentSlide = 0;
    } else if (n < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = n;
    }
    
    // Clean up all slides first
    slides.forEach((slide, index) => {
        if (index !== currentSlide) {
            slide.classList.remove('active', 'prev');
            slide.style.opacity = '0';
            slide.style.transform = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';
        }
    });
    
    // Set up next slide position
    slides[currentSlide].style.transform = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';
    slides[currentSlide].style.opacity = '0';
    
    // Force reflow
    slides[currentSlide].offsetHeight;
    
    // Activate new slide
    slides[currentSlide].classList.add('active');
    slides[currentSlide].style.transform = 'translateX(0)';
    slides[currentSlide].style.opacity = '1';
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1, 'next');
}

function prevSlide() {
    showSlide(currentSlide - 1, 'prev');
}

function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(nextSlide, 5000);
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
}

// Arrow button event listeners
document.querySelector('.carousel-arrow.next').addEventListener('click', () => {
    nextSlide();
    startAutoPlay();
});

document.querySelector('.carousel-arrow.prev').addEventListener('click', () => {
    prevSlide();
    startAutoPlay();
});

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        const direction = index > currentSlide ? 'next' : 'prev';
        showSlide(index, direction);
        startAutoPlay();
    });
});

// Start auto-advance carousel
startAutoPlay();

// Booking form functionality
let selectedSeating = '';

function toggleBookingForm() {
    const form = document.getElementById('bookingForm');
    const overlay = document.getElementById('bookingOverlay');
    const confirmation = document.getElementById('bookingConfirmation');
    
    confirmation.classList.remove('active');
    form.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Set minimum date to today
    const dateInput = document.getElementById('bookingDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    
    // Prevent body scroll when popup is open
    if (form.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeBookingForm() {
    const form = document.getElementById('bookingForm');
    const overlay = document.getElementById('bookingOverlay');
    
    form.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function selectSeating(element, type) {
    // Remove selected class from all options
    document.querySelectorAll('.seating-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    // Add selected class to clicked option
    element.classList.add('selected');
    selectedSeating = type;
}

function submitBooking() {
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;
    const guests = document.getElementById('guestCount').value;
    const name = document.getElementById('guestName').value;
    const email = document.getElementById('guestEmail').value;

    if (!selectedSeating || !date || !time || !guests || !name || !email) {
        alert('Please fill in all fields');
        return;
    }

    // Close popup
    closeBookingForm();
    
    // Show confirmation
    document.getElementById('bookingConfirmation').classList.add('active');

    // Reset form
    setTimeout(() => {
        document.getElementById('bookingForm').reset();
        document.querySelectorAll('.seating-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        selectedSeating = '';
        document.getElementById('bookingConfirmation').classList.remove('active');
    }, 3000);
}

function submitNewsletter() {
    const email = document.getElementById('newsletterEmail').value;
    const consent = document.getElementById('newsletterConsent').checked;

    if (!email) {
        alert('Please enter your email address');
        return;
    }

    if (!consent) {
        alert('Please agree to receive our newsletter');
        return;
    }

    // Show confirmation
    document.getElementById('signupConfirmation').classList.add('active');

    // Reset form
    setTimeout(() => {
        document.getElementById('newsletterEmail').value = '';
        document.getElementById('newsletterConsent').checked = false;
        document.getElementById('signupConfirmation').classList.remove('active');
    }, 3000);
}
