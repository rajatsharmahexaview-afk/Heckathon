import { useState, useRef } from 'react';
import api from '@/lib/api';
import { VoiceParseDetails } from '@/types/gift';

export const useVoiceGift = () => {
    const [isListening, setIsListening] = useState(false);
    const [isParsing, setIsParsing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startListening = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.start();
            setIsListening(true);
            setError(null);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            setError('Could not access microphone');
        }
    };

    const stopListening = async (): Promise<VoiceParseDetails | null> => {
        if (mediaRecorderRef.current && isListening) {
            return new Promise((resolve) => {
                mediaRecorderRef.current!.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                    const result = await parseAudio(audioBlob);
                    resolve(result);
                    // Stop all tracks to release microphone
                    mediaRecorderRef.current!.stream.getTracks().forEach(track => track.stop());
                };
                mediaRecorderRef.current!.stop();
                setIsListening(false);
            });
        }
        return null;
    };

    const parseAudio = async (blob: Blob): Promise<VoiceParseDetails | null> => {
        setIsParsing(true);
        const formData = new FormData();
        formData.append('audio', blob, 'recording.wav');

        try {
            const response = await api.post<VoiceParseDetails>('/voice/parse-gift', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setIsParsing(false);
            return response.data;
        } catch (err) {
            console.error('Error parsing voice gift:', err);
            setError('Failed to understand the voice command. Please try again or edit manually.');
            setIsParsing(false);
            return null;
        }
    };

    const parseText = async (text: string): Promise<VoiceParseDetails | null> => {
        setIsParsing(true);
        try {
            const response = await api.post<VoiceParseDetails>(`/voice/parse-gift?text=${encodeURIComponent(text)}`);
            setIsParsing(false);
            return response.data;
        } catch (err) {
            console.error('Error parsing text gift:', err);
            setError('Failed to parse the gift request.');
            setIsParsing(false);
            return null;
        }
    };

    return {
        isListening,
        isParsing,
        error,
        startListening,
        stopListening,
        parseText,
    };
};
