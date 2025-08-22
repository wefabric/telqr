# TelQr

A lightweight JavaScript library that enhances telephone links on desktop devices by displaying QR codes for easy mobile scanning. Perfect for bridging the gap between desktop and mobile phone functionality.

## Features

- Automatically detects desktop devices and intercepts `tel:` links
- Displays QR codes for phone numbers on desktop devices
- Fully customizable styling and configuration
- Bypasses QR functionality on mobile devices (preserves native calling)
- Lightweight with minimal dependencies
- Easy integration with existing websites

## Installation

```bash
npm install tel-qr-handler
```

## Usage

### Basic Usage

```javascript
// Import the library
import TelQr from 'tel-qr-handler';

// Initialize with default settings
document.addEventListener('DOMContentLoaded', () => {
    new TelQr();
});
```

### With Custom Configuration

```javascript
import TelQr from 'tel-qr-handler';

document.addEventListener('DOMContentLoaded', () => {
    new TelQr({
        showToCallText: 'Click to call',
        scanToCallText: 'Scan with your phone to call',
        buttonText: 'Call Now',
        qrCode: {
            width: 200,
            height: 200,
            correctLevel: 'H',
            colorDark: '#000000',
            colorLight: '#ffffff'
        },
        styling: {
            modal: {
                background: '#ffffff',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '350px'
            },
            button: {
                background: '#007cba',
                color: 'white',
                fontSize: '16px'
            }
        }
    });
});
```

### Browser Script Tag

```html
<script src="path/to/tel-qr-handler/src/TelQr.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        new TelQr({
            scanToCallText: 'Scan to call',
            buttonText: 'Call Now'
        });
    });
</script>
```

## Configuration Options

### Text Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showToCallText` | string | `'Show to call'` | Aria label for the modal |
| `scanToCallText` | string | `'Scan to call'` | Description text below QR code |
| `buttonText` | string | `'Call Now'` | Text for the call button |

### QR Code Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `qrCode.width` | number | `180` | QR code width in pixels |
| `qrCode.height` | number | `180` | QR code height in pixels |
| `qrCode.correctLevel` | string | `'M'` | Error correction level (L, M, Q, H) |
| `qrCode.colorDark` | string | `'#000000'` | Dark color for QR code |
| `qrCode.colorLight` | string | `'#ffffff'` | Light color for QR code |

### Styling Configuration

#### Modal Styling
```javascript
styling: {
    modal: {
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 20px 50px rgba(0,0,0,.2)',
        maxWidth: '300px'
    }
}
```

#### Backdrop Styling
```javascript
styling: {
    backdrop: {
        background: 'rgba(0, 0, 0, 0.5)'
    }
}
```

#### Button Styling
```javascript
styling: {
    button: {
        marginTop: '16px',
        padding: '12px 20px',
        background: '#007cba',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        width: '100%'
    }
}
```

## How It Works

1. **Device Detection**: The library automatically detects if the user is on a mobile device
2. **Mobile Bypass**: On mobile devices, telephone links work normally (native calling)
3. **Desktop Enhancement**: On desktop devices, clicking a `tel:` link shows a QR code modal
4. **QR Code Generation**: Uses the QRCode.js library to generate scannable QR codes
5. **Fallback**: Includes a "Call Now" button that still triggers the tel: link

## Dependencies

- **qrcodejs**: Used for QR code generation (loaded automatically from CDN)

## Browser Support

- Modern browsers that support ES6 classes
- Internet Explorer 11+ (with polyfills)
- All major mobile browsers

## Examples

### Basic HTML Setup

```html
<!DOCTYPE html>
<html>
<head>
    <title>TelQr Example</title>
</head>
<body>
    <p>Call us: <a href="tel:+1234567890">+1 (234) 567-8900</a></p>
    <p>Support: <a href="tel:+0987654321">+0 (987) 654-321</a></p>
    
    <script src="path/to/tel-qr-handler.js"></script>
    <script>
        new TelQr({
            scanToCallText: 'Scan with your phone to call',
            buttonText: 'Call Now'
        });
    </script>
</body>
</html>
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.