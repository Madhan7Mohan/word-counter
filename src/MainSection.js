import React, { useState, useEffect } from 'react';



const MainSection = () => {
    const [text, setText] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [vowelCount, setVowelCount] = useState(0);
    const [consonantCount, setConsonantCount] = useState(0);
    const [specialCharCount, setSpecialCharCount] = useState(0);
    const [buttonColor, setButtonColor] = useState('white'); 

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
            const speech = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();
            console.log("Available voices:", voices);
            speech.voice = voices[10];
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

    const handleChange = (e) => {
        setText(e.target.value);
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
                    </tbody>
                </table>
            </div>
            
        </section>
    );
};

export default MainSection;
