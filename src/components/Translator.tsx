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
    const [isListening, setIsListening] = useState(false);

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Speech recognition not supported in this browser.');
            return;
        }

        // @ts-ignore
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = sourceLang === 'English' ? 'en-US' : 'ta-IN';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputText(transcript);
        };

        recognition.start();
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputText.trim()) {
                let s = sourceLang;
                let t = targetLang;
                const hasTamil = /[^\u0000-\u007F]+/.test(inputText);
                if (hasTamil && sourceLang === 'English') {
                    s = 'Tamil'; t = 'English';
                    setSourceLang('Tamil'); setTargetLang('English');
                } else if (!hasTamil && sourceLang === 'Tamil' && inputText.length > 3) {
                    s = 'English'; t = 'Tamil';
                    setSourceLang('English'); setTargetLang('Tamil');
                }
                handleTranslate(s, t);
            } else {
                setTranslatedText('');
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [inputText]);

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

    const handleTranslate = async (s = sourceLang, t = targetLang) => {
        if (!inputText.trim()) {
            setTranslatedText('');
            return;
        }

        setIsTranslating(true);
        try {
            const pair = s === 'English' ? 'en|ta' : 'ta|en';
            // Using a more robust translation approach if possible, but MyMemory is the best free one
            const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${pair}`);
            const data = await res.json();

            if (data.responseData && data.responseData.translatedText) {
                setTranslatedText(data.responseData.translatedText);
            } else {
                setTranslatedText('Translation busy. Try again.');
            }
        } catch (error) {
            console.error('Translation error:', error);
            setTranslatedText('Connection error. Check your internet.');
        } finally {
            setIsTranslating(false);
        }
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    if (showWelcome) {
        return (
            <div className="welcome-screen">
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
                    <div style={{ 
                        width: '120px',
                        height: '120px',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        marginBottom: '2rem',
                        boxShadow: '0 20px 40px -10px var(--primary-glow)'
                    }}>
                        <img src="/logo.png" alt="LinguaFlow Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
            <header className="header" style={{ paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/logo.png" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>LinguaFlow</h2>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn-icon" onClick={() => setIsDark(!isDark)}>
                        <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
                    </button>
                </div>
            </header>


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
                        style={{ color: isDark ? '#ffffff' : '#1e293b' }}
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
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-icon">
                                <span className="material-symbols-outlined">volume_up</span>
                            </button>
                            <button
                                onClick={() => handleTranslate()}
                                style={{
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0 1rem',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Translate
                            </button>
                        </div>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="card-label" style={{ color: 'var(--primary)' }}>{targetLang}</span>
                        {isTranslating && (
                            <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                        )}
                    </div>
                    <div className="output-text">
                        {translatedText || <span style={{ opacity: 0.3 }}>{sourceLang === 'English' ? 'மொழிபெயர்ப்பு...' : 'Translation...'}</span>}
                    </div>
                    <div className="card-footer" style={{ borderTop: '1px solid rgba(19, 91, 236, 0.1)', paddingTop: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button
                                className="btn-icon"
                                style={{ color: 'var(--primary)' }}
                                onClick={() => {
                                    const synth = window.speechSynthesis;
                                    const utterance = new SpeechSynthesisUtterance(translatedText);
                                    utterance.lang = targetLang === 'Tamil' ? 'ta-IN' : 'en-US';
                                    synth.speak(utterance);
                                }}
                            >
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
                <div className="nav-item" onClick={startListening}>
                    <div className={`mic-btn ${isListening ? 'listening' : ''}`} style={{ background: isListening ? '#ef4444' : 'var(--primary)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>{isListening ? 'graphic_eq' : 'mic'}</span>
                    </div>
                    <span className="nav-label" style={{ fontWeight: 'bold' }}>{isListening ? 'Listening...' : 'Speak'}</span>
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
