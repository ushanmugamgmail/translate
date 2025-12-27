'use client';

import React, { useState, useEffect, useRef } from 'react';

const Translator = () => {
    const [showWelcome, setShowWelcome] = useState(true);
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('English');
    const [targetLang, setTargetLang] = useState('Tamil');
    const [isTranslating, setIsTranslating] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const [predictions, setPredictions] = useState<string[]>([]);
    const [showPredictions, setShowPredictions] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [workMode, setWorkMode] = useState(false);

    useEffect(() => {
        if (inputText.length > 2) {
            const mock = sourceLang === 'English' 
                ? ['Hello, how are you?', 'Good morning', 'Thank you so much', 'Where is the station?']
                : ['வணக்கம், எப்படி இருக்கிறீர்கள்?', 'காலை வணக்கம்', 'மிக்க நன்றி', 'நிலையம் எங்கே உள்ளது?'];
            const filtered = mock.filter(i => i.toLowerCase().includes(inputText.toLowerCase()));
            setPredictions(filtered);
            setShowPredictions(filtered.length > 0);
        } else {
            setShowPredictions(false);
        }
    }, [inputText, sourceLang]);

    const swapLanguages = () => {
        const temp = sourceLang;
        setSourceLang(targetLang);
        setTargetLang(temp);
        setInputText(translatedText);
        setTranslatedText(inputText);
    };

    const handleTranslate = () => {
        if (!inputText.trim()) {
            setTranslatedText('');
            return;
        }
        setIsTranslating(true);
        // Simple mock translation
        setTimeout(() => {
            let result = '';
            if (sourceLang === 'English') {
                if (inputText.toLowerCase().includes('hello')) result = workMode ? 'வணக்கம், ஐயா' : 'வணக்கம்';
                else if (inputText.toLowerCase().includes('how are you')) result = workMode ? 'தாங்கள் எப்படி இருக்கிறீர்கள்?' : 'எப்படி இருக்கிறீர்கள்?';
                else result = 'மொழிபெயர்ப்பு (Demo)';
            } else {
                if (inputText.includes('வணக்கம்')) result = workMode ? 'Greetings/Hello' : 'Hello';
                else result = 'Translated (Demo)';
            }
            setTranslatedText(result);
            setIsTranslating(false);
        }, 600);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    if (showWelcome) {
        return (
            <div className="welcome-screen">
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
                    <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        background: 'var(--primary)', 
                        borderRadius: '20px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'white',
                        marginBottom: '2rem',
                        boxShadow: '0 20px 40px -10px var(--primary-glow)'
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>translate</span>
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1 }}>
                        Break Language <br/>
                        <span style={{ color: 'var(--primary)' }}>Barriers</span>
                    </h1>
                    <p style={{ color: 'var(--slate-500)', marginBottom: '3rem', maxWidth: '300px' }}>
                        Communicate freely with instant voice and text translation.
                    </p>
                    <button 
                        className="btn-primary" 
                        onClick={() => setShowWelcome(false)}
                        style={{ 
                            width: '100%', 
                            padding: '1.25rem', 
                            borderRadius: '1rem', 
                            border: 'none', 
                            background: 'var(--primary)', 
                            color: 'white', 
                            fontWeight: 'bold', 
                            fontSize: '1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        Start Translating
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                    
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                         <button 
                            onClick={() => setIsDark(!isDark)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--slate-400)', cursor: 'pointer' }}
                         >
                            <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
                         </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <header className="header">
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Translate</h2>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn-icon" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                    <button className="btn-icon" onClick={() => setIsDark(!isDark)}>
                        <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
                    </button>
                </div>
            </header>

            {isSettingsOpen && (
                <div style={{
                    position: 'absolute',
                    top: '5rem',
                    right: '1.25rem',
                    left: '1.25rem',
                    background: isDark ? '#2c2c35' : 'white',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    zIndex: 100,
                    border: '1px solid rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontWeight: 700 }}>Options</h3>
                        <span className="material-symbols-outlined" onClick={() => setIsSettingsOpen(false)} style={{ cursor: 'pointer' }}>close</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>💼 Work Mode</span>
                            <div 
                                onClick={() => setWorkMode(!workMode)}
                                style={{ 
                                    width: '40px', 
                                    height: '20px', 
                                    background: workMode ? 'var(--primary)' : '#ccc', 
                                    borderRadius: '10px',
                                    position: 'relative',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ 
                                    width: '16px', 
                                    height: '16px', 
                                    background: 'white', 
                                    borderRadius: '50%', 
                                    position: 'absolute', 
                                    top: '2px', 
                                    left: workMode ? '22px' : '2px',
                                    transition: 'left 0.2s'
                                }} />
                            </div>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                            Work mode ensures translations are professional and suitable for business environments.
                        </div>
                    </div>
                </div>
            )}

            <div className="lang-selector">
                <div className="lang-bar">
                    <button className="lang-btn active">
                        {sourceLang}
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>expand_more</span>
                    </button>
                    <button className="swap-btn" onClick={swapLanguages}>
                        <span className="material-symbols-outlined">sync_alt</span>
                    </button>
                    <button className="lang-btn">
                        {targetLang}
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>expand_more</span>
                    </button>
                </div>
            </div>

            <main className="content">
                <div className="card input-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="card-label">{sourceLang}</span>
                        <span className="material-symbols-outlined" style={{ color: 'var(--slate-400)', fontSize: '18px', cursor: 'pointer' }} onClick={() => setInputText('')}>close</span>
                    </div>
                    <textarea 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onFocus={() => predictions.length > 0 && setShowPredictions(true)}
                        placeholder="Enter text..."
                        spellCheck={false}
                    />
                    {showPredictions && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: '1rem',
                            right: '1rem',
                            background: isDark ? '#2c2c35' : 'white',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                            zIndex: 50,
                            marginTop: '-10px',
                            border: '1px solid var(--primary-glow)'
                        }}>
                            {predictions.map((p, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => {
                                        setInputText(p);
                                        setShowPredictions(false);
                                        handleTranslate();
                                    }}
                                    style={{ 
                                        padding: '0.75rem 1rem', 
                                        borderBottom: i === predictions.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.05)',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {p}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="card-footer">
                        <button className="btn-icon">
                            <span className="material-symbols-outlined">volume_up</span>
                        </button>
                        <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>{inputText.length}/5000</span>
                    </div>
                </div>

                {isTranslating && (
                    <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                        <div style={{ 
                            width: '20px', 
                            height: '20px', 
                            border: '2px solid var(--primary)', 
                            borderTopColor: 'transparent', 
                            borderRadius: '50%', 
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto'
                        }} />
                    </div>
                )}

                <div className="card output-card">
                    <span className="card-label" style={{ color: 'var(--primary)' }}>{targetLang}</span>
                    <div className="output-text">
                        {translatedText || <span style={{ opacity: 0.3 }}>{sourceLang === 'English' ? 'மொழிபெயர்ப்பு...' : 'Translation...'}</span>}
                    </div>
                    <div className="card-footer" style={{ borderTop: '1px solid rgba(19, 91, 236, 0.1)', paddingTop: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button className="btn-icon" style={{ color: 'var(--primary)' }}>
                                <span className="material-symbols-outlined">volume_up</span>
                            </button>
                            <button className="btn-icon" style={{ color: 'var(--primary)' }} onClick={() => navigator.clipboard.writeText(translatedText)}>
                                <span className="material-symbols-outlined">content_copy</span>
                            </button>
                            <button className="btn-icon" style={{ color: 'var(--primary)' }}>
                                <span className="material-symbols-outlined">star</span>
                            </button>
                        </div>
                        <button className="btn-icon" style={{ color: 'var(--primary)' }}>
                            <span className="material-symbols-outlined">fullscreen</span>
                        </button>
                    </div>
                </div>
            </main>

            <nav className="bottom-nav">
                <div className="nav-item">
                    <div className="nav-icon">
                        <span className="material-symbols-outlined">photo_camera</span>
                    </div>
                    <span className="nav-label">Camera</span>
                </div>
                <div className="nav-item">
                    <div className="mic-btn">
                        <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>mic</span>
                    </div>
                    <span className="nav-label" style={{ fontWeight: 'bold' }}>Speak</span>
                </div>
                <div className="nav-item">
                    <div className="nav-icon">
                        <span className="material-symbols-outlined">forum</span>
                    </div>
                    <span className="nav-label">Convo</span>
                </div>
            </nav>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes spin { to { transform: rotate(360deg); } }
            ` }} />
        </div>
    );
};

export default Translator;
