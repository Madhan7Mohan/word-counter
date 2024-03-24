import React, { useState, useEffect, useRef } from 'react';

const MainSection = () => {
    const [text, setText] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [vowelCount, setVowelCount] = useState(0);
    const [consonantCount, setConsonantCount] = useState(0);
    const [specialCharCount, setSpecialCharCount] = useState(0);
    const [buttonColor, setButtonColor] = useState('white');
    const [speaking, setSpeaking] = useState(false);
    const [recognizing, setRecognizing] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const updateCounts = () => {
            const trimmedText = text;
            const words = trimmedText.split(/\s+/).filter(Boolean);
            const characters = trimmedText.length;
            const vowels = (trimmedText.match(/[aeiou]/gi) || []).length;
            const consonants = (trimmedText.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;
            const specials = (trimmedText.match(/[^\w]/g) || []).length;

            setWordCount(words.length);
            setCharCount(characters);
            setVowelCount(vowels);
            setConsonantCount(consonants);
            setSpecialCharCount(specials);
        };

        const speakText = () => {
            if (text.trim() === '') {
                alert('Speak Something!');
                return;
            }

            const speech = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();
            speech.voice = voices[10];
            speech.onstart = () => setSpeaking(true);
            speech.onend = () => setSpeaking(false);
            window.speechSynthesis.speak(speech);
            setButtonColor('green');
            setTimeout(() => {
                setButtonColor('white');
            }, 1000);
        };

        updateCounts();

        const speakButton = document.getElementById("speakButton");
        speakButton.addEventListener("click", speakText);

        return () => {
            speakButton.removeEventListener("click", speakText);
        };
    }, [text]);

    useEffect(() => {
        if (recognizing) {
            recognitionRef.current = new window.webkitSpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                console.log('Speech recognition started');
            };

            recognitionRef.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');

                setText(transcript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setRecognizing(false);
            };

            recognitionRef.current.onend = () => {
                console.log('Speech recognition ended');
                setRecognizing(false);
            };

            recognitionRef.current.start();
        }

        return () => {
            if (recognizing && recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [recognizing]);

    const handleChange = (e) => {
        setText(e.target.value);
    };

    const handleMicClick = () => {
        setRecognizing(true);
    };

    return (
        <section>
            <div className="text-container">
                <textarea
                    placeholder="Enter your text here..."
                    value={text}
                    onChange={handleChange}
                ></textarea>
                <button id="speakButton" style={{ backgroundColor: buttonColor }}>Speak</button>
                <button id="micButton" onClick={handleMicClick}>Mic</button>
            </div>
            <div className='final-data'>
                <table>
                    <tbody>
                        <tr>
                            <td>Word Count:</td>
                            <td>{wordCount}</td>
                        </tr>
                        <tr>
                            <td>Character Count:</td>
                            <td>{charCount}</td>
                        </tr>
                        <tr>
                            <td>Vowel Count:</td>
                            <td>{vowelCount}</td>
                        </tr>
                        <tr>
                            <td>Consonant Count:</td>
                            <td>{consonantCount}</td>
                        </tr>
                        <tr>
                            <td>Special Character Count:</td>
                            <td>{specialCharCount}</td>
                        </tr>
                        <tr>
                            <td>Speaking:</td>
                            <td>{speaking ? 'Speaking...' : 'Idle'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default MainSection;
