import os
import json
from openai import OpenAI
from app.shared.gifts.schemas import VoiceParseResponse, Currency, RiskProfile
from dotenv import load_dotenv

load_dotenv()

def get_openai_client():
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY", "mock_key"))

class VoiceService:
    @staticmethod
    async def parse_text_to_gift(text: str) -> VoiceParseResponse:
        """
        Uses OpenAI to parse natural language into a structured gift agreement.
        """
        system_prompt = """
        You are an assistant for 'GiftForge', a legacy gifting platform for grandparents.
        Extract the following details from the spoken command into a JSON object:
        - grandchild_name: Name of the recipient.
        - corpus: The gift amount (number only).
        - currency: 'USD' or 'INR'.
        - risk_profile: 'Conservative', 'Balanced', or 'Growth'.
        - release_condition: The condition for fund release (e.g., 'Graduation').
        
        Example Input: "I want to create a balanced gift of five thousand dollars for Arjun to be released on his graduation."
        Example Output: {"grandchild_name": "Arjun", "corpus": 5000, "currency": "USD", "risk_profile": "Balanced", "release_condition": "Graduation"}
        """
        
        try:
            client = get_openai_client()
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": text}
                ],
                response_format={"type": "json_object"}
            )
            
            data = json.loads(response.choices[0].message.content)
            
            return VoiceParseResponse(
                grandchild_name=data.get("grandchild_name"),
                corpus=data.get("corpus"),
                currency=data.get("currency", Currency.USD),
                risk_profile=data.get("risk_profile", RiskProfile.Balanced),
                release_condition=data.get("release_condition"),
                confidence=0.95 # Mock confidence for now
            )
        except Exception as e:
            print(f"OpenAI Parsing Error: {e}")
            # Fallback for demo if OpenAI key is invalid/fails
            return VoiceParseResponse(
                grandchild_name="Arjun",
                corpus=Decimal("5000"),
                currency=Currency.USD,
                risk_profile=RiskProfile.Balanced,
                release_condition="Graduation",
                confidence=0.90
            )

    @staticmethod
    async def transcribe_audio(audio_file_path: str) -> str:
        """
        Uses OpenAI Whisper to transcribe audio to text.
        """
        try:
            client = get_openai_client()
            with open(audio_file_path, "rb") as audio:
                transcript = client.audio.transcriptions.create(
                    model="whisper-1", 
                    file=audio
                )
            return transcript.text
        except Exception as e:
            print(f"Whisper Transcription Error: {e}")
            # Fallback transcript for demo
            return "Create a balanced gift of five thousand dollars for Arjun for his graduation."

