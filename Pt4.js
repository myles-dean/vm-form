
// Validation Manager Class
window.ValidationManager = class ValidationManager {
    constructor(instance) {
        this.instance = instance;
    }

    validateCurrentQuestion() {
        // Contact information validation
        if (this.instance.currentQuestion === 1) {
            const churchName = document.getElementById('churchName');
            const contactName = document.getElementById('contactName');
            const contactEmail = document.getElementById('contactEmail');
            const contactPhone = document.getElementById('contactPhone');
            
            if (churchName && contactName && contactEmail && contactPhone) {
                if (!churchName.value.trim() || !contactName.value.trim() || 
                    !contactEmail.value.trim() || !contactPhone.value.trim()) {
                    return false;
                }
                
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(contactEmail.value.trim())) {
                    return false;
                }
            }
        }

        // Radio/checkbox validation for questions 2-7
        if (this.instance.currentQuestion >= 2 && this.instance.currentQuestion <= 7) {
            const currentSlide = document.querySelector(`.question-slide[data-question="${this.instance.currentQuestion}"]`);
            if (currentSlide) {
                const radioInputs = currentSlide.querySelectorAll('input[type="radio"]:checked');
                const checkboxInputs = currentSlide.querySelectorAll('input[type="checkbox"]:checked');
                
                if (this.instance.currentQuestion === 7) {
                    return checkboxInputs.length > 0;
                }
                return radioInputs.length > 0;
            }
        }

        // Control system validation
        if (this.instance.currentQuestion === 9) {
            const controlSystem = document.getElementById('controlSystem');
            return controlSystem && controlSystem.value.trim() !== '';
        }
        
        // Control satisfaction validation
        if (this.instance.currentQuestion === 10) {
            const satisfaction = document.querySelector('input[name="controlSatisfaction"]:checked');
            return satisfaction !== null;
        }

        // Photo upload validation
        if (this.instance.currentQuestion === 14) {
            for (let i = 1; i <= 6; i++) {
                const photoInput = document.getElementById(`photo${i}`);
                if (!photoInput || !photoInput.files || photoInput.files.length === 0) {
                    return false;
                }
            }
            return true;
        }

        return true;
    }
};

// Storage Manager Class
window.StorageManager = class StorageManager {
    constructor(instance) {
        this.instance = instance;
    }

    loadSavedData() {
        try {
            const savedData = localStorage.getItem('churchLightingForm');
            const savedPosition = localStorage.getItem('churchLightingPosition');
            
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                this.instance.formData = { ...this.instance.formData, ...parsedData };
                console.log('Loaded saved form data');
            }
            
            if (savedPosition && savedPosition !== '0') {
                const position = parseInt(savedPosition);
                if (position > 0 && position <= this.instance.totalQuestions) {
                    if (confirm('Would you like to continue where you left off?')) {
                        this.instance.currentQuestion = position;
                        const currentSlide = document.querySelector('.question-slide.active');
                        if (currentSlide) currentSlide.classList.remove('active');
                        const targetSlide = document.querySelector(`.question-slide[data-question="${position}"]`);
                        if (targetSlide) targetSlide.classList.add('active');
                        this.instance.navigationManager.updateProgress();
                        this.instance.navigationManager.updateCounter();
                        this.instance.navigationManager.checkNavigation();
                    }
                }
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }

    saveCurrentData() {
        try {
            const currentSlide = document.querySelector('.question-slide.active');
            if (!currentSlide) return;
            
            const currentInputs = currentSlide.querySelectorAll('input, textarea, select');
            currentInputs.forEach(input => {
                if (input.type === 'radio' || input.type === 'checkbox') {
                    if (input.checked) {
                        this.instance.formData[input.name] = input.value;
                    }
                } else if (input.type !== 'file' && input.value) {
                    this.instance.formData[input.name || input.id] = input.value;
                }
            });
            
            localStorage.setItem('churchLightingForm', JSON.stringify(this.instance.formData));
            localStorage.setItem('churchLightingPosition', this.instance.currentQuestion.toString());
        } catch (error) {
            console.error('Error saving form data:', error);
        }
    }
};

// Event Manager Class
window.EventManager = class EventManager {
    constructor(instance) {
        this.instance = instance;
    }

    setupAllEventListeners() {
        this.setupNavigationButtons();
        this.setupKeyboardShortcuts();
        this.setupSubmitButton();
        this.setupControlNotSure();
        this.setupSatisfactionOptions();
        this.setupFileInputs();
        this.setupFormInputs();
    }

    setupNavigationButtons() {
        const nextBtn = document.getElementById('nextBtn');
        const backBtn = document.getElementById('backBtn');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.instance.navigationManager.nextQuestion());
        }
        if (backBtn) {
            backBtn.addEventListener('click', () => this.instance.navigationManager.previousQuestion());
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                const activeTextarea = document.activeElement.tagName === 'TEXTAREA';
                if (!activeTextarea) {
                    e.preventDefault();
                    this.instance.navigationManager.nextQuestion();
                }
            }
            if (e.key === 'Escape') {
                this.instance.navigationManager.previousQuestion();
            }
            if (e.key === 'ArrowLeft' && e.altKey) {
                this.instance.navigationManager.skipToPrevious();
            }
            if (e.key === 'ArrowRight' && e.altKey) {
                this.instance.navigationManager.skipToNext();
            }
        });
    }

    setupSubmitButton() {
        const submitBtn = document.getElementById('submitForm');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                console.log('Form submitted with data:', this.instance.formData);
                alert('Thank you! Your information has been submitted. We will contact you within 2-3 business days.');
            });
        }
    }

    setupControlNotSure() {
        const controlNotSure = document.getElementById('controlNotSure');
        if (controlNotSure) {
            controlNotSure.addEventListener('click', () => {
                const controlInput = document.getElementById('controlSystem');
                if (controlInput) {
                    controlInput.value = 'Not Sure';
                    this.instance.formData.controlSystem = 'Not Sure';
                    // Trigger navigation check when "Not Sure" is clicked
                    this.instance.navigationManager.checkNavigation();
                    this.instance.storageManager.saveCurrentData();
                }
                
                document.querySelectorAll('.nav-item.selected').forEach(item => {
                    item.classList.remove('selected');
                });

                controlNotSure.style.background = 'rgba(56, 112, 236, 0.2)';
                controlNotSure.style.borderColor = '#3870ec';
            });
        }
    }

    setupSatisfactionOptions() {
        document.querySelectorAll('.satisfaction-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.satisfaction-card').forEach(card => {
                    card.style.background = 'rgba(255,255,255,0.1)';
                    card.style.borderColor = 'rgba(255,255,255,0.3)';
                });

                const card = option.querySelector('.satisfaction-card');
                if (card) {
                    card.style.background = 'rgba(255,255,255,0.3)';
                    card.style.borderColor = '#3870EC';
                }

                const radio = option.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                    this.instance.formData.controlSatisfaction = radio.value;
                    // Trigger navigation check when satisfaction is selected
                    this.instance.navigationManager.checkNavigation();
                    this.instance.storageManager.saveCurrentData();
                }
            });

            const card = option.querySelector('.satisfaction-card');
            if (card) {
                option.addEventListener('mouseenter', () => {
                    const radio = option.querySelector('input[type="radio"]');
                    if (radio && !radio.checked) {
                        card.style.background = 'rgba(255,255,255,0.2)';
                        card.style.transform = 'translateY(-3px)';
                    }
                });
                option.addEventListener('mouseleave', () => {
                    const radio = option.querySelector('input[type="radio"]');
                    if (radio && !radio.checked) {
                        card.style.background = 'rgba(255,255,255,0.1)';
                        card.style.transform = 'translateY(0)';
                    }
                });
            }
        });
    }

    setupFileInputs() {
        document.querySelectorAll('input[type="file"]').forEach(input => {
            input.addEventListener('change', (e) => {
                const label = input.closest('label');
                if (input.files && input.files.length > 0) {
                    if (label && label.classList.contains('photo-upload-item')) {
                        label.classList.add('uploaded');
                        const uploadIcon = label.querySelector('.upload-icon');
                        if (uploadIcon) uploadIcon.textContent = '✅';
                    }
                }
                this.instance.storageManager.saveCurrentData();
                this.instance.navigationManager.checkNavigation();
            });
        });
    }

    setupFormInputs() {
        document.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach(input => {
            input.addEventListener('input', () => {
                this.instance.storageManager.saveCurrentData();
                this.instance.navigationManager.checkNavigation();
            });
        });
        
        document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', () => {
                this.instance.storageManager.saveCurrentData();
                this.instance.navigationManager.checkNavigation();
            });
        });
    }
};
