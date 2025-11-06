
// Fix for thumbnail radio button selection
function setupThumbnailRadioButtons() {
    // Handle all thumbnail options (for building styles, brightness, etc.)
    document.querySelectorAll('.thumbnail-option').forEach(option => {
        option.addEventListener('click', function(e) {
            // Prevent double-firing if clicking directly on the radio
            if (e.target.type === 'radio') return;
            
            // Find the radio input within this thumbnail
            const radioInput = this.querySelector('input[type="radio"]');
            
            if (radioInput && !radioInput.checked) {
                // Uncheck all other radios in the same group
                const radioName = radioInput.name;
                document.querySelectorAll(`input[name="${radioName}"]`).forEach(radio => {
                    radio.checked = false;
                    // Remove the selected state visually
                    const parentOption = radio.closest('.thumbnail-option');
                    if (parentOption) {
                        // Trigger CSS update by toggling a class
                        parentOption.classList.remove('radio-selected');
                    }
                });
                
                // Check this radio
                radioInput.checked = true;
                
                // Add selected class for CSS styling
                this.classList.add('radio-selected');
                
                // Trigger change event for any listeners
                const changeEvent = new Event('change', { bubbles: true });
                radioInput.dispatchEvent(changeEvent);
            }
        });
        
        // Check initial state on page load
        const radio = option.querySelector('input[type="radio"]');
        if (radio && radio.checked) {
            option.classList.add('radio-selected');
        }
    });

    // Handle haze options with different structure
    document.querySelectorAll('.haze-option').forEach(option => {
        option.addEventListener('click', function(e) {
            if (e.target.type === 'radio') return;
            
            const radioInput = this.querySelector('input[type="radio"]');
            
            if (radioInput && !radioInput.checked) {
                // Uncheck all other radios in the same group
                const radioName = radioInput.name;
                document.querySelectorAll(`input[name="${radioName}"]`).forEach(radio => {
                    radio.checked = false;
                    const parentOption = radio.closest('.haze-option');
                    if (parentOption) {
                        parentOption.classList.remove('radio-selected');
                    }
                });
                
                // Check this radio
                radioInput.checked = true;
                this.classList.add('radio-selected');
                
                // Trigger change event
                const changeEvent = new Event('change', { bubbles: true });
                radioInput.dispatchEvent(changeEvent);
            }
        });
        
        // Check initial state
        const radio = option.querySelector('input[type="radio"]');
        if (radio && radio.checked) {
            option.classList.add('radio-selected');
        }
    });

    // Handle center haze option
    document.querySelectorAll('.haze-option-center').forEach(option => {
        option.addEventListener('click', function(e) {
            if (e.target.type === 'radio') return;
            
            const radioInput = this.querySelector('input[type="radio"]');
            
            if (radioInput && !radioInput.checked) {
                // Uncheck all other radios
                const radioName = radioInput.name;
                document.querySelectorAll(`input[name="${radioName}"]`).forEach(radio => {
                    radio.checked = false;
                    const parentOption = radio.closest('.haze-option-center, .haze-option');
                    if (parentOption) {
                        parentOption.classList.remove('radio-selected');
                    }
                });
                
                radioInput.checked = true;
                this.classList.add('radio-selected');
                
                const changeEvent = new Event('change', { bubbles: true });
                radioInput.dispatchEvent(changeEvent);
            }
        });
    });
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupThumbnailRadioButtons);
} else {
    setupThumbnailRadioButtons();
}

// Also run after a short delay in case Webflow modifies the DOM
setTimeout(setupThumbnailRadioButtons, 500);
