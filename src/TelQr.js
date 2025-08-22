/**
 * TelQr - A JavaScript class for handling telephone links with QR code generation
 * Converts tel: links to QR codes for desktop users while preserving mobile functionality
 */
class TelQr {
    constructor(config = {}) {
        this.modal = null;
        this.backdrop = null;
        this.telLinks = [];
        this.isQRLoaded = false;

        // Configuration options with defaults
        this.config = {
            showToCallText: config.showToCallText || 'Show to call',
            scanToCallText: config.scanToCallText || 'Scan to call',
            buttonText: config.buttonText || 'Call Now',
            qrCode: {
                width: config.qrCode?.width || 180,
                height: config.qrCode?.height || 180,
                correctLevel: config.qrCode?.correctLevel || 'M',
                colorDark: config.qrCode?.colorDark || '#000000',
                colorLight: config.qrCode?.colorLight || '#ffffff',
                ...config.qrCode
            },
            styling: {
                modal: {
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 20px 50px rgba(0,0,0,.2)',
                    maxWidth: '300px',
                    ...config.styling?.modal
                },
                backdrop: {
                    background: 'rgba(0, 0, 0, 0.5)',
                    ...config.styling?.backdrop
                },
                title: {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '16px',
                    textAlign: 'center',
                    ...config.styling?.title
                },
                button: {
                    marginTop: '16px',
                    padding: '12px 20px',
                    background: '#007cba',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    width: '100%',
                    ...config.styling?.button
                },
                description: {
                    marginTop: '12px',
                    fontSize: '14px',
                    color: '#666',
                    textAlign: 'center',
                    ...config.styling?.description
                }
            }
        };

        if (this.isMobileDevice()) return;

        this.attachEventListeners();
    }

    isMobileDevice() {
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    attachEventListeners() {
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            this.telLinks.push(link);
            link.addEventListener('click', this.handleTelLinkClick.bind(this));
        });
    }

    async handleTelLinkClick(event) {
        event.preventDefault();
        const link = event.currentTarget;
        const phoneNumber = this.extractPhoneNumber(link);

        await this.loadQRLibrary();
        this.createModal();
        this.populateModal(phoneNumber, link);
        this.showModal();
    }

    extractPhoneNumber(link) {
        return link.getAttribute('href').replace(/^tel:/, '').trim();
    }

    async loadQRLibrary() {
        if (this.isQRLoaded || window.QRCode) {
            this.isQRLoaded = true;
            return;
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js';
            script.onload = () => {
                this.isQRLoaded = true;
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    createModal() {
        // Remove existing modal and backdrop if they exist
        this.closeModal();
        
        // Create backdrop
        this.backdrop = document.createElement('div');
        this.backdrop.className = 'qr-modal-backdrop';
        this.backdrop.addEventListener('click', this.closeModal.bind(this));
        
        // Create modal
        this.modal = document.createElement('div');
        this.modal.className = 'qr-modal';
        this.modal.role = 'dialog';
        this.modal.setAttribute('aria-label', this.config.showToCallText);
        this.modal.addEventListener('click', (e) => e.stopPropagation());
        
        // Add modal to backdrop
        this.backdrop.appendChild(this.modal);
        document.body.appendChild(this.backdrop);
    }

    populateModal(phoneNumber, link) {
        this.modal.innerHTML = '';
        this.applyModalStyles();

        this.addPhoneTitle(phoneNumber);
        this.createQRCode(phoneNumber);
        this.addDescriptionText();
        this.addCallButton(link);
    }

    applyModalStyles() {
        // Apply backdrop styles
        const backdropStyles = this.config.styling.backdrop;
        this.backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${backdropStyles.background};
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        
        // Apply modal styles
        const modalStyles = this.config.styling.modal;
        this.modal.style.cssText = `
            background: ${modalStyles.background};
            border: ${modalStyles.border};
            border-radius: ${modalStyles.borderRadius};
            padding: ${modalStyles.padding};
            box-shadow: ${modalStyles.boxShadow};
            max-width: ${modalStyles.maxWidth};
            text-align: center;
            position: relative;
        `;
    }

    addPhoneTitle(phoneNumber) {
        const titleDiv = document.createElement('div');
        titleDiv.textContent = phoneNumber;
        const styles = this.config.styling.title;
        titleDiv.style.cssText = `
            font-size: ${styles.fontSize};
            font-weight: ${styles.fontWeight};
            color: ${styles.color};
            margin-bottom: ${styles.marginBottom};
            text-align: ${styles.textAlign};
        `;
        this.modal.appendChild(titleDiv);
    }

    createQRCode(phoneNumber) {
        const qrConfig = this.config.qrCode;
        new QRCode(this.modal, {
            text: `tel:${phoneNumber}`,
            width: qrConfig.width,
            height: qrConfig.height,
            correctLevel: QRCode.CorrectLevel[qrConfig.correctLevel],
            colorDark: qrConfig.colorDark,
            colorLight: qrConfig.colorLight
        });
    }

    addDescriptionText() {
        const textDiv = document.createElement('div');
        textDiv.textContent = this.config.scanToCallText;
        const styles = this.config.styling.description;
        textDiv.style.cssText = `margin-top: ${styles.marginTop}; font-size: ${styles.fontSize}; color: ${styles.color}; text-align: ${styles.textAlign};`;
        this.modal.appendChild(textDiv);
    }

    addCallButton(link) {
        const callButton = document.createElement('button');
        callButton.textContent = this.config.buttonText;
        const styles = this.config.styling.button;
        callButton.style.cssText = `
            margin-top: ${styles.marginTop};
            padding: ${styles.padding};
            background: ${styles.background};
            color: ${styles.color};
            border: ${styles.border};
            border-radius: ${styles.borderRadius};
            cursor: ${styles.cursor};
            font-size: ${styles.fontSize};
            width: ${styles.width};
        `;
        callButton.onclick = () => {
            window.location.href = link.getAttribute('href');
        };
        this.modal.appendChild(callButton);
    }

    showModal() {
        // Modal is already visible when created, no additional action needed
    }

    closeModal() {
        if (this.backdrop) {
            document.body.removeChild(this.backdrop);
            this.backdrop = null;
            this.modal = null;
        }
    }
}

// Export for different module systems
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = TelQr;
} else if (typeof define === 'function' && define.amd) {
    define(function() {
        return TelQr;
    });
} else {
    window.TelQr = TelQr;
}