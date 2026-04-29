
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { handleVoiceCommand } from '../services/gemini';

export const VoiceAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processCommand(text);
      };

      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      setResponse('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const processCommand = async (text: string) => {
    setLoading(true);
    try {
      const aiResponse = await handleVoiceCommand(text);
      setResponse(aiResponse);
      speak(aiResponse);
    } catch (err) {
      setResponse("Sorry, I couldn't process that.");
    } finally {
      setLoading(false);
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 w-80 glass rounded-2xl shadow-2xl p-4 flex flex-col gap-4 text-black"
          >
            <div className="flex justify-between items-center border-b pb-2 border-black/10">
              <h3 className="font-bold flex items-center gap-2"><MessageSquare size={18}/> Yaatriq Voice</h3>
              <button onClick={() => setIsOpen(false)} className="hover:bg-black/5 p-1 rounded"><X size={18}/></button>
            </div>
            
            <div className="min-h-[100px] flex flex-col gap-3 overflow-y-auto max-h-60 custom-scrollbar pr-1">
              {transcript && (
                <div className="bg-blue-100 p-2 rounded-lg self-end text-sm max-w-[80%]">
                  {transcript}
                </div>
              )}
              {loading ? (
                <div className="flex gap-1 items-center text-sm text-gray-500 italic">
                  <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 bg-gray-400 rounded-full"/>
                  Thinking...
                </div>
              ) : response && (
                <div className="bg-gray-100 p-2 rounded-lg self-start text-sm max-w-[80%]">
                  {response}
                </div>
              )}
            </div>

            <div className="flex justify-center items-center gap-4">
              <button
                onClick={toggleListening}
                className={`p-4 rounded-full transition-all ${isListening ? 'bg-red-500 scale-110' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isListening ? <MicOff color="white"/> : <Mic color="white"/>}
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
              {isListening ? "Listening..." : "Tap to Speak"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg text-white"
      >
        <Mic size={24} />
      </motion.button>
    </div>
  );
};
