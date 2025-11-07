class TypeformIntake {
    constructor() {
        this.currentQuestion = 0;
        this.currentDimension = 0;
        this.currentGoal = 0;
        this.currentPhoto = 0;
        
        this.slides = document.querySelectorAll('.question-slide');
        this.totalQuestions = this.slides.length - 1;
        this.actualTotalQuestions = this.slides.length;
        this.totalDimensions = document.querySelectorAll('.dimension-step').length;
        this.totalGoals = document.querySelectorAll('.goal-step').length;
        this.totalPhotos = document.querySelectorAll('.photo-step').length;

        this.sequentialQuestions = this.identifySequentialQuestions();
        
        this.selectedStyle = 'contemporary';
        this.formData = {
            goals: {},
            photos: {}
        };
        
        // Initialize managers using global classes
        this.initializeManagers();
        this.init();
    }
    
    initializeManagers() {
        // Use the global classes we defined
        this.navigationManager = new window.NavigationManager(this);
        this.visualManager = new window.VisualManager(this);
        this.dimensionManager = new window.DimensionManager(this);
        this.goalManager = new window.GoalManager(this);
        this.photoManager = new window.PhotoManager(this);
        this.dockManager = new window.DockManager(this);
        this.validationManager = new window.ValidationManager(this);
        this.storageManager = new window.StorageManager(this);
        this.eventManager = new window.EventManager(this);
    }
    
    identifySequentialQuestions() {
        const sequential = {};
        
        document.querySelectorAll('.question-slide').forEach((slide, index) => {
            if (slide.querySelector('.goal-step')) {
                sequential[index] = {
                    type: 'goals',
                    selector: '.goal-step',
                    currentIndex: 0,
                    total: slide.querySelectorAll('.goal-step').length
                };
            } else if (slide.querySelector('.dimension-step')) {
                sequential[index] = {
                    type: 'dimensions',
                    selector: '.dimension-step',
                    currentIndex: 0,
                    total: slide.querySelectorAll('.dimension-step').length
                };
            } else if (slide.querySelector('.photo-step')) {
                sequential[index] = {
                    type: 'photos',
                    selector: '.photo-step',
                    currentIndex: 0,
                    total: slide.querySelectorAll('.photo-step').length
                };
            }
        });
        
        return sequential;
    }

    init() {
        this.eventManager.setupAllEventListeners();
        this.navigationManager.setupMasterNavigator();
        this.dimensionManager.setupDimensionSliders();
        this.dimensionManager.setupDimensionButtons();
        this.goalManager.setupGoalRatings();
        this.dockManager.setupRoomUse();
        this.dockManager.setupDockNavigation();
        this.dockManager.setupDockAnimation();
        this.setupStyleSelection();
        this.photoManager.setupPhotoUploads();
        this.photoManager.setupPhotoButtons();
        this.resetInitialSlideState();
        this.storageManager.loadSavedData();
        this.navigationManager.updateProgress();
        this.navigationManager.updateCounter();
        this.navigationManager.checkNavigation();
        this.visualManager.updateDynamicVisuals();

        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.navigationManager.nextQuestion();
            });
        }
    }

    setupStyleSelection() {
        document.querySelectorAll('input[name="lightingStyle"]').forEach(input => {
            input.addEventListener('change', (e) => {
                const target = e.target;
                const styleSource = target.dataset.style ? target : target.closest('[data-style]');
                const style = styleSource ? styleSource.dataset.style : target.value;

                if (!style) {
                    return;
                }

                this.selectedStyle = style;
                this.formData.lightingStyle = style;

                this.visualManager.updateDynamicVisuals(style);
            });
        });
    }
		resetInitialSlideState() {
        this.currentQuestion = 0;
        this.slides.forEach((slide) => {
            slide.classList.remove('active', 'prev', 'next');

            const questionNumber = parseInt(slide.dataset.question, 10);
            if (!Number.isNaN(questionNumber) && questionNumber === 0) {
                slide.classList.add('active');
            }
        });
    }

    showSequentialStep(questionIndex, stepIndex) {
        const seq = this.sequentialQuestions[questionIndex];
        if (!seq) return;
        
        const questionSlide = document.querySelector(`.question-slide[data-question="${questionIndex}"]`);
        if (!questionSlide) return;
        
        const steps = questionSlide.querySelectorAll(seq.selector);
        
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        
        const dots = questionSlide.querySelectorAll('.goal-dot, .dimension-dot, .photo-dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active', 'completed');
            if (index < stepIndex) {
                dot.classList.add('completed');
            } else if (index === stepIndex) {
                dot.classList.add('active');
            }
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if all required classes are loaded
    if (window.NavigationManager && window.VisualManager && window.DimensionManager && 
        window.GoalManager && window.PhotoManager && window.DockManager && 
        window.ValidationManager && window.StorageManager && window.EventManager) {
        
        window.typeformIntake = new TypeformIntake();
        console.log('TypeformIntake initialized successfully');
    } else {
        console.error('Not all manager classes are loaded. Please ensure all script blocks are included.');
    }
});
