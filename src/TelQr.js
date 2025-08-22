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
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
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

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = TelQr;
} else if (typeof define === 'function' && define.amd) {
    define(function() {
        return TelQr;
    });
} else {
    window.TelQr = TelQr;
}