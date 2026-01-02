// Get Directions function
function getDirections() {
    const destination = '9 St Patrick Street, Edinburgh, EH8 9HB, UK';
    const encodedDestination = encodeURIComponent(destination);
    
    // Open Google Maps with directions from user's current location
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`;
    window.open(mapsUrl, '_blank');
}

// Carousel functionality for multiple carousels
class CarouselManager {
    constructor(carouselNumber) {
        this.carouselNumber = carouselNumber;
        this.currentSlide = 0;
        this.slides = document.querySelectorAll(`[data-carousel="${carouselNumber}"].carousel-track .carousel-slide`);
        this.dots = document.querySelectorAll(`[data-carousel="${carouselNumber}"].carousel-nav .carousel-dot`);
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        // Arrow button event listeners
        const nextBtn = document.querySelector(`.carousel-arrow.next[data-carousel="${this.carouselNumber}"]`);
        const prevBtn = document.querySelector(`.carousel-arrow.prev[data-carousel="${this.carouselNumber}"]`);
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.startAutoPlay();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.startAutoPlay();
            });
        }
        
        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const direction = index > this.currentSlide ? 'next' : 'prev';
                this.showSlide(index, direction);
                this.startAutoPlay();
            });
        });
        
        // Start auto-advance
        this.startAutoPlay();
    }
    
    showSlide(n, direction = 'next') {
        // Remove all classes from current slide
        this.slides[this.currentSlide].classList.remove('active', 'prev');
        this.dots[this.currentSlide].classList.remove('active');
        
        // Calculate new slide index with proper wrapping
        if (n >= this.totalSlides) {
            this.currentSlide = 0;
        } else if (n < 0) {
            this.currentSlide = this.totalSlides - 1;
        } else {
            this.currentSlide = n;
        }
        
        // Clean up all slides first
        this.slides.forEach((slide, index) => {
            if (index !== this.currentSlide) {
                slide.classList.remove('active', 'prev');
                slide.style.opacity = '0';
                slide.style.transform = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';
            }
        });
        
        // Set up next slide position
        this.slides[this.currentSlide].style.transform = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';
        this.slides[this.currentSlide].style.opacity = '0';
        
        // Force reflow
        this.slides[this.currentSlide].offsetHeight;
        
        // Activate new slide
        this.slides[this.currentSlide].classList.add('active');
        this.slides[this.currentSlide].style.transform = 'translateX(0)';
        this.slides[this.currentSlide].style.opacity = '1';
        this.dots[this.currentSlide].classList.add('active');
    }
    
    nextSlide() {
        this.showSlide(this.currentSlide + 1, 'next');
    }
    
    prevSlide() {
        this.showSlide(this.currentSlide - 1, 'prev');
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// Initialize all three carousels
const carousel1 = new CarouselManager(1);
const carousel2 = new CarouselManager(2);
const carousel3 = new CarouselManager(3);

// Booking form functionality
let selectedSeating = '';

function toggleBookingForm() {
    const popup = document.getElementById('bookingPopup');
    const overlay = document.getElementById('bookingOverlay');
    const confirmation = document.getElementById('bookingConfirmation');
    
    confirmation.classList.remove('active');
    popup.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Set minimum date to today
    const dateInput = document.getElementById('bookingDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    
    // Prevent body scroll when popup is open
    if (popup.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeBookingForm() {
    const popup = document.getElementById('bookingPopup');
    const overlay = document.getElementById('bookingOverlay');
    
    popup.classList.remove('active');
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

    // Hide the form fields
    const formGroups = document.querySelectorAll('#bookingPopup .form-group, #bookingPopup .submit-booking, #bookingPopup h3');
    formGroups.forEach(element => {
        element.style.display = 'none';
    });
    
    // Show confirmation inside the popup
    document.getElementById('bookingConfirmation').classList.add('active');

    // Reset and close after 3 seconds
    setTimeout(() => {
        closeBookingForm();
        
        // Reset form and show form fields again
        const bookingForm = document.querySelector('#bookingPopup');
        bookingForm.querySelectorAll('input[type="text"], input[type="email"], input[type="date"], select').forEach(input => {
            input.value = '';
        });
        
        document.querySelectorAll('.seating-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        selectedSeating = '';
        
        document.getElementById('bookingConfirmation').classList.remove('active');
        
        // Show form fields again
        formGroups.forEach(element => {
            element.style.display = '';
        });
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

// Close popup when clicking outside
document.addEventListener('click', (e) => {
    const popup = document.getElementById('bookingPopup');
    const overlay = document.getElementById('bookingOverlay');
    
    if (e.target === overlay) {
        closeBookingForm();
    }
});
