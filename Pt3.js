window.GoalManager = class GoalManager {
    constructor(instance) {
        this.instance = instance;
    }

    setupGoalRatings() {
        document.querySelectorAll('.rating-btn-large').forEach(btn => {
            btn.addEventListener('click', () => {
                const goal = btn.dataset.goal;
                const rating = btn.dataset.rating;
                
                this.instance.formData.goals[goal] = rating;
                
                const currentQuestionSeq = this.instance.sequentialQuestions[this.instance.currentQuestion];
                if (!currentQuestionSeq || currentQuestionSeq.type !== 'goals') return;
                
                if (currentQuestionSeq.currentIndex < currentQuestionSeq.total - 1) {
                    currentQuestionSeq.currentIndex++;
                    this.instance.showSequentialStep(this.instance.currentQuestion, currentQuestionSeq.currentIndex);
                } else {
                    this.instance.navigationManager.nextQuestion();
                }
            });
        });
    }

    showGoal(goalIndex) {
        const currentQuestionSeq = this.instance.sequentialQuestions[this.instance.currentQuestion];
        if (currentQuestionSeq && currentQuestionSeq.type === 'goals') {
            this.instance.showSequentialStep(this.instance.currentQuestion, goalIndex);
        }
    }
};

// Photo Manager Class
window.PhotoManager = class PhotoManager {
    constructor(instance) {
        this.instance = instance;
    }

    setupPhotoUploads() {
        for (let i = 1; i <= 6; i++) {
            const fileInput = document.getElementById(`photo${i}`);
            if (fileInput) {
                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            const uploadArea = fileInput.closest('.photo-upload-area');
                            const uploadContent = uploadArea.querySelector('.upload-content');
                            const uploadPreview = uploadArea.querySelector('.upload-preview');
                            const previewImage = uploadArea.querySelector('.preview-image');
                            
                            if (uploadContent) uploadContent.style.display = 'none';
                            if (uploadPreview) uploadPreview.style.display = 'block';
                            if (previewImage) previewImage.src = event.target.result;

                            if (uploadArea) uploadArea.classList.add('has-file');

                            const currentStep = fileInput.closest('.photo-step');
                            const nextBtn = currentStep ? currentStep.querySelector('.photo-next-btn') : null;
                            if (nextBtn) {
                                nextBtn.disabled = false;
                            }

                            this.instance.formData.photos[`photo${i}`] = file.name;

                            if (this.instance.currentQuestion === 14) {
                                this.instance.navigationManager.checkNavigation();
                            }
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }
        }
    }

    setupPhotoButtons() {
        document.querySelectorAll('.photo-next-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const currentQuestionSeq = this.instance.sequentialQuestions[this.instance.currentQuestion];
                if (!currentQuestionSeq || currentQuestionSeq.type !== 'photos') return;
                
                if (btn.dataset.final === 'true') {
                    this.instance.navigationManager.nextQuestion();
                } else {
                    currentQuestionSeq.currentIndex++;
                    this.instance.showSequentialStep(this.instance.currentQuestion, currentQuestionSeq.currentIndex);
                }
            });
        });
    }

    showPhoto(photoIndex) {
        const currentQuestionSeq = this.instance.sequentialQuestions[this.instance.currentQuestion];
        if (currentQuestionSeq && currentQuestionSeq.type === 'photos') {
            this.instance.showSequentialStep(this.instance.currentQuestion, photoIndex);
        }
    }

    nextPhoto() {
        const currentQuestionSeq = this.instance.sequentialQuestions[this.instance.currentQuestion];
        if (currentQuestionSeq && currentQuestionSeq.type === 'photos') {
            if (currentQuestionSeq.currentIndex < currentQuestionSeq.total - 1) {
                currentQuestionSeq.currentIndex++;
                this.instance.showSequentialStep(this.instance.currentQuestion, currentQuestionSeq.currentIndex);
            }
        }
    }
};

// Dock Manager Class
window.DockManager = class DockManager {
    constructor(instance) {
        this.instance = instance;
    }

    setupDockNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const controlInput = document.getElementById('controlSystem');

        const toggleSiblingClass = (items, index, offset, className, add) => {
            const sibling = items[index + offset];
            if (sibling) {
                sibling.classList.toggle(className, add);
            }
        };

        navItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                item.classList.toggle('selected');
                
                const selectedApps = Array.from(document.querySelectorAll('.nav-item.selected'))
                    .map(el => el.dataset.app);
                
                if (controlInput) {
                    controlInput.value = selectedApps.join(', ');
                    this.instance.formData.controlSystem = controlInput.value;
                    // Trigger navigation check when dock items are clicked
                    this.instance.navigationManager.checkNavigation();
                    this.instance.storageManager.saveCurrentData();
                }
            });

            item.addEventListener('mouseenter', () => {
                item.classList.add('hover');
                toggleSiblingClass(navItems, index, -1, 'sibling-close', true);
                toggleSiblingClass(navItems, index, 1, 'sibling-close', true);
                toggleSiblingClass(navItems, index, -2, 'sibling-far', true);
                toggleSiblingClass(navItems, index, 2, 'sibling-far', true);
            });

            item.addEventListener('mouseleave', () => {
                item.classList.remove('hover');
                toggleSiblingClass(navItems, index, -1, 'sibling-close', false);
                toggleSiblingClass(navItems, index, 1, 'sibling-close', false);
                toggleSiblingClass(navItems, index, -2, 'sibling-far', false);
                toggleSiblingClass(navItems, index, 2, 'sibling-far', false);
            });
        });
    }

    setupDockAnimation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        const toggleSiblingClass = (items, index, offset, className, add) => {
            const sibling = items[index + offset];
            if (sibling) {
                sibling.classList.toggle(className, add);
            }
        };
        
        navItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                item.classList.add('hover');
                toggleSiblingClass(navItems, index, -1, 'sibling-close', true);
                toggleSiblingClass(navItems, index, 1, 'sibling-close', true);
                toggleSiblingClass(navItems, index, -2, 'sibling-far', true);
                toggleSiblingClass(navItems, index, 2, 'sibling-far', true);
            });
            
            item.addEventListener('mouseleave', () => {
                item.classList.remove('hover');
                toggleSiblingClass(navItems, index, -1, 'sibling-close', false);
                toggleSiblingClass(navItems, index, 1, 'sibling-close', false);
                toggleSiblingClass(navItems, index, -2, 'sibling-far', false);
                toggleSiblingClass(navItems, index, 2, 'sibling-far', false);
            });
        });
    }

    setupRoomUse() {
        document.querySelectorAll('.room-use-card').forEach(card => {
            card.addEventListener('click', () => {
                const checkbox = card.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    card.classList.toggle('selected', checkbox.checked);
                    this.instance.storageManager.saveCurrentData();
                }
            });
        });
    }
};
