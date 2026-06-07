import React, { useState, useEffect } from 'react';

const QRCodeGenerator = () => {
    const [inputValue, setInputValue] = useState('');
    const [qrCodeData, setQrCodeData] = useState('');
    const [error, setError] = useState('');
    const [qrSize, setQrSize] = useState(250);
    const [qrColor, setQrColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#FFFFFF');
    const [qrType, setQrType] = useState('text');
    const [margin, setMargin] = useState(2);
    const [errorCorrection, setErrorCorrection] = useState('M');

    // Data states for different QR types
    const [wifiData, setWifiData] = useState({ ssid: '', password: '', encryption: 'WPA' });
    const [vcardData, setVcardData] = useState({ name: '', phone: '', email: '', company: '', title: '', website: '' });
    const [eventData, setEventData] = useState({ title: '', date: '', time: '', location: '' });
    const [locationData, setLocationData] = useState({ address: '', lat: '', lng: '' });
    const [whatsappData, setWhatsappData] = useState({ phone: '', message: '' });
    const [cryptoData, setCryptoData] = useState({ address: '', currency: 'BTC', amount: '' });
    const [socialData, setSocialData] = useState({ platform: 'instagram', username: '' });

    // Track active template to prevent infinite loops
    const [activeTemplate, setActiveTemplate] = useState(null);

    // Function to get current value based on QR type
    const getCurrentValue = () => {
        switch (qrType) {
            case 'url':
                return inputValue;
            case 'email':
                return inputValue;
            case 'phone':
                return inputValue;
            case 'sms':
                return inputValue;
            case 'text':
                return inputValue;
            case 'wifi':
                return `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};;`;
            case 'vcard':
                return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardData.name}\nTEL:${vcardData.phone}\nEMAIL:${vcardData.email}\nORG:${vcardData.company}\nTITLE:${vcardData.title}\nURL:${vcardData.website}\nEND:VCARD`;
            case 'event':
                return `BEGIN:VEVENT\nSUMMARY:${eventData.title}\nDTSTART:${eventData.date}T${eventData.time}\nLOCATION:${eventData.location}\nEND:VEVENT`;
            case 'location':
                if (locationData.lat && locationData.lng) {
                    return `geo:${locationData.lat},${locationData.lng}?q=${encodeURIComponent(locationData.address)}`;
                } else {
                    return `https://maps.google.com/?q=${encodeURIComponent(locationData.address)}`;
                }
            case 'whatsapp':
                return `https://wa.me/${whatsappData.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappData.message)}`;
            case 'crypto':
                return cryptoData.amount
                    ? `${cryptoData.currency}:${cryptoData.address}?amount=${cryptoData.amount}`
                    : `${cryptoData.currency}:${cryptoData.address}`;
            case 'social':
                const socialUrls = {
                    instagram: `https://instagram.com/${socialData.username}`,
                    twitter: `https://twitter.com/${socialData.username}`,
                    linkedin: `https://linkedin.com/in/${socialData.username}`,
                    github: `https://github.com/${socialData.username}`,
                    facebook: `https://facebook.com/${socialData.username}`,
                    youtube: `https://youtube.com/@${socialData.username}`,
                    tiktok: `https://tiktok.com/@${socialData.username}`
                };
                return socialUrls[socialData.platform];
            default:
                return inputValue;
        }
    };

    // Generate QR code
    const generateQR = () => {
        const finalValue = getCurrentValue();

        if (!finalValue || !finalValue.trim()) {
            setError('Please enter some content');
            return;
        }

        setError('');

        const qrColorClean = qrColor.replace('#', '');
        const bgColorClean = bgColor.replace('#', '');

        const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(finalValue)}&size=${qrSize}&margin=${margin}&dark=${qrColorClean}&light=${bgColorClean}&ecLevel=${errorCorrection}`;

        setQrCodeData(qrUrl);
    };

    // Auto-generate when relevant data changes
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         const finalValue = getCurrentValue();
    //         if (finalValue && finalValue.trim()) {
    //             generateQR();
    //         }
    //     }, 500);

    //     return () => clearTimeout(timer);
    // }, [qrType, inputValue, wifiData, vcardData, eventData, locationData, whatsappData, cryptoData, socialData, qrSize, qrColor, bgColor, margin, errorCorrection]);

    // Templates - each template knows exactly what to set
    const templates = {
        companyWebsite: {
            type: 'url',
            setData: () => {
                setQrType('url');
                setInputValue('https://yourcompany.com');
            },
            label: '🏢 Company Website'
        },
        supportEmail: {
            type: 'email',
            setData: () => {
                setQrType('email');
                setInputValue('support@yourcompany.com');
            },
            label: '📧 Support Email'
        },
        officeWiFi: {
            type: 'wifi',
            setData: () => {
                setQrType('wifi');
                setWifiData({ ssid: 'Company-WiFi', password: 'Welcome2024!', encryption: 'WPA' });
            },
            label: '📶 Office WiFi'
        },
        businessCard: {
            type: 'vcard',
            setData: () => {
                setQrType('vcard');
                setVcardData({
                    name: 'John Smith',
                    phone: '+1 (555) 123-4567',
                    email: 'john.smith@company.com',
                    company: 'Company Name',
                    title: 'Senior Manager',
                    website: 'https://company.com'
                });
            },
            label: '💼 Business Card'
        },
        linkedInProfile: {
            type: 'social',
            setData: () => {
                setQrType('social');
                setSocialData({ platform: 'linkedin', username: 'johnsmith' });
            },
            label: '🔗 LinkedIn'
        },
        githubProfile: {
            type: 'social',
            setData: () => {
                setQrType('social');
                setSocialData({ platform: 'github', username: 'johnsmith' });
            },
            label: '🐙 GitHub'
        },
        whatsAppContact: {
            type: 'whatsapp',
            setData: () => {
                setQrType('whatsapp');
                setWhatsappData({ phone: '+1234567890', message: 'Hi, I found you via QR code!' });
            },
            label: '💬 WhatsApp'
        },
        bitcoinDonation: {
            type: 'crypto',
            setData: () => {
                setQrType('crypto');
                setCryptoData({ currency: 'BTC', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', amount: '' });
            },
            label: '₿ Bitcoin'
        },
        eventMeeting: {
            type: 'event',
            setData: () => {
                setQrType('event');
                setEventData({ title: 'Team Meeting', date: '20240615', time: '140000', location: 'Conference Room A' });
            },
            label: '📅 Calendar'
        },
        officeLocation: {
            type: 'location',
            setData: () => {
                setQrType('location');
                setLocationData({ address: '350 5th Ave, New York, NY 10118', lat: '', lng: '' });
            },
            label: '📍 Location'
        },
        zoomLink: {
            type: 'url',
            setData: () => {
                setQrType('url');
                setInputValue('https://zoom.us/j/123456789?pwd=xxxxx');
            },
            label: '🎥 Zoom'
        },
        surveyForm: {
            type: 'url',
            setData: () => {
                setQrType('url');
                setInputValue('https://forms.google.com/your-survey');
            },
            label: '📝 Feedback'
        },
        paymentLink: {
            type: 'url',
            setData: () => {
                setQrType('url');
                setInputValue('https://paypal.me/companyname');
            },
            label: '💰 Payment'
        },
        appDownload: {
            type: 'url',
            setData: () => {
                setQrType('url');
                setInputValue('https://apps.apple.com/app/id123456789');
            },
            label: '📱 App Store'
        },
        googlePlay: {
            type: 'url',
            setData: () => {
                setQrType('url');
                setInputValue('https://play.google.com/store/apps/details?id=com.company.app');
            },
            label: '🤖 Google Play'
        },
        instagramProfile: {
            type: 'social',
            setData: () => {
                setQrType('social');
                setSocialData({ platform: 'instagram', username: 'yourcompany' });
            },
            label: '📸 Instagram'
        },
        twitterProfile: {
            type: 'social',
            setData: () => {
                setQrType('social');
                setSocialData({ platform: 'twitter', username: 'yourcompany' });
            },
            label: '🐦 Twitter/X'
        }
    };

    const applyTemplate = (templateKey) => {
        const template = templates[templateKey];
        setActiveTemplate(templateKey);
        template.setData();
        // Clear active template after a moment
        setTimeout(() => setActiveTemplate(null), 500);
    };

    // Reset form for current type
    const resetCurrentForm = () => {
        switch (qrType) {
            case 'text':
            case 'url':
            case 'email':
            case 'phone':
            case 'sms':
                setInputValue('');
                break;
            case 'wifi':
                setWifiData({ ssid: '', password: '', encryption: 'WPA' });
                break;
            case 'vcard':
                setVcardData({ name: '', phone: '', email: '', company: '', title: '', website: '' });
                break;
            case 'event':
                setEventData({ title: '', date: '', time: '', location: '' });
                break;
            case 'location':
                setLocationData({ address: '', lat: '', lng: '' });
                break;
            case 'whatsapp':
                setWhatsappData({ phone: '', message: '' });
                break;
            case 'crypto':
                setCryptoData({ address: '', currency: 'BTC', amount: '' });
                break;
            case 'social':
                setSocialData({ platform: 'instagram', username: '' });
                break;
        }
    };

    return (
        <div className="container py-4">
            <div className="row">
                {/* Left Panel - Inputs */}
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 rounded-3">
                        <div className="card-header" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}>
                            <h4 className="mb-0 text-white">
                                <i className="bi bi-qr-code-scan me-2"></i>
                                QR Code Generator
                            </h4>
                        </div>
                        <div className="card-body">
                            {/* QR Type Selector */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    <i className="bi bi-tag me-1"></i> QR Type
                                </label>
                                <select
                                    className="form-select"
                                    value={qrType}
                                    onChange={(e) => {
                                        setQrType(e.target.value);
                                        resetCurrentForm();
                                    }}
                                >
                                    <optgroup label="Basic">
                                        <option value="text">📝 Text / Message</option>
                                        <option value="url">🌐 Website URL</option>
                                        <option value="email">✉️ Email Address</option>
                                        <option value="phone">📞 Phone Number</option>
                                        <option value="sms">💬 SMS Message</option>
                                    </optgroup>
                                    <optgroup label="Professional">
                                        <option value="vcard">👤 Contact (vCard)</option>
                                        <option value="wifi">📶 WiFi Network</option>
                                        <option value="event">📅 Calendar Event</option>
                                        <option value="location">📍 Location / Maps</option>
                                    </optgroup>
                                    <optgroup label="Business">
                                        <option value="whatsapp">💚 WhatsApp</option>
                                        <option value="social">📱 Social Media</option>
                                        <option value="crypto">₿ Cryptocurrency</option>
                                    </optgroup>
                                </select>
                            </div>

                            {/* Dynamic Input Fields */}
                            {(qrType === 'text' || qrType === 'url' || qrType === 'email' || qrType === 'phone' || qrType === 'sms') && (
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        {qrType === 'text' && '📝 Text Content'}
                                        {qrType === 'url' && '🌐 Website URL'}
                                        {qrType === 'email' && '✉️ Email Address'}
                                        {qrType === 'phone' && '📞 Phone Number'}
                                        {qrType === 'sms' && '💬 SMS Number'}
                                    </label>
                                    {qrType === 'text' ? (
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            placeholder="Enter your text here..."
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                        />
                                    ) : (
                                        <input
                                            type={qrType === 'email' ? 'email' : qrType === 'url' ? 'url' : 'text'}
                                            className="form-control"
                                            placeholder={qrType === 'url' ? 'https://example.com' : qrType === 'email' ? 'someone@example.com' : qrType === 'phone' ? '+1234567890' : '1234567890'}
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                        />
                                    )}
                                </div>
                            )}

                            {qrType === 'wifi' && (
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">📶 WiFi Configuration</label>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Network Name (SSID)"
                                        value={wifiData.ssid}
                                        onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
                                    />
                                    <input
                                        type="password"
                                        className="form-control mb-2"
                                        placeholder="Password"
                                        value={wifiData.password}
                                        onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
                                    />
                                    <select
                                        className="form-select"
                                        value={wifiData.encryption}
                                        onChange={(e) => setWifiData({ ...wifiData, encryption: e.target.value })}
                                    >
                                        <option value="WPA">WPA / WPA2 (Recommended)</option>
                                        <option value="WEP">WEP (Less Secure)</option>
                                        <option value="nopass">No Password (Open Network)</option>
                                    </select>
                                </div>
                            )}

                            {qrType === 'vcard' && (
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">👤 Contact Information</label>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Full Name *"
                                        value={vcardData.name}
                                        onChange={(e) => setVcardData({ ...vcardData, name: e.target.value })}
                                    />
                                    <input
                                        type="tel"
                                        className="form-control mb-2"
                                        placeholder="Phone Number"
                                        value={vcardData.phone}
                                        onChange={(e) => setVcardData({ ...vcardData, phone: e.target.value })}
                                    />
                                    <input
                                        type="email"
                                        className="form-control mb-2"
                                        placeholder="Email Address"
                                        value={vcardData.email}
                                        onChange={(e) => setVcardData({ ...vcardData, email: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Company"
                                        value={vcardData.company}
                                        onChange={(e) => setVcardData({ ...vcardData, company: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Job Title"
                                        value={vcardData.title}
                                        onChange={(e) => setVcardData({ ...vcardData, title: e.target.value })}
                                    />
                                    <input
                                        type="url"
                                        className="form-control"
                                        placeholder="Website"
                                        value={vcardData.website}
                                        onChange={(e) => setVcardData({ ...vcardData, website: e.target.value })}
                                    />
                                </div>
                            )}

                            {qrType === 'social' && (
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">📱 Social Media</label>
                                    <select
                                        className="form-select mb-2"
                                        value={socialData.platform}
                                        onChange={(e) => setSocialData({ ...socialData, platform: e.target.value })}
                                    >
                                        <option value="instagram">📸 Instagram</option>
                                        <option value="twitter">🐦 Twitter / X</option>
                                        <option value="linkedin">🔗 LinkedIn</option>
                                        <option value="github">🐙 GitHub</option>
                                        <option value="facebook">📘 Facebook</option>
                                        <option value="youtube">▶️ YouTube</option>
                                        <option value="tiktok">🎵 TikTok</option>
                                    </select>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Username (without @)"
                                        value={socialData.username}
                                        onChange={(e) => setSocialData({ ...socialData, username: e.target.value })}
                                    />
                                </div>
                            )}

                            {qrType === 'whatsapp' && (
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">💚 WhatsApp</label>
                                    <input
                                        type="tel"
                                        className="form-control mb-2"
                                        placeholder="Phone Number (with country code)"
                                        value={whatsappData.phone}
                                        onChange={(e) => setWhatsappData({ ...whatsappData, phone: e.target.value })}
                                    />
                                    <textarea
                                        className="form-control"
                                        rows="2"
                                        placeholder="Pre-filled message (optional)"
                                        value={whatsappData.message}
                                        onChange={(e) => setWhatsappData({ ...whatsappData, message: e.target.value })}
                                    />
                                </div>
                            )}

                            {qrType === 'event' && (
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">📅 Calendar Event</label>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Event Title"
                                        value={eventData.title}
                                        onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                                    />
                                    <input
                                        type="date"
                                        className="form-control mb-2"
                                        placeholder="Date (YYYY-MM-DD)"
                                        value={eventData.date}
                                        onChange={(e) => setEventData({ ...eventData, date: e.target.value.replace(/-/g, '') })}
                                    />
                                    <input
                                        type="time"
                                        className="form-control mb-2"
                                        placeholder="Time (HH:MM)"
                                        value={eventData.time}
                                        onChange={(e) => setEventData({ ...eventData, time: e.target.value.replace(/:/g, '') + '00' })}
                                    />
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Location"
                                        value={eventData.location}
                                        onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                                    />
                                </div>
                            )}

                            {qrType === 'location' && (
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">📍 Location</label>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Address or Place Name"
                                        value={locationData.address}
                                        onChange={(e) => setLocationData({ ...locationData, address: e.target.value })}
                                    />
                                    <div className="row">
                                        <div className="col-6">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Latitude (optional)"
                                                value={locationData.lat}
                                                onChange={(e) => setLocationData({ ...locationData, lat: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Longitude (optional)"
                                                value={locationData.lng}
                                                onChange={(e) => setLocationData({ ...locationData, lng: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {qrType === 'crypto' && (
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">₿ Cryptocurrency</label>
                                    <select
                                        className="form-select mb-2"
                                        value={cryptoData.currency}
                                        onChange={(e) => setCryptoData({ ...cryptoData, currency: e.target.value })}
                                    >
                                        <option value="BTC">Bitcoin (BTC)</option>
                                        <option value="ETH">Ethereum (ETH)</option>
                                        <option value="USDT">Tether (USDT)</option>
                                        <option value="SOL">Solana (SOL)</option>
                                        <option value="DOGE">Dogecoin (DOGE)</option>
                                    </select>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Wallet Address"
                                        value={cryptoData.address}
                                        onChange={(e) => setCryptoData({ ...cryptoData, address: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Amount (optional)"
                                        value={cryptoData.amount}
                                        onChange={(e) => setCryptoData({ ...cryptoData, amount: e.target.value })}
                                    />
                                </div>
                            )}

                            {/* Customization Options */}
                            <div className="border-top pt-3 mt-2">
                                <h6 className="fw-semibold mb-3">
                                    <i className="bi bi-palette me-1"></i> Appearance
                                </h6>
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label small fw-semibold">QR Color</label>
                                        <input
                                            type="color"
                                            className="form-control form-control-color"
                                            value={qrColor}
                                            onChange={(e) => setQrColor(e.target.value)}
                                            style={{ height: '38px' }}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small fw-semibold">Background</label>
                                        <input
                                            type="color"
                                            className="form-control form-control-color"
                                            value={bgColor}
                                            onChange={(e) => setBgColor(e.target.value)}
                                            style={{ height: '38px' }}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small fw-semibold">Size</label>
                                        <select
                                            className="form-select"
                                            value={qrSize}
                                            onChange={(e) => setQrSize(parseInt(e.target.value))}
                                        >
                                            <option value="150">Small (150px)</option>
                                            <option value="250">Medium (250px)</option>
                                            <option value="350">Large (350px)</option>
                                            <option value="500">Extra Large (500px)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-semibold">Margin</label>
                                        <select
                                            className="form-select"
                                            value={margin}
                                            onChange={(e) => setMargin(parseInt(e.target.value))}
                                        >
                                            <option value="0">None (0)</option>
                                            <option value="1">Tiny (1)</option>
                                            <option value="2">Small (2)</option>
                                            <option value="4">Medium (4)</option>
                                            <option value="6">Large (6)</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-semibold">Error Correction</label>
                                        <select
                                            className="form-select"
                                            value={errorCorrection}
                                            onChange={(e) => setErrorCorrection(e.target.value)}
                                        >
                                            <option value="L">Low (7%)</option>
                                            <option value="M">Medium (15%)</option>
                                            <option value="Q">Quartile (25%)</option>
                                            <option value="H">High (30%)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="alert alert-danger py-2 mt-3">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    {error}
                                </div>
                            )}

                            {/* Generate Button */}
                            <button
                                className="btn btn-success w-100 mt-3 py-2"
                                onClick={generateQR}
                            >
                                <i className="bi bi-qr-code-scan me-2"></i>
                                Generate QR Code
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Preview & Templates */}
                <div className="col-md-6">
                    {/* QR Code Preview */}
                    <div className="card shadow-sm border-0 rounded-3 mb-3">
                        <div className="card-header" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}>
                            <h5 className="mb-0 text-white">
                                <i className="bi bi-eye me-2"></i>
                                Preview
                            </h5>
                        </div>
                        <div className="card-body text-center">
                            {qrCodeData ? (
                                <>
                                    <div className="p-4 bg-light rounded shadow-sm">
                                        <img
                                            src={qrCodeData}
                                            alt="QR Code"
                                            className="img-fluid"
                                            style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}
                                        />
                                    </div>
                                    <div className="mt-3">
                                        <button
                                            className="btn btn-outline-success me-2"
                                            onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = qrCodeData;
                                                link.download = `qrcode_${Date.now()}.png`;
                                                link.click();
                                            }}
                                        >
                                            <i className="bi bi-download me-1"></i>
                                            Download PNG
                                        </button>
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => {
                                                const printWindow = window.open('', '_blank');
                                                printWindow.document.write(`
                                                    <html>
                                                        <head><title>Print QR Code</title></head>
                                                        <body style="text-align:center; margin-top:50px;">
                                                            <img src="${qrCodeData}" style="max-width:100%;">
                                                            <p>Scan me!</p>
                                                            <script>window.onload = function() { window.print(); window.close(); }<\/script>
                                                        </body>
                                                    </html>
                                                `);
                                                printWindow.document.close();
                                            }}
                                        >
                                            <i className="bi bi-printer me-1"></i>
                                            Print
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="py-5 text-muted">
                                    <i className="bi bi-qr-code" style={{ fontSize: '4rem' }}></i>
                                    <p className="mt-3 mb-0">Enter data and click Generate</p>
                                    <small className="text-muted">Your QR code will appear here</small>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Templates - FULLY SYNCED */}
                    <div className="card shadow-sm border-0 rounded-3">
                        <div className="card-header bg-light">
                            <h6 className="fw-semibold mb-0">
                                <i className="bi bi-lightning-charge text-warning me-1"></i>
                                Quick Templates (17+)
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="row g-2">
                                {/* Row 1 - Basic */}
                                <div className="col-6 col-md-4">
                                    <button
                                        className={`btn w-100 text-start py-2 ${activeTemplate === 'companyWebsite' ? 'btn-success' : 'btn-outline-secondary'}`}
                                        style={{ fontSize: '0.85rem' }}
                                        onClick={() => applyTemplate('companyWebsite')}
                                    >
                                        🏢 Company
                                    </button>
                                </div>
                                <div className="col-6 col-md-4">
                                    <button
                                        className={`btn w-100 text-start py-2 ${activeTemplate === 'supportEmail' ? 'btn-success' : 'btn-outline-secondary'}`}
                                        style={{ fontSize: '0.85rem' }}
                                        onClick={() => applyTemplate('supportEmail')}
                                    >
                                        📧 Support
                                    </button>
                                </div>
                                <div className="col-6 col-md-4">
                                    <button
                                        className={`btn w-100 text-start py-2 ${activeTemplate === 'officeWiFi' ? 'btn-success' : 'btn-outline-secondary'}`}
                                        style={{ fontSize: '0.85rem' }}
                                        onClick={() => applyTemplate('officeWiFi')}
                                    >
                                        📶 WiFi
                                    </button>
                                </div>

                                {/* Row 2 - Professional */}
                                <div className="col-6 col-md-4">
                                    <button
                                        className={`btn w-100 text-start py-2 ${activeTemplate === 'businessCard' ? 'btn-success' : 'btn-outline-secondary'}`}
                                        style={{ fontSize: '0.85rem' }}
                                        onClick={() => applyTemplate('businessCard')}
                                    >
                                        💼 Business Card
                                    </button>
                                </div>
                                <div className="col-6 col-md-4">
                                    <button
                                        className={`btn w-100 text-start py-2 ${activeTemplate === 'linkedInProfile' ? 'btn-success' : 'btn-outline-secondary'}`}
                                        style={{ fontSize: '0.85rem' }}
                                        onClick={() => applyTemplate('linkedInProfile')}
                                    >
                                        🔗 LinkedIn
                                    </button>
                                </div>
                                <div className="col-6 col-md-4">
                                    <button
                                        className={`btn w-100 text-start py-2 ${activeTemplate === 'githubProfile' ? 'btn-success' : 'btn-outline-secondary'}`}
                                        style={{ fontSize: '0.85rem' }}
                                        onClick={() => applyTemplate('githubProfile')}
                                    >
                                        🐙 GitHub
                                    </button>
                                </div>

                                {/* Row 3 - Social Media */}
                                <div className="col-6 col-md-4">
                                    <button
                                        className={`btn w-100 text-start py-2 ${activeTemplate === 'instagramProfile' ? 'btn-success' : 'btn-outline-secondary'}`}
                                        style={{ fontSize: '0.85rem' }}
                                        onClick={() => applyTemplate('instagramProfile')}
                                    >
                                        📸 Instagram
                                    </button>
                                </div>
                                <div className="col-6 col-md-4">
                                    <button
                                        className={`btn w-100 text-start py-2 ${activeTemplate === 'twitterProfile' ? 'btn-success' : 'btn-outline-secondary'}`}
                                        style={{ fontSize: '0.85rem' }}
                                        onClick={() => applyTemplate('twitterProfile')}
                                    >
                                        🐦 Twitter/X
                                    </button>
                                </div>
                                <div className="col-6 col-md-4">
                                    <button
                                        className={`btn w-100 text-start py-2 ${activeTemplate === 'whatsAppContact' ? 'btn-success' : 'btn-outline-secondary'}`}
                                        style={{ fontSize: '0.85rem' }}
                                        onClick={() => applyTemplate('whatsAppContact')}
                                    >
                                        💬 WhatsApp
                                    </button>
                                </div>

                                {/* Row 4 - Business Tools */}
                                <div className="col-6 col-md-4">
                                    <button
                                        className={`btn w-100 text-start py-2 ${activeTemplate === 'eventMeeting' ? 'btn-success' : 'btn-outline-secondary'}`}
                                        style={{ fontSize: '0.85rem' }}
                                        onClick={() => applyTemplate('eventMeeting')}
                                    >
                                        📅 Calendar
                                    </button>
                                </div>
                                <div className="col-6 col-md-4">
                                    <button
                                        className={`btn w-100 text-start py-2 ${activeTemplate === 'officeLocation' ? 'btn-success' : 'btn-outline-secondary'}`}
                                        style={{ fontSize: '0.85rem' }}
                                        onClick={() => applyTemplate('officeLocation')}
                                    >
                                        📍 Location
                                    </button>
                                </div>
                                <div className="col-6 col-md-4">
                                    <button
                                        className={`btn w-100 text-start py-2 ${activeTemplate === 'zoomLink' ? 'btn-success' : 'btn-outline-secondary'}`}
                                        style={{ fontSize: '0.85rem' }}
                                        onClick={() => applyTemplate('zoomLink')}
                                    >
                                        🎥 Zoom
                                    </button>
                                </div>

                                {/* Row 5 - More */}
                                <div className="col-6 col-md-4">
                                    <button
                                        className={`btn w-100 text-start py-2 ${activeTemplate === 'surveyForm' ? 'btn-success' : 'btn-outline-secondary'}`}
                                        style={{ fontSize: '0.85rem' }}
                                        onClick={() => applyTemplate('surveyForm')}
                                    >
                                        📝 Feedback
                                    </button>
                                </div>
                                <div className="col-6 col-md-4">
                                    <button
                                        className={`btn w-100 text-start py-2 ${activeTemplate === 'paymentLink' ? 'btn-success' : 'btn-outline-secondary'}`}
                                        style={{ fontSize: '0.85rem' }}
                                        onClick={() => applyTemplate('paymentLink')}
                                    >
                                        💰 Payment
                                    </button>
                                </div>
                                <div className="col-6 col-md-4">
                                    <button
                                        className={`btn w-100 text-start py-2 ${activeTemplate === 'bitcoinDonation' ? 'btn-success' : 'btn-outline-secondary'}`}
                                        style={{ fontSize: '0.85rem' }}
                                        onClick={() => applyTemplate('bitcoinDonation')}
                                    >
                                        ₿ Crypto
                                    </button>
                                </div>

                                {/* Row 6 - App Stores */}
                                <div className="col-6 col-md-4">
                                    <button
                                        className={`btn w-100 text-start py-2 ${activeTemplate === 'appDownload' ? 'btn-success' : 'btn-outline-secondary'}`}
                                        style={{ fontSize: '0.85rem' }}
                                        onClick={() => applyTemplate('appDownload')}
                                    >
                                        📱 App Store
                                    </button>
                                </div>
                                <div className="col-6 col-md-4">
                                    <button
                                        className={`btn w-100 text-start py-2 ${activeTemplate === 'googlePlay' ? 'btn-success' : 'btn-outline-secondary'}`}
                                        style={{ fontSize: '0.85rem' }}
                                        onClick={() => applyTemplate('googlePlay')}
                                    >
                                        🤖 Google Play
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Tips */}
                    <div className="card mt-3 shadow-sm border-0 rounded-3 bg-light">
                        <div className="card-body py-2">
                            <small className="text-muted">
                                <i className="bi bi-check-circle-fill text-success me-1"></i>
                                {/* <strong>Auto-generates:</strong> QR updates automatically when you change any setting or input. */}
                                <strong>Template:</strong> Use templates to quickly generate QR codes for common use cases.
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRCodeGenerator;