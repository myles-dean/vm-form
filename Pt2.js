
window.NavigationManager = class NavigationManager {
    constructor(instance) {
        this.instance = instance;
    }

    setupMasterNavigator() {
        const masterPrev = document.getElementById('masterPrev');
        const masterNext = document.getElementById('masterNext');
        
        if (masterPrev) {
            masterPrev.addEventListener('click', () => this.skipToPrevious());
        }
        if (masterNext) {
            masterNext.addEventListener('click', () => this.skipToNext());
        }
        
        this.updateMasterNav();
    }

    nextQuestion() {
        if (this.instance.sequentialQuestions[this.instance.currentQuestion]) {
            const seq = this.instance.sequentialQuestions[this.instance.currentQuestion];
            if (seq.currentIndex < seq.total - 1) {
                return;
            }
        }

        if (this.instance.currentQuestion < this.instance.totalQuestions) {
            if (!this.instance.validationManager.validateCurrentQuestion()) {
                this.shakeButton();
                return;
            }

            this.instance.storageManager.saveCurrentData();
            const currentSlide = document.querySelector(`.question-slide[data-question="${this.instance.currentQuestion}"]`);
            if (currentSlide) {
                currentSlide.classList.remove('active');
                currentSlide.classList.add('prev');
            }

            this.instance.currentQuestion++;
            const nextSlide = document.querySelector(`.question-slide[data-question="${this.instance.currentQuestion}"]`);
            if (nextSlide) {
                nextSlide.classList.add('active');
                
                if (this.instance.sequentialQuestions[this.instance.currentQuestion]) {
                    const seq = this.instance.sequentialQuestions[this.instance.currentQuestion];
                    seq.currentIndex = 0;
                    this.instance.showSequentialStep(this.instance.currentQuestion, 0);
                }
            }
            
            this.instance.visualManager.updateDynamicVisuals();
            this.updateProgress();
            this.updateCounter();
            this.checkNavigation();
            this.updateMasterNav();
        }
    }

    previousQuestion() {
        if (this.instance.currentQuestion > 0) {
            const currentSlide = document.querySelector(`.question-slide[data-question="${this.instance.currentQuestion}"]`);
            if (currentSlide) {
                currentSlide.classList.remove('active');
            }

            this.instance.currentQuestion--;
            const prevSlide = document.querySelector(`.question-slide[data-question="${this.instance.currentQuestion}"]`);
            if (prevSlide) {
                prevSlide.classList.remove('prev');
                prevSlide.classList.add('active');

                if (this.instance.sequentialQuestions[this.instance.currentQuestion]) {
                    const seq = this.instance.sequentialQuestions[this.instance.currentQuestion];
                    seq.currentIndex = 0;
                    this.instance.showSequentialStep(this.instance.currentQuestion, 0);
                }
            }

            this.instance.visualManager.updateDynamicVisuals();
            this.updateProgress();
            this.updateCounter();
            this.checkNavigation();
            this.updateMasterNav();
        }
    }

    skipToNext() {
        if (this.instance.currentQuestion < this.instance.totalQuestions) {
            this.instance.storageManager.saveCurrentData();
            const currentSlide = document.querySelector(`.question-slide[data-question="${this.instance.currentQuestion}"]`);
            if (currentSlide) {
                currentSlide.classList.remove('active');
                currentSlide.classList.add('prev');
            }

            this.instance.currentQuestion++;
            const nextSlide = document.querySelector(`.question-slide[data-question="${this.instance.currentQuestion}"]`);
            if (nextSlide) {
                nextSlide.classList.add('active');
                
                if (this.instance.sequentialQuestions[this.instance.currentQuestion]) {
                    const seq = this.instance.sequentialQuestions[this.instance.currentQuestion];
                    seq.currentIndex = 0;
                    
                    if (seq.type === 'goals') {
                        this.instance.currentGoal = 0;
                        this.instance.goalManager.showGoal(0);
                    } else if (seq.type === 'dimensions') {
                        this.instance.currentDimension = 0;
                        this.instance.dimensionManager.showDimension(0);
                    } else if (seq.type === 'photos') {
                        this.instance.currentPhoto = 0;
                        this.instance.photoManager.showPhoto(0);
                    }
                }
            }
            
            this.instance.visualManager.updateDynamicVisuals();
            this.updateProgress();
            this.updateCounter();
            this.checkNavigation();
            this.updateMasterNav();
        }
    }

    skipToPrevious() {
        if (this.instance.currentQuestion > 0) {
            const currentSlide = document.querySelector(`.question-slide[data-question="${this.instance.currentQuestion}"]`);
            if (currentSlide) {
                currentSlide.classList.remove('active');
            }

            this.instance.currentQuestion--;
            const prevSlide = document.querySelector(`.question-slide[data-question="${this.instance.currentQuestion}"]`);
            if (prevSlide) {
                prevSlide.classList.remove('prev');
                prevSlide.classList.add('active');

                if (this.instance.sequentialQuestions[this.instance.currentQuestion]) {
                    const seq = this.instance.sequentialQuestions[this.instance.currentQuestion];
                    seq.currentIndex = 0;
                    this.instance.showSequentialStep(this.instance.currentQuestion, 0);
                }
            }
            
            this.instance.visualManager.updateDynamicVisuals();
            this.updateProgress();
            this.updateCounter();
            this.checkNavigation();
            this.updateMasterNav();
        }
    }

    updateMasterNav() {
        const masterPrev = document.getElementById('masterPrev');
        const masterNext = document.getElementById('masterNext');
        const masterQuestionNum = document.getElementById('masterQuestionNum');
        const masterTotalQuestions = document.getElementById('masterTotalQuestions');

        if (masterQuestionNum) {
            masterQuestionNum.textContent = this.instance.currentQuestion;
        }
        if (masterTotalQuestions) {
            masterTotalQuestions.textContent = this.instance.totalQuestions;
        }
        
        if (masterPrev) {
            masterPrev.disabled = this.instance.currentQuestion === 0;
        }
        if (masterNext) {
            masterNext.disabled = this.instance.currentQuestion >= this.instance.totalQuestions;
        }
    }

    updateProgress() {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const progress = (this.instance.currentQuestion / this.instance.totalQuestions) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    updateCounter() {
        const currentQuestionEl = document.getElementById('currentQuestion');
        const totalQuestionsEl = document.getElementById('totalQuestions');
        
        if (currentQuestionEl) {
            const displayNumber = this.instance.currentQuestion === 0 ? 1 : this.instance.currentQuestion;
            currentQuestionEl.textContent = displayNumber;
        }
        if (totalQuestionsEl) {
            totalQuestionsEl.textContent = this.instance.totalQuestions;
        }
    }

    checkNavigation() {
        const backBtn = document.getElementById('backBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (!backBtn || !nextBtn) return;

        backBtn.style.display = this.instance.currentQuestion === 0 ? 'none' : 'block';

        const isSequential = this.instance.sequentialQuestions[this.instance.currentQuestion] !== undefined;
        const isSuccessScreen = this.instance.currentQuestion >= this.instance.totalQuestions;
        const isLastRealQuestion = this.instance.currentQuestion === this.instance.totalQuestions - 1;

        if (this.instance.currentQuestion === 0) {
            nextBtn.style.display = 'none';
        } else if (isSuccessScreen) {
            nextBtn.style.display = 'none';
        } else if (isLastRealQuestion && !isSequential) {
            nextBtn.textContent = 'Submit';
            nextBtn.style.display = 'block';
        } else if (isSequential) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.textContent = 'Continue';
            nextBtn.style.display = 'block';
        }

        this.updateButtonState();
    }
    
    updateButtonState() {
        const nextBtn = document.getElementById('nextBtn');
        if (!nextBtn || nextBtn.style.display === 'none') return;
        
        const currentSlide = document.querySelector(`.question-slide[data-question="${this.instance.currentQuestion}"]`);
        if (!currentSlide) return;
        
        if (currentSlide.querySelector('#churchName')) {
            const churchName = document.getElementById('churchName');
            const contactName = document.getElementById('contactName');
            const contactEmail = document.getElementById('contactEmail');
            const contactPhone = document.getElementById('contactPhone');
            
            if (churchName && contactName && contactEmail && contactPhone) {
                nextBtn.disabled = !churchName.value.trim() || !contactName.value.trim() || 
                                 !contactEmail.value.trim() || !contactPhone.value.trim();
            }
        }
        else if (currentSlide.querySelector('input[type="radio"][required]')) {
            const checked = currentSlide.querySelector('input[type="radio"]:checked');
            nextBtn.disabled = !checked;
        }
        else if (currentSlide.querySelector('input[type="checkbox"][required]')) {
            const checked = currentSlide.querySelectorAll('input[type="checkbox"]:checked');
            nextBtn.disabled = checked.length === 0;
        }
        else if (currentSlide.querySelector('#controlSystem')) {
            const controlSystem = document.getElementById('controlSystem');
            nextBtn.disabled = !controlSystem || controlSystem.value.trim() === '';
        }
        else {
            nextBtn.disabled = false;
        }
    }

    shakeButton() {
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.style.animation = 'pulse 0.5s';
            setTimeout(() => nextBtn.style.animation = '', 500);
        }
    }
};

// Visual Manager Class
window.VisualManager = class VisualManager {
    constructor(instance) {
        this.instance = instance;
        this.preloadedStyles = new Set();
        this.preloadedImages = new Map();
        this.preloadedVideos = new Set();
        this.imageKeys = ['bright', 'dimmed', 'dark', 'color', 'white', 'calm', 'noHaze', 'haze'];
        this.videoKeys = ['subtle', 'dynamic'];
    }

    updateDynamicVisuals(styleKey = this.instance.selectedStyle) {
        if (!styleKey) {
            return;
        }

        const styleAssets = window.visualAssets[styleKey];
        if (!styleAssets) return;

        this.preloadStyleAssets(styleKey, styleAssets);

        this.setBackgroundImage(document.getElementById('bright-visual'), styleAssets.bright);
        this.setBackgroundImage(document.getElementById('dim-visual'), styleAssets.dimmed);
        this.setBackgroundImage(document.getElementById('dark-visual'), styleAssets.dark);

        this.setBackgroundImage(document.getElementById('color-visual'), styleAssets.color);
        this.setBackgroundImage(document.getElementById('white-visual'), styleAssets.white);

        this.setBackgroundImage(document.getElementById('calm-visual'), styleAssets.calm);
        this.updateBunnyPlayer('subtle-container', styleAssets.subtle);
        this.updateBunnyPlayer('dynamic-container', styleAssets.dynamic);

        this.setBackgroundImage(document.getElementById('no-haze-visual'), styleAssets.noHaze);
        this.setBackgroundImage(document.getElementById('haze-visual'), styleAssets.haze);
    }

    preloadStyleAssets(styleKey, styleAssets = window.visualAssets[styleKey]) {
        if (!styleAssets || this.preloadedStyles.has(styleKey)) {
            return;
        }

        const retainedImages = [];
        this.imageKeys.forEach((key) => {
            const url = styleAssets[key];
            if (!url) return;

            const img = new Image();
            img.src = url;
            retainedImages.push(img);
        });

        if (retainedImages.length) {
            this.preloadedImages.set(styleKey, retainedImages);
        }

        this.videoKeys.forEach((key) => {
            const url = styleAssets[key];
            if (!url) return;

            if (this.preloadedVideos.has(url)) return;

            const head = document.head || document.getElementsByTagName('head')[0];
            if (!head) return;

            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'video';
            link.href = url;
            head.appendChild(link);
            this.preloadedVideos.add(url);
        });

        this.preloadedStyles.add(styleKey);
    }

    setBackgroundImage(element, imageUrl) {
        if (element && imageUrl) {
            element.style.backgroundImage = `url('${imageUrl}')`;
            element.style.backgroundSize = 'cover';
            element.style.backgroundPosition = 'center';
        }
    }

    updateBunnyPlayer(containerId, videoUrl) {
        const container = document.getElementById(containerId);
        if (!container || !videoUrl) return;

        const bunnyPlayer = container.querySelector('.bunny-player');
        if (!bunnyPlayer) return;

        bunnyPlayer.setAttribute('data-player-src', videoUrl);

        const videoElement = bunnyPlayer.querySelector('video');
        if (videoElement) {
            const wasPlaying = !videoElement.paused;
            videoElement.src = videoUrl;
            videoElement.load();

            const shouldAutoplay = wasPlaying || bunnyPlayer.dataset.playerAutoplay === 'true';
            if (shouldAutoplay) {
                videoElement.play().catch(() => {});
            }
        }
    }
};

// Dimension Manager Class
window.DimensionManager = class DimensionManager {
    constructor(instance) {
        this.instance = instance;
    }

    setupDimensionSliders() {
        const sliders = [
            { id: 'ceilingHeight', valueId: 'ceilingValue', suffix: ' ft' },
            { id: 'roomWidth', valueId: 'roomWidthValue', suffix: ' ft' },
            { id: 'roomLength', valueId: 'roomLengthValue', suffix: ' ft' },
            { id: 'stageWidth', valueId: 'stageWidthValue', suffix: ' ft' },
            { id: 'stageDepth', valueId: 'stageDepthValue', suffix: ' ft' },
            { id: 'seatCount', valueId: 'seatsValue', suffix: '' }
        ];

        sliders.forEach(slider => {
            const sliderElement = document.getElementById(slider.id);
            const valueElement = document.getElementById(slider.valueId);
            
            if (sliderElement && valueElement) {
                sliderElement.addEventListener('input', (e) => {
                    let value = e.target.value;
                    if (slider.id === 'seatCount') {
                        value = parseInt(value).toLocaleString();
                    }
                    valueElement.textContent = value + slider.suffix;
                    this.instance.formData[slider.id] = e.target.value;
                });
            }
        });
    }

    setupDimensionButtons() {
        document.querySelectorAll('.dimension-next-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const currentQuestionSeq = this.instance.sequentialQuestions[this.instance.currentQuestion];
                if (!currentQuestionSeq || currentQuestionSeq.type !== 'dimensions') return;
                
                if (btn.dataset.final === 'true') {
                    this.instance.navigationManager.nextQuestion();
                } else {
                    currentQuestionSeq.currentIndex++;
                    this.instance.showSequentialStep(this.instance.currentQuestion, currentQuestionSeq.currentIndex);
                }
            });
        });
    }

    showDimension(dimensionIndex) {
        const currentQuestionSeq = this.instance.sequentialQuestions[this.instance.currentQuestion];
        if (currentQuestionSeq && currentQuestionSeq.type === 'dimensions') {
            this.instance.showSequentialStep(this.instance.currentQuestion, dimensionIndex);
        }
    }
};
