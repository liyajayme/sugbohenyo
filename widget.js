const ItineraryWidget = (function() {
    let config = {
        destination: '',
        apiEndpoint: '/promptItinerary',
        position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
        buttonText: '✨ Plan My Trip',
        buttonColor: '#4F46E5',
        autoDetectDestination: true
    };

    // HTML Templates
    const buttonHTML = `
        <button id="itinerary-widget-btn" class="itinerary-floating-btn" aria-label="AI Travel Planner">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M576 112C576 100.9 570.3 90.6 560.8 84.8C551.3 79 539.6 78.4 529.7 83.4L413.5 141.5L234.1 81.6C226 78.9 217.3 79.5 209.7 83.3L81.7 147.3C70.8 152.8 64 163.9 64 176L64 528C64 539.1 69.7 549.4 79.2 555.2C88.7 561 100.4 561.6 110.3 556.6L226.4 498.5L399.7 556.3C395.4 549.9 391.2 543.2 387.1 536.4C376.1 518.1 365.2 497.1 357.1 474.6L255.9 440.9L255.9 156.4L383.9 199.1L383.9 298.4C414.9 262.6 460.9 240 511.9 240C534.5 240 556.1 244.4 575.9 252.5L576 112zM512 288C445.7 288 392 340.8 392 405.9C392 474.8 456.1 556.3 490.6 595.2C502.2 608.2 521.9 608.2 533.5 595.2C568 556.3 632.1 474.8 632.1 405.9C632.1 340.8 578.4 288 512.1 288zM472 408C472 385.9 489.9 368 512 368C534.1 368 552 385.9 552 408C552 430.1 534.1 448 512 448C489.9 448 472 430.1 472 408z"/></svg>
        </button>
    `;

    const modalHTML = `
        <div id="itinerary-widget-modal" class="itinerary-modal">
            <div class="itinerary-modal-content">
                <div class="itinerary-modal-header">
                    <h2>AI Travel Planner</h2>
                    <button class="itinerary-close-btn" id="itinerary-close-btn">&times;</button>
                </div>
                <div class="itinerary-modal-body">
                    <div class="itinerary-input-section">
                        <label for="itinerary-destination">Destination</label>
                        <input 
                            type="text" 
                            id="itinerary-destination" 
                            placeholder="e.g., Badian, Oslob, Bantayan"
                            class="itinerary-input"
                        />
                    </div>
                    <div class="itinerary-input-section">
                        <label for="itinerary-days">Trip Duration</label>
                        <select id="itinerary-days" class="itinerary-input">
                            <option value="1">1 Day</option>
                            <option value="2">2 Days</option>
                            <option value="3" selected>3 Days</option>
                            <option value="4">4 Days</option>
                            <option value="5">5 Days</option>
                            <option value="7">1 Week</option>
                        </select>
                    </div>
                    <button id="itinerary-generate-btn" class="itinerary-generate-btn">
                        Generate Itinerary
                    </button>
                    <div id="itinerary-output" class="itinerary-output"></div>
                </div>
            </div>
        </div>
    `;

    const styles = `
        .itinerary-floating-btn {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(37, 99, 235, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 9998;
        }

        .itinerary-floating-btn::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: rgba(37, 99, 235, 0.3);
            animation: pulse 2s ease-out infinite;
        }

        @keyframes pulse {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            100% {
                transform: scale(1.5);
                opacity: 0;
            }
        }

        .itinerary-floating-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 30px rgba(37, 99, 235, 0.6);
        }

        .itinerary-floating-btn:hover::before {
            animation: none;
        }

        .itinerary-floating-btn:active {
            transform: scale(0.95);
        }

        .itinerary-floating-btn svg {
            width: 28px;
            height: 28px;
            position: relative;
            z-index: 1;
        }

        .itinerary-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        }

        .itinerary-modal.active {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .itinerary-modal-content {
            background: white;
            border-radius: 16px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .itinerary-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 25px;
            border-bottom: 1px solid #e5e7eb;
        }

        .itinerary-modal-header h2 {
            margin: 0;
            font-size: 24px;
            color: #1f2937;
        }

        .itinerary-close-btn {
            background: none;
            border: none;
            font-size: 32px;
            color: #6b7280;
            cursor: pointer;
            line-height: 1;
            transition: color 0.2s;
        }

        .itinerary-close-btn:hover {
            color: #1f2937;
        }

        .itinerary-modal-body {
            padding: 25px;
            overflow-y: auto;
            max-height: calc(90vh - 80px);
        }

        .itinerary-input-section {
            margin-bottom: 20px;
        }

        .itinerary-input-section label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #374151;
            font-size: 14px;
        }

        .itinerary-input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.2s;
            box-sizing: border-box;
        }

        .itinerary-input:focus {
            outline: none;
            border-color: #667eea;
        }

        .itinerary-generate-btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .itinerary-generate-btn:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .itinerary-generate-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .itinerary-output {
            margin-top: 20px;
            padding: 20px;
            background: #f9fafb;
            border-radius: 8px;
            min-height: 100px;
            display: none;
            line-height: 1.6;
        }

        .itinerary-output.active {
            display: block;
        }

        .itinerary-output.loading {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #6b7280;
        }

        .itinerary-spinner {
            border: 3px solid #f3f4f6;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin-right: 10px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
            .itinerary-floating-btn {
                bottom: 20px;
                right: 20px;
                width: 56px;
                height: 56px;
            }

            .itinerary-floating-btn svg {
                width: 24px;
                height: 24px;
            }

            .itinerary-modal-content {
                width: 95%;
                margin: 10px;
            }
        }
    `;

    function init(options = {}) {
        // Merge custom config
        config = { ...config, ...options };

        // Inject styles
        injectStyles();

        // Create and inject HTML elements
        createWidget();

        // Auto-detect destination from page if enabled
        if (config.autoDetectDestination && !config.destination) {
            config.destination = detectDestination();
        }

        // Set initial destination if available
        if (config.destination) {
            const input = document.getElementById('itinerary-destination');
            if (input) input.value = config.destination;
        }

        // Attach event listeners
        attachEventListeners();
    }

    function injectStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    function createWidget() {
        // Create container
        const container = document.createElement('div');
        container.id = 'itinerary-widget-container';
        container.innerHTML = buttonHTML + modalHTML;
        document.body.appendChild(container);
    }

    function detectDestination() {
        // Try to find destination from common page elements
        const selectors = [
            '[data-name]',
            '[data-destination]',
            '.destination',
            '.city-name',
            'h1',
            '.page-title'
        ];
 
        for (let selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                const text = element.textContent || element.getAttribute('data-destination') || element.getAttribute('data-name');
                if (text && text.trim().length > 0 && text.trim().length < 50) {
                    return text.trim();
                }
            }
        }
        return '';
    }

    function attachEventListeners() {
        const btn = document.getElementById('itinerary-widget-btn');
        const modal = document.getElementById('itinerary-widget-modal');
        const closeBtn = document.getElementById('itinerary-close-btn');
        const generateBtn = document.getElementById('itinerary-generate-btn');

        // Open modal
        btn.addEventListener('click', () => {
            modal.classList.add('active');
        });

        // Close modal
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Generate itinerary
        generateBtn.addEventListener('click', generateItinerary);

        // Enter key in destination input
        document.getElementById('itinerary-destination').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') generateItinerary();
        });
    }

    function closeModal() {
        const modal = document.getElementById('itinerary-widget-modal');
        modal.classList.remove('active');
    }

    async function generateItinerary() {
        const destination = document.getElementById('itinerary-destination').value.trim();
        const days = document.getElementById('itinerary-days').value;
        const output = document.getElementById('itinerary-output');
        const generateBtn = document.getElementById('itinerary-generate-btn');

        if (!destination) {
            alert('Please enter a destination');
            return;
        }

        try {
            // Show loading state
            output.classList.add('active', 'loading');
            output.innerHTML = '<div class="itinerary-spinner"></div><span>Creating your perfect itinerary...</span>';
            generateBtn.disabled = true;

            const message = `create a ${days} day${days > 1 ? 's' : ''} travel plan for ${destination}, only the itinerary`;

            const res = await fetch(config.apiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message })
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();

            // Display result
            output.classList.remove('loading');
            output.innerHTML = formatItinerary(data.reply);

        } catch (err) {
            console.error("Generate itinerary error:", err);
            output.classList.remove('loading');
            output.innerHTML = `
                <div style="color: #dc2626; text-align: center;">
                    <strong>Failed to generate itinerary</strong>
                    <p style="margin-top: 8px; font-size: 14px;">Please try again or contact support.</p>
                </div>
            `;
        } finally {
            generateBtn.disabled = false;
        }
    }

    function formatItinerary(content) {
        // Convert markdown-style formatting to HTML if needed
        let formatted = content;
        
        // Convert **bold** to <strong>
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        
        // Convert line breaks
        formatted = formatted.replace(/\n/g, '<br>');
        
        // Add some styling to day headers (if present)
        formatted = formatted.replace(/Day (\d+):/gi, '<strong style="color: #667eea; font-size: 18px;">Day $1:</strong>');
        
        return formatted;
    }

    // Public API
    return {
        init,
        open: () => document.getElementById('itinerary-widget-modal').classList.add('active'),
        close: closeModal,
        setDestination: (dest) => {
            config.destination = dest;
            const input = document.getElementById('itinerary-destination');
            if (input) input.value = dest;
        }
    };
})();

// Auto-initialize if DOM is ready
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', () => ItineraryWidget.init());
// } else {
//     ItineraryWidget.init();
// }